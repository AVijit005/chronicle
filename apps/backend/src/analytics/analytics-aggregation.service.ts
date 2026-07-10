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
  CalendarYearDto,
  CalendarYearStatsDto,
  CalendarMonthDto,
  CalendarHeatmapCellDto,
  CalendarHighlightDto,
  CalendarStreakDto,
  CalendarUpcomingDto,
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

  async getCalendarYear(userId: string, year: number): Promise<CalendarYearDto> {
    const { months: monthRaw, heatmapCells } = await this.repository.getCalendarYearData(userId, year);
    const highlights = await this.repository.getYearHighlights(userId, year);
    const streakData = await this.repository.getYearStreaks(userId);
    const upcomingRaw = await this.repository.getYearUpcoming(userId);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const months: CalendarMonthDto[] = monthRaw.map((m) => ({
      month: m.month,
      name: monthNames[m.month],
      journalCount: m.journalCount,
      storyCount: m.storyCount,
      hoursTracked: Math.round(m.hoursTracked),
      topMedia: m.topMediaIds.slice(0, 4) as any,
      dayHits: m.dayHits,
    }));

    const totalStories = months.reduce((sum, m) => sum + m.storyCount, 0);
    const totalJournals = months.reduce((sum, m) => sum + m.journalCount, 0);
    const totalHours = months.reduce((sum, m) => sum + m.hoursTracked, 0);

    const stats: CalendarYearStatsDto = {
      totalStories,
      totalJournals,
      longestStreak: 0,
      totalHours,
    };

    const heatmap: CalendarHeatmapCellDto[] = heatmapCells.map((c) => ({
      week: c.week,
      day: c.day,
      value: Math.min(1, c.value),
    }));

    const mappedHighlights: CalendarHighlightDto[] = highlights.map((h) => ({
      label: h.label,
      value: h.value,
      note: h.note,
      mediaId: h.mediaId,
      posterUrl: h.posterUrl,
      accent: h.accent,
    }));

    const streaks: CalendarStreakDto[] = streakData.map((s: any) => ({
      label: s.label,
      value: s.value,
      total: s.total,
      accent: s.accent,
    }));

    const upcoming: CalendarUpcomingDto[] = upcomingRaw.map((u: any) => ({
      title: u.title,
      posterUrl: u.posterUrl,
      when: u.releaseDate ? new Date(u.releaseDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'TBA',
      countdown: u.releaseDate && new Date(u.releaseDate) > new Date() ? `${Math.ceil((new Date(u.releaseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d` : 'Soon',
      accent: 'oklch(0.72 0.18 255)',
    }));

    const insightLines = this.generateInsights(stats, months);

    return {
      year,
      stats,
      months,
      heatmap,
      highlights: mappedHighlights,
      streaks,
      upcoming,
      insights: insightLines,
    };
  }

  private generateInsights(stats: CalendarYearStatsDto, months: CalendarMonthDto[]): string[] {
    const insights: string[] = [];
    if (stats.totalStories > 0) {
      insights.push(`You tracked ${stats.totalStories} stories in total — that's ${Math.round(stats.totalStories / 12)} per month on average.`);
    }
    if (stats.totalHours > 0) {
      insights.push(`Across the year you spent ${stats.totalHours} hours with your media — roughly ${Math.round(stats.totalHours / 52)}h per week.`);
    }
    const bestMonth = [...months].sort((a, b) => b.dayHits - a.dayHits)[0];
    if (bestMonth?.dayHits > 0) {
      insights.push(`${bestMonth.name} was your most active month with ${bestMonth.dayHits} touchpoints.`);
    }
    if (stats.totalJournals > 0) {
      insights.push(`You wrote ${stats.totalJournals} journal entries — an average of ${Math.round(stats.totalJournals / 12)} per month.`);
    }
    return insights.length > 0 ? insights : ['Start tracking media to see your year in review.'];
  }

  private getFavoriteType(totals: Record<string, number>): string | null {
    return Object.entries(totals).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;
  }
}
