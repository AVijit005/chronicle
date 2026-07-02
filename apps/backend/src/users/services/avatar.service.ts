import { Inject, Injectable } from '@nestjs/common';
import { extname } from 'path';
import { BusinessException, NotFoundException, ValidationException } from '../../common/exceptions';
import { Result } from '../../common/result';
import type { StorageFile, StorageService } from '../../core/storage/storage.abstraction';
import { UuidService, STORAGE_SERVICE } from '../../core';
import { UsersRepository } from '../users.repository';

export interface AvatarFile {
  buffer: Buffer;
  mimeType: string;
  originalName?: string;
  size: number;
}

export const AVATAR_ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
export const AVATAR_MAX_SIZE = 2 * 1024 * 1024;
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

@Injectable()
export class AvatarService {
  constructor(
    private readonly users: UsersRepository,
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
    private readonly uuids: UuidService,
  ) {}

  async uploadAvatar(userId: string, file: AvatarFile): Promise<Result<string, BusinessException>> {
    if (!file || !file.buffer || file.buffer.length === 0) {
      return Result.failure(new ValidationException('Avatar file is empty'));
    }
    if (file.size > AVATAR_MAX_SIZE || file.buffer.length > AVATAR_MAX_SIZE) {
      return Result.failure(new ValidationException(`Avatar file exceeds maximum size of ${AVATAR_MAX_SIZE} bytes`));
    }
    if (!AVATAR_ALLOWED_MIME.has(file.mimeType)) {
      return Result.failure(
        new ValidationException(
          `Avatar MIME type "${file.mimeType}" is not allowed; expected one of ${Array.from(AVATAR_ALLOWED_MIME).join(
            ', ',
          )}`,
        ),
      );
    }

    const user = await this.users.findByIdWithProfile(userId);
    if (!user) {
      return Result.failure(new NotFoundException('User not found'));
    }

    const ext = this.resolveExtension(file);
    const id = this.uuids.generate();
    const path = `avatars/${userId}/${id}${ext}`;

    const storageFile: StorageFile = {
      buffer: file.buffer,
      mimeType: file.mimeType,
      originalName: file.originalName ?? `avatar${ext}`,
    };

    const storedPath = await this.storage.upload(path, storageFile);
    await this.users.updateAvatar(userId, storedPath);

    if (user.avatar) {
      await this.safeDelete(user.avatar);
    }

    return Result.success(storedPath);
  }

  async deleteAvatar(userId: string): Promise<Result<null, BusinessException>> {
    const user = await this.users.findByIdWithProfile(userId);
    if (!user) {
      return Result.failure(new NotFoundException('User not found'));
    }

    if (user.avatar) {
      await this.safeDelete(user.avatar);
    }
    await this.users.removeAvatar(userId);
    return Result.success(null);
  }

  private resolveExtension(file: AvatarFile): string {
    if (file.originalName) {
      const ext = extname(file.originalName).toLowerCase();
      if (ext) {
        return ext;
      }
    }
    return MIME_TO_EXT[file.mimeType] ?? '.bin';
  }

  private async safeDelete(path: string): Promise<void> {
    try {
      await this.storage.delete(path);
    } catch {
      // Avatar deletion is best-effort: a stale file should not block profile updates.
    }
  }
}
