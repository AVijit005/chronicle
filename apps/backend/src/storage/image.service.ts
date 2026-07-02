import { Injectable } from '@nestjs/common';
import type { StorageFile } from '../core';

export interface ImageInfo {
  width: number;
  height: number;
  format: string;
  size: number;
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
] as const;

const _ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'] as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2 MB

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

@Injectable()
export class ImageService {
  validate(file: StorageFile, isAvatar = false): string | null {
    if (!file.buffer || file.buffer.length === 0) {
      return 'File is empty';
    }

    const maxSize = isAvatar ? MAX_AVATAR_SIZE : MAX_FILE_SIZE;
    if (file.buffer.length > maxSize) {
      return `File size exceeds ${Math.round((maxSize / 1024 / 1024) * 10) / 10} MB limit`;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimeType as AllowedMimeType)) {
      return `Invalid MIME type: ${file.mimeType}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`;
    }

    return null;
  }

  isAllowedMimeType(mimeType: string): boolean {
    return ALLOWED_MIME_TYPES.includes(mimeType as AllowedMimeType);
  }

  getExtension(mimeType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/avif': '.avif',
      'image/gif': '.gif',
    };
    return map[mimeType] ?? '.bin';
  }

  sanitizeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 255);
  }
}
