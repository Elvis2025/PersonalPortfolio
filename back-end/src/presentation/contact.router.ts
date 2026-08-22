import { Router } from 'express';
import { SendContactMessage, ServiceUnavailableError } from '../application/email.js';
import { ValidationError, validateContact, type ContactInput } from '../domain/contact.js';

const attempts = new Map<string, number[]>();
export function contactRouter(useCase: SendContactMessage) {
  const router = Router();
  router.post('/', async (req, res) => {
    const input = (req.body ?? {}) as ContactInput;
    if (input.company) return res.json({ ok: true });
    const key = `${req.ip}:${String(input.email).toLowerCase()}`;
    const now = Date.now(); const history = (attempts.get(key) ?? []).filter((time) => now - time < 60_000);
    if (history.length >= 3) return res.status(429).json({ error: 'TOO_MANY_REQUESTS', message: 'Too many requests. Try again later' });
    history.push(now); attempts.set(key, history);
    try { return res.json({ ok: true, ...await useCase.execute(validateContact(input)) }); }
    catch (error) {
      if (error instanceof ValidationError) return res.status(400).json({ error: error.code, message: error.message });
      if (error instanceof ServiceUnavailableError) return res.status(503).json({ error: 'CONTACT_SERVICE_UNAVAILABLE', message: error.message });
      console.error('Contact failed:', error); return res.status(503).json({ error: 'CONTACT_SERVICE_UNAVAILABLE' });
    }
  });
  return router;
}
