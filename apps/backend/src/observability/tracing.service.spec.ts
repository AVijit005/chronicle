import { describe, it, expect, beforeEach } from 'bun:test';
import { TracingService } from './tracing.service';

describe('TracingService', () => {
  let service: TracingService;

  beforeEach(() => {
    service = new TracingService();
  });

  it('starts and ends a span', () => {
    const span = service.startSpan('test-span', { key: 'value' });
    expect(span.name).toBe('test-span');
    expect(span.attributes.key).toBe('value');
    expect(span.startTime).toBeDefined();
    expect(span.status).toBe('ok');

    service.endSpan(span, 'ok');
    expect(span.endTime).toBeDefined();
    expect(span.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('traces an async function', async () => {
    const result = await service.trace('async-task', async () => 42, {});
    expect(result).toBe(42);
  });

  it('records error status on exception', async () => {
    await expect(
      service.trace(
        'failing-task',
        async () => {
          throw new Error('boom');
        },
        {},
      ),
    ).rejects.toThrow('boom');

    const spans = service.getRecentSpans();
    const failedSpan = spans.find((s) => s.name === 'failing-task');
    expect(failedSpan).toBeDefined();
    expect(failedSpan!.status).toBe('error');
  });

  it('returns recent spans', () => {
    service.startSpan('span-1');
    service.startSpan('span-2');
    const recent = service.getRecentSpans(2);
    expect(recent.length).toBe(2);
  });

  it('clears spans', () => {
    service.startSpan('temp');
    service.clearSpans();
    expect(service.getSpans().length).toBe(0);
  });
});
