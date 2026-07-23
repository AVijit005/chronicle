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

export const ACHIEVEMENTS_FULL: any[] = [];

export const getAchievements = () => ACHIEVEMENTS_FULL;
export const rankAchievements = () =>
  [...ACHIEVEMENTS_FULL].sort(
    (a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime(),
  );
export const getMilestones = () => ACHIEVEMENTS_FULL.slice(0, 5);

export function getAchievementsByCategory(): Record<AchievementCategory, Achievement[]> {
  return {} as Record<AchievementCategory, Achievement[]>;
}

