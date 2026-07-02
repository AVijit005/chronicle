import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class TokenFactory {
  generateSecureToken(length = 32): string {
    return randomBytes(length).toString('base64url');
  }
}
