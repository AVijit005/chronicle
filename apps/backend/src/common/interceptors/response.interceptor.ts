import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Request } from 'express';

export interface ResponsePayload<T> {
  data: T;
  requestId: string | undefined;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponsePayload<T> | T> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ResponsePayload<T> | T> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = request['id'] as string | undefined;
    const url = request.url ?? '';

    // Skip wrapping for Swagger docs
    if (url.startsWith('/docs') || url.startsWith('/api/docs')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // Skip wrapping for null/undefined (204 No Content intent)
        if (data === null || data === undefined) {
          return data;
        }

        // Skip wrapping for binary/stream responses
        if (Buffer.isBuffer(data)) {
          return data;
        }

        // Handle paginated responses — don't double-wrap
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'meta' in data &&
          Array.isArray((data as PaginatedResponse<unknown>).data)
        ) {
          return {
            ...data,
            requestId,
            timestamp: new Date().toISOString(),
          };
        }

        // Standard wrapping
        return {
          data,
          requestId,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
