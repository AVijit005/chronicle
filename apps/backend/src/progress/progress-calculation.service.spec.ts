import { describe, it, expect } from 'bun:test';
import { ProgressCalculationService, type MediaTotals } from './progress-calculation.service';

describe('ProgressCalculationService', () => {
  const service = new ProgressCalculationService();

  function totals(overrides?: Partial<MediaTotals>): MediaTotals {
    return {
      runtime: null,
      totalEpisodes: null,
      totalSeasons: null,
      pageCount: null,
      totalTracks: null,
      totalModules: null,
      totalLessons: null,
      ...overrides,
    };
  }

  describe('movie', () => {
    it('calculates percentage from minutes spent vs runtime', () => {
      const result = service.calculate(
        'movie',
        {
          progress: 0,
          currentEpisode: null,
          currentSeason: null,
          currentChapter: null,
          currentPage: null,
          currentTrack: null,
          currentLesson: null,
          currentModule: null,
          hoursSpent: null,
          minutesSpent: 60,
        },
        totals({ runtime: 120 }),
      );
      expect(result.progress).toBe(50);
      expect(result.progressPercentage).toBe(50);
    });

    it('caps at 100%', () => {
      const result = service.calculate(
        'movie',
        {
          progress: 0,
          currentEpisode: null,
          currentSeason: null,
          currentChapter: null,
          currentPage: null,
          currentTrack: null,
          currentLesson: null,
          currentModule: null,
          hoursSpent: null,
          minutesSpent: 200,
        },
        totals({ runtime: 120 }),
      );
      expect(result.progress).toBe(100);
    });

    it('uses manual progress when no runtime data', () => {
      const result = service.calculate(
        'movie',
        {
          progress: 75,
          currentEpisode: null,
          currentSeason: null,
          currentChapter: null,
          currentPage: null,
          currentTrack: null,
          currentLesson: null,
          currentModule: null,
          hoursSpent: null,
          minutesSpent: null,
        },
        totals({ runtime: null }),
      );
      expect(result.progress).toBe(75);
    });
  });

  describe('tvShow / anime / podcast', () => {
    it('calculates percentage from current episode', () => {
      const result = service.calculate(
        'tvShow',
        {
          progress: 0,
          currentEpisode: 5,
          currentSeason: null,
          currentChapter: null,
          currentPage: null,
          currentTrack: null,
          currentLesson: null,
          currentModule: null,
          hoursSpent: null,
          minutesSpent: null,
        },
        totals({ totalEpisodes: 20 }),
      );
      expect(result.progress).toBe(25);
    });

    it('caps at 100%', () => {
      const result = service.calculate(
        'anime',
        {
          progress: 0,
          currentEpisode: 30,
          currentSeason: null,
          currentChapter: null,
          currentPage: null,
          currentTrack: null,
          currentLesson: null,
          currentModule: null,
          hoursSpent: null,
          minutesSpent: null,
        },
        totals({ totalEpisodes: 24 }),
      );
      expect(result.progress).toBe(100);
    });
  });

  describe('book', () => {
    it('calculates from page count', () => {
      const result = service.calculate(
        'book',
        {
          progress: 0,
          currentEpisode: null,
          currentSeason: null,
          currentChapter: null,
          currentPage: 100,
          currentTrack: null,
          currentLesson: null,
          currentModule: null,
          hoursSpent: null,
          minutesSpent: null,
        },
        totals({ pageCount: 400 }),
      );
      expect(result.progress).toBe(25);
    });

    it('uses manual progress when no page data', () => {
      const result = service.calculate(
        'book',
        {
          progress: 50,
          currentEpisode: null,
          currentSeason: null,
          currentChapter: null,
          currentPage: null,
          currentTrack: null,
          currentLesson: null,
          currentModule: null,
          hoursSpent: null,
          minutesSpent: null,
        },
        totals({ pageCount: null }),
      );
      expect(result.progress).toBe(50);
    });
  });

  describe('game', () => {
    it('uses manual progress', () => {
      const result = service.calculate(
        'game',
        {
          progress: 60,
          currentEpisode: null,
          currentSeason: null,
          currentChapter: null,
          currentPage: null,
          currentTrack: null,
          currentLesson: null,
          currentModule: null,
          hoursSpent: null,
          minutesSpent: null,
        },
        totals(),
      );
      expect(result.progress).toBe(60);
    });

    it('caps at 100%', () => {
      const result = service.calculate(
        'game',
        {
          progress: 150,
          currentEpisode: null,
          currentSeason: null,
          currentChapter: null,
          currentPage: null,
          currentTrack: null,
          currentLesson: null,
          currentModule: null,
          hoursSpent: null,
          minutesSpent: null,
        },
        totals(),
      );
      expect(result.progress).toBe(100);
    });
  });

  describe('musicAlbum', () => {
    it('calculates from current track', () => {
      const result = service.calculate(
        'musicAlbum',
        {
          progress: 0,
          currentEpisode: null,
          currentSeason: null,
          currentChapter: null,
          currentPage: null,
          currentTrack: 3,
          currentLesson: null,
          currentModule: null,
          hoursSpent: null,
          minutesSpent: null,
        },
        totals({ totalTracks: 12 }),
      );
      expect(result.progress).toBe(25);
    });
  });

  describe('course', () => {
    it('calculates from current lesson', () => {
      const result = service.calculate(
        'course',
        {
          progress: 0,
          currentEpisode: null,
          currentSeason: null,
          currentChapter: null,
          currentPage: null,
          currentTrack: null,
          currentLesson: 8,
          currentModule: null,
          hoursSpent: null,
          minutesSpent: null,
        },
        totals({ totalLessons: 40 }),
      );
      expect(result.progress).toBe(20);
    });

    it('calculates from current module when no lesson data', () => {
      const result = service.calculate(
        'course',
        {
          progress: 0,
          currentEpisode: null,
          currentSeason: null,
          currentChapter: null,
          currentPage: null,
          currentTrack: null,
          currentLesson: null,
          currentModule: 2,
          hoursSpent: null,
          minutesSpent: null,
        },
        totals({ totalModules: 8 }),
      );
      expect(result.progress).toBe(25);
    });
  });

  describe('calculateRemaining', () => {
    it('returns remaining runtime for movies', () => {
      const rem = service.calculateRemaining('movie', totals({ runtime: 120 }), 50);
      expect(rem.runtime).toBe(60);
    });

    it('returns remaining episodes for tv', () => {
      const rem = service.calculateRemaining('tvShow', totals({ totalEpisodes: 20 }), 25);
      expect(rem.episodes).toBe(15);
    });

    it('returns remaining pages for books', () => {
      const rem = service.calculateRemaining('book', totals({ pageCount: 400 }), 25);
      expect(rem.pages).toBe(300);
    });

    it('returns null for game (no total)', () => {
      const rem = service.calculateRemaining('game', totals(), 50);
      expect(rem.episodes).toBeNull();
      expect(rem.pages).toBeNull();
      expect(rem.lessons).toBeNull();
      expect(rem.runtime).toBeNull();
    });
  });
});
