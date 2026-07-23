// Media Graph — pure relationship builders.
import { MEDIA, type MediaItem } from "@/lib/types";
import { MEMORIES_BY_MEDIA, type MediaMemory } from "@/lib/memory";
import { MEMORY_EXTENSIONS } from "@/lib/memoryJournal";
import { GOALS_FULL } from "@/lib/goals";
import { ACHIEVEMENTS_FULL } from "@/lib/achievements";
const COLLECTIONS: any[] = [];
const ACHIEVEMENTS: any[] = [];



const get = (id: string): MediaItem | null => MEDIA.find((m) => m.id === id) ?? null;

export function getSharedCreator(id: string): MediaItem[] {
  const a = get(id);
  if (!a?.creator) return [];
  return MEDIA.filter((m) => m.id !== id && m.creator === a.creator);
}
export function getSharedUniverse(id: string): MediaItem[] {
  // Approximate: same creator OR shared genre + same kind.
  const a = get(id);
  if (!a) return [];
  return MEDIA.filter(
    (m) =>
      m.id !== id &&
      (m.creator === a.creator ||
        (m.kind === a.kind && m.genres.some((g) => a.genres.includes(g)))),
  ).slice(0, 6);
}
export function getSharedMood(id: string): MediaItem[] {
  const mem = MEMORIES_BY_MEDIA[id];
  if (!mem) return [];
  return Object.entries(MEMORIES_BY_MEDIA)
    .filter(([oid, m]) => oid !== id && m && m.mood === mem.mood)
    .map(([oid]) => get(oid)!)
    .filter(Boolean)
    .slice(0, 6);
}
export function getSharedMemory(id: string): MediaItem[] {
  const mem = MEMORIES_BY_MEDIA[id];
  if (!mem) return [];
  return Object.entries(MEMORIES_BY_MEDIA)
    .filter(([oid, m]) => oid !== id && !!m && m.location === mem.location)
    .map(([oid]) => get(oid)!)
    .filter(Boolean)
    .slice(0, 6);
}
export function getSharedCompanion(id: string): MediaItem[] {
  const mem = MEMORIES_BY_MEDIA[id];
  if (!mem) return [];
  return Object.entries(MEMORIES_BY_MEDIA)
    .filter(([oid, m]) => oid !== id && m && m.companion === mem.companion)
    .map(([oid]) => get(oid)!)
    .filter(Boolean)
    .slice(0, 6);
}
export function getSharedCollection(id: string) {
  return COLLECTIONS.filter((c) => c.mediaIds?.includes(id));
}
export function getSharedSeason(id: string) {
  const mem = MEMORIES_BY_MEDIA[id];
  if (!mem) return [];
  return Object.entries(MEMORIES_BY_MEDIA)
    .filter(([oid, m]) => oid !== id && m && m.season === mem.season)
    .map(([oid]) => get(oid)!)
    .filter(Boolean)
    .slice(0, 6);
}
export function getSharedJournal(id: string) {
  const ext = MEMORY_EXTENSIONS[id];
  if (!ext?.journal) return [];
  return Object.entries(MEMORY_EXTENSIONS)
    .filter(([oid, e]) => oid !== id && e?.journal && e.journal.mood === ext.journal!.mood)
    .map(([oid]) => get(oid)!)
    .filter(Boolean)
    .slice(0, 6);
}
export function getSharedGoal(id: string) {
  return GOALS_FULL.filter((g) => g.coverIds.includes(id));
}
export function getSharedAchievement(id: string) {
  return ACHIEVEMENTS_FULL.filter((a) => a.mediaId === id);
}

export interface GraphSummary {
  creator: MediaItem[];
  universe: MediaItem[];
  mood: MediaItem[];
  memory: MediaItem[];
  companion: MediaItem[];
  season: MediaItem[];
  collections: ReturnType<typeof getSharedCollection>;
  goals: ReturnType<typeof getSharedGoal>;
  achievements: ReturnType<typeof getSharedAchievement>;
}

export function getRelatedStories(id: string) {
  return getSharedUniverse(id);
}

export function getGraphSummary(id: string): GraphSummary {
  return {
    creator: getSharedCreator(id),
    universe: getSharedUniverse(id),
    mood: getSharedMood(id),
    memory: getSharedMemory(id),
    companion: getSharedCompanion(id),
    season: getSharedSeason(id),
    collections: getSharedCollection(id),
    goals: getSharedGoal(id),
    achievements: getSharedAchievement(id),
  };
}

export function buildMediaGraph() {
  return MEDIA.map((m) => ({ id: m.id, summary: getGraphSummary(m.id) }));
}
