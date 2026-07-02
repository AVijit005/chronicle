import 'reflect-metadata';
import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { UserAuditLogService } from './user-audit-log.service';

describe('UserAuditLogService', () => {
  let service: UserAuditLogService;
  let prismaMock: { auditLog: { create: ReturnType<typeof mock> } };
  let contextMock: {
    get: ReturnType<typeof mock>;
  };

  beforeEach(() => {
    prismaMock = {
      auditLog: { create: mock(() => Promise.resolve({ id: 'log-1' })) },
    };
    contextMock = { get: mock(() => undefined) };
    service = new UserAuditLogService(prismaMock as never, contextMock as never);
  });

  it('writes an AuditLog with action UPDATE', async () => {
    await service.logChange(
      'user-1',
      'User',
      'user-1',
      { displayName: null },
      { displayName: 'Alice' },
      { ipAddress: '127.0.0.1', userAgent: 'bun-test' },
    );

    expect(prismaMock.auditLog.create).toHaveBeenCalledTimes(1);
    const call = prismaMock.auditLog.create.mock.calls[0]?.[0] as {
      data: Record<string, unknown>;
    };
    expect(call.data.userId).toBe('user-1');
    expect(call.data.action).toBe('UPDATE');
    expect(call.data.entityType).toBe('User');
    expect(call.data.entityId).toBe('user-1');
    expect(call.data.ipAddress).toBe('127.0.0.1');
    expect(call.data.userAgent).toBe('bun-test');
    expect(call.data.previousValue).toEqual({ displayName: null });
    expect(call.data.newValue).toEqual({ displayName: 'Alice' });
    const meta = call.data.metadata as Record<string, unknown>;
    expect(meta.ipAddress).toBe('127.0.0.1');
    expect(meta.userAgent).toBe('bun-test');
  });

  it('includes correlationId from request context when not in metadata', async () => {
    contextMock.get.mockReturnValueOnce({
      requestId: 'req-1',
      correlationId: 'corr-1',
      userId: 'user-1',
    });

    await service.logChange('user-1', 'User', 'user-1', { displayName: null }, { displayName: 'Bob' });

    const call = prismaMock.auditLog.create.mock.calls[0]?.[0] as {
      data: { metadata: Record<string, unknown> };
    };
    expect(call.data.metadata.correlationId).toBe('corr-1');
  });

  it('prefers explicit correlationId from metadata over context', async () => {
    contextMock.get.mockReturnValueOnce({
      requestId: 'req-1',
      correlationId: 'corr-from-context',
      userId: 'user-1',
    });

    await service.logChange('user-1', 'User', 'user-1', null, null, { correlationId: 'corr-explicit' });

    const call = prismaMock.auditLog.create.mock.calls[0]?.[0] as {
      data: { metadata: Record<string, unknown> };
    };
    expect(call.data.metadata.correlationId).toBe('corr-explicit');
  });

  it('omits ipAddress/userAgent when not provided', async () => {
    await service.logChange('user-1', 'User', 'user-1', null, null);

    const call = prismaMock.auditLog.create.mock.calls[0]?.[0] as {
      data: { ipAddress: string | undefined; userAgent: string | undefined };
    };
    expect(call.data.ipAddress).toBeUndefined();
    expect(call.data.userAgent).toBeUndefined();
  });
});
