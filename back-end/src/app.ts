import cors from 'cors'; import express from 'express'; import fs from 'node:fs'; import path from 'node:path';
import { SendContactMessage } from './application/email.js'; import { environment, projectRoot } from './config/environment.js';
import { CvRepository } from './infrastructure/cv.repository.js'; import { ResendGateway } from './infrastructure/resend.gateway.js'; import { contactRouter } from './presentation/contact.router.js';
export function createApp() {
  const app = express(); const dist = path.join(projectRoot, 'front-end/dist');
  const origins = environment.origins.length ? environment.origins : ['http://localhost:5173', 'http://127.0.0.1:5173'];
  const gateway = new ResendGateway(environment.resend.apiKey, environment.resend.from, environment.resend.to);
  const cvs = new CvRepository([...(environment.cvPath ? [path.resolve(environment.cvPath)] : []), path.join(dist, 'cv'), path.join(projectRoot, 'front-end/public/cv')]);
  app.set('trust proxy', 1); app.use(express.json()); app.use(cors({ origin: (origin, cb) => cb(origin && !origins.includes(origin) ? new Error('Not allowed by CORS') : null, true) }));
  if (fs.existsSync(dist)) app.use(express.static(dist));
  app.get('/health', (_req, res) => res.json({ ok: true, service: 'portfolio-back-end' }));
  app.get('/api/cv/download', (req, res) => { const value = String(req.query.lang ?? ''); const file = cvs.find(value === 'en' || value === 'es' ? value : undefined); if (!file) return res.status(404).json({ error: 'CV PDF not found' }); return res.download(file.filePath, file.fileName.endsWith('.pdf') ? file.fileName : `${file.fileName}.pdf`); });
  app.use('/api/contact', contactRouter(new SendContactMessage(gateway)));
  app.get('/', (_req, res) => fs.existsSync(dist) ? res.sendFile(path.join(dist, 'index.html')) : res.send('portfolio-back-end running'));
  if (fs.existsSync(dist)) app.get('*', (req, res, next) => req.path.startsWith('/api') || req.path === '/health' ? next() : res.sendFile(path.join(dist, 'index.html')));
  return { app, origins, configured: gateway.configured };
}
