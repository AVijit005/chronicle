// Memory Insights — Part 03.
import { MEDIA } from "@/lib/types";
import {
  MEMORIES_BY_MEDIA,
  TODAY,
  type MediaMemory,
  type Mood,
  type Season,
  type Companion,
} from "@/lib/memory";

interface Pair {
  media: (typeof MEDIA)[number];
  memory: MediaMemory;
}
const all = (): Pair[] =>
  MEDIA.map((m) => ({ media: m, memory: MEMORIES_BY_MEDIA[m.id] })).filter(
    (x): x is Pair => !!x.memory,
  );

/* ============================================================
 * Life chapters — editorial groupings of memories.
 * ============================================================ */
export interface LifeChapter {
  id: string;
  name: string;
  range: string;
  description: string;
  dominantMood: Mood;
  totalHours: number;
  coverIds: string[];
  mediaIds: string[];
  journalCount: number;
  favoriteMediaId: string;
}

export const LIFE_CHAPTERS: LifeChapter[] = [
  {
    id: "lockdown",
    name: "The Long Spring",
    range: "Mar 2020 – Jul 2020",
    description: "Indoors, slow mornings. Stories kept the days legible.",
    dominantMood: "Tender",
    totalHours: 312,
    coverIds: ["interstellar", "one-piece", "harry-potter", "dark-side"],
    mediaIds: ["one-piece", "harry-potter", "dark-side", "interstellar"],
    journalCount: 24,
    favoriteMediaId: "one-piece",
  },
  {
    id: "college",
    name: "College Years",
    range: "2021 – 2023",
    description: "Late nights, group rewatches, the first stories you chose for yourself.",
    dominantMood: "Obsessed",
    totalHours: 540,
    coverIds: ["elden-ring", "succession", "chainsaw-man", "cyberpunk"],
    mediaIds: ["elden-ring", "succession", "chainsaw-man", "cyberpunk"],
    journalCount: 41,
    favoriteMediaId: "elden-ring",
  },
  {
    id: "internship",
    name: "First Job Summer",
    range: "Summer 2024",
    description: "Long commutes, podcasts, films alone on Friday nights.",
    dominantMood: "Curious",
    totalHours: 188,
    coverIds: ["lex", "cs50", "mkbhd", "dune"],
    mediaIds: ["lex", "cs50", "mkbhd", "dune"],
    journalCount: 12,
    favoriteMediaId: "dune",
  },
  {
    id: "winter25",
    name: "Winter '25",
    range: "Dec 2025 – Feb 2026",
    description: "Snow weeks, family on the couch, soundtracks on repeat.",
    dominantMood: "Comfort",
    totalHours: 96,
    coverIds: ["dune", "interstellar", "succession", "dark-side"],
    mediaIds: ["dune", "interstellar", "succession", "dark-side"],
    journalCount: 9,
    favoriteMediaId: "dune",
  },
];

/* ============================================================
 * Capsules
 * ============================================================ */
export interface Capsule {
  id: string;
  name: string;
  description: string;
  coverIds: string[];
  count: number;
}
export const CAPSULES: Capsule[] = [
  {
    id: "summer25",
    name: "Summer 2025",
    description: "The summer of long evenings.",
    coverIds: ["one-piece", "dark-side", "lex", "cs50"],
    count: 18,
  },
  {
    id: "exam-week",
    name: "Exam Week",
    description: "Comfort stories, fifteen-minute breaks.",
    coverIds: ["mkbhd", "lex", "cs50"],
    count: 7,
  },
  {
    id: "ghibli",
    name: "Studio Ghibli Weekend",
    description: "Two days, hand-drawn worlds.",
    coverIds: ["one-piece", "chainsaw-man"],
    count: 5,
  },
  {
    id: "onepiece",
    name: "One Piece Journey",
    description: "A story that grew up with you.",
    coverIds: ["one-piece"],
    count: 1092,
  },
  {
    id: "first-anime",
    name: "First Anime",
    description: "The one that started everything.",
    coverIds: ["one-piece"],
    count: 1,
  },
];

/* ============================================================
 * Highlights, tags, firsts, milestones, streaks, bookmarks, insights
 * ============================================================ */
export interface MemoryHighlight {
  id: string;
  label: string;
  caption: string;
  mediaId: string;
}
export const HIGHLIGHTS: MemoryHighlight[] = [
  {
    id: "emotional",
    label: "Most Emotional",
    caption: "The hour after still felt loud.",
    mediaId: "interstellar",
  },
  {
    id: "inspiring",
    label: "Most Inspiring",
    caption: "Changed how you read endings.",
    mediaId: "dune",
  },
  {
    id: "rewatched",
    label: "Most Rewatched",
    caption: "Six viewings and counting.",
    mediaId: "interstellar",
  },
  {
    id: "longest",
    label: "Longest Journey",
    caption: "A story you grew up alongside.",
    mediaId: "one-piece",
  },
  {
    id: "unexpected",
    label: "Unexpected Favorite",
    caption: "You didn't expect this one to land.",
    mediaId: "chainsaw-man",
  },
  {
    id: "ending",
    label: "Best Ending",
    caption: "A quiet, honest landing.",
    mediaId: "succession",
  },
  {
    id: "soundtrack",
    label: "Most Beautiful Soundtrack",
    caption: "Still on your sleep playlist.",
    mediaId: "dark-side",
  },
];

export const TAGS = [
  "Comfort",
  "Healing",
  "Adventure",
  "Mind-blowing",
  "Dark",
  "Funny",
  "Late Night",
  "Rainy Day",
  "Winter",
  "Childhood",
  "Family",
  "Friends",
  "College",
  "Travel",
  "Hope",
  "Loss",
  "Growth",
] as const;
export type MemoryTag = (typeof TAGS)[number];

export interface FirstMoment {
  kind: string;
  label: string;
  mediaId: string;
  when: string;
}
export const FIRSTS: FirstMoment[] = [
  { kind: "Movie", label: "First Movie", mediaId: "interstellar", when: "Nov 2014" },
  { kind: "Anime", label: "First Anime", mediaId: "one-piece", when: "Jul 2018" },
  { kind: "Book", label: "First Book", mediaId: "harry-potter", when: "Aug 2009" },
  { kind: "Game", label: "First Game", mediaId: "elden-ring", when: "Feb 2022" },
  { kind: "Podcast", label: "First Podcast", mediaId: "lex", when: "Mar 2021" },
  { kind: "Journal", label: "First Journal", mediaId: "interstellar", when: "Nov 2014" },
  { kind: "Collection", label: "First Collection", mediaId: "interstellar", when: "Jan 2024" },
];

export interface Milestone {
  id: string;
  label: string;
  reached: string;
  mediaId?: string;
}
export const MILESTONES: Milestone[] = [
  { id: "100m", label: "100 Movies", reached: "Mar 2025" },
  { id: "500e", label: "500 Episodes", reached: "Jan 2026" },
  { id: "1000h", label: "1000 Hours", reached: "Apr 2026" },
  { id: "50b", label: "50 Books", reached: "Dec 2025" },
  { id: "5star", label: "First 5-Star", reached: "Nov 2014", mediaId: "interstellar" },
  { id: "rewatch", label: "First Rewatch", reached: "Jan 2016", mediaId: "interstellar" },
  { id: "100j", label: "100 Journal Entries", reached: "Feb 2026" },
];

export interface Streak {
  kind: "Current" | "Longest" | "Weekly" | "Monthly" | "Yearly";
  value: string;
  caption: string;
}
export const STREAKS: Streak[] = [
  { kind: "Current", value: "47 days", caption: "One story a day, kept." },
  { kind: "Longest", value: "112 days", caption: "Winter '25, unbroken." },
  { kind: "Weekly", value: "9 weeks", caption: "Reading every week of 2026." },
  { kind: "Monthly", value: "14 months", caption: "A journal entry every month." },
  { kind: "Yearly", value: "4 years", caption: "Chronicling stories since 2022." },
];

export interface BookmarkedMemory {
  id: string;
  mediaId: string;
  note: string;
  savedAt: string;
}
export const MEMORY_BOOKMARKS: BookmarkedMemory[] = [
  {
    id: "b1",
    mediaId: "interstellar",
    note: "Return to before the next long trip.",
    savedAt: "May 12, 2026",
  },
  {
    id: "b2",
    mediaId: "one-piece",
    note: "Re-read this journal on a slow Sunday.",
    savedAt: "Apr 30, 2026",
  },
  {
    id: "b3",
    mediaId: "dark-side",
    note: "Save for the next quiet night.",
    savedAt: "Mar 18, 2026",
  },
];

export const INSIGHT_LINES = [
  "You usually finish books faster than games.",
  "Winter is your favorite season for movies.",
  "You revisit comfort stories every December.",
  "You rate stories watched with friends higher.",
  "Your longest streaks happen during travel.",
  "Late nights bring out your favorite quotes.",
];

/* ============================================================
 * Grouping selectors
 * ============================================================ */
export function groupByLifeChapter() {
  return LIFE_CHAPTERS;
}

export function groupBySeason(): Record<Season, Pair[]> {
  const out = { Spring: [], Summer: [], Autumn: [], Winter: [] } as Record<Season, Pair[]>;
  for (const p of all()) out[p.memory.season].push(p);
  return out;
}
export function groupByCompanion(): Record<Companion, Pair[]> {
  const out = {} as Record<Companion, Pair[]>;
  for (const p of all()) (out[p.memory.companion] ??= []).push(p);
  return out;
}
export function groupByMood(): Record<Mood, Pair[]> {
  const out = {} as Record<Mood, Pair[]>;
  for (const p of all()) (out[p.memory.mood] ??= []).push(p);
  return out;
}
export function getFavoriteYears() {
  const counts: Record<string, number> = {};
  for (const p of all()) {
    if (!p.memory.finishedAt) continue;
    const y = p.memory.finishedAt.slice(0, 4);
    counts[y] = (counts[y] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
}
export function getBiggestMonth() {
  const counts: Record<string, number> = {};
  for (const p of all()) {
    if (!p.memory.finishedAt) continue;
    const m = p.memory.finishedAt.slice(0, 7);
    counts[m] = (counts[m] ?? 0) + 1;
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? { month: top[0], count: top[1] } : null;
}
export function getMemoryDensity() {
  return all().length / Math.max(1, MEDIA.length);
}
export function getEmotionalPeaks() {
  return all()
    .filter(({ memory }) => ["Heartbreak", "Awe", "Triumph"].includes(memory.mood))
    .slice(0, 5);
}
export function getForgottenMemories() {
  return all().filter(({ memory }) => {
    if (!memory.finishedAt) return false;
    const d = Math.floor((TODAY.getTime() - new Date(memory.finishedAt).getTime()) / 86_400_000);
    return d > 700;
  });
}
export function getPersonalMilestones() {
  return MILESTONES;
}
