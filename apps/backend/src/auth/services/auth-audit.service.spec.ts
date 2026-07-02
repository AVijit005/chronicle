import 'reflect-metadata';
import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { AuthAuditService } from './auth-audit.service';

describe('AuthAuditService', () => {
  let service: AuthAuditService;
  let prismaMock: {
    auditLog: { create: ReturnType<typeof mock> };
    securityEvent: { create: ReturnType<typeof mock> };
  };
  let contextMock: { get: ReturnType<typeof mock> };

  beforeEach(() => {
    prismaMock = {
      auditLog: { create: mock(() => Promise.resolve({ id: 'audit-1' })) },
      securityEvent: { create: mock(() => Promise.resolve({ id: 'event-1' })) },
    };
    contextMock = { get: mock(() => undefined) };
    service = new AuthAuditService(prismaMock as never, contextMock as never);
  });

  describe('logAudit', () => {
    it('writes an AuditLog with the given action and entity fields', async () => {
      await service.logAudit(
        'OAUTH_LINK',
        'user-1',
        'User',
        'user-1',
        null,
        { provider: 'GOOGLE' },
        { ipAddress: '127.0.0.1', userAgent: 'bun-test' },
      );

      expect(prismaMock.auditLog.create).toHaveBeenCalledTimes(1);
      const call = prismaMock.auditLog.create.mock.calls[0]?.[0] as {
        data: Record<string, unknown>;
      };
      expect(call.data.userId).toBe('user-1');
      expect(call.data.action).toBe('OAUTH_LINK');
      expect(call.data.entityType).toBe('User');
      expect(call.data.entityId).toBe('user-1');
      expect(call.data.previousValue).toBeNull();
      expect(call.data.newValue).toEqual({ provider: 'GOOGLE' });
      expect(call.data.ipAddress).toBe('127.0.0.1');
      expect(call.data.userAgent).toBe('bun-test');
    });

    it('allows null userId (system actions)', async () => {
      await service.logAudit('UPDATE', null, 'User', 'user-1', null, { status: 'ACTIVE' });
      const call = prismaMock.auditLog.create.mock.calls[0]?.[0] as {
        data: Record<string, unknown>;
      };
      expect(call.data.userId).toBeNull();
    });

    it('records EMAIL_VERIFIED action with previous and new values', async () => {
      await service.logAudit(
        'EMAIL_VERIFIED',
        'user-1',
        'User',
        'user-1',
        { emailVerified: false },
        { emailVerified: true },
      );
      const call = prismaMock.auditLog.create.mock.calls[0]?.[0] as {
        data: Record<string, unknown>;
      };
      expect(call.data.action).toBe('EMAIL_VERIFIED');
      expect(call.data.previousValue).toEqual({ emailVerified: false });
      expect(call.data.newValue).toEqual({ emailVerified: true });
    });

    it('includes correlationId from request context when not in metadata', async () => {
      contextMock.get.mockReturnValueOnce({
        requestId: 'req-1',
        correlationId: 'corr-1',
        userId: 'user-1',
      });

      await service.logAudit('LOGIN', 'user-1', 'User', 'user-1', null, null);

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

      await service.logAudit('LOGIN', 'user-1', 'User', 'user-1', null, null, { correlationId: 'corr-explicit' });

      const call = prismaMock.auditLog.create.mock.calls[0]?.[0] as {
        data: { metadata: Record<string, unknown> };
      };
      expect(call.data.metadata.correlationId).toBe('corr-explicit');
    });

    it('omits ipAddress/userAgent when not provided', async () => {
      await service.logAudit('UPDATE', 'user-1', 'User', 'user-1', null, null);

      const call = prismaMock.auditLog.create.mock.calls[0]?.[0] as {
        data: { ipAddress: string | undefined; userAgent: string | undefined };
      };
      expect(call.data.ipAddress).toBeUndefined();
      expect(call.data.userAgent).toBeUndefined();
    });
  });

  describe('logSecurityEvent', () => {
    it('writes a SecurityEvent with EMAIL_VERIFICATION_SENT', async () => {
      await service.logSecurityEvent('user-1', 'EMAIL_VERIFICATION_SENT', 'LOW', {
        ipAddress: '127.0.0.1',
        userAgent: 'bun-test',
      });

      expect(prismaMock.securityEvent.create).toHaveBeenCalledTimes(1);
      const call = prismaMock.securityEvent.create.mock.calls[0]?.[0] as {
        data: Record<string, unknown>;
      };
      expect(call.data.userId).toBe('user-1');
      expect(call.data.eventType).toBe('EMAIL_VERIFICATION_SENT');
      expect(call.data.severity).toBe('LOW');
      expect(call.data.ipAddress).toBe('127.0.0.1');
      expect(call.data.userAgent).toBe('bun-test');
    });

    it('allows null userId', async () => {
      await service.logSecurityEvent(null, 'FAILED_LOGIN', 'MEDIUM');
      const call = prismaMock.securityEvent.create.mock.calls[0]?.[0] as {
        data: Record<string, unknown>;
      };
      expect(call.data.userId).toBeNull();
    });

    it('includes correlationId from request context when not in metadata', async () => {
      contextMock.get.mockReturnValueOnce({
        requestId: 'req-1',
        correlationId: 'corr-1',
      });

      await service.logSecurityEvent('user-1', 'EMAIL_VERIFICATION_SENT', 'LOW');

      const call = prismaMock.securityEvent.create.mock.calls[0]?.[0] as {
        data: { metadata: Record<string, unknown> };
      };
      expect(call.data.metadata.correlationId).toBe('corr-1');
    });

    it('omits ipAddress/userAgent when not provided', async () => {
      await service.logSecurityEvent('user-1', 'EMAIL_VERIFICATION_SENT', 'LOW');
      const call = prismaMock.securityEvent.create.mock.calls[0]?.[0] as {
        data: { ipAddress: string | undefined; userAgent: string | undefined };
      };
      expect(call.data.ipAddress).toBeUndefined();
      expect(call.data.userAgent).toBeUndefined();
    });
  });
});
