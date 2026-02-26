import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express-serve-static-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resend } from 'resend';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);

// ==============================
// Load .env safely from candidates
// ==============================
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

// ==============================
// Helpers
// ==============================
function normalizeEnvValue(value: string | undefined) {
  if (!value) return '';
  const trimmed = value.trim();
  return trimmed.replace(/^['"]|['"]$/g, '').trim();
}

function toBool(value: string | undefined, defaultValue = false) {
  const v = normalizeEnvValue(value).toLowerCase();
  if (!v) return defaultValue;
  return v === 'true' || v === '1' || v === 'yes';
}

function getAllowedOrigins() {
  const raw = normalizeEnvValue(process.env.ALLOWED_ORIGINS);
  if (!raw) return [];
  return raw
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

// ==============================
// App
// ==============================
const app = express();
const port = Number(process.env.PORT ?? 4000);

app.set('trust proxy', 1);
app.use(express.json());

// ==============================
// CORS (prod + dev)
// ==============================
const allowedOrigins = getAllowedOrigins();
// si no declaras ALLOWED_ORIGINS, en dev igual permitir localhost:5173
const devFallbackOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const effectiveOrigins = allowedOrigins.length ? allowedOrigins : devFallbackOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests sin origin (curl, server-to-server) -> permitir
      if (!origin) return callback(null, true);

      const isAllowed = effectiveOrigins.includes(origin);
      if (!isAllowed) return callback(new Error('Not allowed by CORS'));
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
  })
);

// ==============================
// Static client (if dist exists)
// ==============================
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

// ==============================
// Health
// ==============================
app.get('/health', (_req: Request, res: Response) => {
  return res.json({ ok: true, service: 'portfolio-server' });
});

// ==============================
// Root
// ==============================
app.get('/', (_req: Request, res: Response) => {
  if (hasClientDist) return res.sendFile(path.join(clientDistPath, 'index.html'));
  return res.status(200).send('portfolio-server running');
});

// ==============================
// CV Download
// ==============================
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

// ==============================
// Contact (Resend)
// ==============================
type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  company?: string; // honeypot
};

const requests = new Map<string, number[]>();

function rateLimit(req: any, email: string) {
  const ip = req.ip ?? 'unknown';
  const now = Date.now();
  const windowMs = 60_000;
  const maxPerWindow = 3;

  const key = `${ip}:${email.toLowerCase()}`;
  const history = (requests.get(key) ?? []).filter((ts) => now - ts < windowMs);

  if (history.length >= maxPerWindow) {
    const retryAfterSeconds = Math.max(1, Math.ceil((history[0] + windowMs - now) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  history.push(now);
  requests.set(key, history);
  return { allowed: true, retryAfterSeconds: 0 };
}

const resendApiKey = normalizeEnvValue(process.env.RESEND_API_KEY);
const resendFrom = normalizeEnvValue(process.env.RESEND_FROM);
const contactToEmail = normalizeEnvValue(process.env.CONTACT_TO_EMAIL);

const resendEnabled = Boolean(resendApiKey && resendFrom && contactToEmail);
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

app.post('/api/contact', async (req: any, res: any) => {
  const { name, email, subject, message, company } = (req.body ?? {}) as ContactBody;

  // Honeypot
  if (company) return res.status(200).json({ ok: true });

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'MISSING_REQUIRED_FIELDS', message: 'Missing required fields' });
  }

  const normalizedEmail = String(email).trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ error: 'INVALID_EMAIL_FORMAT', message: 'Invalid email format' });
  }

  const rl = rateLimit(req, normalizedEmail);
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfterSeconds));
    return res.status(429).json({
      error: 'TOO_MANY_REQUESTS',
      message: `Too many requests. Try again in ${rl.retryAfterSeconds}s`,
      retryAfterSeconds: rl.retryAfterSeconds
    });
  }

  if (!resendEnabled || !resendClient) {
    return res.status(503).json({
      error: 'CONTACT_SERVICE_UNAVAILABLE',
      message: 'Email service is not configured. Set RESEND_API_KEY, RESEND_FROM and CONTACT_TO_EMAIL.'
    });
  }

  const safeName = String(name).trim();
  const safeSubject = String(subject).trim();
  const safeMessage = String(message).trim();

  try {
    const result = await resendClient.emails.send({
      from: resendFrom, // Ej: "Elvis Portfolio <onboarding@resend.dev>"
      to: contactToEmail, // tu correo donde recibes
      replyTo: normalizedEmail,
      subject: `[Portfolio] ${safeSubject}`,
      html: `
        <div style="font-family:Arial, sans-serif; line-height:1.5">
          <h2 style="margin:0 0 12px">Nuevo mensaje desde tu Portfolio</h2>
          <p><strong>Nombre:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${normalizedEmail}</p>
          <p><strong>Asunto:</strong> ${safeSubject}</p>
          <hr style="margin:16px 0"/>
          <p style="white-space:pre-wrap">${safeMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>
      `
    });

    return res.json({ ok: true, provider: 'resend', id: (result as any)?.data?.id ?? null });
  } catch (error: any) {
    const msg = String(error?.message ?? 'Unknown Resend error');
    const code = String(error?.code ?? 'UNKNOWN');

    console.error('Contact email failed (Resend):', { code, message: msg });

    return res.status(503).json({
      error: 'CONTACT_SERVICE_UNAVAILABLE',
      message: 'Email service is temporarily unavailable',
      reason: code
    });
  }
});

// ==============================
// SPA fallback (only when dist exists)
// ==============================
if (hasClientDist) {
  app.get('*', (req: any, res: any, next: any) => {
    if (req.path.startsWith('/api') || req.path === '/health') return next();
    return res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// ==============================
// Start
// ==============================
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`CORS allowed origins: ${effectiveOrigins.join(', ') || '(none)'}`);
  console.log(`Resend configured: ${resendEnabled ? 'YES' : 'NO'}`);
});