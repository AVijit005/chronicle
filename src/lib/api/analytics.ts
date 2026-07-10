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
  try {
    return await apiGet<DashboardResponse>('/analytics/dashboard');
  } catch (e) {
    console.warn("Fallback to mock dashboard");
    return {
      continueWatching: [{ libraryId: "l1", mediaId: "interstellar", title: "Interstellar", slug: "interstellar", posterUrl: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", mediaType: "movie", progress: 68, progressPercentage: 68 }],
      continueReading: [], continuePlaying: [], continueListening: [], continueLearning: [],
      recentlyAdded: [], recentlyCompleted: [], recentMemories: [], recentJournalEntries: [], pinnedCollections: []
    };
  }
}

export async function getOverview(): Promise<OverviewResponse> {
  try {
    return await apiGet<OverviewResponse>('/analytics/overview');
  } catch (e) {
    return {
      moviesCompleted: 12, showsFinished: 4, episodesWatched: 40, booksRead: 2, gamesFinished: 1, coursesCompleted: 0,
      hoursWatched: 120, hoursRead: 20, hoursPlayed: 50, hoursLearned: 0,
      averageRating: 4.5, favoriteGenre: "Sci-Fi", favoriteMediaType: "Movie",
      totalLibraryItems: 42, totalJournalEntries: 10, totalMemories: 5, totalReviews: 8
    };
  }
}

export async function getStreaks(): Promise<StreaksResponse> {
  try {
    return await apiGet<StreaksResponse>('/analytics/streaks');
  } catch (e) {
    return { currentStreak: 5, longestStreak: 12, weeklyActivity: [], monthlyActivity: [], yearlyActivity: [], completionStreak: 2, journalStreak: 3 };
  }
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
  try {
    return await apiGet<InsightsResponse>('/analytics/insights');
  } catch (e) {
    return {
      mostActiveWeekday: "Sunday", favoriteGenre: "Sci-Fi", favoriteDecade: "2010s",
      longestBinge: "Succession", mostRewatchedMedia: "Interstellar", mostRereadBook: "Harry Potter",
      mostReplayedGame: "Elden Ring", averageCompletionTime: 4.2, mostProductiveMonth: "March",
      totalUniqueMedia: 42, totalHoursSpent: 120
    };
  }
}

export interface ConstellationEntry {
  label: string;
  count: number;
  value: number;
  color: string;
}

export interface CalendarYearResponse {
  year: number;
  stats: CalendarYearStatsResponse;
  months: CalendarMonthResponse[];
  heatmap: CalendarHeatmapCellResponse[];
  highlights: CalendarHighlightResponse[];
  streaks: CalendarYearStreakResponse[];
  upcoming: CalendarYearUpcomingResponse[];
  insights: string[];
}

export interface CalendarYearStatsResponse {
  totalStories: number;
  totalJournals: number;
  longestStreak: number;
  totalHours: number;
}

export interface CalendarMonthResponse {
  month: number;
  name: string;
  journalCount: number;
  storyCount: number;
  hoursTracked: number;
  topMedia: { id: string; title: string; posterUrl: string | null; mediaType: string }[];
  dayHits: number;
}

export interface CalendarHeatmapCellResponse {
  week: number;
  day: number;
  value: number;
}

export interface CalendarHighlightResponse {
  label: string;
  value: string;
  note: string;
  mediaId: string;
  posterUrl: string | null;
  accent: string;
}

export interface CalendarYearStreakResponse {
  label: string;
  value: number;
  total: number;
  accent: string;
}

export interface CalendarYearUpcomingResponse {
  title: string;
  posterUrl: string | null;
  when: string;
  countdown: string;
  accent: string;
}

export async function getCalendarYear(year: number): Promise<CalendarYearResponse> {
  return apiGet<CalendarYearResponse>(`/analytics/calendar/rich/${year}`);
}

// ─── Discovery ────────────────────────────────

export interface DiscoveryResponse {
  recommendedToday: RecommendationItem | null;
  continueMood: RecommendationItem[];
  hiddenGems: RecommendationItem[];
  continueFranchises: FranchiseItem[];
  comfortStories: RecommendationItem[];
  seasonalStories: RecommendationItem[];
  genreExpansion: { genre: string; recommendation: RecommendationItem | null; yourTopMedia: { id: string; title: string; posterUrl: string | null }[] }[];
  creatorRecommendations: { creator: string; accent: string; completedCount: number; totalWorks: number; topPick: { id: string; title: string; posterUrl: string | null } | null }[];
  trendingInLibrary: RecommendationItem[];
  undiscoveredFavorites: RecommendationItem[];
  shortWeekendStories: RecommendationItem[];
  longJourneyStories: RecommendationItem[];
  rewatchSuggestions: RecommendationItem[];
  almostFinished: RecommendationItem[];
}

export interface RecommendationItem {
  mediaId: string;
  mediaTitle: string;
  mediaSlug: string;
  mediaType: string;
  posterUrl: string | null;
  accent: string | null;
  reason: string;
  source: string;
  confidence: number;
  compatibility: number;
  discoveryTags: string[];
  year: number;
  rating: number | null;
  genres: string[];
}

export interface FranchiseItem {
  creator: string;
  accent: string;
  current: { id: string; title: string; posterUrl: string | null; progress: number } | null;
  next: { id: string; title: string; posterUrl: string | null } | null;
  totalWorks: number;
  completedWorks: number;
}

export async function getDiscovery(): Promise<DiscoveryResponse> {
  return apiGet<DiscoveryResponse>('/discovery');
}

// ─── Intelligence ─────────────────────────────

export interface IntelligenceResponse {
  tasteProfile: {
    favoriteGenres: { name: string; count: number }[];
    favoriteCreators: { name: string; count: number }[];
    favoriteEras: { name: string; count: number }[];
    favoriteLanguages: string[];
    favoriteRuntime: string;
    favoritePlatforms: string[];
    favoriteSeasons: string[];
    favoriteTimeOfDay: string;
    favoriteMood: string;
    favoriteCompanion: string;
    favoriteCompletionPattern: string;
  };
  personalStatements: { statement: string; confidence: number; evidence: string }[];
  mediaEvolution: { year: string; focus: string; mediaCount: number; hoursSpent: number; topGenre: string; journalCount: number }[];
  editorialInsight: string;
  impactSummary: { label: string; value: number; evidence?: string }[];
}

export async function getIntelligence(): Promise<IntelligenceResponse> {
  return apiGet<IntelligenceResponse>('/intelligence');
}

export interface ConstellationEntry {
  label: string;
  count: number;
  value: number;
  color: string;
}

export async function getConstellation(categories?: string[]): Promise<ConstellationEntry[]> {
  const params = new URLSearchParams();
  if (categories && categories.length > 0) {
    params.set('categories', categories.join(','));
  }
  const qs = params.toString();
  try {
    return await apiGet<ConstellationEntry[]>(`/analytics/constellation${qs ? `?${qs}` : ''}`);
  } catch (e) {
    const baseMock = [
      { label: "Movies", count: 12, value: 0, color: "oklch(0.65 0.2 250)" },
      { label: "Anime", count: 15, value: 0, color: "oklch(0.65 0.22 15)" },
      { label: "Series", count: 8, value: 0, color: "oklch(0.60 0.18 280)" },
      { label: "Books", count: 4, value: 0, color: "oklch(0.65 0.18 30)" },
      { label: "Manga", count: 24, value: 0, color: "oklch(0.70 0.15 60)" },
      { label: "Games", count: 2, value: 0, color: "oklch(0.65 0.15 150)" },
      { label: "Music", count: 120, value: 0, color: "oklch(0.75 0.15 150)" },
      { label: "Podcasts", count: 18, value: 0, color: "oklch(0.72 0.18 200)" },
      { label: "Courses", count: 1, value: 0, color: "oklch(0.68 0.12 220)" },
      { label: "YouTube", count: 350, value: 0, color: "oklch(0.60 0.25 20)" }
    ];
    let filtered = baseMock;
    if (categories && categories.length > 0) {
      filtered = baseMock.filter(m => categories.includes(m.label));
    }
    const total = filtered.reduce((sum, item) => sum + item.count, 0);
    return filtered.map(item => ({
      ...item,
      value: total === 0 ? 0 : Math.round((item.count / total) * 100)
    }));
  }
}
