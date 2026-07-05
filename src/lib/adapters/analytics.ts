/**
 * Analytics adapter: API responses → UIOverview, UIStreak
 */

import type { 
  UIOverview, 
  UIStreak, 
  UIMediaAnalytics, 
  UIGenreAnalytics, 
  UIActivity, 
  UICalendar, 
  UIInsights 
} from "./types";
import type { 
  OverviewResponse, 
  StreaksResponse, 
  MediaAnalyticsResponse, 
  GenreAnalyticsResponse, 
  ActivityResponse, 
  CalendarResponse, 
  InsightsResponse 
} from "@/lib/api/analytics";

export function adaptOverview(o: OverviewResponse): UIOverview {
  return {
    totalItems: o.totalLibraryItems,
    completedItems: o.moviesCompleted + o.showsFinished + o.booksRead + o.gamesFinished + o.coursesCompleted,
    hoursSpent: o.hoursWatched + o.hoursRead + o.hoursPlayed + o.hoursLearned,
    averageRating: o.averageRating,
    favoriteGenre: o.favoriteGenre,
    favoriteMediaType: o.favoriteMediaType,
    journalEntries: o.totalJournalEntries,
    memories: o.totalMemories,
    moviesCompleted: o.moviesCompleted,
    showsFinished: o.showsFinished,
    episodesWatched: o.episodesWatched,
    booksRead: o.booksRead,
    gamesFinished: o.gamesFinished,
    coursesCompleted: o.coursesCompleted,
    hoursWatched: o.hoursWatched,
    hoursRead: o.hoursRead,
    hoursPlayed: o.hoursPlayed,
    hoursLearned: o.hoursLearned,
    totalReviews: o.totalReviews,
  };
}

export function adaptStreaks(s: StreaksResponse): UIStreak {
  return {
    current: s.currentStreak,
    longest: s.longestStreak,
    weeklyActivity: s.weeklyActivity,
    monthlyActivity: s.monthlyActivity,
    yearlyActivity: s.yearlyActivity,
    completionStreak: s.completionStreak,
    journalStreak: s.journalStreak,
  };
}

export function adaptMediaAnalytics(m: MediaAnalyticsResponse): UIMediaAnalytics {
  return m; // Matches perfectly
}

export function adaptGenreAnalytics(g: GenreAnalyticsResponse): UIGenreAnalytics {
  return g; // Matches perfectly
}

export function adaptActivity(a: ActivityResponse): UIActivity {
  return {
    heatmap: a.heatmap,
    byWeekday: a.byWeekday,
    byHour: a.byHour,
    timeline: a.timeline,
  };
}

export function adaptCalendar(c: CalendarResponse): UICalendar {
  return c; // Matches perfectly
}

export function adaptInsights(i: InsightsResponse): UIInsights {
  return i; // Matches perfectly
}
