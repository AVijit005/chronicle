// Universal Search Index — deterministic, SSR-safe aggregator.
import { MEDIA, COLLECTIONS, JOURNAL, ACHIEVEMENTS, SEARCHABLE_SETTINGS } from "@/lib/mock";
import { GOALS_FULL } from "@/lib/goals";
import { allCreators } from "@/lib/creatorEngine";
import { FRANCHISES } from "@/lib/franchiseEngine";
import { CHARACTERS } from "@/lib/characters";
import { allQuotes } from "@/lib/quoteEngine";
import { tagIndex } from "@/lib/tagEngine";

export type SearchEntityKind =
  | "media"
  | "collection"
  | "journal"
  | "goal"
  | "achievement"
  | "setting"
  | "route"
  | "smart"
  | "favorite"
  | "creator"
  | "franchise"
  | "character"
  | "quote"
  | "tag";

export interface SearchEntity {
  kind: SearchEntityKind;
  id: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  to?: string;
  params?: Record<string, string>;
}

const ROUTES: SearchEntity[] = [
  { kind: "route", id: "r-home", title: "Home", to: "/app" },
  { kind: "route", id: "r-lib", title: "Library", to: "/app/library" },
  { kind: "route", id: "r-col", title: "Collections", to: "/app/collections" },
  { kind: "route", id: "r-jrn", title: "Journal", to: "/app/journal" },
  { kind: "route", id: "r-tml", title: "Timeline", to: "/app/timeline" },
  { kind: "route", id: "r-ana", title: "Analytics", to: "/app/analytics" },
  { kind: "route", id: "r-wrp", title: "Wrapped", to: "/app/wrapped" },
  { kind: "route", id: "r-cal", title: "Calendar", to: "/app/calendar" },
  { kind: "route", id: "r-gls", title: "Goals", to: "/app/goals" },
  { kind: "route", id: "r-ach", title: "Achievements", to: "/app/achievements" },
  { kind: "route", id: "r-set", title: "Settings", to: "/app/settings" },
  { kind: "route", id: "r-prf", title: "Profile", to: "/app/profile" },
  { kind: "route", id: "r-mus", title: "Museum", to: "/app/museum" },
  { kind: "route", id: "r-cre", title: "Creators", to: "/app/creators" },
  { kind: "route", id: "r-fra", title: "Franchises", to: "/app/franchises" },
  { kind: "route", id: "r-cha", title: "Characters", to: "/app/characters" },
  { kind: "route", id: "r-qte", title: "Quotes", to: "/app/quotes" },
  { kind: "route", id: "r-bkm", title: "Bookmarks", to: "/app/bookmarks" },
  { kind: "route", id: "r-sfl", title: "Save for later", to: "/app/save-for-later" },
];

let _index: SearchEntity[] | null = null;
export function buildSearchIndex(): SearchEntity[] {
  if (_index) return _index;
  const list: SearchEntity[] = [];
  for (const m of MEDIA) {
    list.push({
      kind: "media",
      id: m.id,
      title: m.title,
      subtitle: `${m.creator ?? ""} · ${m.year} · ${m.kind}`,
      tags: [...m.genres, m.kind, m.creator ?? "", m.status, String(m.year)],
      to: "/app/media/$id",
      params: { id: m.id },
    });
  }
  for (const c of COLLECTIONS) {
    list.push({
      kind: "collection",
      id: c.id,
      title: c.name,
      subtitle: c.description,
      tags: [c.category ?? "", c.creator ?? ""],
      to: "/app/collections/$id",
      params: { id: c.id },
    });
  }
  for (const j of JOURNAL) {
    list.push({
      kind: "journal",
      id: j.id,
      title: j.title,
      subtitle: `${j.date} · ${j.media}`,
      tags: [j.mood, j.media],
      to: "/app/journal",
    });
  }
  for (const g of GOALS_FULL) {
    list.push({
      kind: "goal",
      id: g.id,
      title: g.title,
      subtitle: `${g.current}/${g.target}`,
      tags: [g.kind, g.status],
      to: "/app/goals",
    });
  }
  for (const a of ACHIEVEMENTS) {
    list.push({
      kind: "achievement",
      id: a.id,
      title: a.name,
      subtitle: `${a.tier} · ${a.earned}`,
      tags: [a.tier],
      to: "/app/achievements",
    });
  }
  for (const s of SEARCHABLE_SETTINGS) {
    list.push({ kind: "setting", id: s.label, title: s.label, subtitle: s.hint, to: s.to });
  }
  for (const c of allCreators()) {
    list.push({
      kind: "creator",
      id: c.id,
      title: c.name,
      subtitle: "Creator",
      to: "/app/creators/$id",
      params: { id: c.id },
    });
  }
  for (const f of FRANCHISES) {
    list.push({
      kind: "franchise",
      id: f.id,
      title: f.name,
      subtitle: "Franchise",
      to: "/app/franchises/$id",
      params: { id: f.id },
    });
  }
  for (const ch of CHARACTERS) {
    list.push({
      kind: "character",
      id: ch.id,
      title: ch.name,
      subtitle: `${ch.role} · Character`,
      to: "/app/characters/$id",
      params: { id: ch.id },
    });
  }
  for (const q of allQuotes().slice(0, 40)) {
    list.push({
      kind: "quote",
      id: q.id,
      title: q.text.slice(0, 80),
      subtitle: `Quote · ${q.refTitle}`,
      to: "/app/quotes",
    });
  }
  for (const t of tagIndex().slice(0, 30)) {
    list.push({
      kind: "tag",
      id: t.tag,
      title: `#${t.tag}`,
      subtitle: `${t.count} references`,
      to: "/app/tags/$tag",
      params: { tag: t.tag },
    });
  }
  list.push(...ROUTES);
  _index = list;
  return list;
}

export function searchEntities(term: string, limit = 12): SearchEntity[] {
  const t = term.trim().toLowerCase();
  if (!t) return [];
  const idx = buildSearchIndex();
  return idx
    .filter(
      (e) =>
        e.title.toLowerCase().includes(t) ||
        (e.subtitle?.toLowerCase().includes(t) ?? false) ||
        (e.tags?.some((tag) => tag.toLowerCase().includes(t)) ?? false),
    )
    .slice(0, limit);
}
