import fs from 'node:fs';
import type { ContactAutoReplySender } from '../application/email.js';
import type { ContactMessage } from '../domain/contact.js';
import { createContactThankYouEmail } from './email-templates/contact-thank-you.template.js';

type CvAttachment = { fileName: string; filePath: string };
type OptionalSocialLinks = { telegram: string; threads: string; instagram: string; x: string };

export class BrevoAutoReplySender implements ContactAutoReplySender {
  readonly configured: boolean;

  constructor(
    private apiKey: string,
    private senderEmail: string,
    private profileImageUrl: string,
    private socialLinks: OptionalSocialLinks,
    private findCv: (language: 'en' | 'es') => CvAttachment | null
  ) {
    this.configured = Boolean(apiKey && senderEmail);
  }

  async send(message: ContactMessage) {
    if (!this.configured) {
      console.error('Brevo auto-reply is not configured. Set BREVO_API_KEY and BREVO_SENDER_EMAIL.');
      return false;
    }

    const cv = this.findCv(message.language);
    if (!cv || !fs.existsSync(cv.filePath)) {
      console.error('Brevo auto-reply CV is missing:', cv?.filePath);
      return false;
    }

    try {
      const email = createContactThankYouEmail(message, new Date(), this.profileImageUrl, this.socialLinks);
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { accept: 'application/json', 'api-key': this.apiKey, 'content-type': 'application/json' },
        body: JSON.stringify({
          sender: { name: 'Elvis Hernández', email: this.senderEmail },
          to: [{ name: message.name, email: message.email }],
          replyTo: { name: 'Elvis Hernández', email: this.senderEmail },
          subject: email.subject,
          htmlContent: email.html,
          attachment: [{
            name: cv.fileName.toLowerCase().endsWith('.pdf') ? cv.fileName : `${cv.fileName}.pdf`,
            content: fs.readFileSync(cv.filePath).toString('base64')
          }],
          tags: ['portfolio-contact-auto-reply']
        }),
        signal: AbortSignal.timeout(30_000)
      });
      const result = await response.json().catch(() => ({})) as { messageId?: string; message?: string; code?: string };
      if (!response.ok) {
        console.error('Brevo auto-reply rejected:', response.status, result.code, result.message);
        return false;
      }
      console.log(`Brevo auto-reply accepted: ${result.messageId ?? 'no message id'}`);
      return true;
    } catch (error) {
      console.error('Brevo auto-reply failed:', error);
      return false;
    }
  }
}
