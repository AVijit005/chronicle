import { BusinessException } from './business.exception';

export class NotFoundException extends BusinessException {
  constructor(message: string, code = 'NOT_FOUND') {
    super(message, code, 404);
  }
}
