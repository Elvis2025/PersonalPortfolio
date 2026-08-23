import fs from 'node:fs';
import nodemailer from 'nodemailer';
import type { ContactAutoReplySender } from '../application/email.js';
import type { ContactMessage } from '../domain/contact.js';
import { createContactThankYouEmail } from './email-templates/contact-thank-you.template.js';

type CvAttachment = { fileName: string; filePath: string };

export class GmailAutoReplySender implements ContactAutoReplySender {
  readonly configured: boolean;
  private readonly transporter;

  constructor(
    private gmailAddress: string,
    appPassword: string,
    private profileImagePath: string,
    private findCv: (language: 'en' | 'es') => CvAttachment | null
  ) {
    this.configured = Boolean(gmailAddress && appPassword);
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: gmailAddress, pass: appPassword }
    });
  }

  async send(message: ContactMessage) {
    if (!this.configured) {
      console.error('Gmail auto-reply is not configured. Set CONTACT_TO_EMAIL and GMAIL_APP_PASSWORD.');
      return false;
    }

    const cv = this.findCv(message.language);
    if (!cv || !fs.existsSync(cv.filePath) || !fs.existsSync(this.profileImagePath)) {
      console.error('Gmail auto-reply assets are missing:', { cv: cv?.filePath, profile: this.profileImagePath });
      return false;
    }

    try {
      const email = createContactThankYouEmail(message);
      const info = await this.transporter.sendMail({
        from: `Elvis Hernández <${this.gmailAddress}>`,
        to: message.email,
        replyTo: this.gmailAddress,
        subject: email.subject,
        html: email.html,
        attachments: [
          {
            filename: 'elvis-hernandez.webp',
            path: this.profileImagePath,
            cid: 'elvis-profile',
            contentType: 'image/webp'
          },
          {
            filename: cv.fileName.toLowerCase().endsWith('.pdf') ? cv.fileName : `${cv.fileName}.pdf`,
            path: cv.filePath,
            contentType: 'application/pdf'
          }
        ]
      });
      console.log(`Gmail auto-reply sent: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('Gmail auto-reply failed:', error);
      return false;
    }
  }
}
