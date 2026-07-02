import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { BusinessException, NotFoundException, ValidationException } from '../../common/exceptions';
import { Result } from '../../common/result';
import { UpdatePreferencesDto } from '../dto';
import { UserPreferences } from '../users.types';
import { UsersRepository } from '../users.repository';

const LANDING_PAGES = new Set(['home', 'library', 'timeline', 'dashboard']);
const GRID_LIST = new Set(['grid', 'list']);
const MEDIA_VIEWS = new Set(['card', 'compact', 'poster']);
const SORT_OPTIONS = new Set(['recent', 'title', 'rating', 'releaseDate']);
const LIBRARY_VIEWS = new Set(['all', 'inProgress', 'completed', 'favorites']);

@Injectable()
export class PreferencesService {
  constructor(private readonly users: UsersRepository) {}

  async getPreferences(userId: string): Promise<Result<UserPreferences, BusinessException>> {
    const user = await this.users.findByIdWithProfile(userId);
    if (!user) {
      return Result.failure(new NotFoundException('User not found'));
    }
    return Result.success(this.fromUser(user));
  }

  async updatePreferences(
    userId: string,
    dto: UpdatePreferencesDto,
  ): Promise<Result<UserPreferences, BusinessException>> {
    const existing = await this.users.findByIdWithProfile(userId);
    if (!existing) {
      return Result.failure(new NotFoundException('User not found'));
    }

    const merged: UserPreferences = { ...this.fromUser(existing), ...dto };
    const errors = this.validate(merged);
    if (Object.keys(errors).length > 0) {
      return Result.failure(new ValidationException('Preferences validation failed', errors));
    }

    const updated = await this.users.updatePreferences(userId, merged);
    return Result.success(this.fromUser(updated));
  }

  validate(prefs: UserPreferences): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    if (prefs.defaultLandingPage !== undefined && !LANDING_PAGES.has(prefs.defaultLandingPage)) {
      errors.defaultLandingPage = [`defaultLandingPage must be one of: ${Array.from(LANDING_PAGES).join(', ')}`];
    }
    if (prefs.gridListPreference !== undefined && !GRID_LIST.has(prefs.gridListPreference)) {
      errors.gridListPreference = [`gridListPreference must be one of: ${Array.from(GRID_LIST).join(', ')}`];
    }
    if (prefs.preferredMediaView !== undefined && !MEDIA_VIEWS.has(prefs.preferredMediaView)) {
      errors.preferredMediaView = [`preferredMediaView must be one of: ${Array.from(MEDIA_VIEWS).join(', ')}`];
    }
    if (prefs.defaultSort !== undefined && !SORT_OPTIONS.has(prefs.defaultSort)) {
      errors.defaultSort = [`defaultSort must be one of: ${Array.from(SORT_OPTIONS).join(', ')}`];
    }
    if (prefs.defaultLibraryView !== undefined && !LIBRARY_VIEWS.has(prefs.defaultLibraryView)) {
      errors.defaultLibraryView = [`defaultLibraryView must be one of: ${Array.from(LIBRARY_VIEWS).join(', ')}`];
    }
    if (prefs.autoplay !== undefined && typeof prefs.autoplay !== 'boolean') {
      errors.autoplay = ['autoplay must be a boolean'];
    }
    if (prefs.reduceMotion !== undefined && typeof prefs.reduceMotion !== 'boolean') {
      errors.reduceMotion = ['reduceMotion must be a boolean'];
    }
    if (
      prefs.defaultFilters !== undefined &&
      (typeof prefs.defaultFilters !== 'object' || prefs.defaultFilters === null || Array.isArray(prefs.defaultFilters))
    ) {
      errors.defaultFilters = ['defaultFilters must be a plain object'];
    }

    return errors;
  }

  private fromUser(user: User): UserPreferences {
    if (!user.preferences || typeof user.preferences !== 'object' || Array.isArray(user.preferences)) {
      return {};
    }
    return user.preferences as unknown as UserPreferences;
  }
}
