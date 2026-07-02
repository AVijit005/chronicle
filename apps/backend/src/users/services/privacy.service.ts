import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { BusinessException, NotFoundException, ValidationException } from '../../common/exceptions';
import { Result } from '../../common/result';
import { UpdatePrivacyDto } from '../dto';
import { PrivacyVisibility, UserPrivacy } from '../users.types';
import { UsersRepository } from '../users.repository';

const VISIBILITY_VALUES = new Set<PrivacyVisibility>(['public', 'followers', 'private']);

type PrivacyField = keyof UserPrivacy;

const PRIVACY_FIELDS: ReadonlyArray<PrivacyField> = [
  'profileVisibility',
  'collectionVisibility',
  'journalVisibility',
  'timelineVisibility',
  'wrappedVisibility',
  'searchVisibility',
];

@Injectable()
export class PrivacyService {
  constructor(private readonly users: UsersRepository) {}

  async getPrivacy(userId: string): Promise<Result<UserPrivacy, BusinessException>> {
    const user = await this.users.findByIdWithProfile(userId);
    if (!user) {
      return Result.failure(new NotFoundException('User not found'));
    }
    return Result.success(this.fromUser(user));
  }

  async updatePrivacy(userId: string, dto: UpdatePrivacyDto): Promise<Result<UserPrivacy, BusinessException>> {
    const existing = await this.users.findByIdWithProfile(userId);
    if (!existing) {
      return Result.failure(new NotFoundException('User not found'));
    }

    const merged: UserPrivacy = { ...this.fromUser(existing), ...dto };
    const errors = this.validate(merged);
    if (Object.keys(errors).length > 0) {
      return Result.failure(new ValidationException('Privacy validation failed', errors));
    }

    const updated = await this.users.updatePrivacy(userId, merged);
    return Result.success(this.fromUser(updated));
  }

  validate(privacy: UserPrivacy): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    for (const field of PRIVACY_FIELDS) {
      const value = privacy[field];
      if (value === undefined) {
        continue;
      }
      if (!VISIBILITY_VALUES.has(value)) {
        errors[field] = [`${field} must be one of: public, followers, private`];
      }
    }
    return errors;
  }

  private fromUser(user: User): UserPrivacy {
    if (!user.privacy || typeof user.privacy !== 'object' || Array.isArray(user.privacy)) {
      return {};
    }
    return user.privacy as unknown as UserPrivacy;
  }
}
