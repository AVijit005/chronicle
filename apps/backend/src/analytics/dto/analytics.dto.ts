export class DashboardDto {
  continueWatching: ContinueItemDto[];
  continueReading: ContinueItemDto[];
  continuePlaying: ContinueItemDto[];
  continueListening: ContinueItemDto[];
  continueLearning: ContinueItemDto[];
  recentlyAdded: RecentActivityItemDto[];
  recentlyCompleted: RecentActivityItemDto[];
  recentMemories: RecentActivityItemDto[];
  recentJournalEntries: RecentActivityItemDto[];
  pinnedCollections: PinnedCollectionDto[];
}

export class ContinueItemDto {
  libraryId: string;
  mediaId: string;
  title: string;
  slug: string;
  posterUrl: string | null;
  mediaType: string;
  progress: number;
  progressPercentage: number;
}

export class RecentActivityItemDto {
  id: string;
  title: string;
  type: string;
  date: string;
  metadata?: Record<string, unknown>;
}

export class PinnedCollectionDto {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
}

export class OverviewDto {
  moviesCompleted: number;
  showsFinished: number;
  episodesWatched: number;
  booksRead: number;
  gamesFinished: number;
  coursesCompleted: number;
  hoursWatched: number;
  hoursRead: number;
  hoursPlayed: number;
  hoursLearned: number;
  averageRating: number | null;
  favoriteGenre: string | null;
  favoriteMediaType: string | null;
  totalLibraryItems: number;
  totalJournalEntries: number;
  totalMemories: number;
  totalReviews: number;
}

export class StreaksDto {
  currentStreak: number;
  longestStreak: number;
  weeklyActivity: ActivityCountDto[];
  monthlyActivity: ActivityCountDto[];
  yearlyActivity: ActivityCountDto[];
  completionStreak: number;
  journalStreak: number;
}

export class ActivityCountDto {
  period: string;
  count: number;
}

export class MediaAnalyticsDto {
  completionByType: Record<string, number>;
  progressDistribution: Record<string, number>;
  ratingsDistribution: Record<string, number>;
  reviewCount: number;
  favoriteCount: number;
  bookmarkCount: number;
  totalByType: Record<string, number>;
}

export class GenreAnalyticsDto {
  topGenres: GenreStatDto[];
  genreCompletion: Record<string, number>;
  genreRatings: Record<string, number>;
  genreTimeSpent: Record<string, number>;
}

export class GenreStatDto {
  genre: string;
  count: number;
  percentage: number;
}

export class ActivityDto {
  heatmap: HeatmapEntryDto[];
  byWeekday: Record<string, number>;
  byHour: Record<string, number>;
  timeline: RecentActivityItemDto[];
}

export class HeatmapEntryDto {
  date: string;
  count: number;
}

export class CalendarEntryDto {
  date: string;
  journalCount: number;
  memoryCount: number;
  completedCount: number;
  hoursTracked: number;
}

export class CalendarDto {
  entries: CalendarEntryDto[];
}

export class InsightsDto {
  mostActiveWeekday: string;
  favoriteGenre: string | null;
  mostProductiveMonth: string | null;
  totalUniqueMedia: number;
  totalHoursSpent: number;
}
