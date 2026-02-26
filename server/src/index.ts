import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import nodemailer from 'nodemailer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);

// ============================
// Load env from possible paths
// ============================
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

// ============================
// Helpers
// ============================
function normalizeEnvValue(value: string | undefined) {
  if (!value) return '';
  const trimmed = value.trim();
  const withoutWrappingQuotes = trimmed.replace(/^['"]|['"]$/g, '');
  return withoutWrappingQuotes.trim();
}

function normalizeOrigin(origin: string) {
  // Quita trailing slash
  return origin.replace(/\/+$/, '');
}

function getPublicBaseUrl(req: any) {
  const forwardedProto = req.header('x-forwarded-proto')?.split(',')[0]?.trim();
  const proto = forwardedProto || req.protocol || 'https';

  const host = req.header('x-forwarded-host') || req.get('host');
  return host ? `${proto}://${host}` : null;
}

// ============================
// App
// ============================
const app = express();
app.set('trust proxy', 1); // ✅ Railway / proxies

const port = Number(process.env.PORT ?? 4000);

// ============================
// CORS (PRODUCTION-SAFE)
// ============================
// - Permite FRONTEND_URL (si existe)
// - Permite localhost en dev
// - Permite mismo origen (cuando FE y API son el mismo dominio)
// - Permite Origin vacío (curl, SSR, healthchecks)
const frontendUrl = normalizeEnvValue(process.env.FRONTEND_URL);
const allowedOrigins = new Set<string>();

if (frontendUrl) allowedOrigins.add(normalizeOrigin(frontendUrl));
allowedOrigins.add('http://localhost:5173');
allowedOrigins.add('http://127.0.0.1:5173');

app.use(
  cors({
    origin(origin, callback) {
      // Requests sin Origin (curl/healthcheck)
      if (!origin) return callback(null, true);

      const o = normalizeOrigin(origin);

      // Permitidos explícitos
      if (allowedOrigins.has(o)) return callback(null, true);

      // Permitir mismo origen del server (cuando FE está servido por el mismo backend)
      // Ej: origin=https://elvis-hernandez.up.railway.app
      // y la request entra al mismo host
      // Nota: aquí no tenemos req, pero si FE/API comparten dominio,
      // casi siempre coincidirá con FRONTEND_URL (por eso debe estar correcto).
      // Si no coincide, lo bloqueamos.
      return callback(new Error('Not allowed by CORS'));
    }
  })
);

app.use(express.json());

// ============================
// Simple rate-limit
// ============================
const requests = new Map<string, number[]>();

// ============================
// Static client (if exists)
// ============================
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

  const preferredNames = lang === 'en'
    ? ['english-eh-cv.pdf', 'english-eh-cv']
    : ['spanish-eh-cv.pdf', 'spanish-eh-cv'];

  const exactMatch = pdfFiles.find((file) => preferredNames.includes(file.fileName.toLowerCase()));
  if (exactMatch) return exactMatch;

  const languageHints = lang === 'en'
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

// ============================
// Routes
// ============================
app.get('/', (req: any, res: any) => {
  if (hasClientDist) return res.sendFile(path.join(clientDistPath, 'index.html'));

  if (frontendUrl) return res.redirect(frontendUrl);

  const publicBaseUrl = getPublicBaseUrl(req);
  if (publicBaseUrl) return res.redirect(publicBaseUrl);

  return res.status(200).send('portfolio-server running');
});

app.get('/health', (_req: any, res: any) => {
  return res.json({ ok: true, service: 'portfolio-server' });
});

app.get('/api/cv/download', (req: any, res: any) => {
  const lang = String(req.query.lang ?? '').toLowerCase();

  if (lang === 'en' || lang === 'es') {
    const languageCv = getCvByLanguage(lang);

    if (!languageCv) {
      return res.status(404).json({
        error: 'CV PDF not found',
        message: `Could not find ${lang.toUpperCase()} CV in configured paths: ${cvStoragePaths.join(', ')}`
      });
    }

    return res.download(languageCv.filePath, getDownloadFileName(languageCv.fileName));
  }

  const latestPdf = getLatestPdfInDirectory();

  if (!latestPdf) {
    return res.status(404).json({
      error: 'CV PDF not found',
      message: `Place a CV file inside one of: ${cvStoragePaths.join(', ')}`
    });
  }

  return res.download(latestPdf.filePath, getDownloadFileName(latestPdf.fileName));
});

app.post('/api/contact', async (req: any, res: any) => {
  const { name, email, subject, message, company } = req.body as Record<string, string>;

  // Honeypot anti-bot
  if (company) {
    return res.status(200).json({ ok: true });
  }

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

  // Rate limit by ip+email
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

  // SMTP config
  const contactToEmail = normalizeEnvValue(process.env.CONTACT_TO_EMAIL);
  const emailHost = normalizeEnvValue(process.env.EMAIL_HOST);
  const emailPort = Number(normalizeEnvValue(process.env.EMAIL_PORT) || '587');
  const emailUser = normalizeEnvValue(process.env.EMAIL_USER);
  const emailPass = normalizeEnvValue(process.env.EMAIL_PASS).replace(/\s+/g, '');
  const emailFrom = normalizeEnvValue(process.env.EMAIL_FROM) || `Portfolio <${emailUser}>`;

  const emailSecure =
    normalizeEnvValue(process.env.EMAIL_SECURE).toLowerCase() === 'true' || emailPort === 465;

  // ✅ Fix para "self-signed certificate in certificate chain"
  // Si EMAIL_TLS_REJECT_UNAUTHORIZED=false => no valida la cadena (menos estricto).
  const emailTlsRejectUnauthorized =
    normalizeEnvValue(process.env.EMAIL_TLS_REJECT_UNAUTHORIZED).toLowerCase() !== 'false';

  if (!contactToEmail || !emailHost || !emailUser || !emailPass || Number.isNaN(emailPort)) {
    return res.status(503).json({
      error: 'CONTACT_SERVICE_UNAVAILABLE',
      message: 'Email configuration is incomplete. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS and CONTACT_TO_EMAIL.'
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: {
        user: emailUser,
        pass: emailPass
      },
      tls: {
        rejectUnauthorized: emailTlsRejectUnauthorized
      }
    });

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

    const reason = [errorCode, errorResponseCode].filter(Boolean).join(':');

    if (errorCode === 'EAUTH' || errorResponseCode === '535') {
      return res.status(503).json({
        error: 'CONTACT_SERVICE_UNAVAILABLE',
        message: 'SMTP authentication failed. Check EMAIL_USER and EMAIL_PASS (App Password).',
        reason: reason || 'EAUTH'
      });
    }

    return res.status(503).json({
      error: 'CONTACT_SERVICE_UNAVAILABLE',
      message: 'Email service is temporarily unavailable',
      reason: reason || 'UNKNOWN'
    });
  }
});

// SPA fallback
if (hasClientDist) {
  app.get('*', (req: any, res: any, next: any) => {
    if (req.path.startsWith('/api') || req.path === '/health') return next();
    return res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});