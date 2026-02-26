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
  const escapeHtml = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const safeNameX = escapeHtml(String(name ?? '').trim() || 'Nuevo contacto');
  const safeEmailX = escapeHtml(String(normalizedEmail ?? '').trim());
  const safeSubjectX = escapeHtml(String(safeSubject ?? '').trim());
  const safeMessageX = escapeHtml(String(message ?? '').trim());

  const html = `
  <!doctype html>
  <html lang="es">
    <body style="margin:0;padding:0;background:#0b0f14;font-family:Arial,Helvetica,sans-serif;">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
        Mensaje desde tu portfolio · ${safeNameX}
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b0f14;padding:24px 12px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;">
              <tr>
                <td style="padding:8px 8px 14px 8px;">
                  <div style="color:#c7d2fe;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">
                    Portfolio · Nuevo mensaje
                  </div>
                </td>
              </tr>

              <tr>
                <td style="background:#0f172a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:18px;">
                  <div style="color:#e5e7eb;font-size:15px;font-weight:700;line-height:1.2;">
                    ${safeNameX}
                  </div>
                  <div style="color:#94a3b8;font-size:13px;line-height:1.4;margin-top:4px;">
                    ${safeEmailX}
                  </div>

                  <div style="height:10px;"></div>

                  <div style="color:#cbd5e1;font-size:13px;opacity:.9;">
                    ${safeSubjectX}
                  </div>

                  <div style="height:14px;"></div>

                  <div style="background:#0b1220;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:14px;">
                    <div style="color:#e5e7eb;font-size:15px;line-height:1.65;white-space:pre-wrap;">
                      ${safeMessageX}
                    </div>
                  </div>

                  <div style="height:14px;"></div>

                  <div style="color:#64748b;font-size:12px;line-height:1.4;">
                    Para responder, usa “Reply” (se enviará al remitente automáticamente).
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:14px 8px 0 8px;">
                  <div style="color:#334155;font-size:11px;">
                    © ${new Date().getFullYear()} Elvis Portfolio
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  const result = await resendClient.emails.send({
    from: resendFrom,
    to: contactToEmail,
    replyTo: normalizedEmail,
    subject: `[Portfolio] ${safeSubject}`,
    html
  });

  // ✅ ESTE ES EL FIX IMPORTANTE:
  if ((result as any)?.error) {
    console.error('Resend error:', (result as any).error);
    return res.status(503).json({
      error: 'CONTACT_SERVICE_UNAVAILABLE',
      message: 'Resend rejected the email',
      details: (result as any).error
    });
  }

  return res.json({ ok: true, provider: 'resend', id: (result as any)?.data?.id ?? null });
} catch (error: any) {
  console.error('Contact email failed (Resend):', error);
  return res.status(503).json({
    error: 'CONTACT_SERVICE_UNAVAILABLE',
    message: 'Email service is temporarily unavailable'
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