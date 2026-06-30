// Universal bookmark system — localStorage-backed, SSR-safe.
const KEY = "chronicle:bookmarks:v1";

export type BookmarkKind =
  | "media"
  | "collection"
  | "journal"
  | "goal"
  | "achievement"
  | "timeline"
  | "analytics"
  | "wrapped"
  | "search"
  | "profile"
  | "creator"
  | "franchise"
  | "character"
  | "quote";

export interface Bookmark {
  id: string;
  kind: BookmarkKind;
  refId: string;
  title: string;
  subtitle?: string;
  to?: string;
  createdAt: string;
  pinned?: boolean;
}

function read(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Bookmark[]) : [];
  } catch {
    return [];
  }
}
function write(list: Bookmark[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function listBookmarks(): Bookmark[] {
  return read();
}
export function isBookmarked(kind: BookmarkKind, refId: string) {
  return read().some((b) => b.kind === kind && b.refId === refId);
}

export function toggleBookmark(b: Omit<Bookmark, "id" | "createdAt">): boolean {
  const list = read();
  const idx = list.findIndex((x) => x.kind === b.kind && x.refId === b.refId);
  if (idx >= 0) {
    list.splice(idx, 1);
    write(list);
    return false;
  }
  list.unshift({ ...b, id: `bm_${Date.now().toString(36)}`, createdAt: new Date().toISOString() });
  write(list);
  return true;
}

export function pinBookmark(id: string) {
  const list = read().map((b) => (b.id === id ? { ...b, pinned: !b.pinned } : b));
  write(list);
}

export function searchBookmarks(term: string): Bookmark[] {
  const t = term.trim().toLowerCase();
  if (!t) return read();
  return read().filter(
    (b) => b.title.toLowerCase().includes(t) || (b.subtitle?.toLowerCase().includes(t) ?? false),
  );
}
