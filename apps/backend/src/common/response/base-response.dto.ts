export class BaseResponseDto<T> {
  data: T;
  requestId?: string;
  timestamp = new Date().toISOString();
}
