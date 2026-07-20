import { describe, it, expect, beforeEach } from 'bun:test';
import { ImageService } from './image.service';

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(() => {
    service = new ImageService();
  });

  // Helper: create a buffer with valid JPEG magic bytes
  function fakeJpeg(size = 100): Buffer {
    const buf = Buffer.alloc(size);
    buf[0] = 0xff;
    buf[1] = 0xd8;
    buf[2] = 0xff;
    return buf;
  }

  // Helper: create a buffer with valid PNG magic bytes
  function fakePng(size = 100): Buffer {
    const buf = Buffer.alloc(size);
    buf[0] = 0x89;
    buf[1] = 0x50;
    buf[2] = 0x4e;
    buf[3] = 0x47;
    buf[4] = 0x0d;
    buf[5] = 0x0a;
    buf[6] = 0x1a;
    buf[7] = 0x0a;
    return buf;
  }

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
    expect(result).toContain('Invalid file type');
  });

  it('accepts valid JPEG image', () => {
    const result = service.validate({ buffer: fakeJpeg(), mimeType: 'image/jpeg', originalName: 'test.jpg' });
    expect(result).toBeNull();
  });

  it('accepts valid PNG image', () => {
    const result = service.validate({ buffer: fakePng(), mimeType: 'image/png', originalName: 'test.png' });
    expect(result).toBeNull();
  });

  it('rejects oversized avatar', () => {
    const large = fakeJpeg(3 * 1024 * 1024); // 3 MB
    const result = service.validate({ buffer: large, mimeType: 'image/jpeg', originalName: 'test.jpg' }, true);
    expect(result).toContain('File size exceeds');
  });

  it('rejects MIME type mismatch (claiming JPEG but actually not)', () => {
    const zeroBuffer = Buffer.alloc(100); // No valid magic bytes
    const result = service.validate({ buffer: zeroBuffer, mimeType: 'image/jpeg', originalName: 'test.jpg' });
    expect(result).toContain('Unrecognized file format');
  });

  it('rejects SVG content', () => {
    const svgBuffer = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>');
    const result = service.validate({ buffer: svgBuffer, mimeType: 'image/svg+xml', originalName: 'test.svg' });
    expect(result).toContain('SVG files are not allowed');
  });

  it('rejects SVG with XML declaration', () => {
    const svgBuffer = Buffer.from('<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"/>');
    const result = service.validate({ buffer: svgBuffer, mimeType: 'image/svg+xml', originalName: 'test.svg' });
    expect(result).toContain('SVG files are not allowed');
  });

  it('returns correct extension for mime type', () => {
    expect(service.getExtension('image/jpeg')).toBe('.jpg');
    expect(service.getExtension('image/png')).toBe('.png');
    expect(service.getExtension('image/webp')).toBe('.webp');
  });

  it('sanitizes filenames — spaces and special chars', () => {
    expect(service.sanitizeFilename('hello world.jpg')).toBe('hello_world.jpg');
  });

  it('sanitizes filenames — directory traversal', () => {
    const result = service.sanitizeFilename('../../../etc/passwd');
    // Leading dots stripped, path separators replaced
    expect(result).not.toContain('..');
    expect(result).not.toContain('/');
  });

  it('sanitizes filenames — null bytes', () => {
    const result = service.sanitizeFilename('test\x00.jpg');
    expect(result).not.toContain('\x00');
  });

  it('sanitizes filenames — double extensions', () => {
    const result = service.sanitizeFilename('image.jpg.php');
    // Multiple dots in base should be collapsed, leaving only the last extension
    expect(result).toBe('image_jpg.php');
  });

  it('sanitizes filenames — empty input', () => {
    const result = service.sanitizeFilename('');
    expect(result).toBe('upload');
  });
});
