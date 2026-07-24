// Crosslinks — surface peer entities for any media item.
import type { MediaItem } from "@/lib/types";
import { GOALS_FULL } from "@/lib/goals";

export interface Crosslinks {
  collections: any[];
  journal: any[];
  goals: typeof GOALS_FULL;
  related: MediaItem[];
}

export function getCrosslinks(item: MediaItem): Crosslinks {
  return {
    collections: [],
    journal: [],
    goals: GOALS_FULL.filter((g) => g.coverIds?.includes(item.id)),
    related: [],
  };
}
