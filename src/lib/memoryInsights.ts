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

export const LIFE_CHAPTERS: LifeChapter[] = [];

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
export const CAPSULES: Capsule[] = [];

/* ============================================================
 * Highlights, tags, firsts, milestones, streaks, bookmarks, insights
 * ============================================================ */
export interface MemoryHighlight {
  id: string;
  label: string;
  caption: string;
  mediaId: string;
}
export const HIGHLIGHTS: MemoryHighlight[] = [];

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
export const FIRSTS: FirstMoment[] = [];

export interface Milestone {
  id: string;
  label: string;
  reached: string;
  mediaId?: string;
}
export const MILESTONES: Milestone[] = [];

export interface Streak {
  kind: "Current" | "Longest" | "Weekly" | "Monthly" | "Yearly";
  value: string;
  caption: string;
}
export const STREAKS: Streak[] = [];

export interface BookmarkedMemory {
  id: string;
  mediaId: string;
  note: string;
  savedAt: string;
}
export const MEMORY_BOOKMARKS: BookmarkedMemory[] = [];

export const INSIGHT_LINES: string[] = [];

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
    const d = Math.floor((TODAY().getTime() - new Date(memory.finishedAt).getTime()) / 86_400_000);
    return d > 700;
  });
}
export function getPersonalMilestones() {
  return MILESTONES;
}
