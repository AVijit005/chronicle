import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { Prisma, Session, User } from '@prisma/client';
import { UsersRepository } from './users.repository';

function createMockUser(overrides?: Partial<User>): User {
  const now = new Date();
  return {
    id: 'user-1',
    email: 'test@example.com',
    passwordHash: null,
    name: null,
    displayName: null,
    username: null,
    bio: null,
    location: null,
    website: null,
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    themePreference: 'system',
    avatar: null,
    coverImage: null,
    preferences: Prisma.JsonNull,
    privacy: Prisma.JsonNull,
    role: 'USER',
    status: 'ACTIVE',
    emailVerified: false,
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    ...overrides,
  } as User;
}

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let prismaMock: {
    user: {
      findUnique: ReturnType<typeof mock>;
      findFirst: ReturnType<typeof mock>;
      count: ReturnType<typeof mock>;
      create: ReturnType<typeof mock>;
      update: ReturnType<typeof mock>;
      delete: ReturnType<typeof mock>;
    };
    session: {
      findMany: ReturnType<typeof mock>;
      findFirst: ReturnType<typeof mock>;
      update: ReturnType<typeof mock>;
      updateMany: ReturnType<typeof mock>;
    };
  };

  beforeEach(() => {
    prismaMock = {
      user: {
        findUnique: mock(() => Promise.resolve(null)),
        findFirst: mock(() => Promise.resolve(null)),
        count: mock(() => Promise.resolve(0)),
        create: mock(() => Promise.resolve(createMockUser())),
        update: mock(() => Promise.resolve(createMockUser())),
        delete: mock(() => Promise.resolve(undefined)),
      },
      session: {
        findMany: mock(() => Promise.resolve([])),
        findFirst: mock(() => Promise.resolve(null)),
        update: mock(() => Promise.resolve({} as Session)),
        updateMany: mock(() => Promise.resolve({ count: 1 })),
      },
    };
    repository = new UsersRepository(prismaMock as never);
  });

  it('findById delegates to prisma.user.findUnique', async () => {
    const user = createMockUser({ id: 'u-2' });
    prismaMock.user.findUnique.mockResolvedValueOnce(user);
    const result = await repository.findById('u-2');
    expect(result).toEqual(user);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 'u-2' } });
  });

  it('exists returns true when count is greater than zero', async () => {
    prismaMock.user.count.mockResolvedValueOnce(1);
    const result = await repository.exists('u-1');
    expect(result).toBe(true);
  });

  it('exists returns false when count is zero', async () => {
    prismaMock.user.count.mockResolvedValueOnce(0);
    const result = await repository.exists('u-1');
    expect(result).toBe(false);
  });

  it('save updates a user by id', async () => {
    const user = createMockUser({ id: 'u-3', name: 'Updated' });
    prismaMock.user.update.mockResolvedValueOnce(user);
    const result = await repository.save(user);
    expect(result).toEqual(user);
    expect(prismaMock.user.update).toHaveBeenCalled();
  });

  it('delete removes a user', async () => {
    prismaMock.user.delete.mockResolvedValueOnce(undefined);
    await repository.delete('u-1');
    expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: 'u-1' } });
  });

  it('findByUsername returns a user when present', async () => {
    const user = createMockUser({ username: 'alice' });
    prismaMock.user.findUnique.mockResolvedValueOnce(user);
    const result = await repository.findByUsername('alice');
    expect(result).toEqual(user);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { username: 'alice' } });
  });

  it('findByUsernameExcludingUserId excludes the user id from the query', async () => {
    const user = createMockUser({ id: 'other', username: 'bob' });
    prismaMock.user.findFirst.mockResolvedValueOnce(user);
    const result = await repository.findByUsernameExcludingUserId('bob', 'self-id');
    expect(result).toEqual(user);
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { username: 'bob', NOT: { id: 'self-id' } },
    });
  });

  it('updateProfile applies the partial data', async () => {
    const updated = createMockUser({ displayName: 'Alice' });
    prismaMock.user.update.mockResolvedValueOnce(updated);
    const result = await repository.updateProfile('u-1', { displayName: 'Alice' });
    expect(result).toEqual(updated);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 'u-1' },
      data: { displayName: 'Alice' },
    });
  });

  it('updatePreferences persists JSON preferences', async () => {
    const updated = createMockUser();
    prismaMock.user.update.mockResolvedValueOnce(updated);
    const prefs = { autoplay: true, defaultLandingPage: 'library' as const };
    await repository.updatePreferences('u-1', prefs);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 'u-1' },
      data: { preferences: prefs },
    });
  });

  it('updatePrivacy persists JSON privacy', async () => {
    const privacy = { profileVisibility: 'public' as const };
    await repository.updatePrivacy('u-1', privacy);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 'u-1' },
      data: { privacy },
    });
  });

  it('updateAvatar sets the avatar path', async () => {
    await repository.updateAvatar('u-1', 'avatars/u-1/file.png');
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 'u-1' },
      data: { avatar: 'avatars/u-1/file.png' },
    });
  });

  it('removeAvatar nulls the avatar field', async () => {
    await repository.removeAvatar('u-1');
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 'u-1' },
      data: { avatar: null },
    });
  });

  it('findSessionsByUserId filters active non-expired sessions', async () => {
    const sessions = [{ id: 's-1' } as Session];
    prismaMock.session.findMany.mockResolvedValueOnce(sessions);
    const now = new Date();
    const result = await repository.findSessionsByUserId('u-1', now);
    expect(result).toEqual(sessions);
    expect(prismaMock.session.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'u-1',
        status: 'ACTIVE',
        deletedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('findSessionByIdAndUserId scopes by both id and userId', async () => {
    const session = { id: 's-1', userId: 'u-1' } as Session;
    prismaMock.session.findFirst.mockResolvedValueOnce(session);
    const result = await repository.findSessionByIdAndUserId('s-1', 'u-1');
    expect(result).toEqual(session);
    expect(prismaMock.session.findFirst).toHaveBeenCalledWith({
      where: { id: 's-1', userId: 'u-1' },
    });
  });

  it('revokeSession marks the session revoked with deletedAt', async () => {
    await repository.revokeSession('s-1', 'u-1');
    const call = prismaMock.session.updateMany.mock.calls[0]?.[0] as {
      where: { id: string; userId: string };
      data: { status: string; deletedAt: Date };
    };
    expect(call.where.id).toBe('s-1');
    expect(call.where.userId).toBe('u-1');
    expect(call.data.status).toBe('REVOKED');
    expect(call.data.deletedAt).toBeInstanceOf(Date);
  });
});
