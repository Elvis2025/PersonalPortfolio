import type { ContactMessage } from '../domain/contact.js';
export type EmailDelivery = {
  provider: string;
  id: string | null;
  autoReplySent: boolean;
};

export interface EmailGateway {
  readonly configured: boolean;
  send(message: ContactMessage): Promise<EmailDelivery>;
}
export class ServiceUnavailableError extends Error {}
export class SendContactMessage {
  constructor(private gateway: EmailGateway) {}
  execute(message: ContactMessage) {
    if (!this.gateway.configured) throw new ServiceUnavailableError('Email service is not configured');
    return this.gateway.send(message);
  }
}
