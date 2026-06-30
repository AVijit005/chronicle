// Universal tag index — deterministic, derived from existing data.
import { MEDIA, COLLECTIONS, JOURNAL } from "@/lib/mock";

export type TaggableKind = "media" | "collection" | "journal";
export interface TaggedRef {
  kind: TaggableKind;
  id: string;
  title: string;
}
export interface TagBucket {
  tag: string;
  count: number;
  refs: TaggedRef[];
}

const SEED_TAGS = [
  "comfort",
  "cyberpunk",
  "nostalgia",
  "space",
  "philosophy",
  "romance",
  "winter",
  "late-night",
  "masterpiece",
  "favorite",
  "journaled",
  "completed",
  "planning",
  "summer",
  "soundtrack",
  "epic",
];

function hash(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return h >>> 0;
}

function tagsFor(seed: string, k = 3): string[] {
  const h = hash(seed);
  const out: string[] = [];
  for (let i = 0; i < k; i++) out.push(SEED_TAGS[(h + i * 7) % SEED_TAGS.length]!);
  return [...new Set(out)];
}

export function tagsForMedia(id: string) {
  return tagsFor("m:" + id);
}
export function tagsForCollection(id: string) {
  return tagsFor("c:" + id, 4);
}
export function tagsForJournal(id: string) {
  return tagsFor("j:" + id, 2);
}

let _index: Map<string, TagBucket> | null = null;
export function tagIndex(): TagBucket[] {
  if (_index) return [..._index.values()].sort((a, b) => b.count - a.count);
  const map = new Map<string, TagBucket>();
  const add = (tag: string, ref: TaggedRef) => {
    const b = map.get(tag) ?? { tag, count: 0, refs: [] as TaggedRef[] };
    b.count += 1;
    b.refs.push(ref);
    map.set(tag, b);
  };
  for (const m of MEDIA)
    for (const t of tagsForMedia(m.id)) add(t, { kind: "media", id: m.id, title: m.title });
  for (const c of COLLECTIONS)
    for (const t of tagsForCollection(c.id))
      add(t, { kind: "collection", id: c.id, title: c.name });
  for (const j of JOURNAL)
    for (const t of tagsForJournal(j.id)) add(t, { kind: "journal", id: j.id, title: j.title });
  _index = map;
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function bucketForTag(tag: string): TagBucket | undefined {
  return tagIndex().find((b) => b.tag === tag);
}
