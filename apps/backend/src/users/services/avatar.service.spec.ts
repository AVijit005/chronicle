import 'reflect-metadata';
import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { User } from '@prisma/client';
import { NotFoundException, ValidationException } from '../../common/exceptions';
import { StorageService } from '../../core';
import { UuidService } from '../../core';
import { UsersRepository } from '../users.repository';
import { AvatarFile, AvatarService } from './avatar.service';

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
    preferences: null,
    privacy: null,
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

function createFile(overrides?: Partial<AvatarFile>): AvatarFile {
  return {
    buffer: Buffer.from([0x01, 0x02, 0x03]),
    mimeType: 'image/png',
    originalName: 'avatar.png',
    size: 3,
    ...overrides,
  };
}

describe('AvatarService', () => {
  let service: AvatarService;
  let users: {
    findByIdWithProfile: ReturnType<typeof mock>;
    updateAvatar: ReturnType<typeof mock>;
    removeAvatar: ReturnType<typeof mock>;
  };
  let storage: {
    upload: ReturnType<typeof mock>;
    delete: ReturnType<typeof mock>;
  };

  beforeEach(() => {
    users = {
      findByIdWithProfile: mock(() => Promise.resolve(createUser())),
      updateAvatar: mock((id: string, path: string) => Promise.resolve(createUser({ id, avatar: path }))),
      removeAvatar: mock((id: string) => Promise.resolve(createUser({ id, avatar: null }))),
    };
    storage = {
      upload: mock((path: string) => Promise.resolve(path)),
      delete: mock(() => Promise.resolve()),
    };
    service = new AvatarService(
      users as unknown as UsersRepository,
      storage as unknown as StorageService,
      new UuidService(),
    );
  });

  describe('uploadAvatar', () => {
    it('rejects empty buffer', async () => {
      const result = await service.uploadAvatar('user-1', createFile({ buffer: Buffer.alloc(0), size: 0 }));
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBeInstanceOf(ValidationException);
    });

    it('rejects oversized file (greater than 2 MiB)', async () => {
      const big = Buffer.alloc(2 * 1024 * 1024 + 1, 0);
      const result = await service.uploadAvatar('user-1', createFile({ buffer: big, size: big.length }));
      expect(result.isFailure()).toBe(true);
      expect((result.getError() as ValidationException).message).toContain('maximum size');
    });

    it('rejects non-image MIME type', async () => {
      const result = await service.uploadAvatar('user-1', createFile({ mimeType: 'application/pdf' }));
      expect(result.isFailure()).toBe(true);
      expect((result.getError() as ValidationException).message).toContain('MIME type');
    });

    it('returns NotFoundException when user is missing', async () => {
      users.findByIdWithProfile.mockResolvedValueOnce(null);
      const result = await service.uploadAvatar('user-1', createFile());
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBeInstanceOf(NotFoundException);
    });

    it('uploads the file and returns a stable avatars/{userId}/{uuid}.{ext} path', async () => {
      const result = await service.uploadAvatar(
        'user-1',
        createFile({ mimeType: 'image/png', originalName: 'me.png' }),
      );
      expect(result.isSuccess()).toBe(true);
      const storedPath = result.getValue();
      expect(storedPath).toMatch(/^avatars\/user-1\/[a-f0-9-]+\.png$/);

      expect(storage.upload).toHaveBeenCalledTimes(1);
      const [uploadPath, uploadFile] = storage.upload.mock.calls[0] as [
        string,
        { buffer: Buffer; mimeType: string; originalName: string },
      ];
      expect(uploadPath).toBe(storedPath);
      expect(uploadFile.mimeType).toBe('image/png');
      expect(uploadFile.originalName).toBe('me.png');
      expect(users.updateAvatar).toHaveBeenCalledWith('user-1', storedPath);
    });

    it('derives extension from MIME type when filename has none', async () => {
      const result = await service.uploadAvatar(
        'user-1',
        createFile({ mimeType: 'image/webp', originalName: 'noext' }),
      );
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toMatch(/\.webp$/);
    });

    it('uses jpg extension for image/jpeg', async () => {
      const result = await service.uploadAvatar(
        'user-1',
        createFile({ mimeType: 'image/jpeg', originalName: 'me.JPG' }),
      );
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toMatch(/\.jpg$/);
    });

    it('deletes the previous avatar when one exists', async () => {
      users.findByIdWithProfile.mockResolvedValueOnce(createUser({ avatar: 'avatars/user-1/old.png' }));
      const result = await service.uploadAvatar('user-1', createFile());
      expect(result.isSuccess()).toBe(true);
      expect(storage.delete).toHaveBeenCalledWith('avatars/user-1/old.png');
    });

    it('does not fail if old avatar delete throws', async () => {
      users.findByIdWithProfile.mockResolvedValueOnce(createUser({ avatar: 'avatars/user-1/old.png' }));
      storage.delete.mockRejectedValueOnce(new Error('disk error'));
      const result = await service.uploadAvatar('user-1', createFile());
      expect(result.isSuccess()).toBe(true);
    });

    it('does not call delete when no previous avatar', async () => {
      const result = await service.uploadAvatar('user-1', createFile());
      expect(result.isSuccess()).toBe(true);
      expect(storage.delete).not.toHaveBeenCalled();
    });
  });

  describe('deleteAvatar', () => {
    it('returns NotFoundException when user is missing', async () => {
      users.findByIdWithProfile.mockResolvedValueOnce(null);
      const result = await service.deleteAvatar('user-1');
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBeInstanceOf(NotFoundException);
    });

    it('removes the file from storage and clears the User.avatar column', async () => {
      users.findByIdWithProfile.mockResolvedValueOnce(createUser({ avatar: 'avatars/user-1/current.png' }));
      const result = await service.deleteAvatar('user-1');
      expect(result.isSuccess()).toBe(true);
      expect(storage.delete).toHaveBeenCalledWith('avatars/user-1/current.png');
      expect(users.removeAvatar).toHaveBeenCalledWith('user-1');
    });

    it('clears User.avatar even when no file is stored', async () => {
      const result = await service.deleteAvatar('user-1');
      expect(result.isSuccess()).toBe(true);
      expect(storage.delete).not.toHaveBeenCalled();
      expect(users.removeAvatar).toHaveBeenCalledWith('user-1');
    });

    it('swallows storage delete errors', async () => {
      users.findByIdWithProfile.mockResolvedValueOnce(createUser({ avatar: 'avatars/user-1/x.png' }));
      storage.delete.mockRejectedValueOnce(new Error('disk'));
      const result = await service.deleteAvatar('user-1');
      expect(result.isSuccess()).toBe(true);
      expect(users.removeAvatar).toHaveBeenCalledWith('user-1');
    });
  });
});
