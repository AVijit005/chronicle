import { Injectable } from '@nestjs/common';
import { JournalRepository } from './journal.repository';
import type { JournalStatisticsDto } from './dto';

@Injectable()
export class JournalStatisticsService {
  constructor(private readonly repository: JournalRepository) {}

  async getStats(userId: string): Promise<JournalStatisticsDto> {
    const [journalCount, memoryCount, timelineEventCount, favoriteQuoteCount, highlightCount, dates] =
      await Promise.all([
        this.repository.countEntries(userId),
        this.repository.countMemories(userId),
        this.repository.countTimelineEvents(userId),
        this.repository.countQuotes(userId),
        this.repository.countHighlights(userId),
        this.repository.getRecentEntryDates(userId, 365),
      ]);

    return {
      journalCount,
      memoryCount,
      writingStreak: this.calculateStreak(dates),
      timelineEventCount,
      favoriteQuoteCount,
      highlightCount,
    };
  }

  private calculateStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;

    // Remove time portion and duplicates, sort desc
    const uniqueDays = [...new Set(dates.map((d) => d.toISOString().slice(0, 10)))].sort().reverse();

    let streak = 0;

    for (let i = 0; i < uniqueDays.length; i++) {
      const expected = new Date();
      expected.setDate(expected.getDate() - i);
      const expectedDay = expected.toISOString().slice(0, 10);

      if (uniqueDays[i] === expectedDay) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}
