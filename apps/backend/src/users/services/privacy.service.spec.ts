import 'reflect-metadata';
import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { Prisma, User } from '@prisma/client';
import { NotFoundException, ValidationException } from '../../common/exceptions';
import { UserPrivacy } from '../users.types';
import { UsersRepository } from '../users.repository';
import { PrivacyService } from './privacy.service';

function createUser(overrides?: Partial<User>): User {
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

describe('PrivacyService', () => {
  let service: PrivacyService;
  let users: {
    findByIdWithProfile: ReturnType<typeof mock>;
    updatePrivacy: ReturnType<typeof mock>;
  };

  beforeEach(() => {
    users = {
      findByIdWithProfile: mock(() => Promise.resolve(createUser())),
      updatePrivacy: mock((id: string, privacy: UserPrivacy) =>
        Promise.resolve(createUser({ id, privacy: privacy as never })),
      ),
    };
    service = new PrivacyService(users as unknown as UsersRepository);
  });

  it('returns NotFoundException when user missing (get)', async () => {
    users.findByIdWithProfile.mockResolvedValueOnce(null);
    const result = await service.getPrivacy('missing');
    expect(result.isFailure()).toBe(true);
    expect(result.getError()).toBeInstanceOf(NotFoundException);
  });

  it('returns NotFoundException when user missing (update)', async () => {
    users.findByIdWithProfile.mockResolvedValueOnce(null);
    const result = await service.updatePrivacy('missing', { profileVisibility: 'public' });
    expect(result.isFailure()).toBe(true);
    expect(result.getError()).toBeInstanceOf(NotFoundException);
  });

  it('merges existing privacy with DTO updates', async () => {
    const existing = createUser({
      privacy: { profileVisibility: 'public', journalVisibility: 'followers' } as unknown as Prisma.JsonValue,
    });
    users.findByIdWithProfile.mockResolvedValueOnce(existing);
    users.updatePrivacy.mockResolvedValueOnce(
      createUser({
        privacy: {
          profileVisibility: 'private',
          journalVisibility: 'followers',
        } as unknown as Prisma.JsonValue,
      }),
    );

    const result = await service.updatePrivacy('user-1', { profileVisibility: 'private' });

    expect(result.isSuccess()).toBe(true);
    expect(users.updatePrivacy).toHaveBeenCalledWith('user-1', {
      profileVisibility: 'private',
      journalVisibility: 'followers',
    });
    expect(result.getValue()).toEqual({
      profileVisibility: 'private',
      journalVisibility: 'followers',
    });
  });

  it('rejects invalid visibility values', async () => {
    const result = await service.updatePrivacy('user-1', {
      profileVisibility: 'everyone' as unknown as 'public',
    });
    expect(result.isFailure()).toBe(true);
    expect(result.getError()).toBeInstanceOf(ValidationException);
    expect((result.getError() as ValidationException).errors?.profileVisibility).toBeDefined();
  });

  it('accepts valid privacy updates', async () => {
    users.updatePrivacy.mockResolvedValueOnce(
      createUser({
        privacy: {
          profileVisibility: 'public',
          collectionVisibility: 'private',
          journalVisibility: 'followers',
          timelineVisibility: 'private',
          wrappedVisibility: 'public',
          searchVisibility: 'public',
        } as unknown as Prisma.JsonValue,
      }),
    );

    const result = await service.updatePrivacy('user-1', {
      profileVisibility: 'public',
      collectionVisibility: 'private',
      journalVisibility: 'followers',
      timelineVisibility: 'private',
      wrappedVisibility: 'public',
      searchVisibility: 'public',
    });
    expect(result.isSuccess()).toBe(true);
  });

  it('validate flags every invalid field', () => {
    const errors = service.validate({
      profileVisibility: 'invalid' as unknown as 'public',
      journalVisibility: 'open' as unknown as 'public',
    });
    expect(errors.profileVisibility).toBeDefined();
    expect(errors.journalVisibility).toBeDefined();
  });

  it('validate returns empty for fully valid object', () => {
    expect(service.validate({ profileVisibility: 'public' })).toEqual({});
  });
});
