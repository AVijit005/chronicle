import { HttpException } from '@nestjs/common';

export class BusinessException extends HttpException {
  public readonly code: string;

  constructor(message: string, code: string, statusCode = 400) {
    super({ message, code }, statusCode);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
