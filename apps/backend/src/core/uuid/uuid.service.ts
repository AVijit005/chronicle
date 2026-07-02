import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UuidGenerator } from './uuid.abstraction';

@Injectable()
export class UuidService extends UuidGenerator {
  generate(): string {
    return randomUUID();
  }
}
