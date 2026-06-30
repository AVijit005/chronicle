// Achievements — memories, not trophies.
import type { Mood, Season } from "@/lib/memory";

export type AchievementCategory =
  | "Explorer"
  | "Collector"
  | "Writer"
  | "Thinker"
  | "Reader"
  | "Listener"
  | "Viewer"
  | "Gamer"
  | "Completionist"
  | "Curator"
  | "Historian"
  | "Traveler";

export interface Achievement {
  id: string;
  name: string;
  caption: string;
  category: AchievementCategory;
  earnedAt: string;
  mediaId?: string;
  favoriteMemory?: string;
  journalExcerpt?: string;
  mood?: Mood;
  season?: Season;
  icon?: string;
}

export const ACHIEVEMENTS_FULL: Achievement[] = [
  {
    id: "first-movie",
    name: "First Movie",
    caption: "The story that started it all.",
    category: "Viewer",
    earnedAt: "Nov 2014",
    mediaId: "interstellar",
    favoriteMemory: "Watched at the cinema, alone.",
    journalExcerpt: "Sitting in the dark, not wanting to move.",
    mood: "Awe",
    season: "Autumn",
  },
  {
    id: "100-movies",
    name: "100 Movies",
    caption: "A century of evenings.",
    category: "Completionist",
    earnedAt: "Mar 2025",
    favoriteMemory: "Mostly Fridays.",
    mood: "Joy",
  },
  {
    id: "1000-eps",
    name: "1000 Episodes",
    caption: "A year of series, lived together.",
    category: "Viewer",
    earnedAt: "Jan 2026",
    mediaId: "one-piece",
    mood: "Comfort",
  },
  {
    id: "journal-365",
    name: "365 Day Journal",
    caption: "A full year of remembered things.",
    category: "Writer",
    earnedAt: "Feb 2026",
    journalExcerpt: "Memory becomes story when written.",
    mood: "Tender",
  },
  {
    id: "ghibli-complete",
    name: "Every Ghibli",
    caption: "Hand-drawn worlds, all of them.",
    category: "Curator",
    earnedAt: "Dec 2025",
    mood: "Wonder",
    season: "Winter",
  },
  {
    id: "first-classic",
    name: "First Classic",
    caption: "Started reading the long ones.",
    category: "Reader",
    earnedAt: "Aug 2024",
    mood: "Curious",
  },
  {
    id: "longest-series",
    name: "Finished Longest Series",
    caption: "Years of weekends.",
    category: "Completionist",
    earnedAt: "Mar 2026",
    mediaId: "one-piece",
    mood: "Triumph",
  },
  {
    id: "first-rewatch",
    name: "First Rewatch",
    caption: "Came back, found something new.",
    category: "Viewer",
    earnedAt: "Jan 2016",
    mediaId: "interstellar",
    mood: "Tender",
  },
  {
    id: "memory-writer",
    name: "Memory Writer",
    caption: "Wrote about every story you finished.",
    category: "Writer",
    earnedAt: "Apr 2026",
    mood: "Tender",
  },
  {
    id: "night-owl",
    name: "Night Owl",
    caption: "Most of your stories happen after midnight.",
    category: "Viewer",
    earnedAt: "Oct 2025",
    mood: "Wonder",
  },
  {
    id: "weekend-reader",
    name: "Weekend Reader",
    caption: "Saturdays belong to books.",
    category: "Reader",
    earnedAt: "May 2025",
    mood: "Comfort",
  },
  {
    id: "story-keeper",
    name: "Story Keeper",
    caption: "A library that remembers itself.",
    category: "Curator",
    earnedAt: "Jun 2026",
    mood: "Joy",
  },
];

export const getAchievements = () => ACHIEVEMENTS_FULL;
export const rankAchievements = () =>
  [...ACHIEVEMENTS_FULL].sort(
    (a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime(),
  );
export const getMilestones = () => ACHIEVEMENTS_FULL.slice(0, 5);

export function getAchievementsByCategory(): Record<AchievementCategory, Achievement[]> {
  const out = {} as Record<AchievementCategory, Achievement[]>;
  for (const a of ACHIEVEMENTS_FULL) (out[a.category] ??= []).push(a);
  return out;
}
