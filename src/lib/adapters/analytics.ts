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
  UICalendarYear,
  UIInsights 
} from "./types";
import type { 
  OverviewResponse, 
  StreaksResponse, 
  MediaAnalyticsResponse, 
  GenreAnalyticsResponse, 
  ActivityResponse, 
  CalendarResponse,
  CalendarYearResponse,
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

// ─── Calendar Year ──────────────────────────────
export function adaptCalendarYear(y: CalendarYearResponse): UICalendarYear {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthAccents = [
    'oklch(0.65 0.2 250)', 'oklch(0.7 0.18 290)', 'oklch(0.78 0.16 130)',
    'oklch(0.82 0.16 80)', 'oklch(0.7 0.2 35)', 'oklch(0.72 0.18 255)',
    'oklch(0.78 0.16 80)', 'oklch(0.7 0.2 35)', 'oklch(0.65 0.22 295)',
    'oklch(0.7 0.18 25)', 'oklch(0.6 0.18 250)', 'oklch(0.68 0.15 280)'
  ];

  const months = y.months.map((m) => ({
    index: m.month,
    name: monthNames[m.month],
    short: monthNames[m.month],
    daysInMonth: new Date(y.year, m.month + 1, 0).getDate(),
    startDay: new Date(y.year, m.month, 1).getDay(),
    cells: Array.from({ length: new Date(y.year, m.month + 1, 0).getDate() }, (_, i) => ({
      day: i + 1,
      hasMedia: false,
      hasJournal: false,
      hasAchievement: false,
      intensity: 0,
      mediaCount: 0,
      poster: '',
    })),
    accent: monthAccents[m.month],
    favorite: '',
    genre: '',
    mediaCount: m.storyCount,
    journalCount: m.journalCount,
    hours: m.hoursTracked,
    collage: m.topMedia.map((t) => t.posterUrl ?? ''),
    dayHits: m.dayHits,
  }));

  const heatmap = y.heatmap.map((c) => ({
    w: c.week,
    d: c.day,
    v: c.value,
  }));

  return {
    year: y.year,
    stats: {
      stories: y.stats.totalStories,
      journals: y.stats.totalJournals,
      longestStreak: y.stats.longestStreak,
      favoriteMonth: months.sort((a, b) => b.dayHits - a.dayHits)[0]?.name ?? '—',
    },
    months,
    heatmap,
    highlights: y.highlights.map((h) => ({ label: h.label, value: h.value, note: h.note, media: { poster: h.posterUrl } })),
    streaks: y.streaks.map((s) => ({ label: s.label, value: s.value, total: s.total, accent: s.accent })),
    releases: y.upcoming.map((u) => ({ title: u.title, poster: u.posterUrl ?? '', when: u.when, countdown: u.countdown, accent: u.accent })),
    insights: y.insights,
  };
}
