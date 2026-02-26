import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import nodemailer from 'nodemailer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

const requests = new Map<string, number[]>();

const frontendUrl = process.env.FRONTEND_URL;

function getPublicBaseUrl(req: any) {
  const forwardedProto = req.header('x-forwarded-proto')?.split(',')[0]?.trim();
  const proto = forwardedProto || req.protocol || 'https';
  const host = req.header('x-forwarded-host') || req.get('host');
  return host ? `${proto}://${host}` : null;
}

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
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

  return pdfFiles.find((file) => {
    const lowerName = file.fileName.toLowerCase();
    return languageHints.some((hint) => lowerName.includes(hint));
  }) ?? null;
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

app.get('/health', (_req: any, res: any) => {
  return res.json({ ok: true, service: 'portfolio-server' });
});

app.post('/api/contact', async (req: any, res: any) => {
  const { name, email, subject, message, company } = req.body as Record<string, string>;

  if (company) {
    return res.status(200).json({ ok: true });
  }

  const ip = req.ip ?? 'unknown';
  const now = Date.now();
  const windowMs = 60_000;
  const maxPerWindow = 3;
  const history = (requests.get(ip) ?? []).filter((ts) => now - ts < windowMs);

  if (history.length >= maxPerWindow) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  history.push(now);
  requests.set(ip, history);

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const normalizedEmail = String(email).trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = Number(process.env.SMTP_PORT ?? 587);
  const contactToEmail = process.env.CONTACT_TO_EMAIL;

  if (!smtpHost || !smtpUser || !smtpPass || !contactToEmail) {
    return res.status(500).json({ error: 'SMTP configuration is incomplete' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? smtpUser,
      to: contactToEmail,
      replyTo: normalizedEmail,
      subject: `[Portfolio] ${String(subject).trim()}`,
      text: `Name: ${String(name).trim()}
Email: ${normalizedEmail}

${String(message).trim()}`
    });

    return res.json({ ok: true });
  } catch (error) {
    console.error('Contact email failed:', error);
    return res.status(502).json({ error: 'Email delivery failed' });
  }
});

if (hasClientDist) {
  app.get('*', (req: any, res: any, next: any) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }

    return res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
