// Personal stats — pure, deterministic.
import { MEDIA, JOURNAL, ACTIVITY_30D } from "@/lib/mock";
import { mulberry } from "@/lib/seed";

export interface PersonalStats {
  averageCompletion: number; // 0-100
  averageRating: number; // 0-5
  favoriteWeekday: string;
  favoriteMonth: string;
  favoriteHour: string;
  genreGrowth: { genre: string; delta: number }[];
  creatorGrowth: { creator: string; delta: number }[];
  completionTrend: number[]; // sparkline
  discoveryTrend: number[];
  journalTrend: number[];
  learningTrend: number[];
  moodTrend: { mood: string; pct: number }[];
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let _stats: PersonalStats | null = null;
export function getPersonalStats(): PersonalStats {
  if (_stats) return _stats;
  const rng = mulberry(7);
  const avgCompletion = Math.round(
    MEDIA.reduce((s, m) => s + (m.progress ?? (m.status === "completed" ? 100 : 0)), 0) /
      MEDIA.length,
  );
  const avgRating = Math.round((MEDIA.reduce((s, m) => s + (m.rating ?? 0), 0) / MEDIA.length) * 10) / 10;
  const genres = [...new Set(MEDIA.flatMap((m) => m.genres))];
  const creators = [...new Set(MEDIA.map((m) => m.creator).filter(Boolean) as string[])];
  _stats = {
    averageCompletion: avgCompletion,
    averageRating: avgRating,
    favoriteWeekday: WEEKDAYS[Math.floor(rng() * 7)]!,
    favoriteMonth: MONTHS[Math.floor(rng() * 12)]!,
    favoriteHour: `${20 + Math.floor(rng() * 3)}:00`,
    genreGrowth: genres
      .slice(0, 5)
      .map((g) => ({ genre: g, delta: Math.round((rng() - 0.35) * 40) })),
    creatorGrowth: creators
      .slice(0, 5)
      .map((c) => ({ creator: c, delta: Math.round((rng() - 0.4) * 30) })),
    completionTrend: ACTIVITY_30D.map((a) => a.hours),
    discoveryTrend: Array.from({ length: 12 }, () => Math.round(rng() * 9 + 1)),
    journalTrend: Array.from({ length: 12 }, () => Math.round(rng() * 6)),
    learningTrend: Array.from({ length: 12 }, () => Math.round(rng() * 4 + 1)),
    moodTrend: ["Awe", "Joy", "Comfort", "Wonder", "Tender"].map((m) => ({
      mood: m,
      pct: Math.round(rng() * 22 + 8),
    })),
  };
  return _stats;
}

export const RECENT_JOURNAL_COUNT = () => JOURNAL.length;
