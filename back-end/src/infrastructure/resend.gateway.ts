import fs from 'node:fs';
import { Resend } from 'resend';
import type { EmailGateway } from '../application/email.js';
import type { CvDownloadNotifier } from '../application/cv-download.js';
import { ServiceUnavailableError } from '../application/email.js';
import type { ContactMessage } from '../domain/contact.js';
import type { CvDownloadEvent } from '../domain/cv-download.js';
import { createContactMessageEmail } from './email-templates/contact-message.template.js';
import { createContactThankYouEmail } from './email-templates/contact-thank-you.template.js';
import { createCvDownloadEmail } from './email-templates/cv-download.template.js';

type CvAttachment = { fileName: string; filePath: string };

export class ResendGateway implements EmailGateway, CvDownloadNotifier {
  private client: Resend | null;
  readonly configured: boolean;
  constructor(
    key: string,
    private from: string,
    private to: string,
    private profileImagePath: string,
    private findCv: (language: 'en' | 'es') => CvAttachment | null
  ) { this.configured = Boolean(key && from && to); this.client = key ? new Resend(key) : null; }
  async send(message: ContactMessage) {
    if (!this.client) throw new ServiceUnavailableError('Resend is not configured');
    const email = createContactMessageEmail(message);
    const result = await this.client.emails.send({ from: this.from, to: this.to, replyTo: message.email, subject: email.subject, html: email.html });
    if (result.error) throw new ServiceUnavailableError(result.error.message);

    try {
      const reply = createContactThankYouEmail(message);
      const cv = this.findCv(message.language);
      const attachments = [
        {
          content: fs.readFileSync(this.profileImagePath).toString('base64'),
          filename: 'elvis-hernandez.webp',
          contentId: 'elvis-profile'
        },
        ...(cv ? [{ content: fs.readFileSync(cv.filePath).toString('base64'), filename: cv.fileName }] : [])
      ];
      const autoReply = await this.client.emails.send({
        from: this.from,
        to: message.email,
        replyTo: this.to,
        subject: reply.subject,
        html: reply.html,
        attachments
      });
      if (autoReply.error) console.error('Contact auto-reply failed:', autoReply.error);
    } catch (autoReplyError) {
      console.error('Contact auto-reply failed:', autoReplyError);
    }

    return { provider: 'resend', id: result.data?.id ?? null };
  }

  async notifyCvDownload(event: CvDownloadEvent) {
    if (!this.client) throw new ServiceUnavailableError('Resend is not configured');
    const email = createCvDownloadEmail(event);
    const result = await this.client.emails.send({
      from: this.from,
      to: this.to,
      subject: email.subject,
      html: email.html
    });
    if (result.error) throw new ServiceUnavailableError(result.error.message);
  }
}
