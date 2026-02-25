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

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: email,
    subject: `[Portfolio] ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`
  });

  return res.json({ ok: true });
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
