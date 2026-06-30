// Relationship engine — unified selector across the entire data graph.
import { MEDIA, COLLECTIONS, JOURNAL, type MediaItem, type Collection } from "@/lib/mock";
import { GOALS_FULL, type Goal } from "@/lib/goals";
import { CHARACTERS, type Character } from "@/lib/characters";
import { allCreators, type Creator } from "@/lib/creatorEngine";
import { FRANCHISES, type Franchise } from "@/lib/franchiseEngine";
import { allQuotes, type Quote } from "@/lib/quoteEngine";

export type EntityKind =
  | "media"
  | "collection"
  | "journal"
  | "goal"
  | "achievement"
  | "creator"
  | "character"
  | "franchise"
  | "quote";

export interface RelatedEntities {
  media: MediaItem[];
  collections: Collection[];
  journal: typeof JOURNAL;
  goals: Goal[];
  creators: Creator[];
  characters: Character[];
  franchises: Franchise[];
  quotes: Quote[];
}

function empty(): RelatedEntities {
  return {
    media: [],
    collections: [],
    journal: [],
    goals: [],
    creators: [],
    characters: [],
    franchises: [],
    quotes: [],
  };
}

export function getRelated(kind: EntityKind, id: string): RelatedEntities {
  const r = empty();
  if (kind === "media") {
    const m = MEDIA.find((x) => x.id === id);
    if (!m) return r;
    r.media = MEDIA.filter(
      (x) => x.id !== id && (x.creator === m.creator || x.genres.some((g) => m.genres.includes(g))),
    ).slice(0, 6);
    r.collections = COLLECTIONS.filter((c) => c.mediaIds?.includes(id));
    r.journal = JOURNAL.filter((j) => j.media.toLowerCase().includes(m.title.toLowerCase()));
    r.goals = GOALS_FULL.filter((g) => g.coverIds.includes(id));
    r.characters = CHARACTERS.filter((c) => c.mediaId === id);
    r.creators = allCreators().filter((c) => c.name === m.creator);
    r.franchises = FRANCHISES.filter((f) => f.mediaIds.includes(id));
    r.quotes = allQuotes()
      .filter((q) => q.source === "media" && q.refId === id)
      .slice(0, 4);
  } else if (kind === "collection") {
    const c = COLLECTIONS.find((x) => x.id === id);
    if (!c) return r;
    r.media = MEDIA.filter((m) => c.mediaIds?.includes(m.id));
    r.collections = COLLECTIONS.filter((x) => x.id !== id && x.category === c.category).slice(0, 4);
    r.creators = allCreators().filter((cr) => r.media.some((m) => m.creator === cr.name));
    r.journal = JOURNAL.filter((j) =>
      r.media.some((m) => j.media.toLowerCase().includes(m.title.toLowerCase())),
    );
  } else if (kind === "creator") {
    r.media = MEDIA.filter(
      (m) =>
        m.creator &&
        m.creator
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") === id,
    );
    r.collections = COLLECTIONS.filter((c) =>
      c.mediaIds?.some((mid) => r.media.some((m) => m.id === mid)),
    );
    r.characters = CHARACTERS.filter((ch) => r.media.some((m) => m.id === ch.mediaId));
    r.franchises = FRANCHISES.filter((f) =>
      f.mediaIds.some((mid) => r.media.some((m) => m.id === mid)),
    );
  } else if (kind === "character") {
    const ch = CHARACTERS.find((c) => c.id === id);
    if (!ch) return r;
    const m = MEDIA.find((x) => x.id === ch.mediaId);
    if (m) {
      r.media = [m];
      r.collections = COLLECTIONS.filter((c) => c.mediaIds?.includes(m.id));
      r.creators = allCreators().filter((c) => c.name === m.creator);
    }
    r.characters = CHARACTERS.filter((c) => c.id !== id && c.mediaId === ch.mediaId);
    r.quotes = allQuotes().filter((q) => q.source === "character" && q.refId === id);
  } else if (kind === "franchise") {
    const f = FRANCHISES.find((x) => x.id === id);
    if (!f) return r;
    r.media = MEDIA.filter((m) => f.mediaIds.includes(m.id));
    r.collections = COLLECTIONS.filter((c) => c.mediaIds?.some((mid) => f.mediaIds.includes(mid)));
    r.creators = allCreators().filter((cr) => r.media.some((m) => m.creator === cr.name));
    r.characters = CHARACTERS.filter((ch) => f.mediaIds.includes(ch.mediaId));
  } else if (kind === "journal") {
    const j = JOURNAL.find((x) => x.id === id);
    if (!j) return r;
    r.media = MEDIA.filter((m) => j.media.toLowerCase().includes(m.title.toLowerCase()));
  } else if (kind === "goal") {
    const g = GOALS_FULL.find((x) => x.id === id);
    if (!g) return r;
    r.media = MEDIA.filter((m) => g.coverIds.includes(m.id));
  }
  return r;
}
