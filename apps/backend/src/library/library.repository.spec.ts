import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { LibraryRepository, type LibraryRow } from './library.repository';

function createMockRow(overrides?: Partial<LibraryRow>): LibraryRow {
  const now = new Date();
  return {
    id: 'lib-1',
    userId: 'user-1',
    status: 'PLANNING',
    rating: null,
    rewatchCount: null,
    favorite: false,
    hidden: false,
    private: false,
    notes: null,
    startedAt: null,
    finishedAt: null,
    lastInteractionAt: null,
    progress: null,
    progressPercentage: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    ...overrides,
  };
}

describe('LibraryRepository', () => {
  let repository: LibraryRepository;
  let userMovieMock: {
    findUnique: ReturnType<typeof mock>;
    findMany: ReturnType<typeof mock>;
    create: ReturnType<typeof mock>;
    update: ReturnType<typeof mock>;
    count: ReturnType<typeof mock>;
  };
  let movieMock: {
    findUnique: ReturnType<typeof mock>;
  };

  beforeEach(() => {
    userMovieMock = {
      findUnique: mock(() => Promise.resolve(null)),
      findMany: mock(() => Promise.resolve([])),
      create: mock(() => Promise.resolve(createMockRow())),
      update: mock(() => Promise.resolve(createMockRow())),
      count: mock(() => Promise.resolve(0)),
    };
    movieMock = {
      findUnique: mock(() => Promise.resolve(null)),
    };
    const prismaMock = {
      userMovie: userMovieMock,
      movie: movieMock,
    };
    repository = new LibraryRepository(prismaMock as never);
  });

  describe('verifyMediaExists', () => {
    it('returns true when media exists', async () => {
      movieMock.findUnique.mockResolvedValueOnce({ id: 'movie-1', deletedAt: null });
      const result = await repository.verifyMediaExists('movie', 'movie-1');
      expect(result).toBe(true);
    });

    it('returns false when media is deleted', async () => {
      movieMock.findUnique.mockResolvedValueOnce({ id: 'movie-1', deletedAt: new Date() });
      const result = await repository.verifyMediaExists('movie', 'movie-1');
      expect(result).toBe(false);
    });

    it('returns false when media not found', async () => {
      movieMock.findUnique.mockResolvedValueOnce(null);
      const result = await repository.verifyMediaExists('movie', 'missing');
      expect(result).toBe(false);
    });

    it('returns false for unknown type', async () => {
      const result = await repository.verifyMediaExists('unknown' as never, 'id');
      expect(result).toBe(false);
    });
  });

  describe('findByUserIdAndMediaId', () => {
    it('returns null when no duplicate exists', async () => {
      userMovieMock.findUnique.mockResolvedValueOnce(null);
      const result = await repository.findByUserIdAndMediaId('user-1', 'movie', 'movie-1');
      expect(result).toBeNull();
    });

    it('returns the row when duplicate exists', async () => {
      const row = createMockRow({ id: 'lib-1' });
      userMovieMock.findUnique.mockResolvedValueOnce(row);
      const result = await repository.findByUserIdAndMediaId('user-1', 'movie', 'movie-1');
      expect(result).not.toBeNull();
      expect(result!.id).toBe('lib-1');
    });
  });

  describe('create', () => {
    it('creates a library entry', async () => {
      const row = createMockRow({ id: 'lib-new' });
      userMovieMock.create.mockResolvedValueOnce(row);

      const result = await repository.create('movie', {
        userId: 'user-1',
        mediaId: 'movie-1',
        status: 'WATCHING',
      });

      expect(result.id).toBe('lib-new');
      expect(userMovieMock.create).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('returns null when not found', async () => {
      userMovieMock.findUnique.mockResolvedValueOnce(null);
      const result = await repository.findById('non-existent', 'user-1', 'movie');
      expect(result).toBeNull();
    });

    it('returns null when userId does not match', async () => {
      const row = createMockRow({ userId: 'other-user' });
      userMovieMock.findUnique.mockResolvedValueOnce(row);
      const result = await repository.findById('lib-1', 'user-1', 'movie');
      expect(result).toBeNull();
    });

    it('returns row when found and owned', async () => {
      const row = createMockRow({ userId: 'user-1' });
      userMovieMock.findUnique.mockResolvedValueOnce(row);
      const result = await repository.findById('lib-1', 'user-1', 'movie');
      expect(result).not.toBeNull();
      expect(result!.id).toBe('lib-1');
    });
  });

  describe('softDelete', () => {
    it('returns false when not found', async () => {
      userMovieMock.findUnique.mockResolvedValueOnce(null);
      const result = await repository.softDelete('lib-1', 'user-1', 'movie');
      expect(result).toBe(false);
    });

    it('returns false when userId does not match', async () => {
      userMovieMock.findUnique.mockResolvedValueOnce(createMockRow({ userId: 'other-user' }));
      const result = await repository.softDelete('lib-1', 'user-1', 'movie');
      expect(result).toBe(false);
    });

    it('soft deletes when found and owned', async () => {
      userMovieMock.findUnique.mockResolvedValueOnce(createMockRow({ userId: 'user-1' }));
      userMovieMock.update.mockResolvedValueOnce(createMockRow({ deletedAt: new Date() }));
      const result = await repository.softDelete('lib-1', 'user-1', 'movie');
      expect(result).toBe(true);
    });
  });

  describe('update', () => {
    it('returns null when not found', async () => {
      userMovieMock.findUnique.mockResolvedValueOnce(null);
      const result = await repository.update('lib-1', 'user-1', 'movie', { status: 'COMPLETED' });
      expect(result).toBeNull();
    });

    it('updates the row when found and owned', async () => {
      userMovieMock.findUnique.mockResolvedValueOnce(createMockRow({ userId: 'user-1' }));
      userMovieMock.update.mockResolvedValueOnce(createMockRow({ userId: 'user-1', status: 'COMPLETED' }));

      const result = await repository.update('lib-1', 'user-1', 'movie', { status: 'COMPLETED' });
      expect(result).not.toBeNull();
      expect(userMovieMock.update).toHaveBeenCalled();
    });
  });
});
