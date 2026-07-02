import 'reflect-metadata';
import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { Prisma, User } from '@prisma/client';
import { NotFoundException, ValidationException } from '../../common/exceptions';
import { UpdatePreferencesDto } from '../dto';
import { UserPreferences } from '../users.types';
import { UsersRepository } from '../users.repository';
import { PreferencesService } from './preferences.service';

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

describe('PreferencesService', () => {
  let service: PreferencesService;
  let users: {
    findByIdWithProfile: ReturnType<typeof mock>;
    updatePreferences: ReturnType<typeof mock>;
  };

  beforeEach(() => {
    users = {
      findByIdWithProfile: mock(() => Promise.resolve(createUser())),
      updatePreferences: mock((id: string, prefs: UserPreferences) =>
        Promise.resolve(createUser({ id, preferences: prefs as never })),
      ),
    };
    service = new PreferencesService(users as unknown as UsersRepository);
  });

  it('returns NotFoundException when user missing (get)', async () => {
    users.findByIdWithProfile.mockResolvedValueOnce(null);
    const result = await service.getPreferences('missing');
    expect(result.isFailure()).toBe(true);
    expect(result.getError()).toBeInstanceOf(NotFoundException);
  });

  it('returns empty preferences when user has none stored', async () => {
    const result = await service.getPreferences('user-1');
    expect(result.isSuccess()).toBe(true);
    expect(result.getValue()).toEqual({});
  });

  it('returns NotFoundException when user missing (update)', async () => {
    users.findByIdWithProfile.mockResolvedValueOnce(null);
    const result = await service.updatePreferences('missing', { autoplay: true });
    expect(result.isFailure()).toBe(true);
    expect(result.getError()).toBeInstanceOf(NotFoundException);
  });

  it('merges existing preferences with DTO updates and persists the merged set', async () => {
    const existing = createUser({
      preferences: { autoplay: false, defaultLandingPage: 'home' } as unknown as Prisma.JsonValue,
    });
    users.findByIdWithProfile.mockResolvedValueOnce(existing);
    users.updatePreferences.mockResolvedValueOnce(
      createUser({
        preferences: { autoplay: true, defaultLandingPage: 'home' } as unknown as Prisma.JsonValue,
      }),
    );

    const dto: UpdatePreferencesDto = { autoplay: true };
    const result = await service.updatePreferences('user-1', dto);

    expect(result.isSuccess()).toBe(true);
    expect(users.updatePreferences).toHaveBeenCalledWith('user-1', {
      autoplay: true,
      defaultLandingPage: 'home',
    });
    expect(result.getValue()).toEqual({ autoplay: true, defaultLandingPage: 'home' });
  });

  it('returns ValidationException for invalid enum values', async () => {
    const dto = { defaultLandingPage: 'invalid' as unknown as 'home' };
    const result = await service.updatePreferences('user-1', dto);
    expect(result.isFailure()).toBe(true);
    expect(result.getError()).toBeInstanceOf(ValidationException);
    expect((result.getError() as ValidationException).errors?.defaultLandingPage).toBeDefined();
  });

  it('rejects non-boolean autoplay', () => {
    const errors = service.validate({ autoplay: 'yes' as unknown as boolean });
    expect(errors.autoplay).toBeDefined();
  });

  it('rejects non-object defaultFilters', () => {
    const errors = service.validate({ defaultFilters: 'all' as unknown as Record<string, unknown> });
    expect(errors.defaultFilters).toBeDefined();
  });

  it('accepts valid preference set', () => {
    const errors = service.validate({
      defaultLandingPage: 'library',
      gridListPreference: 'grid',
      autoplay: true,
      reduceMotion: false,
      preferredMediaView: 'card',
      defaultSort: 'recent',
      defaultFilters: { tag: 'x' },
      defaultLibraryView: 'favorites',
    });
    expect(errors).toEqual({});
  });
});
