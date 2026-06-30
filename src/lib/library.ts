// Library status taxonomy + selectors derived from MEDIA mock + live store.
import { MEDIA, type MediaItem, type MediaKind } from "@/lib/mock";
import { useLibraryStore } from "@/lib/store/libraryStore";

export type MediaStatus =
  | "in_progress"
  | "completed"
  | "planning"
  | "paused"
  | "dropped"
  | "rewatching"
  | "archived";

export interface LibraryMeta {
  status: MediaStatus;
  favorite?: boolean;
  completedAt?: string;
  lastActivityAt?: string;
  timesWatched?: number;
  priority?: "high" | "med" | "low";
  reasonSaved?: string;
  droppedAtLabel?: string;
  addedAt?: string;
  journalExcerpt?: string;
}

// Per-id overrides. Anything missing gets defaults from `deriveStatus`.
const META: Record<string, Partial<LibraryMeta>> = {
  interstellar: {
    status: "completed",
    favorite: true,
    completedAt: "Yesterday",
    timesWatched: 6,
    journalExcerpt: "The docking scene still wrecks me — six viewings in.",
  },
  "one-piece": { status: "in_progress", favorite: true, lastActivityAt: "2h ago", timesWatched: 1 },
  cyberpunk: { status: "paused", lastActivityAt: "19 days ago", droppedAtLabel: "Paused at 42%" },
  dune: {
    status: "completed",
    favorite: true,
    completedAt: "6 weeks ago",
    timesWatched: 2,
    journalExcerpt: "The chants. The dunes. The silence after.",
  },
  "harry-potter": { status: "in_progress", lastActivityAt: "3 days ago" },
  succession: { status: "completed", completedAt: "Last week", timesWatched: 1 },
  "chainsaw-man": {
    status: "dropped",
    droppedAtLabel: "Dropped at ch 58",
    lastActivityAt: "2 months ago",
  },
  "elden-ring": {
    status: "rewatching",
    favorite: true,
    timesWatched: 3,
    lastActivityAt: "Yesterday",
    journalExcerpt: "Beat Malenia after 41 tries. Felt nothing for an hour, then everything.",
  },
  "dark-side": {
    status: "completed",
    favorite: true,
    completedAt: "1 month ago",
    timesWatched: 22,
  },
  lex: { status: "in_progress", lastActivityAt: "Today" },
  cs50: { status: "in_progress", lastActivityAt: "Last week" },
  mkbhd: { status: "archived", completedAt: "Mar 2024" },
};

const PLANNING_SEED: {
  id: string;
  title: string;
  kind: MediaKind;
  year: number;
  poster: string;
  rating: number;
  creator: string;
  genres: string[];
  runtime?: string;
  synopsis: string;
  accent?: string;
  priority: "high" | "med" | "low";
  reasonSaved: string;
  addedAt: string;
}[] = [
  {
    id: "p-foundation",
    title: "Foundation S3",
    kind: "series",
    year: 2025,
    poster:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&h=1200&q=80",
    rating: 0,
    creator: "Apple TV+",
    genres: ["Sci-Fi"],
    runtime: "10 ep",
    synopsis: "The Cleon dynasty teeters on the edge.",
    accent: "oklch(0.7 0.16 240)",
    priority: "high",
    reasonSaved: "Loved season 2's score.",
    addedAt: "3 days ago",
  },
  {
    id: "p-pachinko",
    title: "Pachinko",
    kind: "book",
    year: 2017,
    poster:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&h=1200&q=80",
    rating: 0,
    creator: "Min Jin Lee",
    genres: ["Literary"],
    runtime: "496 pages",
    synopsis: "Four generations of a Korean family in Japan.",
    accent: "oklch(0.7 0.16 25)",
    priority: "high",
    reasonSaved: "Mentioned by a friend at dinner.",
    addedAt: "1 week ago",
  },
  {
    id: "p-bg3",
    title: "Baldur's Gate 3",
    kind: "game",
    year: 2023,
    poster:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&h=1200&q=80",
    rating: 0,
    creator: "Larian",
    genres: ["CRPG"],
    runtime: "~100h",
    synopsis: "A turn-based descent into the Forgotten Realms.",
    accent: "oklch(0.72 0.16 80)",
    priority: "med",
    reasonSaved: "Saved for the long winter.",
    addedAt: "2 weeks ago",
  },
  {
    id: "p-shogun",
    title: "Shōgun",
    kind: "series",
    year: 2024,
    poster:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&h=1200&q=80",
    rating: 0,
    creator: "FX",
    genres: ["Historical"],
    runtime: "10 ep",
    synopsis: "An English navigator in feudal Japan.",
    accent: "oklch(0.6 0.05 240)",
    priority: "med",
    reasonSaved: "Was #1 on three friends' lists.",
    addedAt: "Yesterday",
  },
  {
    id: "p-eclipse",
    title: "Eclipse (Berserk)",
    kind: "manga",
    year: 1997,
    poster:
      "https://images.unsplash.com/photo-1611673025387-78f3fb1cb56e?auto=format&fit=crop&w=800&h=1200&q=80",
    rating: 0,
    creator: "Kentaro Miura",
    genres: ["Dark Fantasy"],
    runtime: "364 ch",
    synopsis: "Guts and Griffith. Everyone says brace yourself.",
    accent: "oklch(0.65 0.25 25)",
    priority: "low",
    reasonSaved: "Friend wouldn't shut up about it.",
    addedAt: "1 month ago",
  },
];

// Synthetic items for planning so the queue feels real.
export const PLANNING_ITEMS: MediaItem[] = PLANNING_SEED.map((p) => ({
  id: p.id,
  title: p.title,
  kind: p.kind,
  year: p.year,
  poster: p.poster,
  rating: p.rating,
  status: "planned",
  genres: p.genres,
  runtime: p.runtime,
  creator: p.creator,
  accent: p.accent,
  synopsis: p.synopsis,
}));
const PLANNING_META: Record<string, Partial<LibraryMeta>> = Object.fromEntries(
  PLANNING_SEED.map((p) => [
    p.id,
    {
      status: "planning" as const,
      priority: p.priority,
      reasonSaved: p.reasonSaved,
      addedAt: p.addedAt,
    },
  ]),
);

const SEED_ALL: MediaItem[] = [...MEDIA, ...PLANNING_ITEMS];

function deriveStatus(m: MediaItem): MediaStatus {
  if (m.status === "completed") return "completed";
  if (m.status === "planned") return "planning";
  if (m.status === "paused") return "paused";
  return "in_progress";
}

function liveItems(): MediaItem[] {
  const custom = useLibraryStore.getState().customItems;
  const ids = new Set(custom.map((c) => c.id));
  return [...custom, ...SEED_ALL.filter((m) => !ids.has(m.id))];
}

function liveMeta(id: string): Partial<LibraryMeta> {
  return useLibraryStore.getState().meta[id] ?? {};
}

export const ALL_LIBRARY = SEED_ALL;

export function metaOf(id: string): LibraryMeta {
  const all = liveItems();
  const m = all.find((x) => x.id === id);
  const base: LibraryMeta = { status: m ? deriveStatus(m) : "in_progress" };
  return { ...base, ...META[id], ...PLANNING_META[id], ...liveMeta(id) } as LibraryMeta;
}

export function statusOf(id: string): MediaStatus {
  return metaOf(id).status;
}

export function byStatus(status: MediaStatus): MediaItem[] {
  return liveItems().filter((m) => statusOf(m.id) === status);
}

export function inProgress() {
  return byStatus("in_progress");
}
export function continueJourney() {
  return byStatus("in_progress").sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));
}
export function completed() {
  return byStatus("completed");
}
export function recentlyFinished() {
  const order = ["Today", "Yesterday", "Last week", "1 month ago", "6 weeks ago", "Mar 2024"];
  return completed()
    .slice()
    .sort((a, b) => {
      const ai = order.indexOf(metaOf(a.id).completedAt ?? "");
      const bi = order.indexOf(metaOf(b.id).completedAt ?? "");
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    });
}
export function planning() {
  return byStatus("planning");
}
export function paused() {
  return byStatus("paused");
}
export function dropped() {
  return byStatus("dropped");
}
export function rewatching() {
  return byStatus("rewatching");
}
export function archived() {
  return byStatus("archived");
}
export function favorites() {
  return liveItems().filter((m) => metaOf(m.id).favorite);
}

export function bucketOfDate(
  label?: string,
): "Today" | "Yesterday" | "Last Week" | "Last Month" | "Older" {
  if (!label) return "Older";
  const l = label.toLowerCase();
  if (l.includes("today")) return "Today";
  if (l.includes("yesterday")) return "Yesterday";
  if (l.includes("week")) return "Last Week";
  if (l.includes("month")) return "Last Month";
  return "Older";
}

export interface StatusCount {
  status: MediaStatus;
  count: number;
  trend: number;
}
export function statusCounts(): Record<MediaStatus, number> {
  const out = {
    in_progress: 0,
    completed: 0,
    planning: 0,
    paused: 0,
    dropped: 0,
    rewatching: 0,
    archived: 0,
  } as Record<MediaStatus, number>;
  liveItems().forEach((m) => {
    out[statusOf(m.id)] += 1;
  });
  // Pad numbers so the dashboard feels populated.
  out.completed += 305;
  out.in_progress += 4;
  out.planning += 18;
  out.archived += 47;
  return out;
}

export function trendFor(status: MediaStatus): number {
  const t: Record<MediaStatus, number> = {
    in_progress: +2,
    completed: +7,
    planning: +12,
    paused: -1,
    dropped: 0,
    rewatching: +1,
    archived: +3,
  };
  return t[status];
}

export function collageRecent(n = 9): string[] {
  return liveItems()
    .slice(0, n)
    .map((m) => m.poster);
}

export function smartInsights(): string[] {
  return [
    "You completed 7 stories this month — your highest of the year.",
    "You've been watching more Anime than Series recently.",
    `Your planning queue has grown by ${trendFor("planning")} this week.`,
    "You haven't continued Cyberpunk in 19 days.",
    "You usually finish books faster than games.",
  ];
}

// Status presentation tokens — emotional, not statistical.
// Route paths stay technical (`/library/completed`); these are what users read.
export const STATUS_LABEL: Record<MediaStatus, string> = {
  in_progress: "In the middle",
  completed: "Stayed with you",
  planning: "Future adventure",
  paused: "Waiting for the right time",
  dropped: "Left behind",
  rewatching: "Returning to",
  archived: "Archived",
};

export const STATUS_TINT: Record<MediaStatus | "favorite", string> = {
  in_progress: "var(--status-in-progress)",
  completed: "var(--status-completed)",
  planning: "var(--status-planning)",
  paused: "var(--status-paused)",
  dropped: "var(--status-dropped)",
  rewatching: "var(--status-rewatching)",
  archived: "var(--status-archived)",
  favorite: "var(--status-favorite)",
};
