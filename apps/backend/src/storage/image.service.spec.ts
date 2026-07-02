import { describe, it, expect, beforeEach } from 'bun:test';
import { ImageService } from './image.service';

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(() => {
    service = new ImageService();
  });

  it('rejects empty file', () => {
    const result = service.validate({ buffer: Buffer.alloc(0), mimeType: 'image/jpeg', originalName: 'test.jpg' });
    expect(result).toBe('File is empty');
  });

  it('rejects invalid mime type', () => {
    const result = service.validate({
      buffer: Buffer.alloc(100),
      mimeType: 'application/pdf',
      originalName: 'test.pdf',
    });
    expect(result).toContain('Invalid MIME type');
  });

  it('accepts valid image', () => {
    const result = service.validate({ buffer: Buffer.alloc(100), mimeType: 'image/jpeg', originalName: 'test.jpg' });
    expect(result).toBeNull();
  });

  it('rejects oversized avatar', () => {
    const large = Buffer.alloc(3 * 1024 * 1024); // 3 MB
    const result = service.validate({ buffer: large, mimeType: 'image/jpeg', originalName: 'test.jpg' }, true);
    expect(result).toContain('File size exceeds');
  });

  it('returns correct extension for mime type', () => {
    expect(service.getExtension('image/jpeg')).toBe('.jpg');
    expect(service.getExtension('image/png')).toBe('.png');
    expect(service.getExtension('image/webp')).toBe('.webp');
  });

  it('sanitizes filenames', () => {
    expect(service.sanitizeFilename('hello world.jpg')).toBe('hello_world.jpg');
    const result = service.sanitizeFilename('../../../etc/passwd');
    expect(result).toBe('.._.._.._etc_passwd');
  });
});
