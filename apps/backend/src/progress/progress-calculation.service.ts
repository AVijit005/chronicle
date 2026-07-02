import { Injectable } from '@nestjs/common';

export interface MediaTotals {
  runtime: number | null;
  totalEpisodes: number | null;
  totalSeasons: number | null;
  pageCount: number | null;
  totalTracks: number | null;
  totalModules: number | null;
  totalLessons: number | null;
}

export interface ProgressInput {
  progress: number | null;
  currentEpisode: number | null;
  currentSeason: number | null;
  currentChapter: number | null;
  currentPage: number | null;
  currentTrack: number | null;
  currentLesson: number | null;
  currentModule: number | null;
  hoursSpent: number | null;
  minutesSpent: number | null;
}

export interface ProgressOutput {
  progress: number;
  progressPercentage: number;
}

export interface RemainingOutput {
  episodes: number | null;
  pages: number | null;
  lessons: number | null;
  runtime: number | null;
}

@Injectable()
export class ProgressCalculationService {
  calculate(type: string, input: ProgressInput, totals: MediaTotals): ProgressOutput {
    switch (type) {
      case 'movie':
        return this.calculateMovie(input, totals);
      case 'tvShow':
        return this.calculateEpisodeBased(input, totals);
      case 'anime':
        return this.calculateEpisodeBased(input, totals);
      case 'book':
        return this.calculateBook(input, totals);
      case 'game':
        return this.calculateGame(input);
      case 'musicAlbum':
        return this.calculateTrackBased(input, totals);
      case 'podcast':
        return this.calculateEpisodeBased(input, totals);
      case 'course':
        return this.calculateCourse(input, totals);
      default:
        return { progress: Math.min(input.progress ?? 0, 100), progressPercentage: Math.min(input.progress ?? 0, 100) };
    }
  }

  calculateRemaining(type: string, totals: MediaTotals, progressPct: number): RemainingOutput {
    switch (type) {
      case 'movie':
        return this.remainingMovie(totals, progressPct);
      case 'tvShow':
        return this.remainingEpisodes(totals, progressPct);
      case 'anime':
        return this.remainingEpisodes(totals, progressPct);
      case 'book':
        return this.remainingBook(totals, progressPct);
      case 'game':
        return { episodes: null, pages: null, lessons: null, runtime: null };
      case 'musicAlbum':
        return this.remainingTracks(totals, progressPct);
      case 'podcast':
        return this.remainingEpisodes(totals, progressPct);
      case 'course':
        return this.remainingCourse(totals, progressPct);
      default:
        return { episodes: null, pages: null, lessons: null, runtime: null };
    }
  }

  private calculateMovie(input: ProgressInput, totals: MediaTotals): ProgressOutput {
    if (input.minutesSpent && totals.runtime && totals.runtime > 0) {
      const pct = Math.round((input.minutesSpent / totals.runtime) * 100);
      return { progress: Math.min(pct, 100), progressPercentage: Math.min(pct, 100) };
    }
    const pct = Math.min(input.progress ?? 0, 100);
    return { progress: pct, progressPercentage: pct };
  }

  private calculateEpisodeBased(input: ProgressInput, totals: MediaTotals): ProgressOutput {
    if (input.currentEpisode && totals.totalEpisodes && totals.totalEpisodes > 0) {
      const pct = Math.round((input.currentEpisode / totals.totalEpisodes) * 100);
      return { progress: Math.min(pct, 100), progressPercentage: Math.min(pct, 100) };
    }
    const pct = Math.min(input.progress ?? 0, 100);
    return { progress: pct, progressPercentage: pct };
  }

  private calculateBook(input: ProgressInput, totals: MediaTotals): ProgressOutput {
    if (input.currentPage && totals.pageCount && totals.pageCount > 0) {
      const pct = Math.round((input.currentPage / totals.pageCount) * 100);
      return { progress: Math.min(pct, 100), progressPercentage: Math.min(pct, 100) };
    }
    if (input.currentChapter && totals.totalLessons && totals.totalLessons > 0) {
      const pct = Math.round((input.currentChapter / totals.totalLessons) * 100);
      return { progress: Math.min(pct, 100), progressPercentage: Math.min(pct, 100) };
    }
    const pct = Math.min(input.progress ?? 0, 100);
    return { progress: pct, progressPercentage: pct };
  }

  private calculateGame(input: ProgressInput): ProgressOutput {
    const pct = Math.min(input.progress ?? 0, 100);
    return { progress: pct, progressPercentage: pct };
  }

  private calculateTrackBased(input: ProgressInput, totals: MediaTotals): ProgressOutput {
    if (input.currentTrack && totals.totalTracks && totals.totalTracks > 0) {
      const pct = Math.round((input.currentTrack / totals.totalTracks) * 100);
      return { progress: Math.min(pct, 100), progressPercentage: Math.min(pct, 100) };
    }
    const pct = Math.min(input.progress ?? 0, 100);
    return { progress: pct, progressPercentage: pct };
  }

  private calculateCourse(input: ProgressInput, totals: MediaTotals): ProgressOutput {
    if (input.currentLesson && totals.totalLessons && totals.totalLessons > 0) {
      const pct = Math.round((input.currentLesson / totals.totalLessons) * 100);
      return { progress: Math.min(pct, 100), progressPercentage: Math.min(pct, 100) };
    }
    if (input.currentModule && totals.totalModules && totals.totalModules > 0) {
      const pct = Math.round((input.currentModule / totals.totalModules) * 100);
      return { progress: Math.min(pct, 100), progressPercentage: Math.min(pct, 100) };
    }
    const pct = Math.min(input.progress ?? 0, 100);
    return { progress: pct, progressPercentage: pct };
  }

  private remainingMovie(totals: MediaTotals, pct: number): RemainingOutput {
    const remainingRuntime = totals.runtime ? Math.round(totals.runtime * (1 - pct / 100)) : null;
    return { episodes: null, pages: null, lessons: null, runtime: remainingRuntime };
  }

  private remainingEpisodes(totals: MediaTotals, pct: number): RemainingOutput {
    const remainingEpisodes = totals.totalEpisodes
      ? Math.max(0, totals.totalEpisodes - Math.round((totals.totalEpisodes * pct) / 100))
      : null;
    return { episodes: remainingEpisodes, pages: null, lessons: null, runtime: null };
  }

  private remainingBook(totals: MediaTotals, pct: number): RemainingOutput {
    const remainingPages = totals.pageCount
      ? Math.max(0, totals.pageCount - Math.round((totals.pageCount * pct) / 100))
      : null;
    return { episodes: null, pages: remainingPages, lessons: null, runtime: null };
  }

  private remainingTracks(totals: MediaTotals, pct: number): RemainingOutput {
    const remainingEpisodes = totals.totalTracks
      ? Math.max(0, totals.totalTracks - Math.round((totals.totalTracks * pct) / 100))
      : null;
    return { episodes: remainingEpisodes, pages: null, lessons: null, runtime: null };
  }

  private remainingCourse(totals: MediaTotals, pct: number): RemainingOutput {
    const remainingLessons = totals.totalLessons
      ? Math.max(0, totals.totalLessons - Math.round((totals.totalLessons * pct) / 100))
      : null;
    return { episodes: null, pages: null, lessons: remainingLessons, runtime: null };
  }
}
