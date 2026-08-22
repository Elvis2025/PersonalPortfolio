import type { ContactMessage } from '../domain/contact.js';
export interface EmailGateway { readonly configured: boolean; send(message: ContactMessage): Promise<{ provider: string; id: string | null }> }
export class ServiceUnavailableError extends Error {}
export class SendContactMessage {
  constructor(private gateway: EmailGateway) {}
  execute(message: ContactMessage) {
    if (!this.gateway.configured) throw new ServiceUnavailableError('Email service is not configured');
    return this.gateway.send(message);
  }
}
