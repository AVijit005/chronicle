// Universal Profile Engine — deterministic identity selectors.
import { MEDIA, STATS, JOURNAL } from "@/lib/mock";
import { TODAY } from "@/lib/memory";

export interface ProfileIdentity {
  name: string;
  initials: string;
  memberSince: string;
  memoryAgeYears: number;
  totalStories: number;
  totalHours: number;
  readingIdentity: string;
  watchingIdentity: string;
  listeningIdentity: string;
  gamingIdentity: string;
  learningIdentity: string;
  favoriteGenres: string[];
  favoriteCreators: string[];
  favoriteYears: number[];
  favoriteLanguages: string[];
  mostEmotionalId: string;
  mostRewatchedId: string;
  longestJourneyId: string;
  averageCompletionDays: number;
  personalQuote: string;
  personalitySummary: string;
  memoryScore: number;
  discoveryScore: number;
  curiosityScore: number;
}

const SINCE = new Date("2021-08-01T00:00:00Z");

function topByKind(kind: string, n = 3): string[] {
  const counts = new Map<string, number>();
  for (const m of MEDIA) {
    if (m.kind !== kind || !m.creator) continue;
    counts.set(m.creator, (counts.get(m.creator) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

function genreCounts(): string[] {
  const counts = new Map<string, number>();
  for (const m of MEDIA) for (const g of m.genres) counts.set(g, (counts.get(g) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k)
    .slice(0, 5);
}

let _identity: ProfileIdentity | null = null;
export function getProfileIdentity(): ProfileIdentity {
  if (_identity) return _identity;
  const memoryAgeYears = Math.max(
    1,
    Math.floor((TODAY.getTime() - SINCE.getTime()) / (365.25 * 86400_000)),
  );
  const creators = [...new Set(MEDIA.map((m) => m.creator).filter(Boolean) as string[])];
  const years = [...new Set(MEDIA.map((m) => m.year))].sort((a, b) => b - a).slice(0, 4);
  _identity = {
    name: "Alex Yamamoto",
    initials: "AY",
    memberSince: "August 2021",
    memoryAgeYears,
    totalStories: MEDIA.length * 27,
    totalHours: STATS.totalHours,
    readingIdentity: "Slow reader · long-form lover",
    watchingIdentity: "Cinema purist · late-night marathoner",
    listeningIdentity: "Album-first listener",
    gamingIdentity: "Soulslike pilgrim · world-explorer",
    learningIdentity: "Self-taught · CS hobbyist",
    favoriteGenres: genreCounts(),
    favoriteCreators: creators.slice(0, 5),
    favoriteYears: years,
    favoriteLanguages: ["English", "Japanese", "French"],
    mostEmotionalId: "interstellar",
    mostRewatchedId: "interstellar",
    longestJourneyId: "one-piece",
    averageCompletionDays: 9,
    personalQuote: "Every story you finish becomes part of your story.",
    personalitySummary:
      "You build slow, deep relationships with stories. You return to the ones that changed you. You read like a marathon and watch like a cathedral.",
    memoryScore: 92,
    discoveryScore: 78,
    curiosityScore: 84,
  };
  return _identity;
}

export function readingTopCreators() {
  return topByKind("book");
}
export function watchingTopCreators() {
  return topByKind("movie");
}
export function gamingTopCreators() {
  return topByKind("game");
}

export const RECENT_JOURNAL_SUMMARY = () => JOURNAL.slice(0, 3);
