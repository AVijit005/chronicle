/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';
import type {
  OverviewDto,
  MediaAnalyticsDto,
  GenreAnalyticsDto,
  ActivityDto,
  CalendarDto,
  CalendarEntryDto,
  GenreStatDto,
} from './dto';

@Injectable()
export class AnalyticsAggregationService {
  constructor(private readonly repository: AnalyticsRepository) {}

  async getOverview(userId: string): Promise<OverviewDto> {
    const [completedByType, totalsByType, totalItems, avgRating, journalCount, memoryCount, reviewCount] =
      await Promise.all([
        this.repository.countCompletedByType(userId),
        this.repository.countTotalByType(userId),
        this.repository.getTotalLibraryItems(userId),
        this.repository.getAverageRating(userId),
        this.repository.getJournalEntryDates(userId, 10000),
        this.repository.getRecentMemories(userId, 10000),
        this.repository.getReviewCount(userId),
        this.repository.getFavoriteCount(userId),
      ]);

    return {
      moviesCompleted: completedByType['movie'] ?? 0,
      showsFinished: (completedByType['tvShow'] ?? 0) + (completedByType['anime'] ?? 0),
      episodesWatched: 0,
      booksRead: completedByType['book'] ?? 0,
      gamesFinished: completedByType['game'] ?? 0,
      coursesCompleted: completedByType['course'] ?? 0,
      hoursWatched: 0,
      hoursRead: 0,
      hoursPlayed: 0,
      hoursLearned: 0,
      averageRating: avgRating,
      favoriteGenre: null,
      favoriteMediaType: this.getFavoriteType(totalsByType),
      totalLibraryItems: totalItems,
      totalJournalEntries: journalCount.length,
      totalMemories: memoryCount.length,
      totalReviews: reviewCount,
    };
  }

  async getMediaAnalytics(userId: string): Promise<MediaAnalyticsDto> {
    const [completedByType, totalsByType, progressDist, ratingsDist, reviewCount, favCount, bookmarkCount] =
      await Promise.all([
        this.repository.countCompletedByType(userId),
        this.repository.countTotalByType(userId),
        this.repository.getProgressDistribution(userId),
        this.repository.getRatingsDistribution(userId),
        this.repository.getReviewCount(userId),
        this.repository.getFavoriteCount(userId),
        this.repository.getBookmarkCount(userId),
      ]);

    return {
      completionByType: completedByType,
      progressDistribution: progressDist,
      ratingsDistribution: ratingsDist,
      reviewCount,
      favoriteCount: favCount,
      bookmarkCount,
      totalByType: totalsByType,
    };
  }

  async getGenreAnalytics(userId: string): Promise<GenreAnalyticsDto> {
    const raw = await this.repository.getGenreData(userId);
    const total = Object.values(raw.genreCounts).reduce((a, b) => a + b, 0) || 1;

    const topGenres: GenreStatDto[] = Object.entries(raw.genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([genre, count]) => ({ genre, count, percentage: Math.round((count / total) * 100) }));

    const genreCompletion: Record<string, number> = {};
    for (const [genre, count] of Object.entries(raw.genreCompleted)) {
      const totalForGenre = raw.genreCounts[genre] ?? 1;
      genreCompletion[genre] = Math.round((count / totalForGenre) * 100);
    }

    const genreRatings: Record<string, number> = {};
    for (const [genre, data] of Object.entries(raw.genreRatings)) {
      genreRatings[genre] = Math.round((data.total / data.count / 2) * 10) / 10;
    }

    return {
      topGenres,
      genreCompletion,
      genreRatings,
      genreTimeSpent: Object.fromEntries(
        Object.entries(raw.genreTime)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10),
      ),
    };
  }

  async getActivity(userId: string): Promise<ActivityDto> {
    const [activityData, timeline] = await Promise.all([
      this.repository.getActivityData(userId, 365),
      this.repository.getRecentTimelineEvents(userId, 20),
    ]);

    const heatmap = Object.entries(activityData).map(([date, count]) => ({ date, count }));
    const byWeekday: Record<string, number> = {};
    const byHour: Record<string, number> = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (const [date, count] of Object.entries(activityData)) {
      const day = dayNames[new Date(date).getDay()];
      byWeekday[day] = (byWeekday[day] ?? 0) + count;
      // Simplified hour distribution
      const hour = new Date(date).getHours();
      const hourKey = `${hour}:00`;
      byHour[hourKey] = (byHour[hourKey] ?? 0) + count;
    }

    return {
      heatmap,
      byWeekday,
      byHour,
      timeline: timeline.map((t: any) => ({
        id: t.id,
        title: t.title,
        type: t.type,
        date: t.eventDate?.toISOString() ?? t.createdAt?.toISOString() ?? '',
      })),
    };
  }

  async getCalendar(userId: string, year: number, month: number): Promise<CalendarDto> {
    const raw = await this.repository.getCalendarData(userId, year, month);
    const allDates = new Set([
      ...Object.keys(raw.journalCounts),
      ...Object.keys(raw.memoryCounts),
      ...Object.keys(raw.completedCounts),
      ...Object.keys(raw.hoursTracked),
    ]);

    const entries: CalendarEntryDto[] = [...allDates].sort().map((date) => ({
      date,
      journalCount: raw.journalCounts[date] ?? 0,
      memoryCount: raw.memoryCounts[date] ?? 0,
      completedCount: raw.completedCounts[date] ?? 0,
      hoursTracked: Math.round((raw.hoursTracked[date] ?? 0) * 10) / 10,
    }));

    return { entries };
  }

  private getFavoriteType(totals: Record<string, number>): string | null {
    return Object.entries(totals).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;
  }
}
