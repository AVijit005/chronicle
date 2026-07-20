// Reactive selectors over libraryStore — real numbers, not mock seeds.
import { useMemo } from "react";
import type { MediaItem } from "@/lib/types";
import { useLibraryStore } from "@/lib/store/libraryStore";
import type { StoredMeta } from "@/lib/store/libraryStore";

function allItemsFrom(custom: MediaItem[]): MediaItem[] {
  return [...custom];
}

export interface ReflectionRow {
  id: string;
  item: MediaItem;
  mood?: string;
  reflection: string;
  rating?: number;
  completedAt?: string;
  favorite?: boolean;
}

export function useUserReflections(): ReflectionRow[] {
  const meta = useLibraryStore((s) => s.meta);
  const custom = useLibraryStore((s) => s.customItems);
  return useMemo(() => {
    const items = allItemsFrom(custom);
    const out: ReflectionRow[] = [];
    for (const m of items) {
      const md = meta[m.id];
      if (md?.reflection && md.reflection.trim().length > 0) {
        out.push({
          id: m.id,
          item: m,
          mood: md.mood,
          reflection: md.reflection,
          rating: md.rating,
          completedAt: md.completedAt,
          favorite: md.favorite,
        });
      }
    }
    return out;
  }, [meta, custom]);
}

export function useUserQuotes() {
  return useLibraryStore((s) => s.userQuotes);
}

export interface LiveStats {
  total: number;
  completed: number;
  inProgress: number;
  planning: number;
  paused: number;
  rewatching: number;
  favorites: number;
  reflections: number;
  userQuotes: number;
  avgRating: number; // 0-5, only items the user rated
  ratedCount: number;
  topMood?: string;
  byKind: Record<string, number>;
}

export function useLiveStats(): LiveStats {
  const meta = useLibraryStore((s) => s.meta);
  const custom = useLibraryStore((s) => s.customItems);
  const userQuotes = useLibraryStore((s) => s.userQuotes);
  return useMemo(() => {
    const items = allItemsFrom(custom);
    const stats: LiveStats = {
      total: items.length,
      completed: 0,
      inProgress: 0,
      planning: 0,
      paused: 0,
      rewatching: 0,
      favorites: 0,
      reflections: 0,
      userQuotes: userQuotes.length,
      avgRating: 0,
      ratedCount: 0,
      topMood: undefined,
      byKind: {},
    };
    const moods: Record<string, number> = {};
    let ratingSum = 0;
    for (const m of items) {
      const md: StoredMeta | undefined = meta[m.id];
      stats.byKind[m.kind] = (stats.byKind[m.kind] ?? 0) + 1;
      if (!md) continue;
      if (md.favorite) stats.favorites++;
      if (md.reflection?.trim()) stats.reflections++;
      if (md.mood) moods[md.mood] = (moods[md.mood] ?? 0) + 1;
      if (typeof md.rating === "number" && md.rating > 0) {
        ratingSum += md.rating;
        stats.ratedCount++;
      }
      switch (md.status) {
        case "completed":
          stats.completed++;
          break;
        case "in_progress":
          stats.inProgress++;
          break;
        case "planning":
          stats.planning++;
          break;
        case "paused":
          stats.paused++;
          break;
        case "rewatching":
          stats.rewatching++;
          break;
      }
    }
    stats.avgRating =
      stats.ratedCount > 0 ? Math.round((ratingSum / stats.ratedCount) * 10) / 10 : 0;
    const topMoodEntry = Object.entries(moods).sort((a, b) => b[1] - a[1])[0];
    if (topMoodEntry) stats.topMood = topMoodEntry[0];
    return stats;
  }, [meta, custom, userQuotes]);
}
