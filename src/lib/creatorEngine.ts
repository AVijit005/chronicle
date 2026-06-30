// Creator engine — derives per-creator works, collections, journal mentions, stats.
import { MEDIA, COLLECTIONS, JOURNAL, type MediaItem, type Collection } from "@/lib/mock";

export interface Creator {
  id: string;
  name: string;
  bio: string;
  accent: string;
}

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

let _creators: Creator[] | null = null;
export function allCreators(): Creator[] {
  if (_creators) return _creators;
  const seen = new Map<string, Creator>();
  for (const m of MEDIA) {
    if (!m.creator) continue;
    const id = slug(m.creator);
    if (seen.has(id)) continue;
    seen.set(id, {
      id,
      name: m.creator,
      bio: `${m.creator} — known for ${m.title} and other works in your library.`,
      accent: m.accent ?? "oklch(0.72 0.18 255)",
    });
  }
  _creators = [...seen.values()];
  return _creators;
}

export function getCreator(id: string): Creator | undefined {
  return allCreators().find((c) => c.id === id);
}

export interface CreatorProfile {
  creator: Creator;
  works: MediaItem[];
  completed: MediaItem[];
  owned: MediaItem[];
  collections: Collection[];
  journalMentions: typeof JOURNAL;
  stats: { works: number; completed: number; avgRating: number; totalHours: number };
}

export function buildCreatorProfile(id: string): CreatorProfile | undefined {
  const creator = getCreator(id);
  if (!creator) return undefined;
  const works = MEDIA.filter((m) => m.creator && slug(m.creator) === id);
  const completed = works.filter((m) => m.status === "completed");
  const collections = COLLECTIONS.filter((c) =>
    c.mediaIds?.some((mid) => works.some((w) => w.id === mid)),
  );
  const journalMentions = JOURNAL.filter((j) =>
    works.some((w) => j.media.toLowerCase().includes(w.title.toLowerCase())),
  );
  const avgRating = works.length
    ? Math.round((works.reduce((s, w) => s + w.rating, 0) / works.length) * 10) / 10
    : 0;
  return {
    creator,
    works,
    completed,
    owned: works,
    collections,
    journalMentions,
    stats: {
      works: works.length,
      completed: completed.length,
      avgRating,
      totalHours: works.length * 14,
    },
  };
}
