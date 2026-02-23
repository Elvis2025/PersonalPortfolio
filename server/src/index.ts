import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

const requests = new Map<string, number[]>();

app.post('/api/contact', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
