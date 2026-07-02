export const EMAIL_TRANSPORT = Symbol('EMAIL_TRANSPORT');

export interface VerificationEmailOptions {
  token: string;
  link: string;
  userDisplayName?: string;
}

export interface EmailTransport {
  sendVerificationEmail(to: string, options: VerificationEmailOptions): Promise<void>;
}
