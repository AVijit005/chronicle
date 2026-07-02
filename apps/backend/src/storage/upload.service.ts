import { Inject, Injectable, Logger } from '@nestjs/common';
import { STORAGE_SERVICE, type StorageService, type StorageFile, UuidService } from '../core';
import { ImageService } from './image.service';
import { ImageProcessorService } from './image-processor.service';
import type { UploadResponseDto } from './dto';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
    private readonly imageService: ImageService,
    private readonly imageProcessor: ImageProcessorService,
    private readonly uuidService: UuidService,
  ) {}

  async upload(file: StorageFile, category: string, userId: string): Promise<UploadResponseDto> {
    const validationError = this.imageService.validate(file);
    if (validationError) {
      throw new Error(validationError);
    }

    const ext = this.imageService.getExtension(file.mimeType);
    const id = this.uuidService.generate();
    const sanitizedName = this.imageService.sanitizeFilename(file.originalName);
    const path = `${category}/${userId}/${id}${ext}`;

    // Optimize image
    let buffer = file.buffer;
    let mimeType = file.mimeType;
    let width: number | null = null;
    let height: number | null = null;

    if (file.mimeType.startsWith('image/')) {
      const processed = await this.imageProcessor.optimize(file.buffer, file.mimeType);
      buffer = processed.buffer;
      width = processed.width;
      height = processed.height;
      mimeType = processed.mimeType;
    }

    const storageFile: StorageFile = { buffer, mimeType, originalName: sanitizedName };
    const storedPath = await this.storage.upload(path, storageFile);

    return {
      id,
      path: storedPath,
      url: `/${storedPath}`,
      mimeType,
      size: buffer.length,
      width,
      height,
      originalName: sanitizedName,
    };
  }

  async uploadAvatar(file: StorageFile, userId: string): Promise<UploadResponseDto> {
    const validationError = this.imageService.validate(file, true);
    if (validationError) {
      throw new Error(validationError);
    }

    // Resize avatar to standard size
    const resized = await this.imageProcessor.resize(file.buffer, 256);
    const mimeType = 'image/jpeg';

    const storageFile: StorageFile = { buffer: resized, mimeType, originalName: 'avatar.jpg' };
    const id = this.uuidService.generate();
    const path = `avatars/${userId}/${id}.jpg`;
    const storedPath = await this.storage.upload(path, storageFile);

    return {
      id,
      path: storedPath,
      url: `/${storedPath}`,
      mimeType,
      size: resized.length,
      width: 256,
      height: 256,
      originalName: 'avatar.jpg',
    };
  }

  async uploadCover(file: StorageFile, userId: string): Promise<UploadResponseDto> {
    const validationError = this.imageService.validate(file);
    if (validationError) {
      throw new Error(validationError);
    }

    // Resize cover to standard width
    const resized = await this.imageProcessor.resize(file.buffer, 1280);
    const processed = await this.imageProcessor.optimize(resized, 'image/jpeg');

    const storageFile: StorageFile = { buffer: processed.buffer, mimeType: 'image/jpeg', originalName: 'cover.jpg' };
    const id = this.uuidService.generate();
    const path = `covers/${userId}/${id}.jpg`;
    const storedPath = await this.storage.upload(path, storageFile);

    return {
      id,
      path: storedPath,
      url: `/${storedPath}`,
      mimeType: 'image/jpeg',
      size: processed.buffer.length,
      width: processed.width,
      height: processed.height,
      originalName: 'cover.jpg',
    };
  }

  async download(path: string): Promise<Buffer> {
    return this.storage.download(path);
  }

  async delete(path: string): Promise<void> {
    await this.storage.delete(path);
  }

  async exists(path: string): Promise<boolean> {
    return this.storage.exists(path);
  }
}
