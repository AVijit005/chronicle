import { BaseResponseDto } from './base-response.dto';

export class ApiResponse {
  static success<T>(data: T, requestId?: string): BaseResponseDto<T> {
    return {
      data,
      requestId,
      timestamp: new Date().toISOString(),
    };
  }
}
