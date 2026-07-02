import { Injectable, Logger } from '@nestjs/common';
import { AnalyticsRepository } from '../analytics/analytics.repository';
import type { WrappedCardDto, WrappedStatDto, WrappedInsightDto } from './dto';

@Injectable()
export class WrappedGeneratorService {
  private readonly logger = new Logger(WrappedGeneratorService.name);

  constructor(private readonly analyticsRepo: AnalyticsRepository) {}

  async generate(
    userId: string,
    year: number,
  ): Promise<{
    cards: WrappedCardDto[];
    stats: WrappedStatDto[];
    insights: WrappedInsightDto[];
    summary: string;
    sharePayload: Record<string, unknown>;
  }> {
    const [completedByType, totalsByType, totalItems, avgRating, genreData, journalDates] = await Promise.all([
      this.analyticsRepo.countCompletedByType(userId),
      this.analyticsRepo.countTotalByType(userId),
      this.analyticsRepo.getTotalLibraryItems(userId),
      this.analyticsRepo.getAverageRating(userId),
      this.analyticsRepo.getGenreData(userId),
      this.analyticsRepo.getJournalEntryDates(userId, 10000),
    ]);

    const totalCompleted = Object.values(completedByType).reduce((a, b) => a + b, 0);
    const _totalHours = 0; // Would need hours tracking to compute
    const journalCount = journalDates.length;

    // ─── Cards: Top media by completion ──────────────────────────────────────
    const cards: WrappedCardDto[] = [];
    let rank = 1;

    const typeLabels: Record<string, string> = {
      movie: 'Movies',
      tvShow: 'TV Shows',
      anime: 'Anime',
      book: 'Books',
      game: 'Games',
      musicAlbum: 'Music',
      podcast: 'Podcasts',
      course: 'Courses',
    };

    for (const [type, count] of Object.entries(totalsByType)) {
      if (count > 0) {
        cards.push({
          rank: rank++,
          title: `${count} ${typeLabels[type] ?? type}`,
          type,
          subtitle: `${count} ${type} item${count !== 1 ? 's' : ''}`,
          imageUrl: null,
          stat: `${count}`,
        });
      }
    }

    // ─── Stats ──────────────────────────────────────────────────────────────
    const stats: WrappedStatDto[] = [
      { title: 'Movies Completed', value: String(completedByType['movie'] ?? 0), icon: 'film', sortOrder: 1 },
      {
        title: 'Shows Finished',
        value: String((completedByType['tvShow'] ?? 0) + (completedByType['anime'] ?? 0)),
        icon: 'tv',
        sortOrder: 2,
      },
      { title: 'Books Read', value: String(completedByType['book'] ?? 0), icon: 'book', sortOrder: 3 },
      { title: 'Games Finished', value: String(completedByType['game'] ?? 0), icon: 'gamepad', sortOrder: 4 },
      {
        title: 'Courses Completed',
        value: String(completedByType['course'] ?? 0),
        icon: 'graduation-cap',
        sortOrder: 5,
      },
      { title: 'Total Items', value: String(totalItems), icon: 'library', sortOrder: 6 },
      { title: 'Average Rating', value: avgRating ? avgRating.toFixed(1) : 'N/A', icon: 'star', sortOrder: 7 },
      { title: 'Journal Entries', value: String(journalCount), icon: 'book-open', sortOrder: 8 },
    ];

    // ─── Top Genre ──────────────────────────────────────────────────────────
    const topGenre = Object.entries(genreData.genreCounts).sort(([, a], [, b]) => b - a)[0];
    if (topGenre) {
      stats.push({ title: 'Favorite Genre', value: topGenre[0], icon: 'tag', sortOrder: 9 });
    }

    // ─── Insights ───────────────────────────────────────────────────────────
    const insights: WrappedInsightDto[] = [];

    if (completedByType['movie'] && completedByType['movie'] > 0) {
      insights.push({
        text: `You completed ${completedByType['movie']} movie${completedByType['movie'] !== 1 ? 's' : ''} this year.`,
        icon: 'film',
        category: 'media',
      });
    }
    if (completedByType['book'] && completedByType['book'] > 0) {
      insights.push({
        text: `You read ${completedByType['book']} book${completedByType['book'] !== 1 ? 's' : ''}.`,
        icon: 'book',
        category: 'media',
      });
    }
    if (avgRating) {
      insights.push({
        text: `Your average rating was ${avgRating.toFixed(1)} out of 5.`,
        icon: 'star',
        category: 'rating',
      });
    }
    if (journalCount > 0) {
      insights.push({
        text: `You wrote ${journalCount} journal entr${journalCount !== 1 ? 'ies' : 'y'}.`,
        icon: 'book-open',
        category: 'journal',
      });
    }
    if (topGenre) {
      insights.push({
        text: `${topGenre[0]} was your most-watched genre with ${topGenre[1]} title${topGenre[1] !== 1 ? 's' : ''}.`,
        icon: 'tag',
        category: 'genre',
      });
    }

    // ─── Summary ────────────────────────────────────────────────────────────
    const summary = this.buildSummary(totalCompleted, totalItems, journalCount, year);

    // ─── Share Payload ──────────────────────────────────────────────────────
    const sharePayload: Record<string, unknown> = {
      year,
      totalCompleted,
      totalItems,
      journalCount,
      topGenre: topGenre?.[0] ?? null,
      stats,
      insights,
    };

    return { cards, stats, insights, summary, sharePayload };
  }

  private buildSummary(totalCompleted: number, totalItems: number, journalCount: number, year: number): string {
    const parts: string[] = [];
    if (totalCompleted > 0) parts.push(`completed ${totalCompleted} items`);
    if (totalItems > 0) parts.push(`tracked ${totalItems} total`);
    if (journalCount > 0) parts.push(`wrote ${journalCount} journal entries`);

    if (parts.length === 0) return `Your ${year} Chronicle Wrapped is ready.`;
    return `In ${year}, you ${parts.join(', ')}.`;
  }
}
