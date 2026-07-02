import { BusinessException } from './business.exception';

export class ForbiddenException extends BusinessException {
  constructor(message: string, code = 'FORBIDDEN') {
    super(message, code, 403);
  }
}
