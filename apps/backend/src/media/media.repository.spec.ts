import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { MediaRepository, type MediaRow } from './media.repository';

function createMockRow(overrides?: Partial<MediaRow>): MediaRow {
  const now = new Date();
  return {
    id: 'media-1',
    slug: 'test-movie',
    title: 'Test Movie',
    originalTitle: null,
    description: 'A test movie',
    overview: null,
    posterUrl: null,
    backdropUrl: null,
    bannerUrl: null,
    coverImage: null,
    thumbnail: null,
    releaseDate: null,
    releaseYear: 2024,
    runtime: 120,
    duration: null,
    language: 'en',
    country: 'US',
    genres: ['Action', 'Drama'],
    tags: [],
    externalIds: null,
    metadata: null,
    status: 'PUBLISHED',
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    ...overrides,
  };
}

describe('MediaRepository', () => {
  let repository: MediaRepository;
  let prismaMock: {
    movie: {
      findUnique: ReturnType<typeof mock>;
      findFirst: ReturnType<typeof mock>;
      findMany: ReturnType<typeof mock>;
      count: ReturnType<typeof mock>;
    };
  };

  beforeEach(() => {
    prismaMock = {
      movie: {
        findUnique: mock(() => Promise.resolve(createMockRow())),
        findFirst: mock(() => Promise.resolve(createMockRow())),
        findMany: mock(() => Promise.resolve([createMockRow()])),
        count: mock(() => Promise.resolve(1)),
      },
    };
    repository = new MediaRepository(prismaMock as never);
  });

  describe('findById', () => {
    it('returns a row when found', async () => {
      prismaMock.movie.findFirst.mockResolvedValueOnce(createMockRow({ id: 'movie-1' }));
      const result = await repository.findById('movie', 'movie-1');
      expect(result).not.toBeNull();
      expect(result!.id).toBe('movie-1');
      expect(prismaMock.movie.findFirst).toHaveBeenCalled();
    });

    it('returns null for unknown type', async () => {
      const result = await repository.findById('unknown' as never, 'id');
      expect(result).toBeNull();
    });

    it('returns null when not found', async () => {
      prismaMock.movie.findFirst.mockResolvedValueOnce(null);
      const result = await repository.findById('movie', 'missing-id');
      expect(result).toBeNull();
    });
  });

  describe('findBySlug', () => {
    it('returns a row by slug', async () => {
      prismaMock.movie.findUnique.mockResolvedValueOnce(createMockRow({ slug: 'the-dark-knight' }));
      const result = await repository.findBySlug('movie', 'the-dark-knight');
      expect(result).not.toBeNull();
      expect(result!.slug).toBe('the-dark-knight');
    });

    it('returns null for missing slug', async () => {
      prismaMock.movie.findUnique.mockResolvedValueOnce(null);
      const result = await repository.findBySlug('movie', 'missing-slug');
      expect(result).toBeNull();
    });
  });

  describe('findMany', () => {
    it('returns rows for a specific type', async () => {
      prismaMock.movie.findMany.mockResolvedValueOnce([createMockRow(), createMockRow()]);
      const result = await repository.findMany('movie', { limit: 20 });
      expect(result).toHaveLength(2);
    });

    it('returns empty array for unknown type', async () => {
      const result = await repository.findMany('unknown' as never, { limit: 20 });
      expect(result).toEqual([]);
    });
  });

  describe('count', () => {
    it('returns count for a specific type', async () => {
      prismaMock.movie.count.mockResolvedValueOnce(5);
      const result = await repository.count('movie', { limit: 20 });
      expect(result).toBe(5);
    });

    it('returns 0 for unknown type', async () => {
      const result = await repository.count('unknown' as never, { limit: 20 });
      expect(result).toBe(0);
    });
  });

  describe('findRelated', () => {
    it('returns related items based on genre and language', async () => {
      prismaMock.movie.findFirst.mockResolvedValueOnce(
        createMockRow({ id: 'movie-1', genres: ['Action', 'Drama'], language: 'en' }),
      );
      prismaMock.movie.findMany.mockResolvedValueOnce([createMockRow({ id: 'movie-2' })]);

      const result = await repository.findRelated('movie', 'movie-1');
      expect(result).toHaveLength(1);
    });

    it('returns empty array when source not found', async () => {
      prismaMock.movie.findFirst.mockResolvedValueOnce(null);
      const result = await repository.findRelated('movie', 'missing');
      expect(result).toEqual([]);
    });
  });

  describe('getMetadata', () => {
    it('returns metadata fields for an item', async () => {
      prismaMock.movie.findFirst.mockResolvedValueOnce(
        createMockRow({
          posterUrl: 'http://example.com/poster.jpg',
          runtime: 120,
          genres: ['Action'],
        }),
      );

      const result = await repository.getMetadata('movie', 'movie-1');
      expect(result).not.toBeNull();
      expect(result!.posterUrl).toBe('http://example.com/poster.jpg');
      expect(result!.runtime).toBe(120);
      expect(result!.genres).toEqual(['Action']);
    });

    it('returns null when item not found', async () => {
      prismaMock.movie.findFirst.mockResolvedValueOnce(null);
      const result = await repository.getMetadata('movie', 'missing');
      expect(result).toBeNull();
    });
  });
});
