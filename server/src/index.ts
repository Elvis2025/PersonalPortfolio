import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import nodemailer from 'nodemailer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);

const envCandidatePaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(currentDirPath, '../.env'),
  path.resolve(currentDirPath, '../../.env')
];

const seenEnvPaths = new Set<string>();
for (const envPath of envCandidatePaths) {
  if (seenEnvPaths.has(envPath) || !fs.existsSync(envPath)) continue;
  dotenv.config({ path: envPath, override: false });
  seenEnvPaths.add(envPath);
}

const app = express();
app.set('trust proxy', 1);

const port = Number(process.env.PORT ?? 4000);

function normalizeEnvValue(value: string | undefined) {
  if (!value) return '';
  const trimmed = value.trim();
  const withoutWrappingQuotes = trimmed.replace(/^['"]|['"]$/g, '');
  return withoutWrappingQuotes.trim();
}

/**
 * ✅ CORS robusto:
 * - Permite FRONTEND_URL (ej: http://localhost:5173)
 * - Permite localhost comunes (5173, 3000, 4000, etc.)
 * - Permite requests sin Origin (Postman/curl)
 */
const frontendUrl = normalizeEnvValue(process.env.FRONTEND_URL);

function isAllowedOrigin(origin: string) {
  const allowList = new Set<string>();

  if (frontendUrl) allowList.add(frontendUrl);

  // Localhost típicos en dev (agrega/quita si quieres)
  [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:4000',
    'http://127.0.0.1:4000'
  ].forEach((o) => allowList.add(o));

  return allowList.has(origin);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Sin origin => Postman/curl/server-to-server
      if (!origin) return callback(null, true);

      if (isAllowedOrigin(origin)) return callback(null, true);

      // Bloquea con error (lo capturamos abajo en middleware de error)
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
  })
);

// Para preflight
app.options('*', cors());

app.use(express.json());

// ✅ Middleware para devolver JSON cuando CORS bloquea
app.use((err: any, _req: any, res: any, next: any) => {
  if (err && String(err.message || '').includes('Not allowed by CORS')) {
    return res.status(403).json({
      error: 'CORS_NOT_ALLOWED',
      message:
        'Origin not allowed by CORS. Set FRONTEND_URL correctly or add the origin to the allow list.',
      originHint: frontendUrl || null
    });
  }
  return next(err);
});

const requests = new Map<string, number[]>();

function getPublicBaseUrl(req: any) {
  const forwardedProto = req.header('x-forwarded-proto')?.split(',')[0]?.trim();
  const proto = forwardedProto || req.protocol || 'https';
  const host = req.header('x-forwarded-host') || req.get('host');
  return host ? `${proto}://${host}` : null;
}

const clientDistPath = path.resolve(currentDirPath, '../../client/dist');
const hasClientDist = fs.existsSync(clientDistPath);
const fallbackCvDir = path.resolve(currentDirPath, '../../client/public/cv');
const distCvDir = path.join(clientDistPath, 'cv');

const cvStoragePaths = [
  process.env.CV_STORAGE_PATH ? path.resolve(process.env.CV_STORAGE_PATH) : null,
  distCvDir,
  fallbackCvDir,
  path.resolve(process.cwd(), 'client/dist/cv'),
  path.resolve(process.cwd(), 'client/public/cv')
].filter((dirPath): dirPath is string => Boolean(dirPath));

function getPdfFilesInDirectory(directoryPath: string) {
  if (!fs.existsSync(directoryPath)) {
    return [] as Array<{ fileName: string; filePath: string; mtimeMs: number; directoryPath: string }>;
  }

  const knownCvNamesWithoutExtension = new Set(['english-eh-cv', 'spanish-eh-cv']);

  return fs
    .readdirSync(directoryPath)
    .filter((fileName) => {
      const lowerName = fileName.toLowerCase();
      if (lowerName.endsWith('.pdf')) return true;

      const parsedName = path.parse(lowerName);
      return parsedName.ext === '' && knownCvNamesWithoutExtension.has(parsedName.name);
    })
    .map((fileName) => {
      const filePath = path.join(directoryPath, fileName);
      const stats = fs.statSync(filePath);
      return { fileName, filePath, mtimeMs: stats.mtimeMs, directoryPath };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);
}

function getPdfFilesFromCandidates() {
  const byPath = new Map<string, { fileName: string; filePath: string; mtimeMs: number; directoryPath: string }>();

  cvStoragePaths.forEach((directoryPath) => {
    getPdfFilesInDirectory(directoryPath).forEach((file) => {
      byPath.set(file.filePath, file);
    });
  });

  return Array.from(byPath.values()).sort((a, b) => b.mtimeMs - a.mtimeMs);
}

function getLatestPdfInDirectory() {
  const pdfFiles = getPdfFilesFromCandidates();
  return pdfFiles[0] ?? null;
}

function getCvByLanguage(lang: 'en' | 'es') {
  const pdfFiles = getPdfFilesFromCandidates();

  const preferredNames =
    lang === 'en' ? ['english-eh-cv.pdf', 'english-eh-cv'] : ['spanish-eh-cv.pdf', 'spanish-eh-cv'];

  const exactMatch = pdfFiles.find((file) => preferredNames.includes(file.fileName.toLowerCase()));
  if (exactMatch) return exactMatch;

  const languageHints =
    lang === 'en'
      ? ['english', '-en', '_en', ' en ', 'cv-en']
      : ['spanish', 'espanol', 'español', '-es', '_es', ' es ', 'cv-es'];

  return (
    pdfFiles.find((file) => {
      const lowerName = file.fileName.toLowerCase();
      return languageHints.some((hint) => lowerName.includes(hint));
    }) ?? null
  );
}

function getDownloadFileName(fileName: string) {
  return fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;
}

if (hasClientDist) {
  app.use(express.static(clientDistPath));
}

app.get('/', (req: any, res: any) => {
  if (hasClientDist) {
    return res.sendFile(path.join(clientDistPath, 'index.html'));
  }

  if (frontendUrl) {
    return res.redirect(frontendUrl);
  }

  const publicBaseUrl = getPublicBaseUrl(req);
  if (publicBaseUrl && publicBaseUrl !== `${req.protocol}://${req.get('host')}`) {
    return res.redirect(publicBaseUrl);
  }

  return res.status(200).send('portfolio-server running');
});

app.get('/api/cv/download', (req: any, res: any) => {
  const lang = String(req.query.lang ?? '').toLowerCase();

  if (lang === 'en' || lang === 'es') {
    const languageCv = getCvByLanguage(lang);

    if (!languageCv) {
      return res.status(404).json({
        error: 'CV_PDF_NOT_FOUND',
        message: `Could not find ${lang.toUpperCase()} CV in configured paths: ${cvStoragePaths.join(', ')}`
      });
    }

    return res.download(languageCv.filePath, getDownloadFileName(languageCv.fileName));
  }

  const latestPdf = getLatestPdfInDirectory();

  if (!latestPdf) {
    return res.status(404).json({
      error: 'CV_PDF_NOT_FOUND',
      message: `Place a CV file inside one of: ${cvStoragePaths.join(', ')}`
    });
  }

  return res.download(latestPdf.filePath, getDownloadFileName(latestPdf.fileName));
});

app.get('/health', (_req: any, res: any) => {
  return res.json({ ok: true, service: 'portfolio-server' });
});

app.post('/api/contact', async (req: any, res: any) => {
  const { name, email, subject, message, company } = req.body as Record<string, string>;

  // Honeypot
  if (company) return res.status(200).json({ ok: true });

  const ip = req.ip ?? 'unknown';
  const now = Date.now();
  const windowMs = 60_000;
  const maxPerWindow = 3;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'MISSING_REQUIRED_FIELDS', message: 'Missing required fields' });
  }

  const normalizedEmail = String(email).trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ error: 'INVALID_EMAIL_FORMAT', message: 'Invalid email format' });
  }

  // ✅ Soporta EMAIL_* o SMTP_* (compatibilidad con tu .env anterior)
  const contactToEmail = normalizeEnvValue(process.env.CONTACT_TO_EMAIL);

  const emailHost = normalizeEnvValue(process.env.EMAIL_HOST || process.env.SMTP_HOST);
  const emailPort = Number(normalizeEnvValue(process.env.EMAIL_PORT || process.env.SMTP_PORT) || '587');
  const emailUser = normalizeEnvValue(process.env.EMAIL_USER || process.env.SMTP_USER);
  const emailPass = normalizeEnvValue(process.env.EMAIL_PASS || process.env.SMTP_PASS).replace(/\s+/g, '');
  const emailFrom =
    normalizeEnvValue(process.env.EMAIL_FROM || process.env.SMTP_FROM) || `Portfolio <${emailUser}>`;

  const emailSecure =
    normalizeEnvValue(process.env.EMAIL_SECURE).toLowerCase() === 'true' || emailPort === 465;

  // ✅ En DEV puedes poner EMAIL_TLS_REJECT_UNAUTHORIZED=false si te sale "self-signed certificate..."
  const emailTlsRejectUnauthorized =
    normalizeEnvValue(process.env.EMAIL_TLS_REJECT_UNAUTHORIZED).toLowerCase() !== 'false';

  if (!contactToEmail || !emailHost || !emailUser || !emailPass || Number.isNaN(emailPort)) {
    return res.status(503).json({
      error: 'CONTACT_SERVICE_UNAVAILABLE',
      message:
        'Email configuration is incomplete. Set EMAIL_HOST/SMTP_HOST, EMAIL_PORT/SMTP_PORT, EMAIL_USER/SMTP_USER, EMAIL_PASS/SMTP_PASS and CONTACT_TO_EMAIL.'
    });
  }

  // Rate limit por IP + email
  const rateLimitKey = `${ip}:${normalizedEmail.toLowerCase()}`;
  const history = (requests.get(rateLimitKey) ?? []).filter((ts) => now - ts < windowMs);

  if (history.length >= maxPerWindow) {
    const retryAfterSeconds = Math.max(1, Math.ceil((history[0] + windowMs - now) / 1000));
    res.setHeader('Retry-After', String(retryAfterSeconds));
    return res.status(429).json({
      error: 'TOO_MANY_REQUESTS',
      message: `Too many requests. Try again in ${retryAfterSeconds}s`,
      retryAfterSeconds
    });
  }

  history.push(now);
  requests.set(rateLimitKey, history);

  try {
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: { user: emailUser, pass: emailPass },
      tls: {
        rejectUnauthorized: emailTlsRejectUnauthorized,
        // ayuda en algunos entornos con TLS raro
        servername: emailHost
      }
    });

    // ✅ Primero verifica la conexión
    await transporter.verify();

    await transporter.sendMail({
      from: emailFrom,
      to: contactToEmail,
      replyTo: normalizedEmail,
      subject: `[Portfolio] ${String(subject).trim()}`,
      text: `Name: ${String(name).trim()}
Email: ${normalizedEmail}

${String(message).trim()}`,
      html: `
        <p><strong>Name:</strong> ${String(name).trim()}</p>
        <p><strong>Email:</strong> ${normalizedEmail}</p>
        <p><strong>Subject:</strong> ${String(subject).trim()}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).trim().replace(/\n/g, '<br/>')}</p>
      `
    });

    return res.json({ ok: true, provider: 'smtp' });
  } catch (error: any) {
    const errorCode = String(error?.code ?? 'UNKNOWN');
    const errorResponseCode = typeof error?.responseCode === 'number' ? String(error.responseCode) : '';

    console.error('Contact email failed (SMTP):', {
      code: errorCode,
      responseCode: errorResponseCode || undefined,
      message: String(error?.message ?? 'Unknown email transport error')
    });

    // auth
    if (errorCode === 'EAUTH' || errorResponseCode === '535') {
      return res.status(503).json({
        error: 'CONTACT_SERVICE_UNAVAILABLE',
        message: 'SMTP authentication failed. Check EMAIL_USER and EMAIL_PASS (App Password).',
        reason: errorCode
      });
    }

    // TLS / certificados
    if (errorCode === 'ESOCKET' && String(error?.message || '').includes('self-signed certificate')) {
      return res.status(503).json({
        error: 'CONTACT_SERVICE_UNAVAILABLE',
        message:
          'TLS certificate chain rejected (self-signed). In DEV you can set EMAIL_TLS_REJECT_UNAUTHORIZED=false. In PROD, fix the SMTP certificate chain / proxy.',
        reason: 'TLS_SELF_SIGNED_CHAIN'
      });
    }

    return res.status(503).json({
      error: 'CONTACT_SERVICE_UNAVAILABLE',
      message: 'Email service is temporarily unavailable',
      reason: errorCode || 'UNKNOWN'
    });
  }
});

if (hasClientDist) {
  app.get('*', (req: any, res: any, next: any) => {
    if (req.path.startsWith('/api') || req.path === '/health') return next();
    return res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  if (frontendUrl) console.log(`Allowed CORS origin: ${frontendUrl}`);
});