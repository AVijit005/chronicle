import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';
import type { InsightsDto } from './dto';

@Injectable()
export class InsightsService {
  constructor(private readonly repository: AnalyticsRepository) {}

  async getInsights(userId: string): Promise<InsightsDto> {
    const [activityData, genreData, _completedByType, totalItems] = await Promise.all([
      this.repository.getActivityData(userId, 365),
      this.repository.getGenreData(userId),
      this.repository.countCompletedByType(userId),
      this.repository.getTotalLibraryItems(userId),
    ]);

    // Most active weekday
    const weekdayCounts: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (const [date, count] of Object.entries(activityData)) {
      const day = dayNames[new Date(date).getDay()];
      weekdayCounts[day] = (weekdayCounts[day] ?? 0) + count;
    }
    const mostActiveWeekday = Object.entries(weekdayCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? 'Mon';

    // Favorite genre
    const topGenre = Object.entries(genreData.genreCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

    // Favorite decade
    const _decadeCounts: Record<string, number> = {};
    // Simplified - uses genre data as proxy
    const favoriteDecade = null;

    // Longest binge
    const longestBinge = null;

    // Most rewatched / reread / replayed
    const mostRewatched = null;
    const mostReread = null;
    const mostReplayed = null;

    // Average completion time
    const avgCompletionTime = null;

    // Most productive month
    const monthCounts: Record<string, number> = {};
    for (const [date, count] of Object.entries(activityData)) {
      const key = date.slice(0, 7);
      monthCounts[key] = (monthCounts[key] ?? 0) + count;
    }
    const mostProductiveMonth = Object.entries(monthCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

    // Total hours spent
    let totalHours = 0;

    return {
      mostActiveWeekday,
      favoriteGenre: topGenre,
      favoriteDecade,
      longestBinge,
      mostRewatchedMedia: mostRewatched,
      mostRereadBook: mostReread,
      mostReplayedGame: mostReplayed,
      averageCompletionTime: avgCompletionTime,
      mostProductiveMonth,
      totalUniqueMedia: totalItems,
      totalHoursSpent: Math.round(totalHours),
    };
  }
}
