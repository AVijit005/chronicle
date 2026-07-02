import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import type { ImageInfo } from './image.service';

export interface ProcessedImage {
  buffer: Buffer;
  mimeType: string;
  width: number;
  height: number;
  format: string;
}

export interface ResponsiveSizes {
  sm: Buffer | null;
  md: Buffer | null;
  lg: Buffer | null;
  thumbnail: Buffer | null;
}

@Injectable()
export class ImageProcessorService {
  private readonly logger = new Logger(ImageProcessorService.name);

  async getInfo(buffer: Buffer): Promise<ImageInfo | null> {
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        width: metadata.width ?? 0,
        height: metadata.height ?? 0,
        format: metadata.format ?? 'unknown',
        size: buffer.length,
      };
    } catch {
      return null;
    }
  }

  async optimize(buffer: Buffer, mimeType: string): Promise<ProcessedImage> {
    try {
      let pipeline = sharp(buffer);

      // Strip EXIF metadata
      pipeline = pipeline.withMetadata({ orientation: undefined, exif: undefined, icc: undefined });

      switch (mimeType) {
        case 'image/jpeg':
          pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true });
          break;
        case 'image/png':
          pipeline = pipeline.png({ quality: 85, compressionLevel: 9, palette: true });
          break;
        case 'image/webp':
          pipeline = pipeline.webp({ quality: 80 });
          break;
        case 'image/avif':
          pipeline = pipeline.avif({ quality: 70 });
          break;
        default:
          break;
      }

      const result = await pipeline.toBuffer();
      const metadata = await sharp(result).metadata();

      return {
        buffer: result,
        mimeType,
        width: metadata.width ?? 0,
        height: metadata.height ?? 0,
        format: metadata.format ?? 'unknown',
      };
    } catch (error) {
      this.logger.error(`Image optimization failed: ${error}`);
      const metadata = await sharp(buffer).metadata();
      return {
        buffer,
        mimeType,
        width: metadata.width ?? 0,
        height: metadata.height ?? 0,
        format: metadata.format ?? 'unknown',
      };
    }
  }

  async generateResponsiveSizes(buffer: Buffer): Promise<ResponsiveSizes> {
    try {
      const [sm, md, lg, thumbnail] = await Promise.all([
        this.resize(buffer, 320).catch(() => null),
        this.resize(buffer, 640).catch(() => null),
        this.resize(buffer, 1280).catch(() => null),
        this.resize(buffer, 150).catch(() => null),
      ]);

      return { sm, md, lg, thumbnail };
    } catch {
      return { sm: null, md: null, lg: null, thumbnail: null };
    }
  }

  async resize(buffer: Buffer, width: number): Promise<Buffer> {
    return sharp(buffer)
      .resize(width, null, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
  }

  async generateWebp(buffer: Buffer): Promise<Buffer | null> {
    try {
      return await sharp(buffer).webp({ quality: 80 }).toBuffer();
    } catch {
      return null;
    }
  }

  async generateAvif(buffer: Buffer): Promise<Buffer | null> {
    try {
      return await sharp(buffer).avif({ quality: 70 }).toBuffer();
    } catch {
      return null;
    }
  }
}
