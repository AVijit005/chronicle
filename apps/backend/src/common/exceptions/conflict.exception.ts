import { BusinessException } from './business.exception';

export class ConflictException extends BusinessException {
  constructor(message: string, code = 'CONFLICT') {
    super(message, code, 409);
  }
}
