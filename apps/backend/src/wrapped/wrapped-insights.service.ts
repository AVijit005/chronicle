import { Injectable } from '@nestjs/common';
import type { WrappedInsightDto } from './dto';

@Injectable()
export class WrappedInsightsService {
  generateInsights(data: {
    completedByType: Record<string, number>;
    journalCount: number;
    avgRating: number | null;
    topGenre: [string, number] | undefined;
    totalItems: number;
  }): WrappedInsightDto[] {
    const insights: WrappedInsightDto[] = [];
    const { completedByType, journalCount, avgRating, topGenre } = data;

    if (completedByType['movie'] && completedByType['movie'] > 0) {
      insights.push({
        text: `You completed ${completedByType['movie']} movie${completedByType['movie'] !== 1 ? 's' : ''} this year.`,
        icon: 'film',
        category: 'media',
      });
    }
    if (completedByType['tvShow'] && completedByType['tvShow'] > 0) {
      insights.push({
        text: `You finished ${completedByType['tvShow']} TV show${completedByType['tvShow'] !== 1 ? 's' : ''}.`,
        icon: 'tv',
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
    if (completedByType['game'] && completedByType['game'] > 0) {
      insights.push({
        text: `You finished ${completedByType['game']} game${completedByType['game'] !== 1 ? 's' : ''}.`,
        icon: 'gamepad',
        category: 'media',
      });
    }
    if (completedByType['course'] && completedByType['course'] > 0) {
      insights.push({
        text: `You completed ${completedByType['course']} course${completedByType['course'] !== 1 ? 's' : ''}.`,
        icon: 'graduation-cap',
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

    return insights;
  }
}
