import { Injectable, Logger } from '@nestjs/common';

export interface OptimizationSuggestion {
  table: string;
  issue: string;
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
}

export interface QueryAnalysisResult {
  query: string;
  frequency: number;
  avgDurationMs: number;
  suggestions: string[];
}

@Injectable()
export class DatabaseOptimizationService {
  private readonly logger = new Logger(DatabaseOptimizationService.name);

  getSuggestedIndexes(): OptimizationSuggestion[] {
    return [
      {
        table: 'User',
        issue: 'Frequent lookups by email',
        suggestion: 'Index on email (already unique — covered)',
        impact: 'high',
      },
      {
        table: 'User',
        issue: 'Session queries by userId',
        suggestion: 'Index on sessions(userId, expiresAt)',
        impact: 'high',
      },
      {
        table: 'LibraryItem',
        issue: 'Filtering by userId and status',
        suggestion: 'Composite index on (userId, status, mediaType)',
        impact: 'high',
      },
      {
        table: 'LibraryItem',
        issue: 'Sorting by updatedAt',
        suggestion: 'Index on (userId, updatedAt DESC)',
        impact: 'medium',
      },
      {
        table: 'Progress',
        issue: 'Lookups by libraryItemId and userId',
        suggestion: 'Index on (libraryItemId, userId)',
        impact: 'high',
      },
      {
        table: 'Interaction',
        issue: 'Rating/review queries by libraryItemId',
        suggestion: 'Index on (libraryItemId, type)',
        impact: 'medium',
      },
      {
        table: 'CollectionItem',
        issue: 'Joining collections with items',
        suggestion: 'Index on (collectionId, libraryItemId)',
        impact: 'high',
      },
      {
        table: 'ActivityFeed',
        issue: 'Recent activity queries by userId',
        suggestion: 'Index on (userId, createdAt DESC)',
        impact: 'high',
      },
      {
        table: 'JournalEntry',
        issue: 'Date-range queries by userId',
        suggestion: 'Index on (userId, date)',
        impact: 'medium',
      },
      {
        table: 'Notification',
        issue: 'Unread notifications by userId',
        suggestion: 'Index on (userId, readAt, createdAt DESC)',
        impact: 'medium',
      },
    ];
  }

  getQueryOptimizations(): QueryAnalysisResult[] {
    return [
      {
        query: 'Analytics overview (counts by mediaType, status)',
        frequency: 10,
        avgDurationMs: 150,
        suggestions: ['Cache with 5-min TTL', 'Add covering index on LibraryItem(userId, status, mediaType)'],
      },
      {
        query: 'Recent activity feed',
        frequency: 50,
        avgDurationMs: 30,
        suggestions: ['Use cursor pagination instead of offset', 'Limit to 20 items by default'],
      },
      {
        query: 'Search across media types',
        frequency: 100,
        avgDurationMs: 200,
        suggestions: ['Consider PostgreSQL full-text search indexes', 'Cache popular search results'],
      },
      {
        query: 'Wrapped generation (yearly aggregations)',
        frequency: 1,
        avgDurationMs: 500,
        suggestions: ['Generate asynchronously via BullMQ', 'Cache generated results permanently'],
      },
    ];
  }
}
