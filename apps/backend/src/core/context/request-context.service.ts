import { Injectable, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContextData {
  requestId: string;
  correlationId?: string;
  userId?: string;
}

@Injectable({ scope: Scope.DEFAULT })
export class RequestContextService {
  private readonly storage = new AsyncLocalStorage<RequestContextData>();

  public run<T>(context: RequestContextData, fn: () => Promise<T>): Promise<T> {
    return this.storage.run(context, fn);
  }

  public get(): RequestContextData | undefined {
    return this.storage.getStore();
  }

  public getRequestId(): string | undefined {
    return this.get()?.requestId;
  }

  public getCorrelationId(): string | undefined {
    return this.get()?.correlationId;
  }

  public getUserId(): string | undefined {
    return this.get()?.userId;
  }
}
