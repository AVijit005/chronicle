import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { TracingSpan } from './dto';

@Injectable()
export class TracingService {
  private readonly logger = new Logger(TracingService.name);
  private readonly spans: TracingSpan[] = [];
  private readonly maxSpans = 1000;

  startSpan(name: string, attributes: Record<string, string | number | boolean> = {}): TracingSpan {
    const span: TracingSpan = {
      name,
      traceId: randomUUID(),
      spanId: randomUUID(),
      startTime: new Date(),
      attributes,
      status: 'ok',
    };

    if (this.spans.length >= this.maxSpans) {
      this.spans.shift();
    }
    this.spans.push(span);

    return span;
  }

  endSpan(span: TracingSpan, status: 'ok' | 'error' = 'ok'): void {
    span.endTime = new Date();
    span.durationMs = span.endTime.getTime() - span.startTime.getTime();
    span.status = status;
  }

  async trace<T>(
    name: string,
    fn: () => Promise<T>,
    attributes: Record<string, string | number | boolean> = {},
  ): Promise<T> {
    const span = this.startSpan(name, attributes);
    try {
      const result = await fn();
      this.endSpan(span, 'ok');
      return result;
    } catch (error) {
      this.endSpan(span, 'error');
      span.attributes.error = (error as Error).message;
      throw error;
    }
  }

  getSpans(): TracingSpan[] {
    return this.spans;
  }

  getRecentSpans(limit = 50): TracingSpan[] {
    return this.spans.slice(-limit);
  }

  clearSpans(): void {
    this.spans.length = 0;
  }
}
