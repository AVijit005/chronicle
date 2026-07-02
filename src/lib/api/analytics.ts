import { apiGet } from './fetch';

export interface ContinueItem {
  libraryId: string;
  mediaId: string;
  title: string;
  slug: string;
  posterUrl: string | null;
  mediaType: string;
  progress: number;
  progressPercentage: number;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  type: string;
  date: string;
  metadata?: Record<string, unknown>;
}

export interface PinnedCollection {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
}

export interface DashboardResponse {
  continueWatching: ContinueItem[];
  continueReading: ContinueItem[];
  continuePlaying: ContinueItem[];
  continueListening: ContinueItem[];
  continueLearning: ContinueItem[];
  recentlyAdded: RecentActivityItem[];
  recentlyCompleted: RecentActivityItem[];
  recentMemories: RecentActivityItem[];
  recentJournalEntries: RecentActivityItem[];
  pinnedCollections: PinnedCollection[];
}

export interface OverviewResponse {
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

export interface StreaksResponse {
  currentStreak: number;
  longestStreak: number;
  weeklyActivity: { period: string; count: number }[];
  monthlyActivity: { period: string; count: number }[];
  yearlyActivity: { period: string; count: number }[];
  completionStreak: number;
  journalStreak: number;
}

export interface MediaAnalyticsResponse {
  completionByType: Record<string, number>;
  progressDistribution: Record<string, number>;
  ratingsDistribution: Record<string, number>;
  reviewCount: number;
  favoriteCount: number;
  bookmarkCount: number;
  totalByType: Record<string, number>;
}

export interface GenreAnalyticsResponse {
  topGenres: { genre: string; count: number; percentage: number }[];
  genreCompletion: Record<string, number>;
  genreRatings: Record<string, number>;
  genreTimeSpent: Record<string, number>;
}

export interface ActivityResponse {
  heatmap: { date: string; count: number }[];
  byWeekday: Record<string, number>;
  byHour: Record<string, number>;
  timeline: RecentActivityItem[];
}

export interface CalendarEntry {
  date: string;
  journalCount: number;
  memoryCount: number;
  completedCount: number;
  hoursTracked: number;
}

export interface CalendarResponse {
  entries: CalendarEntry[];
}

export interface InsightsResponse {
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

export async function getDashboard(): Promise<DashboardResponse> {
  return apiGet<DashboardResponse>('/analytics/dashboard');
}

export async function getOverview(): Promise<OverviewResponse> {
  return apiGet<OverviewResponse>('/analytics/overview');
}

export async function getStreaks(): Promise<StreaksResponse> {
  return apiGet<StreaksResponse>('/analytics/streaks');
}

export async function getMediaAnalytics(): Promise<MediaAnalyticsResponse> {
  return apiGet<MediaAnalyticsResponse>('/analytics/media');
}

export async function getGenreAnalytics(): Promise<GenreAnalyticsResponse> {
  return apiGet<GenreAnalyticsResponse>('/analytics/genres');
}

export async function getActivity(): Promise<ActivityResponse> {
  return apiGet<ActivityResponse>('/analytics/activity');
}

export async function getCalendar(year?: number, month?: number): Promise<CalendarResponse> {
  const params = new URLSearchParams();
  if (year) params.set('year', String(year));
  if (month) params.set('month', String(month));
  const qs = params.toString();
  return apiGet<CalendarResponse>(`/analytics/calendar${qs ? `?${qs}` : ''}`);
}

export async function getInsights(): Promise<InsightsResponse> {
  return apiGet<InsightsResponse>('/analytics/insights');
}
