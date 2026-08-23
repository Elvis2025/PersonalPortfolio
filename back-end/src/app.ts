import cors from 'cors'; import express from 'express'; import fs from 'node:fs'; import path from 'node:path';
import { TrackCvDownload } from './application/cv-download.js'; import { SendContactMessage } from './application/email.js'; import { environment, projectRoot } from './config/environment.js';
import { CvRepository } from './infrastructure/cv.repository.js'; import { GmailAutoReplySender } from './infrastructure/gmail-auto-reply.sender.js'; import { IpApiGeoLocator } from './infrastructure/ipapi.geolocator.js'; import { ResendGateway } from './infrastructure/resend.gateway.js'; import { contactRouter } from './presentation/contact.router.js'; import { getBrowserName, getVisitorIp } from './presentation/request-metadata.js';
export function createApp() {
  const app = express(); const dist = path.join(projectRoot, 'front-end/dist');
  const origins = environment.origins.length ? environment.origins : ['http://localhost:5173', 'http://127.0.0.1:5173'];
  const cvs = new CvRepository([...(environment.cvPath ? [path.resolve(environment.cvPath)] : []), path.join(dist, 'cv'), path.join(projectRoot, 'front-end/public/cv')]);
  const profileImagePath = path.join(projectRoot, 'front-end/public/img/profile/EH-IMG.webp');
  const gateway = new ResendGateway(environment.resend.apiKey, environment.resend.from, environment.resend.to);
  const autoReplySender = new GmailAutoReplySender(
    environment.resend.to,
    environment.gmail.appPassword,
    profileImagePath,
    (language) => cvs.find(language)
  );
  const trackCvDownload = new TrackCvDownload(new IpApiGeoLocator(), gateway);
  app.set('trust proxy', 1); app.use(express.json()); app.use(cors({ origin: (origin, cb) => cb(origin && !origins.includes(origin) ? new Error('Not allowed by CORS') : null, true) }));
  if (fs.existsSync(dist)) app.use(express.static(dist));
  app.get('/health', (_req, res) => res.json({ ok: true, service: 'portfolio-back-end' }));
  app.get('/api/cv/download', (req, res) => {
    const value = String(req.query.lang ?? '').toLowerCase();
    const language = value === 'es' ? 'es' : 'en';
    const file = cvs.find(language);
    if (!file) return res.status(404).json({ error: 'CV PDF not found' });
    const fileName = file.fileName.endsWith('.pdf') ? file.fileName : `${file.fileName}.pdf`;
    return res.download(file.filePath, fileName, (error) => {
      if (error) {
        console.error('CV download failed:', error);
        return;
      }
      void trackCvDownload.execute({
        language,
        ipAddress: getVisitorIp(req),
        browser: getBrowserName(req.get('user-agent'))
      }).catch((notificationError) => console.error('CV download notification failed:', notificationError));
    });
  });
  app.use('/api/contact', contactRouter(new SendContactMessage(gateway, autoReplySender)));
  app.get('/', (_req, res) => fs.existsSync(dist) ? res.sendFile(path.join(dist, 'index.html')) : res.send('portfolio-back-end running'));
  if (fs.existsSync(dist)) app.get('*', (req, res, next) => req.path.startsWith('/api') || req.path === '/health' ? next() : res.sendFile(path.join(dist, 'index.html')));
  return { app, origins, resendConfigured: gateway.configured, gmailConfigured: autoReplySender.configured };
}
