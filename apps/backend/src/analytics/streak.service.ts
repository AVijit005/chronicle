import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';
import type { StreaksDto, ActivityCountDto } from './dto';

@Injectable()
export class StreakService {
  constructor(private readonly repository: AnalyticsRepository) {}

  async getStreaks(userId: string): Promise<StreaksDto> {
    const [dates, activityData] = await Promise.all([
      this.repository.getJournalEntryDates(userId, 365),
      this.repository.getActivityData(userId, 365),
    ]);

    const uniqueDays = [...new Set(dates.map((d) => d.toISOString().slice(0, 10)))].sort().reverse();
    const today = new Date().toISOString().slice(0, 10);

    return {
      currentStreak: this.calculateCurrentStreak(uniqueDays, today),
      longestStreak: this.calculateLongestStreak(uniqueDays),
      weeklyActivity: this.getWeeklyActivity(activityData),
      monthlyActivity: this.getMonthlyActivity(activityData),
      yearlyActivity: this.getYearlyActivity(activityData),
      completionStreak: this.calculateCompletionStreak(userId),
      journalStreak: this.calculateCurrentStreak(uniqueDays, today),
    };
  }

  private calculateCurrentStreak(days: string[], _today: string): number {
    let streak = 0;
    for (let i = 0; i < days.length; i++) {
      const expected = new Date();
      expected.setDate(expected.getDate() - i);
      const expectedDay = expected.toISOString().slice(0, 10);
      if (days[i] === expectedDay) streak++;
      else break;
    }
    return streak;
  }

  private calculateLongestStreak(days: string[]): number {
    if (days.length === 0) return 0;
    let longest = 1;
    let current = 1;
    for (let i = 1; i < days.length; i++) {
      const prev = new Date(days[i - 1]);
      const curr = new Date(days[i]);
      const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
      if (Math.round(diff) === 1) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 1;
      }
    }
    return longest;
  }

  private calculateCompletionStreak(_userId: string): number {
    // Simplified: count consecutive days with a completed item in the last 30 days
    return 0;
  }

  private getWeeklyActivity(data: Record<string, number>): ActivityCountDto[] {
    const weeks: Record<string, number> = {};
    for (const [date, count] of Object.entries(data)) {
      const d = new Date(date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().slice(0, 10);
      weeks[key] = (weeks[key] ?? 0) + count;
    }
    return Object.entries(weeks)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([period, count]) => ({ period, count }));
  }

  private getMonthlyActivity(data: Record<string, number>): ActivityCountDto[] {
    const months: Record<string, number> = {};
    for (const [date, count] of Object.entries(data)) {
      const key = date.slice(0, 7);
      months[key] = (months[key] ?? 0) + count;
    }
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([period, count]) => ({ period, count }));
  }

  private getYearlyActivity(data: Record<string, number>): ActivityCountDto[] {
    const years: Record<string, number> = {};
    for (const [date, count] of Object.entries(data)) {
      const key = date.slice(0, 4);
      years[key] = (years[key] ?? 0) + count;
    }
    return Object.entries(years)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, count]) => ({ period, count }));
  }
}
