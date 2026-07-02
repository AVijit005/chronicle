import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { ProgressService } from './progress.service';

describe('ProgressService', () => {
  let service: ProgressService;
  let repoMock: {
    findLibraryItem: ReturnType<typeof mock>;
    fetchMediaTotals: ReturnType<typeof mock>;
    updateProgress: ReturnType<typeof mock>;
    findRecentByUserId: ReturnType<typeof mock>;
  };
  let calcMock: {
    calculate: ReturnType<typeof mock>;
    calculateRemaining: ReturnType<typeof mock>;
  };
  let eventsMock: {
    emitStarted: ReturnType<typeof mock>;
    emitUpdated: ReturnType<typeof mock>;
    emitCompleted: ReturnType<typeof mock>;
    emitReset: ReturnType<typeof mock>;
  };

  beforeEach(() => {
    repoMock = {
      findLibraryItem: mock(() =>
        Promise.resolve({
          id: 'lib-1',
          userId: 'user-1',
          status: 'WATCHING',
          progress: 0,
          progressPercentage: 0,
          movieId: 'movie-1',
          currentEpisode: null,
          currentSeason: null,
          currentChapter: null,
          currentPage: null,
          currentTrack: null,
          currentLesson: null,
          currentModule: null,
          hoursSpent: null,
          minutesSpent: null,
          startedAt: null,
          finishedAt: null,
          lastInteractionAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ),
      fetchMediaTotals: mock(() =>
        Promise.resolve({
          runtime: 120,
          totalEpisodes: null,
          totalSeasons: null,
          pageCount: null,
          totalTracks: null,
          totalModules: null,
          totalLessons: null,
        }),
      ),
      updateProgress: mock(() =>
        Promise.resolve({
          id: 'lib-1',
          userId: 'user-1',
          status: 'WATCHING',
          progress: 50,
          progressPercentage: 50,
          currentEpisode: null,
          currentSeason: null,
          currentChapter: null,
          currentPage: null,
          currentTrack: null,
          currentLesson: null,
          currentModule: null,
          hoursSpent: null,
          minutesSpent: 60,
          startedAt: new Date(),
          finishedAt: null,
          lastInteractionAt: new Date(),
          updatedAt: new Date(),
        }),
      ),
      findRecentByUserId: mock(() => Promise.resolve([])),
    };
    calcMock = {
      calculate: mock(() => ({ progress: 50, progressPercentage: 50 })),
      calculateRemaining: mock(() => ({ episodes: null, pages: null, lessons: null, runtime: 60 })),
    };
    eventsMock = {
      emitStarted: mock(() => Promise.resolve()),
      emitUpdated: mock(() => Promise.resolve()),
      emitCompleted: mock(() => Promise.resolve()),
      emitReset: mock(() => Promise.resolve()),
    };

    service = new ProgressService(repoMock as never, calcMock as never, eventsMock as never);
  });

  describe('update', () => {
    it('updates progress and returns response', async () => {
      const result = await service.update('user-1', 'lib-1', 'movie', { minutesSpent: 60 });
      expect(result.progress).toBe(50);
      expect(result.progressPercentage).toBe(50);
      expect(result.mediaType).toBe('movie');
      expect(result.total.runtime).toBe(120);
    });

    it('throws NotFoundException when item missing', async () => {
      repoMock.findLibraryItem.mockResolvedValueOnce(null);
      try {
        await service.update('user-1', 'missing', 'movie', { progress: 50 });
        expect.unreachable('should have thrown');
      } catch (err) {
        expect((err as Error).message).toBe('Library item not found');
      }
    });

    it('throws NotFoundException when userId does not match', async () => {
      repoMock.findLibraryItem.mockResolvedValueOnce({ id: 'lib-1', userId: 'other-user' });
      try {
        await service.update('user-1', 'lib-1', 'movie', { progress: 50 });
        expect.unreachable('should have thrown');
      } catch (err) {
        expect((err as Error).message).toBe('Library item not found');
      }
    });

    it('completes the item when progress reaches 100%', async () => {
      calcMock.calculate.mockReturnValueOnce({ progress: 100, progressPercentage: 100 });
      repoMock.updateProgress.mockResolvedValueOnce({
        id: 'lib-1',
        userId: 'user-1',
        status: 'COMPLETED',
        progress: 100,
        progressPercentage: 100,
        currentEpisode: null,
        currentSeason: null,
        currentChapter: null,
        currentPage: null,
        currentTrack: null,
        currentLesson: null,
        currentModule: null,
        hoursSpent: null,
        minutesSpent: null,
        startedAt: new Date(),
        finishedAt: new Date(),
        lastInteractionAt: new Date(),
        updatedAt: new Date(),
      });
      const result = await service.update('user-1', 'lib-1', 'movie', { progress: 100 });
      expect(result.status).toBe('COMPLETED');
      expect(result.progress).toBe(100);
    });
  });

  describe('getProgress', () => {
    it('returns current progress', async () => {
      const result = await service.getProgress('user-1', 'lib-1', 'movie');
      expect(result.progress).toBe(50);
    });
  });

  describe('complete', () => {
    it('sets progress to 100% and status to COMPLETED', async () => {
      calcMock.calculate.mockReturnValueOnce({ progress: 100, progressPercentage: 100 });
      repoMock.updateProgress.mockResolvedValueOnce({
        id: 'lib-1',
        userId: 'user-1',
        status: 'COMPLETED',
        progress: 100,
        progressPercentage: 100,
        currentEpisode: null,
        currentSeason: null,
        currentChapter: null,
        currentPage: null,
        currentTrack: null,
        currentLesson: null,
        currentModule: null,
        hoursSpent: null,
        minutesSpent: null,
        startedAt: new Date(),
        finishedAt: new Date(),
        lastInteractionAt: new Date(),
        updatedAt: new Date(),
      });
      const result = await service.complete('user-1', 'lib-1', 'movie');
      expect(result.progress).toBe(100);
      expect(result.status).toBe('COMPLETED');
    });
  });

  describe('reset', () => {
    it('resets progress to 0 and status to PLANNING', async () => {
      repoMock.updateProgress.mockResolvedValueOnce({
        id: 'lib-1',
        userId: 'user-1',
        status: 'PLANNING',
        progress: 0,
        progressPercentage: 0,
        currentEpisode: null,
        currentSeason: null,
        currentChapter: null,
        currentPage: null,
        currentTrack: null,
        currentLesson: null,
        currentModule: null,
        hoursSpent: null,
        minutesSpent: null,
        startedAt: null,
        finishedAt: null,
        lastInteractionAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.reset('user-1', 'lib-1', 'movie');
      expect(result.progress).toBe(0);
      expect(result.status).toBe('PLANNING');
    });

    it('throws when item not found', async () => {
      repoMock.findLibraryItem.mockResolvedValueOnce(null);
      try {
        await service.reset('user-1', 'missing', 'movie');
        expect.unreachable('should have thrown');
      } catch (err) {
        expect((err as Error).message).toBe('Library item not found');
      }
    });
  });

  describe('getRecent', () => {
    it('returns recent items', async () => {
      repoMock.findRecentByUserId.mockResolvedValueOnce([]);
      const result = await service.getRecent('user-1');
      expect(result).toEqual([]);
    });
  });
});
