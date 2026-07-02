import { Injectable } from '@nestjs/common';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { HashingService } from './hashing.abstraction';

@Injectable()
export class NodeCryptoHashingService extends HashingService {
  private readonly algorithm = 'sha256';

  async hash(plain: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const hash = createHash(this.algorithm)
      .update(plain + salt)
      .digest('hex');
    return `${salt}:${hash}`;
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    const [salt, hash] = hashed.split(':');
    if (!salt || !hash) return false;
    const computed = createHash(this.algorithm)
      .update(plain + salt)
      .digest('hex');
    const computedBuffer = Buffer.from(computed);
    const hashBuffer = Buffer.from(hash);
    if (computedBuffer.length !== hashBuffer.length) return false;
    return timingSafeEqual(computedBuffer, hashBuffer);
  }
}
