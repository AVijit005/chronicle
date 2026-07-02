import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { EmailVerificationToken } from '@prisma/client';
import { TokenFactory } from './token.factory';
import {
  CreateEmailVerificationTokenData,
  EmailVerificationTokenRepository,
} from '../repositories/email-verification-token.repository';

@Injectable()
export class VerificationTokenService {
  constructor(
    private readonly tokenFactory: TokenFactory,
    private readonly repository: EmailVerificationTokenRepository,
  ) {}

  generateToken(): string {
    return this.tokenFactory.generateSecureToken(32);
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async create(data: CreateEmailVerificationTokenData): Promise<EmailVerificationToken> {
    return this.repository.create(data);
  }

  async findByTokenHash(tokenHash: string): Promise<EmailVerificationToken | null> {
    return this.repository.findByTokenHash(tokenHash);
  }

  async markVerified(id: string): Promise<EmailVerificationToken> {
    return this.repository.markVerified(id);
  }

  async invalidatePreviousForUser(userId: string): Promise<{ count: number }> {
    return this.repository.invalidatePreviousForUser(userId);
  }
}
