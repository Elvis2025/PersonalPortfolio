import { Resend } from 'resend';
import type { EmailGateway } from '../application/email.js';
import { ServiceUnavailableError } from '../application/email.js';
import type { ContactMessage } from '../domain/contact.js';

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
export class ResendGateway implements EmailGateway {
  private client: Resend | null;
  readonly configured: boolean;
  constructor(key: string, private from: string, private to: string) { this.configured = Boolean(key && from && to); this.client = key ? new Resend(key) : null; }
  async send(message: ContactMessage) {
    if (!this.client) throw new ServiceUnavailableError('Resend is not configured');
    const html = `<h2>Portfolio · Nuevo mensaje</h2><p><b>${escape(message.name)}</b><br>${escape(message.email)}</p><p>${escape(message.subject)}</p><div style="white-space:pre-wrap">${escape(message.message)}</div>`;
    const result = await this.client.emails.send({ from: this.from, to: this.to, replyTo: message.email, subject: `[Portfolio] ${message.subject}`, html });
    if (result.error) throw new ServiceUnavailableError(result.error.message);
    return { provider: 'resend', id: result.data?.id ?? null };
  }
}
