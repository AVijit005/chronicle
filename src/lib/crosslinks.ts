// Crosslinks — surface peer entities for any media item.
import { COLLECTIONS, JOURNAL, MEDIA, type MediaItem } from "@/lib/mock";
import { GOALS_FULL } from "@/lib/goals";

export interface Crosslinks {
  collections: typeof COLLECTIONS;
  journal: typeof JOURNAL;
  goals: typeof GOALS_FULL;
  related: MediaItem[];
}

export function getCrosslinks(item: MediaItem): Crosslinks {
  return {
    collections: COLLECTIONS.filter((c) => c.mediaIds?.includes(item.id)),
    journal: JOURNAL.filter((j) => j.media.toLowerCase().includes(item.title.toLowerCase())),
    goals: GOALS_FULL.filter((g) => g.coverIds.includes(item.id)),
    related: MEDIA.filter((m) => m.id !== item.id && m.creator === item.creator).slice(0, 4),
  };
}
