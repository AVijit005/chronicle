// Collection Engine — deterministic intelligence over existing COLLECTIONS.
import { MEDIA, COLLECTIONS, type Collection, type MediaItem } from "@/lib/mock";
import { MEMORIES_BY_MEDIA } from "@/lib/memory";
import { mulberry } from "@/lib/seed";

function hash(id: string) {
  let h = 0xcafebabe >>> 0;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface CollectionIntelligence {
  score: number; // 0..100
  completionPct: number;
  growthRate: string;
  favoriteCategory: string;
  mostEmotionalId: string | null;
  newestId: string | null;
  oldestId: string | null;
  averageRating: number;
  averageTimeInvested: string;
  journalDensity: number;
  memoryDensity: number;
  moodDistribution: { mood: string; count: number }[];
  activityTrend: string;
  completionTrend: string;
  rewatchRate: number;
}

export function getCollectionItems(c: Collection): MediaItem[] {
  return (c.mediaIds ?? []).map((id) => MEDIA.find((m) => m.id === id)!).filter(Boolean);
}

export function getCollectionIntelligence(c: Collection): CollectionIntelligence {
  const items = getCollectionItems(c);
  const rng = mulberry(hash(c.id));
  const moods = new Map<string, number>();
  let memCount = 0,
    journalCount = 0,
    revisits = 0,
    ratingSum = 0;
  for (const m of items) {
    const mem = MEMORIES_BY_MEDIA[m.id];
    if (mem) {
      memCount++;
      moods.set(mem.mood, (moods.get(mem.mood) ?? 0) + 1);
      journalCount += mem.journalEntries;
      revisits += mem.revisits;
    }
    ratingSum += m.rating;
  }
  const avg = items.length ? ratingSum / items.length : 0;
  return {
    score: Math.min(100, c.completion ?? Math.round(60 + rng() * 30)),
    completionPct: c.completion ?? 0,
    growthRate: `+${Math.floor(rng() * 4) + 1} this month`,
    favoriteCategory: c.category ?? items[0]?.genres[0] ?? "Story",
    mostEmotionalId: items.sort((a, b) => b.rating - a.rating)[0]?.id ?? null,
    newestId: items[0]?.id ?? null,
    oldestId: items[items.length - 1]?.id ?? null,
    averageRating: Math.round(avg * 10) / 10,
    averageTimeInvested: "12h per item",
    journalDensity: items.length ? journalCount / items.length : 0,
    memoryDensity: items.length ? memCount / items.length : 0,
    moodDistribution: [...moods.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([mood, count]) => ({ mood, count })),
    activityTrend: rng() > 0.5 ? "Growing slowly" : "Stable",
    completionTrend: c.completion && c.completion > 75 ? "Almost finished" : "In progress",
    rewatchRate: items.length ? revisits / items.length : 0,
  };
}

export { COLLECTIONS };
