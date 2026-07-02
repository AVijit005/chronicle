import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { EmailVerificationToken } from '@prisma/client';
import { EmailVerificationTokenRepository } from './email-verification-token.repository';

function createMockToken(overrides?: Partial<EmailVerificationToken>): EmailVerificationToken {
  const now = new Date();
  return {
    id: 'token-1',
    userId: 'user-1',
    email: 'alice@example.com',
    tokenHash: 'hash-1',
    expiresAt: new Date(now.getTime() + 60_000),
    verifiedAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  } as EmailVerificationToken;
}

describe('EmailVerificationTokenRepository', () => {
  let repository: EmailVerificationTokenRepository;
  let prismaMock: {
    emailVerificationToken: {
      findUnique: ReturnType<typeof mock>;
      count: ReturnType<typeof mock>;
      create: ReturnType<typeof mock>;
      update: ReturnType<typeof mock>;
      updateMany: ReturnType<typeof mock>;
      delete: ReturnType<typeof mock>;
    };
  };

  beforeEach(() => {
    prismaMock = {
      emailVerificationToken: {
        findUnique: mock(() => Promise.resolve(null)),
        count: mock(() => Promise.resolve(0)),
        create: mock(() => Promise.resolve(createMockToken())),
        update: mock(() => Promise.resolve(createMockToken())),
        updateMany: mock(() => Promise.resolve({ count: 1 })),
        delete: mock(() => Promise.resolve(undefined)),
      },
    };
    repository = new EmailVerificationTokenRepository(prismaMock as never);
  });

  it('findById delegates to prisma.emailVerificationToken.findUnique', async () => {
    const token = createMockToken({ id: 'token-2' });
    prismaMock.emailVerificationToken.findUnique.mockResolvedValueOnce(token);
    const result = await repository.findById('token-2');
    expect(result).toEqual(token);
    expect(prismaMock.emailVerificationToken.findUnique).toHaveBeenCalledWith({
      where: { id: 'token-2' },
    });
  });

  it('exists returns true when count is greater than zero', async () => {
    prismaMock.emailVerificationToken.count.mockResolvedValueOnce(1);
    const result = await repository.exists('token-1');
    expect(result).toBe(true);
    expect(prismaMock.emailVerificationToken.count).toHaveBeenCalledWith({
      where: { id: 'token-1' },
    });
  });

  it('exists returns false when count is zero', async () => {
    prismaMock.emailVerificationToken.count.mockResolvedValueOnce(0);
    const result = await repository.exists('token-1');
    expect(result).toBe(false);
  });

  it('save updates a token by id', async () => {
    const token = createMockToken({ id: 'token-3', verifiedAt: new Date() });
    prismaMock.emailVerificationToken.update.mockResolvedValueOnce(token);
    const result = await repository.save(token);
    expect(result).toEqual(token);
    expect(prismaMock.emailVerificationToken.update).toHaveBeenCalled();
  });

  it('delete performs a hard delete', async () => {
    prismaMock.emailVerificationToken.delete.mockResolvedValueOnce(undefined);
    await repository.delete('token-1');
    expect(prismaMock.emailVerificationToken.delete).toHaveBeenCalledWith({
      where: { id: 'token-1' },
    });
  });

  it('findByTokenHash delegates to findUnique by tokenHash', async () => {
    const token = createMockToken({ tokenHash: 'hash-2' });
    prismaMock.emailVerificationToken.findUnique.mockResolvedValueOnce(token);
    const result = await repository.findByTokenHash('hash-2');
    expect(result).toEqual(token);
    expect(prismaMock.emailVerificationToken.findUnique).toHaveBeenCalledWith({
      where: { tokenHash: 'hash-2' },
    });
  });

  it('create persists a token', async () => {
    const token = createMockToken();
    prismaMock.emailVerificationToken.create.mockResolvedValueOnce(token);
    const expiresAt = new Date('2030-01-01T00:00:00Z');
    const result = await repository.create({
      userId: 'user-1',
      email: 'alice@example.com',
      tokenHash: 'hash-1',
      expiresAt,
    });
    expect(result).toEqual(token);
    expect(prismaMock.emailVerificationToken.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        email: 'alice@example.com',
        tokenHash: 'hash-1',
        expiresAt,
      },
    });
  });

  it('markVerified sets verifiedAt to now', async () => {
    const token = createMockToken({ verifiedAt: new Date() });
    prismaMock.emailVerificationToken.update.mockResolvedValueOnce(token);
    const result = await repository.markVerified('token-1');
    expect(result).toEqual(token);
    const call = prismaMock.emailVerificationToken.update.mock.calls[0]?.[0] as {
      where: { id: string };
      data: { verifiedAt: Date };
    };
    expect(call.where.id).toBe('token-1');
    expect(call.data.verifiedAt).toBeInstanceOf(Date);
  });

  it('invalidatePreviousForUser expires unverified future tokens', async () => {
    prismaMock.emailVerificationToken.updateMany.mockResolvedValueOnce({ count: 2 });
    const result = await repository.invalidatePreviousForUser('user-1');
    expect(result).toEqual({ count: 2 });
    const call = prismaMock.emailVerificationToken.updateMany.mock.calls[0]?.[0] as {
      where: { userId: string; verifiedAt: null; expiresAt: { gt: Date } };
      data: { expiresAt: Date };
    };
    expect(call.where.userId).toBe('user-1');
    expect(call.where.verifiedAt).toBeNull();
    expect(call.where.expiresAt.gt).toBeInstanceOf(Date);
    expect(call.data.expiresAt).toBeInstanceOf(Date);
    expect(call.data.expiresAt.getTime()).toBeLessThanOrEqual(Date.now());
  });
});
