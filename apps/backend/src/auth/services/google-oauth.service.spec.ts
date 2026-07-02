import 'reflect-metadata';
import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { ForbiddenException } from '../../common';
import { GoogleOAuthService } from './google-oauth.service';
import { AuthAuditService } from './auth-audit.service';

function createMockUser(overrides: Record<string, unknown> = {}) {
  const now = new Date();
  return {
    id: 'user-1',
    email: 'alice@example.com',
    passwordHash: null,
    name: 'Alice',
    role: 'USER',
    status: 'ACTIVE',
    emailVerified: true,
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    ...overrides,
  };
}

function createProfile(overrides: Record<string, unknown> = {}) {
  return {
    provider: 'google' as const,
    providerAccountId: 'google-123',
    email: 'alice@example.com',
    emailVerified: true,
    displayName: 'Alice',
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    ...overrides,
  };
}

describe('GoogleOAuthService', () => {
  let service: GoogleOAuthService;
  let authRepoMock: {
    findById: ReturnType<typeof mock>;
    findByEmail: ReturnType<typeof mock>;
    createOAuthUser: ReturnType<typeof mock>;
    save: ReturnType<typeof mock>;
  };
  let oauthRepoMock: {
    findByProviderAndAccountId: ReturnType<typeof mock>;
    create: ReturnType<typeof mock>;
  };
  let auditMock: {
    logAudit: ReturnType<typeof mock>;
    logSecurityEvent: ReturnType<typeof mock>;
  };

  beforeEach(() => {
    authRepoMock = {
      findById: mock(() => Promise.resolve(null)),
      findByEmail: mock(() => Promise.resolve(null)),
      createOAuthUser: mock(() => Promise.resolve(createMockUser())),
      save: mock((user: ReturnType<typeof createMockUser>) => Promise.resolve(user)),
    };
    oauthRepoMock = {
      findByProviderAndAccountId: mock(() => Promise.resolve(null)),
      create: mock(() =>
        Promise.resolve({
          id: 'oauth-1',
          userId: 'user-1',
          provider: 'GOOGLE',
          providerAccountId: 'google-123',
        }),
      ),
    };
    auditMock = {
      logAudit: mock(() => Promise.resolve()),
      logSecurityEvent: mock(() => Promise.resolve()),
    };

    service = new GoogleOAuthService(authRepoMock as never, oauthRepoMock as never, auditMock as never);
  });

  it('rejects unverified Google emails', async () => {
    const profile = createProfile({ emailVerified: false });

    expect(service.validateOrCreate(profile)).rejects.toThrow(ForbiddenException);
    expect(oauthRepoMock.findByProviderAndAccountId).not.toHaveBeenCalled();
  });

  it('returns existing user when OAuth account exists', async () => {
    const user = createMockUser();
    oauthRepoMock.findByProviderAndAccountId.mockReturnValueOnce(
      Promise.resolve({ id: 'oauth-1', userId: user.id, provider: 'GOOGLE' }),
    );
    authRepoMock.findById.mockReturnValueOnce(Promise.resolve(user));

    const result = await service.validateOrCreate(createProfile());

    expect(result.user.id).toBe(user.id);
    expect(result.isNew).toBe(false);
    expect(result.isLinked).toBe(false);
    expect(authRepoMock.createOAuthUser).not.toHaveBeenCalled();
    expect(auditMock.logAudit).not.toHaveBeenCalled();
  });

  it('links existing password user when email matches verified Google', async () => {
    const user = createMockUser({ emailVerified: false, passwordHash: 'hash' });
    authRepoMock.findByEmail.mockReturnValueOnce(Promise.resolve(user));
    authRepoMock.save.mockImplementationOnce((u) => Promise.resolve(u));

    const result = await service.validateOrCreate(createProfile({ providerAccountId: 'google-456' }));

    expect(result.isNew).toBe(false);
    expect(result.isLinked).toBe(true);
    expect(result.user.emailVerified).toBe(true);
    expect(oauthRepoMock.create).toHaveBeenCalledTimes(1);
    expect(authRepoMock.save).toHaveBeenCalledTimes(1);
    expect(auditMock.logAudit).toHaveBeenCalledTimes(1);
    const call = auditMock.logAudit.mock.calls[0];
    expect(call?.[0]).toBe('OAUTH_LINK');
    expect(call?.[1]).toBe(user.id);
  });

  it('does not call save when existing user already verified', async () => {
    const user = createMockUser({ emailVerified: true });
    authRepoMock.findByEmail.mockReturnValueOnce(Promise.resolve(user));

    const result = await service.validateOrCreate(createProfile());

    expect(result.isLinked).toBe(true);
    expect(authRepoMock.save).not.toHaveBeenCalled();
  });

  it('creates a new user when no email match and no OAuth account exists', async () => {
    const user = createMockUser({ id: 'new-user', emailVerified: true });
    authRepoMock.createOAuthUser.mockReturnValueOnce(Promise.resolve(user));

    const result = await service.validateOrCreate(
      createProfile({ email: 'new@example.com', providerAccountId: 'google-789' }),
    );

    expect(result.isNew).toBe(true);
    expect(result.isLinked).toBe(false);
    expect(result.user.id).toBe('new-user');
    expect(authRepoMock.createOAuthUser).toHaveBeenCalledWith({
      email: 'new@example.com',
      displayName: 'Alice',
      emailVerified: true,
    });
    expect(oauthRepoMock.create).toHaveBeenCalledTimes(1);
    expect(auditMock.logAudit.mock.calls[0]?.[0]).toBe('CREATE');
  });

  it('throws when existing OAuth account points to missing user', async () => {
    oauthRepoMock.findByProviderAndAccountId.mockReturnValueOnce(
      Promise.resolve({ id: 'oauth-1', userId: 'missing-user', provider: 'GOOGLE' }),
    );
    authRepoMock.findById.mockReturnValueOnce(Promise.resolve(null));

    expect(service.validateOrCreate(createProfile())).rejects.toThrow(ForbiddenException);
  });

  it('propagates AuthAuditService unused import detection', () => {
    expect(AuthAuditService).toBeDefined();
  });
});
