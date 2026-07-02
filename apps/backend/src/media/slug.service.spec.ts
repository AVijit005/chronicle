import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { SlugService, isValidMediaType } from './slug.service';

describe('SlugService', () => {
  let service: SlugService;
  let prismaMock: Record<string, { findUnique: ReturnType<typeof mock> }>;

  beforeEach(() => {
    prismaMock = {
      movie: { findUnique: mock(() => Promise.resolve(null)) },
      tvShow: { findUnique: mock(() => Promise.resolve(null)) },
    };
    service = new SlugService(prismaMock as never);
  });

  describe('generate', () => {
    it('converts a title to a URL-friendly slug', () => {
      expect(service.generate('The Dark Knight')).toBe('the-dark-knight');
    });

    it('strips special characters', () => {
      expect(service.generate('What We Do in the Shadows!')).toBe('what-we-do-in-the-shadows');
    });

    it('handles multiple spaces and underscores', () => {
      expect(service.generate('Hello   World_Test')).toBe('hello-world-test');
    });

    it('trims leading and trailing hyphens', () => {
      expect(service.generate('--Inception--')).toBe('inception');
    });

    it('falls back to untitled for empty input', () => {
      expect(service.generate('')).toBe('untitled');
    });

    it('truncates to 200 characters', () => {
      const long = 'a'.repeat(300);
      const slug = service.generate(long);
      expect(slug.length).toBeLessThanOrEqual(200);
    });
  });

  describe('ensureUnique', () => {
    it('returns the base slug when no conflict exists', async () => {
      const result = await service.ensureUnique('the-dark-knight', 'movie');
      expect(result).toBe('the-dark-knight');
    });

    it('appends a counter when slug exists', async () => {
      prismaMock.movie.findUnique.mockImplementation(async ({ where }: { where: { slug: string } }) => {
        if (where.slug === 'the-dark-knight') return { id: 'existing' };
        if (where.slug === 'the-dark-knight-1') return { id: 'existing-2' };
        return null;
      });

      const result = await service.ensureUnique('the-dark-knight', 'movie');
      expect(result).toBe('the-dark-knight-2');
    });
  });

  describe('isValidMediaType', () => {
    it('returns true for valid media types', () => {
      expect(isValidMediaType('movie')).toBe(true);
      expect(isValidMediaType('tvShow')).toBe(true);
      expect(isValidMediaType('book')).toBe(true);
    });

    it('returns false for invalid media types', () => {
      expect(isValidMediaType('invalidType')).toBe(false);
      expect(isValidMediaType('')).toBe(false);
    });
  });
});
