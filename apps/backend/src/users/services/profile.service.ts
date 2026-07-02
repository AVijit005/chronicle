import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ConflictException, NotFoundException, ValidationException, BusinessException } from '../../common/exceptions';
import { Result } from '../../common/result';
import { ProfileResponseDto, UpdateProfileDto } from '../dto';
import { UsersRepository } from '../users.repository';

export const RESERVED_USERNAMES: ReadonlySet<string> = new Set([
  'admin',
  'root',
  'api',
  'auth',
  'system',
  'support',
  'login',
  'logout',
  'me',
  'user',
  'users',
  'help',
  'security',
]);

const USERNAME_PATTERN = /^[a-z0-9_]+$/i;
const WEBSITE_PATTERN = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
const TIMEZONE_PATTERN = /^[A-Za-z_]+(\/[A-Za-z_-]+)?$/;
const LANGUAGE_PATTERN = /^[a-z]{2}$/;
const DATE_FORMATS = new Set(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']);
const THEME_PREFERENCES = new Set(['light', 'dark', 'system']);

export interface ProfileUpdateChanges {
  before: Partial<ProfileResponseDto>;
  after: Partial<ProfileResponseDto>;
}

@Injectable()
export class ProfileService {
  constructor(private readonly users: UsersRepository) {}

  async getProfile(userId: string): Promise<Result<ProfileResponseDto, BusinessException>> {
    const user = await this.users.findByIdWithProfile(userId);
    if (!user) {
      return Result.failure(new NotFoundException('User not found'));
    }
    return Result.success(this.toResponse(user));
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<Result<ProfileResponseDto, BusinessException>> {
    const existing = await this.users.findByIdWithProfile(userId);
    if (!existing) {
      return Result.failure(new NotFoundException('User not found'));
    }

    const fieldErrors: Record<string, string[]> = {};

    const updateData: Partial<User> = {};

    if (dto.displayName !== undefined) {
      if (typeof dto.displayName !== 'string' || dto.displayName.length < 1 || dto.displayName.length > 50) {
        fieldErrors.displayName = ['displayName must be between 1 and 50 characters'];
      } else {
        updateData.displayName = dto.displayName;
      }
    }

    if (dto.username !== undefined) {
      const normalized = this.normalizeUsername(dto.username);
      if (normalized === null) {
        fieldErrors.username = ['username must be 3-30 characters and contain only letters, numbers, and underscores'];
      } else if (this.isReserved(normalized)) {
        fieldErrors.username = [`username "${normalized}" is reserved`];
      } else {
        const conflict = await this.users.findByUsernameExcludingUserId(normalized, userId);
        if (conflict) {
          fieldErrors.username = [`username "${normalized}" is already taken`];
        } else {
          updateData.username = normalized;
        }
      }
    }

    if (dto.bio !== undefined) {
      if (typeof dto.bio !== 'string' || dto.bio.length > 500) {
        fieldErrors.bio = ['bio must be at most 500 characters'];
      } else {
        updateData.bio = dto.bio;
      }
    }

    if (dto.location !== undefined) {
      if (typeof dto.location !== 'string' || dto.location.length > 100) {
        fieldErrors.location = ['location must be at most 100 characters'];
      } else {
        updateData.location = dto.location;
      }
    }

    if (dto.website !== undefined && dto.website !== null && dto.website !== '') {
      if (typeof dto.website !== 'string' || !WEBSITE_PATTERN.test(dto.website)) {
        fieldErrors.website = ['website must be a valid URL'];
      } else {
        updateData.website = dto.website;
      }
    } else if (dto.website === null || dto.website === '') {
      updateData.website = null;
    }

    if (dto.timezone !== undefined) {
      if (typeof dto.timezone !== 'string' || !TIMEZONE_PATTERN.test(dto.timezone)) {
        fieldErrors.timezone = ['timezone must be a valid IANA timezone (e.g. UTC, America/New_York)'];
      } else {
        updateData.timezone = dto.timezone;
      }
    }

    if (dto.language !== undefined) {
      if (typeof dto.language !== 'string' || !LANGUAGE_PATTERN.test(dto.language)) {
        fieldErrors.language = ['language must be a 2-letter ISO 639-1 code'];
      } else {
        updateData.language = dto.language;
      }
    }

    if (dto.dateFormat !== undefined) {
      if (typeof dto.dateFormat !== 'string' || !DATE_FORMATS.has(dto.dateFormat)) {
        fieldErrors.dateFormat = ['dateFormat must be one of: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD'];
      } else {
        updateData.dateFormat = dto.dateFormat;
      }
    }

    if (dto.themePreference !== undefined) {
      if (typeof dto.themePreference !== 'string' || !THEME_PREFERENCES.has(dto.themePreference)) {
        fieldErrors.themePreference = ['themePreference must be one of: light, dark, system'];
      } else {
        updateData.themePreference = dto.themePreference;
      }
    }

    if (dto.coverImage !== undefined && dto.coverImage !== null && dto.coverImage !== '') {
      if (typeof dto.coverImage !== 'string' || !WEBSITE_PATTERN.test(dto.coverImage)) {
        fieldErrors.coverImage = ['coverImage must be a valid URL'];
      } else {
        updateData.coverImage = dto.coverImage;
      }
    } else if (dto.coverImage === null || dto.coverImage === '') {
      updateData.coverImage = null;
    }

    if (Object.keys(fieldErrors).length > 0) {
      return Result.failure(new ValidationException('Profile validation failed', fieldErrors));
    }

    if (Object.keys(updateData).length === 0) {
      return Result.success(this.toResponse(existing));
    }

    let updated: User;
    try {
      updated = await this.users.updateProfile(userId, updateData);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (this.isUniqueViolation(error)) {
        return Result.failure(new ConflictException(`username already taken`));
      }
      return Result.failure(new ValidationException(`Failed to update profile: ${message}`));
    }

    return Result.success(this.toResponse(updated));
  }

  normalizeUsername(value: string): string | null {
    if (typeof value !== 'string') {
      return null;
    }
    const trimmed = value.trim();
    if (trimmed.length < 3 || trimmed.length > 30) {
      return null;
    }
    const lowered = trimmed.toLowerCase();
    const replaced = lowered.replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '');
    if (replaced.length < 3 || replaced.length > 30) {
      return null;
    }
    if (!USERNAME_PATTERN.test(replaced)) {
      return null;
    }
    return replaced;
  }

  isReserved(username: string): boolean {
    return RESERVED_USERNAMES.has(username.toLowerCase());
  }

  private isUniqueViolation(error: unknown): boolean {
    if (error && typeof error === 'object' && 'code' in error) {
      return (error as { code?: string }).code === 'P2002';
    }
    return false;
  }

  toResponse(user: User): ProfileResponseDto {
    const preferences =
      user.preferences && typeof user.preferences === 'object' && !Array.isArray(user.preferences)
        ? (user.preferences as Record<string, unknown>)
        : null;
    const privacy =
      user.privacy && typeof user.privacy === 'object' && !Array.isArray(user.privacy)
        ? (user.privacy as Record<string, unknown>)
        : null;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      username: user.username,
      bio: user.bio,
      location: user.location,
      website: user.website,
      timezone: user.timezone,
      language: user.language,
      dateFormat: user.dateFormat,
      themePreference: user.themePreference,
      avatar: user.avatar,
      coverImage: user.coverImage,
      preferences,
      privacy,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
