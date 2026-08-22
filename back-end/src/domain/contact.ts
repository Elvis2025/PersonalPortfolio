export type ContactInput = { name?: string; email?: string; subject?: string; message?: string; company?: string };
export type ContactMessage = Required<Omit<ContactInput, 'company'>>;
export class ValidationError extends Error { constructor(public code: 'MISSING_REQUIRED_FIELDS' | 'INVALID_EMAIL_FORMAT') { super(code); } }
export function validateContact(input: ContactInput): ContactMessage {
  if (!input.name || !input.email || !input.subject || !input.message) throw new ValidationError('MISSING_REQUIRED_FIELDS');
  const email = input.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ValidationError('INVALID_EMAIL_FORMAT');
  return { name: input.name.trim(), email, subject: input.subject.trim(), message: input.message.trim() };
}
