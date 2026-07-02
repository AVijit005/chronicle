import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  requestId?: string;
  correlationId?: string;
  userId?: string;
  executionTimeMs?: number;
  route?: string;
  method?: string;
  statusCode?: number;
  queue?: string;
  jobId?: string;
  scheduler?: string;
  [key: string]: unknown;
}

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);
  private readonly buffer: LogEntry[] = [];
  private readonly maxBufferSize = 500;

  debug(message: string, meta: Partial<LogEntry> = {}): void {
    this.emit('debug', message, meta);
  }

  info(message: string, meta: Partial<LogEntry> = {}): void {
    this.emit('info', message, meta);
  }

  warn(message: string, meta: Partial<LogEntry> = {}): void {
    this.emit('warn', message, meta);
  }

  error(message: string, meta: Partial<LogEntry> = {}): void {
    this.emit('error', message, meta);
  }

  private emit(level: LogEntry['level'], message: string, meta: Partial<LogEntry>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta,
      correlationId: meta.correlationId ?? randomUUID(),
    };

    // Add to buffer
    if (this.buffer.length >= this.maxBufferSize) {
      this.buffer.shift();
    }
    this.buffer.push(entry);

    // Write via NestJS logger
    const logFn =
      level === 'error'
        ? this.logger.error.bind(this.logger)
        : level === 'warn'
          ? this.logger.warn.bind(this.logger)
          : level === 'debug'
            ? this.logger.debug.bind(this.logger)
            : this.logger.log.bind(this.logger);

    logFn(JSON.stringify(entry));
  }

  getRecentLogs(limit = 100): LogEntry[] {
    return this.buffer.slice(-limit);
  }

  clearLogs(): void {
    this.buffer.length = 0;
  }
}
