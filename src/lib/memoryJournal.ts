// Memory Journal Layer — Part 02.
// Deterministic SSR-safe data + selectors for journals, moments, arcs, scores.
import { mulberry } from "@/lib/seed";
import { MEDIA, type MediaItem } from "@/lib/mock";
import { MEMORIES_BY_MEDIA, TODAY, type Mood, type MediaMemory } from "@/lib/memory";

/* ============================================================
 * Types
 * ============================================================ */
export type Visibility = "private" | "friends" | "public";

export interface MemoryJournal {
  title: string;
  summary: string;
  fullEntry: string;
  createdAt: string;
  updatedAt: string;
  mood: Mood;
  emotionIntensity: number; // 0..1
  spoilerFree: boolean;
  visibility: Visibility;
}

export type MomentKind =
  | "quote"
  | "scene"
  | "character"
  | "episode"
  | "chapter"
  | "song"
  | "mission"
  | "boss";

export interface FavoriteMoment {
  kind: MomentKind;
  label: string;
  detail: string;
}

export interface EmotionArcNode {
  label: string;
  caption: string;
  intensity: number; // 0..1
}

export interface EmotionScores {
  comfort: number;
  excitement: number;
  sadness: number;
  wonder: number;
  inspiration: number;
  addiction: number;
  relaxation: number;
}

export interface MemoryQuoteData {
  text: string;
  attribution?: string;
}

export interface MemoryReflectionData {
  changed: string;
  recommend: string;
  revisit: string;
  audience: string;
}

export interface MemoryEnvironmentData {
  timeOfDay: "Morning" | "Afternoon" | "Evening" | "Late Night";
  travel: string;
  occasion: string;
}

export interface MemoryExtensions {
  journal: MemoryJournal | null;
  moments: FavoriteMoment[];
  arc: EmotionArcNode[];
  scores: EmotionScores;
  quote: any;
  reflection: MemoryReflectionData;
  environment: MemoryEnvironmentData;
}

/* ============================================================
 * Deterministic builder
 * ============================================================ */
function hash(id: string): number {
  let h = 0x9e3779b1 >>> 0;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 2654435761);
  }
  return h >>> 0;
}
function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

const ARC_TEMPLATES: { label: string; caption: string }[] = [
  { label: "Curious", caption: "First glance, soft intrigue." },
  { label: "Attached", caption: "Something began to hold." },
  { label: "Obsessed", caption: "I thought about it between sittings." },
  { label: "Heartbroken", caption: "A turn I didn't see coming." },
  { label: "Satisfied", caption: "A quiet, full ending." },
];

const QUOTES = [
  "Pay attention. It's the most basic form of love.",
  "We accept the love we think we deserve.",
  "Stories are the wildest things of all.",
  "Maybe ever's just a word.",
  "All we have to decide is what to do with the time given to us.",
];

const TRAVEL = [
  "Home",
  "Trip to the coast",
  "Weekend away",
  "Festival visit",
  "Vacation",
  "Daily commute",
];
const OCCASIONS = [
  "Exam Week",
  "Summer Break",
  "Winter Holiday",
  "A long weekend",
  "Quiet evenings",
  "A rainy month",
  "First week of a new job",
];
const SUMMARIES = [
  "Some stories arrive at exactly the right time. This one did.",
  "I don't think I'll talk about this with anyone soon — it's still settling.",
  "Returned to this on a quiet week and it returned to me.",
  "A long story that felt short. A short story that felt long.",
];
const ENTRIES = [
  "There's a particular kind of quiet that follows a story you love. I closed it, set it down, and watched the rain finish the evening for me. I don't know if I'll come back to it next year, or in ten — but I know it's a place now, not just a book.",
  "What I won't forget: the cold of the room, the lamplight, the way the soundtrack thinned in the second-to-last scene. I cried in a way that surprised me, less from sadness than from recognition. The ending was honest, which is what I needed.",
  "Spent most of the month with this. The pacing wears people down, I think, but I liked the patience of it. Some stories trust you to wait. This one trusted me, and I trusted it back.",
];

function buildExtensions(item: MediaItem, memory: MediaMemory): MemoryExtensions {
  const rng = mulberry(hash(item.id) ^ 0xa1b2c3);
  const hasJournal = rng() > 0.35;

  const journal: MemoryJournal | null = hasJournal
    ? {
        title: memory.memoryTitle,
        summary: pick(rng, SUMMARIES),
        fullEntry: pick(rng, ENTRIES),
        createdAt: memory.finishedAt ?? memory.firstExperiencedAt,
        updatedAt: memory.finishedAt ?? memory.firstExperiencedAt,
        mood: memory.mood,
        emotionIntensity: 0.4 + rng() * 0.6,
        spoilerFree: rng() > 0.5,
        visibility: pick(rng, ["private", "friends", "public"] as Visibility[]),
      }
    : null;

  // Moments keyed to media kind.
  const kindMomentMap: Record<MediaItem["kind"], MomentKind[]> = {
    movie: ["quote", "scene", "character"],
    series: ["quote", "scene", "episode", "character"],
    anime: ["quote", "episode", "character", "scene"],
    book: ["quote", "chapter", "character"],
    manga: ["quote", "chapter", "character"],
    game: ["mission", "boss", "character", "quote"],
    music: ["song"],
    podcast: ["quote", "episode"],
    course: ["chapter", "quote"],
    youtube: ["scene", "quote"],
  };
  const moments: FavoriteMoment[] = kindMomentMap[item.kind].map((kind) => ({
    kind,
    label: pick(rng, [
      "The third act",
      "The opening",
      "The reunion",
      "The first night",
      "The last hour",
      "The reveal",
    ]),
    detail: pick(rng, [
      "Held still for the whole room.",
      "Earned every minute it took.",
      "Quiet, then loud, then quiet.",
      "Reframed everything before it.",
    ]),
  }));

  const arcLen = 4 + Math.floor(rng() * 2);
  const arc: EmotionArcNode[] = ARC_TEMPLATES.slice(0, arcLen).map((n) => ({
    ...n,
    intensity: 0.3 + rng() * 0.7,
  }));

  const scores: EmotionScores = {
    comfort: rng(),
    excitement: rng(),
    sadness: rng(),
    wonder: rng(),
    inspiration: rng(),
    addiction: rng(),
    relaxation: rng(),
  };

  const hasQuote = rng() > 0.4;
  const quote: any = hasQuote
    ? { text: pick(rng, QUOTES), attribution: item.creator }
    : null;

  const reflection: MemoryReflectionData = {
    changed:
      "It softened how I read endings. I wait longer now, before I decide what a story meant.",
    recommend: memory.wouldRevisit
      ? "Yes — but only to someone who likes a quiet middle and an honest ending."
      : "Once, in the right week of your life.",
    revisit: memory.wouldRevisit ? "Already planning to." : "Maybe in a few years.",
    audience: "Friends who don't mind sitting in a feeling for a while.",
  };

  const environment: MemoryEnvironmentData = {
    timeOfDay: pick(rng, ["Morning", "Afternoon", "Evening", "Late Night"] as const),
    travel: pick(rng, TRAVEL),
    occasion: pick(rng, OCCASIONS),
  };

  return { journal, moments, arc, scores, quote, reflection, environment };
}

export const MEMORY_EXTENSIONS: Record<string, MemoryExtensions | null> = Object.fromEntries(
  MEDIA.map((m) => {
    const mem = MEMORIES_BY_MEDIA[m.id];
    return [m.id, mem ? buildExtensions(m, mem) : null] as const;
  }),
);

export const getExtensions = (id: string): MemoryExtensions | null => MEMORY_EXTENSIONS[id] ?? null;
export const getJournal = (id: string): MemoryJournal | null =>
  MEMORY_EXTENSIONS[id]?.journal ?? null;

/* ============================================================
 * Selectors
 * ============================================================ */
const all = () =>
  MEDIA.map((m) => ({
    media: m,
    mem: MEMORIES_BY_MEDIA[m.id],
    ext: MEMORY_EXTENSIONS[m.id],
  })).filter(
    (x): x is { media: MediaItem; mem: MediaMemory; ext: MemoryExtensions } => !!x.mem && !!x.ext,
  );

export function getLongestEntries() {
  return all()
    .filter((x) => x.ext.journal)
    .sort((a, b) => b.ext.journal!.fullEntry.length - a.ext.journal!.fullEntry.length)
    .slice(0, 6);
}
export function getMostEmotional() {
  return all()
    .sort((a, b) => (b.ext.journal?.emotionIntensity ?? 0) - (a.ext.journal?.emotionIntensity ?? 0))
    .slice(0, 6);
}
export function getUnreadMemories() {
  return all().filter((x) => !x.ext.journal);
}
export function getRecentReflections() {
  return all()
    .filter((x) => x.ext.journal)
    .sort((a, b) => b.ext.journal!.updatedAt.localeCompare(a.ext.journal!.updatedAt))
    .slice(0, 6);
}
export function getComfortReads() {
  return all()
    .sort((a, b) => b.ext.scores.comfort - a.ext.scores.comfort)
    .slice(0, 6);
}
export function getFavoriteQuotes() {
  return all()
    .filter((x) => x.ext.quote)
    .slice(0, 8);
}
export function getStoriesByMood(mood: Mood) {
  return all().filter((x) => x.mem.mood === mood);
}
export function groupByEmotion(): Record<Mood, ReturnType<typeof all>> {
  const out = {} as Record<Mood, ReturnType<typeof all>>;
  for (const x of all()) {
    const m = x.mem.mood;
    (out[m] ??= [] as never).push(x);
  }
  return out;
}

export { TODAY };
