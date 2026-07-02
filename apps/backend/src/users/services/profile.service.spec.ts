import 'reflect-metadata';
import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { Prisma, User } from '@prisma/client';
import { ConflictException, NotFoundException, ValidationException } from '../../common/exceptions';
import { UpdateProfileDto } from '../dto';
import { UsersRepository } from '../users.repository';
import { ProfileService } from './profile.service';

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

describe('ProfileService', () => {
  let service: ProfileService;
  let users: {
    findByIdWithProfile: ReturnType<typeof mock>;
    findByUsernameExcludingUserId: ReturnType<typeof mock>;
    updateProfile: ReturnType<typeof mock>;
  };

  beforeEach(() => {
    users = {
      findByIdWithProfile: mock(() => Promise.resolve(createUser())),
      findByUsernameExcludingUserId: mock(() => Promise.resolve(null)),
      updateProfile: mock((id: string, data: Partial<User>) =>
        Promise.resolve(createUser({ id, ...data } as Partial<User>)),
      ),
    };
    service = new ProfileService(users as unknown as UsersRepository);
  });

  describe('getProfile', () => {
    it('returns NotFoundException when user missing', async () => {
      users.findByIdWithProfile.mockResolvedValueOnce(null);
      const result = await service.getProfile('missing');
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBeInstanceOf(NotFoundException);
    });

    it('returns a ProfileResponseDto on success', async () => {
      const result = await service.getProfile('user-1');
      expect(result.isSuccess()).toBe(true);
      const dto = result.getValue();
      expect(dto.id).toBe('user-1');
      expect(dto.email).toBe('test@example.com');
      expect(dto.timezone).toBe('UTC');
      expect(dto.themePreference).toBe('system');
    });
  });

  describe('updateProfile', () => {
    it('returns NotFoundException when user is missing', async () => {
      users.findByIdWithProfile.mockResolvedValueOnce(null);
      const result = await service.updateProfile('missing', { displayName: 'X' });
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBeInstanceOf(NotFoundException);
    });

    it('updates a simple field and returns the new profile', async () => {
      const updated = createUser({ displayName: 'Alice' });
      users.updateProfile.mockResolvedValueOnce(updated);
      const dto: UpdateProfileDto = { displayName: 'Alice' };

      const result = await service.updateProfile('user-1', dto);
      expect(result.isSuccess()).toBe(true);
      expect(users.updateProfile).toHaveBeenCalledWith('user-1', { displayName: 'Alice' });
      expect(result.getValue().displayName).toBe('Alice');
    });

    it('returns ValidationException for invalid username', async () => {
      const result = await service.updateProfile('user-1', { username: 'a!' });
      expect(result.isFailure()).toBe(true);
      const err = result.getError();
      expect(err).toBeInstanceOf(ValidationException);
      expect((err as ValidationException).errors?.username).toBeDefined();
    });

    it('returns ValidationException for too-short username', async () => {
      const result = await service.updateProfile('user-1', { username: 'ab' });
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBeInstanceOf(ValidationException);
    });

    it('rejects reserved usernames', async () => {
      const result = await service.updateProfile('user-1', { username: 'admin' });
      expect(result.isFailure()).toBe(true);
      const err = result.getError() as ValidationException;
      expect(err).toBeInstanceOf(ValidationException);
      expect(err.errors?.username?.[0]).toContain('reserved');
      expect(users.findByUsernameExcludingUserId).not.toHaveBeenCalled();
    });

    it('rejects usernames already taken by another user', async () => {
      users.findByUsernameExcludingUserId.mockResolvedValueOnce(createUser({ id: 'other', username: 'taken' }));
      const result = await service.updateProfile('user-1', { username: 'taken' });
      expect(result.isFailure()).toBe(true);
      const err = result.getError() as ValidationException;
      expect(err.errors?.username?.[0]).toContain('already taken');
    });

    it('normalizes usernames: trims, lowercases, replaces spaces/special chars', async () => {
      users.updateProfile.mockResolvedValueOnce(createUser({ username: 'alice_smith' }));
      const result = await service.updateProfile('user-1', { username: '  Alice Smith!! ' });
      expect(result.isSuccess()).toBe(true);
      expect(users.updateProfile).toHaveBeenCalledWith('user-1', { username: 'alice_smith' });
    });

    it('collapses runs of special chars into a single underscore', async () => {
      users.updateProfile.mockResolvedValueOnce(createUser({ username: 'a_b_c' }));
      const result = await service.updateProfile('user-1', { username: 'a!!@#b!!c' });
      expect(result.isSuccess()).toBe(true);
      expect(users.updateProfile).toHaveBeenCalledWith('user-1', { username: 'a_b_c' });
    });

    it('returns ValidationException for invalid website', async () => {
      const result = await service.updateProfile('user-1', { website: 'not a url' });
      expect(result.isFailure()).toBe(true);
      expect((result.getError() as ValidationException).errors?.website).toBeDefined();
    });

    it('returns ValidationException for invalid timezone', async () => {
      const result = await service.updateProfile('user-1', { timezone: 'Mars123/Olympus!' });
      expect(result.isFailure()).toBe(true);
      expect((result.getError() as ValidationException).errors?.timezone).toBeDefined();
    });

    it('accepts IANA timezone', async () => {
      users.updateProfile.mockResolvedValueOnce(createUser({ timezone: 'America/New_York' }));
      const result = await service.updateProfile('user-1', { timezone: 'America/New_York' });
      expect(result.isSuccess()).toBe(true);
      expect(users.updateProfile).toHaveBeenCalledWith('user-1', { timezone: 'America/New_York' });
    });

    it('returns ValidationException for invalid language', async () => {
      const result = await service.updateProfile('user-1', { language: 'eng' });
      expect(result.isFailure()).toBe(true);
      expect((result.getError() as ValidationException).errors?.language).toBeDefined();
    });

    it('returns ValidationException for invalid dateFormat', async () => {
      const result = await service.updateProfile('user-1', { dateFormat: 'YY-MM-DD' });
      expect(result.isFailure()).toBe(true);
      expect((result.getError() as ValidationException).errors?.dateFormat).toBeDefined();
    });

    it('returns ValidationException for invalid themePreference', async () => {
      const result = await service.updateProfile('user-1', { themePreference: 'sepia' });
      expect(result.isFailure()).toBe(true);
      expect((result.getError() as ValidationException).errors?.themePreference).toBeDefined();
    });

    it('returns ValidationException for bio over 500 chars', async () => {
      const result = await service.updateProfile('user-1', { bio: 'x'.repeat(501) });
      expect(result.isFailure()).toBe(true);
      expect((result.getError() as ValidationException).errors?.bio).toBeDefined();
    });

    it('clears website when explicit empty string passed', async () => {
      users.updateProfile.mockResolvedValueOnce(createUser({ website: null }));
      const result = await service.updateProfile('user-1', { website: '' });
      expect(result.isSuccess()).toBe(true);
      expect(users.updateProfile).toHaveBeenCalledWith('user-1', { website: null });
    });

    it('maps Prisma unique violation to ConflictException', async () => {
      const prismaError = Object.assign(new Error('unique'), { code: 'P2002' });
      users.updateProfile.mockRejectedValueOnce(prismaError);
      const result = await service.updateProfile('user-1', { displayName: 'X' });
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBeInstanceOf(ConflictException);
    });

    it('wraps generic repository errors as ValidationException', async () => {
      users.updateProfile.mockRejectedValueOnce(new Error('boom'));
      const result = await service.updateProfile('user-1', { displayName: 'X' });
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBeInstanceOf(ValidationException);
    });

    it('returns existing profile when DTO has no fields', async () => {
      const existing = createUser({ displayName: 'Static' });
      users.findByIdWithProfile.mockResolvedValueOnce(existing);
      const result = await service.updateProfile('user-1', {});
      expect(result.isSuccess()).toBe(true);
      expect(users.updateProfile).not.toHaveBeenCalled();
      expect(result.getValue().displayName).toBe('Static');
    });
  });

  describe('normalizeUsername', () => {
    it('returns null for non-strings', () => {
      expect(service.normalizeUsername(undefined as unknown as string)).toBeNull();
    });

    it('lowercases and trims', () => {
      expect(service.normalizeUsername('  HelloWorld  ')).toBe('helloworld');
    });

    it('replaces non-alphanumeric with single underscore', () => {
      expect(service.normalizeUsername('alice@bob!smith')).toBe('alice_bob_smith');
    });

    it('strips leading and trailing underscores', () => {
      expect(service.normalizeUsername('!!!alice!!!')).toBe('alice');
    });

    it('returns null when too short after normalization', () => {
      expect(service.normalizeUsername('  a  ')).toBeNull();
    });

    it('returns null when too long', () => {
      expect(service.normalizeUsername('a'.repeat(31))).toBeNull();
    });
  });

  describe('isReserved', () => {
    it('matches reserved names case-insensitively', () => {
      expect(service.isReserved('ADMIN')).toBe(true);
      expect(service.isReserved('admin')).toBe(true);
      expect(service.isReserved('Admin')).toBe(true);
    });

    it('returns false for normal usernames', () => {
      expect(service.isReserved('alice')).toBe(false);
    });
  });
});
