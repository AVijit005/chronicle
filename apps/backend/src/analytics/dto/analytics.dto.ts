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

// ─── Rich Calendar Year ────────────────────────────────
export class CalendarMonthDto {
  month: number;
  name: string;
  journalCount: number;
  storyCount: number;
  hoursTracked: number;
  topMedia: CalendarMediaRefDto[];
  dayHits: number;
}

export class CalendarMediaRefDto {
  id: string;
  title: string;
  posterUrl: string | null;
  mediaType: string;
}

export class CalendarYearStatsDto {
  totalStories: number;
  totalJournals: number;
  longestStreak: number;
  totalHours: number;
}

export class CalendarHeatmapCellDto {
  week: number;
  day: number;
  value: number;
}

export class CalendarYearDto {
  year: number;
  stats: CalendarYearStatsDto;
  months: CalendarMonthDto[];
  heatmap: CalendarHeatmapCellDto[];
  highlights: CalendarHighlightDto[];
  streaks: CalendarStreakDto[];
  upcoming: CalendarUpcomingDto[];
  insights: string[];
}

export class CalendarDayMediaItemDto {
  id: string;
  title: string;
  posterUrl: string | null;
  mediaType: string;
  note: string;
}

export class CalendarDayDto {
  date: string;
  mediaItems: CalendarDayMediaItemDto[];
  journalEntry: { id: string; content: string; mood: string | null } | null;
}

export class CalendarHighlightDto {
  label: string;
  value: string;
  note: string;
  mediaId: string;
  posterUrl: string | null;
  accent: string;
}

export class CalendarStreakDto {
  label: string;
  value: number;
  total: number;
  accent: string;
}

export class CalendarUpcomingDto {
  title: string;
  posterUrl: string | null;
  when: string;
  countdown: string;
  accent: string;
}

export class InsightsDto {
  mostActiveWeekday: string;
  favoriteGenre: string | null;
  favoriteDecade: string | null;
  longestBinge: string | null;
  mostRewatchedMedia: string | null;
  mostRereadBook: string | null;
  mostReplayedGame: string | null;
  averageCompletionTime: number | null;
  mostProductiveMonth: string | null;
  totalUniqueMedia: number;
  totalHoursSpent: number;
}
