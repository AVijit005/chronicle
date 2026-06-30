// Collection Insights — editorial highlights.
import { type Collection } from "@/lib/mock";
import { MEMORIES_BY_MEDIA } from "@/lib/memory";
import { getCollectionItems } from "@/lib/collectionEngine";

export interface InsightCard {
  label: string;
  title: string;
  subtitle?: string;
  mediaId?: string;
}

export function getCollectionInsights(c: Collection): InsightCard[] {
  const items = getCollectionItems(c);
  if (!items.length) return [];
  const byRating = [...items].sort((a, b) => b.rating - a.rating);
  const oldest = items[items.length - 1]!;
  const newest = items[0]!;
  const mostJournaled = items
    .map((m) => ({ m, j: MEMORIES_BY_MEDIA[m.id]?.journalEntries ?? 0 }))
    .sort((a, b) => b.j - a.j)[0]!;
  const mostRevisited = items
    .map((m) => ({ m, r: MEMORIES_BY_MEDIA[m.id]?.revisits ?? 0 }))
    .sort((a, b) => b.r - a.r)[0]!;

  return [
    {
      label: "Most emotional",
      title: byRating[0]!.title,
      mediaId: byRating[0]!.id,
      subtitle: "Highest personal rating.",
    },
    {
      label: "Hidden masterpiece",
      title: byRating[Math.min(1, byRating.length - 1)]!.title,
      subtitle: "Underrated by the world.",
    },
    {
      label: "Most replayed",
      title: mostRevisited.m.title,
      mediaId: mostRevisited.m.id,
      subtitle: `${mostRevisited.r} revisits.`,
    },
    {
      label: "Most journaled",
      title: mostJournaled.m.title,
      mediaId: mostJournaled.m.id,
      subtitle: `${mostJournaled.j} entries.`,
    },
    { label: "Newest addition", title: newest.title, mediaId: newest.id },
    { label: "Oldest in collection", title: oldest.title, mediaId: oldest.id },
    { label: "Highest rated", title: byRating[0]!.title, mediaId: byRating[0]!.id },
    {
      label: "Most recommended",
      title: byRating[0]!.title,
      mediaId: byRating[0]!.id,
      subtitle: "Worth sharing.",
    },
  ];
}
