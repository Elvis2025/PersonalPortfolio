import type { ContactMessage } from '../domain/contact.js';
export type EmailDelivery = {
  provider: string;
  id: string | null;
};

export interface EmailGateway {
  readonly configured: boolean;
  send(message: ContactMessage): Promise<EmailDelivery>;
}

export interface ContactAutoReplySender {
  readonly configured: boolean;
  send(message: ContactMessage): Promise<boolean>;
}
export class ServiceUnavailableError extends Error {}
export class SendContactMessage {
  constructor(private gateway: EmailGateway, private autoReplySender: ContactAutoReplySender) {}
  async execute(message: ContactMessage) {
    if (!this.gateway.configured) throw new ServiceUnavailableError('Email service is not configured');
    const delivery = await this.gateway.send(message);
    const autoReplyQueued = this.autoReplySender.configured;
    if (autoReplyQueued) {
      setImmediate(() => {
        void this.autoReplySender.send(message).then((sent) => {
          if (!sent) console.error('Brevo auto-reply was not accepted. Review the previous API error.');
        });
      });
    }
    return { ...delivery, autoReplyQueued };
  }
}
