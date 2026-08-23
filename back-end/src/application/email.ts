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
    const autoReplySent = this.autoReplySender.configured
      ? await this.autoReplySender.send(message)
      : false;
    return { ...delivery, autoReplySent };
  }
}
