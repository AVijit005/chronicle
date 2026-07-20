// Recommendation Engine — pure deterministic scoring.
// No AI, no randomness beyond seeded mulberry. SSR-safe.
import { mulberry } from "@/lib/seed";
import { MEDIA, type MediaItem } from "@/lib/types";
import { MEMORIES_BY_MEDIA, type MediaMemory, type Season } from "@/lib/memory";

export type RecommendationSource =
  | "creator"
  | "genre"
  | "mood"
  | "memory"
  | "franchise"
  | "season"
  | "comfort"
  | "trending"
  | "editorial"
  | "almost-finished";

export interface Recommendation {
  media: MediaItem;
  compatibility: number; // 0..1
  confidence: number; // 0..1
  reason: string;
  source: RecommendationSource;
  discoveryTags: string[];
}

function hash(id: string) {
  let h = 0x811c9dc5 >>> 0;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function calculateCompatibility(a: MediaItem, b: MediaItem): number {
  if (a.id === b.id) return 0;
  let s = 0;
  if (a.creator && a.creator === b.creator) s += 0.45;
  const shared = a.genres.filter((g) => b.genres.includes(g)).length;
  s += Math.min(0.4, shared * 0.15);
  if (a.kind === b.kind) s += 0.15;
  return Math.min(1, s);
}

export function calculateDiscoveryWeight(m: MediaItem): number {
  // Higher for unstarted/planned of high rating.
  const planning = m.status === "planned" ? 0.4 : (m.status === "watching" || m.status === "in_progress") ? 0.2 : 0.1;
  return Math.min(1, planning + (m.rating ?? 0) / 10);
}

export function buildReason(
  source: RecommendationSource,
  ctx?: { anchor?: MediaItem; season?: Season },
): string {
  switch (source) {
    case "creator":
      return ctx?.anchor
        ? `Because you loved ${ctx.anchor.creator ?? ctx.anchor.title}`
        : "From a creator you love";
    case "genre":
      return ctx?.anchor ? `More like ${ctx.anchor.title}` : "In a genre you love";
    case "mood":
      return "Same emotional tone as your favorites";
    case "memory":
      return "Based on your journals";
    case "franchise":
      return ctx?.anchor ? `Continue ${ctx.anchor.title}'s world` : "Continue your journey";
    case "season":
      return ctx?.season ? `Perfect for ${ctx.season.toLowerCase()}` : "Right for this season";
    case "comfort":
      return "Hidden comfort story";
    case "trending":
      return "Popular in your library";
    case "editorial":
      return "Today's editorial pick";
    case "almost-finished":
      return "You almost finished it";
  }
}

export function findRelatedMedia(id: string, limit = 6): Recommendation[] {
  const anchor = MEDIA.find((m) => m.id === id);
  if (!anchor) return [];
  return MEDIA.filter((m) => m.id !== id)
    .map((m) => {
      const c = calculateCompatibility(anchor, m);
      return {
        media: m,
        compatibility: c,
        confidence: c * 0.85,
        reason: buildReason(anchor.creator === m.creator ? "creator" : "genre", { anchor }),
        source: (anchor.creator === m.creator ? "creator" : "genre") as RecommendationSource,
        discoveryTags: m.genres.slice(0, 2),
      };
    })
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, limit);
}

export function scoreRecommendation(m: MediaItem, anchor?: MediaItem): number {
  const base = calculateDiscoveryWeight(m);
  return anchor ? Math.min(1, base * 0.5 + calculateCompatibility(anchor, m) * 0.6) : base;
}

export function sortRecommendations(list: Recommendation[]) {
  return [...list].sort((a, b) => b.compatibility - a.compatibility);
}

/* ============================================================
 * Ranking helpers used by selectors
 * ============================================================ */
const withMem = () =>
  MEDIA.map((m) => ({ m, mem: MEMORIES_BY_MEDIA[m.id] })).filter(
    (x): x is { m: MediaItem; mem: MediaMemory } => !!x.mem,
  );

export function rankComfortStories(limit = 8): Recommendation[] {
  return withMem()
    .filter(({ mem }) => mem.revisits > 0 || mem.badges.includes("Comfort"))
    .sort((a, b) => b.mem.revisits - a.mem.revisits)
    .slice(0, limit)
    .map(({ m }) => ({
      media: m,
      compatibility: 0.8,
      confidence: 0.7,
      reason: buildReason("comfort"),
      source: "comfort",
      discoveryTags: ["Comfort"],
    }));
}

export function rankSeasonalStories(season: Season, limit = 8): Recommendation[] {
  return withMem()
    .filter(({ mem }) => mem.season === season)
    .slice(0, limit)
    .map(({ m }) => ({
      media: m,
      compatibility: 0.7,
      confidence: 0.65,
      reason: buildReason("season", { season }),
      source: "season",
      discoveryTags: [season],
    }));
}

export function rankFranchises(limit = 6) {
  // Group by creator with multiple items.
  const groups = new Map<string, MediaItem[]>();
  for (const m of MEDIA) {
    if (!m.creator) continue;
    if (!groups.has(m.creator)) groups.set(m.creator, []);
    groups.get(m.creator)!.push(m);
  }
  return [...groups.entries()]
    .map(([creator, items]) => {
      const current = items.find((i) => (i.status === "watching" || i.status === "in_progress")) ?? items[0];
      const next = items.find((i) => i.status === "planned");
      const completion = Math.round(
        items.reduce((a, b) => a + (b.progress ?? 0), 0) / items.length,
      );
      return {
        creator,
        items,
        current,
        next,
        remaining: items.filter((i) => i.status !== "completed").length,
        completion,
      };
    })
    .sort((a, b) => b.items.length - a.items.length)
    .slice(0, limit);
}

export function rankCreators(limit = 6) {
  const map = new Map<string, MediaItem[]>();
  for (const m of MEDIA) {
    if (!m.creator) continue;
    if (!map.has(m.creator)) map.set(m.creator, []);
    map.get(m.creator)!.push(m);
  }
  return [...map.entries()]
    .map(([creator, items]) => ({
      creator,
      experienced: items.filter((i) => i.status === "completed").length,
      remaining: items.filter((i) => i.status !== "completed").length,
      recommendedNext: items.find((i) => i.status === "planned") ?? items[0],
      total: items.length,
    }))
    .sort((a, b) => b.experienced - a.experienced)
    .slice(0, limit);
}

export function rankGenres(limit = 5) {
  const counts = new Map<string, number>();
  for (const m of MEDIA) for (const g of m.genres) counts.set(g, (counts.get(g) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([genre, count]) => ({ genre, count }));
}

export function pickDeterministic<T>(arr: T[], seed: number): T | null {
  if (!arr.length) return null;
  const rng = mulberry(seed);
  return arr[Math.floor(rng() * arr.length)] ?? null;
}

export { hash };
