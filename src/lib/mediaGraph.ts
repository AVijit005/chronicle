// Media Graph — pure relationship builders over live library data.
import type { MediaItem } from "@/lib/types";
import { GOALS_FULL } from "@/lib/goals";
import { ACHIEVEMENTS_FULL } from "@/lib/achievements";

export function getSharedCreator(_id: string, _items: MediaItem[]): MediaItem[] {
  return [];
}

export function getSharedUniverse(_id: string, _items: MediaItem[]): MediaItem[] {
  return [];
}

export function getSharedMood(_id: string, _items: MediaItem[]): MediaItem[] {
  return [];
}

export function getSharedJourney(_id: string, _items: MediaItem[]): MediaItem[] {
  return [];
}

export function getRelatedGoals(_id: string) {
  return GOALS_FULL.filter((g) => g.coverIds?.includes(_id));
}

export function getRelatedAchievements(_id: string) {
  return ACHIEVEMENTS_FULL.filter((a) => a.mediaIds?.includes(_id));
}

export interface GraphSummary {
  id: string;
  sharedCreator: number;
  sharedUniverse: number;
  sharedMood: number;
  goals: number;
  achievements: number;
}

export function getGraphSummary(_id: string, _items: MediaItem[]): GraphSummary {
  return { id: _id, sharedCreator: 0, sharedUniverse: 0, sharedMood: 0, goals: 0, achievements: 0 };
}

export function getAllSummaries(_items: MediaItem[]): GraphSummary[] {
  return [];
}

export function getRelatedStories(_id: string, _items: MediaItem[]): MediaItem[] {
  return [];
}
