import { BusinessException } from './business.exception';

export class ValidationException extends BusinessException {
  public readonly errors?: Record<string, string[]>;

  constructor(message: string, errors?: Record<string, string[]>, code = 'VALIDATION_ERROR') {
    super(message, code, 400);
    this.errors = errors;
  }
}
