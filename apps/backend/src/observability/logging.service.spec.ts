import { describe, it, expect, beforeEach } from 'bun:test';
import { LoggingService } from './logging.service';

describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    service = new LoggingService();
  });

  it('logs info messages', () => {
    service.info('test message', { route: '/test' });
    const logs = service.getRecentLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('info');
    expect(logs[0].message).toBe('test message');
    expect(logs[0].route).toBe('/test');
  });

  it('logs error messages', () => {
    service.error('error occurred', { statusCode: 500 });
    const logs = service.getRecentLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('error');
    expect(logs[0].statusCode).toBe(500);
  });

  it('logs warn messages', () => {
    service.warn('warning', {});
    const logs = service.getRecentLogs();
    expect(logs[0].level).toBe('warn');
  });

  it('logs debug messages', () => {
    service.debug('debugging', {});
    const logs = service.getRecentLogs();
    expect(logs[0].level).toBe('debug');
  });

  it('generates correlationId when not provided', () => {
    service.info('no correlation', {});
    const logs = service.getRecentLogs();
    expect(logs[0].correlationId).toBeDefined();
    expect(typeof logs[0].correlationId).toBe('string');
  });

  it('clears logs', () => {
    service.info('temp', {});
    service.clearLogs();
    expect(service.getRecentLogs().length).toBe(0);
  });
});
