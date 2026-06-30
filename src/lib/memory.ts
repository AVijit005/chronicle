// Memory Layer — deterministic, SSR-safe.
// Source of truth for memory data, types, and selectors across Chronicle.
import { mulberry } from "@/lib/seed";
import { MEDIA, JOURNAL, COLLECTIONS, type MediaItem } from "@/lib/mock";

/* ============================================================
 * Fixed "today" so all relative-time math is SSR-deterministic.
 * ============================================================ */
export const TODAY = new Date("2026-06-27T00:00:00Z");

/* ============================================================
 * Taxonomy
 * ============================================================ */
export type Season = "Spring" | "Summer" | "Autumn" | "Winter";
export type Weather = "Sunny" | "Rainy" | "Snowy" | "Stormy" | "Foggy" | "Clear Night";
export type Mood =
  | "Awe"
  | "Joy"
  | "Melancholy"
  | "Triumph"
  | "Tender"
  | "Wonder"
  | "Comfort"
  | "Heartbreak"
  | "Curious"
  | "Obsessed";
export type Companion =
  | "Alone"
  | "Friends"
  | "Family"
  | "Partner"
  | "Online Community"
  | "Classmates";
export type PersonalImpact =
  | "Changed my perspective"
  | "Comfort story"
  | "Inspired my career"
  | "Childhood memory"
  | "Watched during exams"
  | "Helped through difficult times";
export type MemoryBadge =
  | "Comfort"
  | "Life Changing"
  | "Classic"
  | "Nostalgic"
  | "Rewatch Worthy"
  | "Emotional"
  | "Mind Blowing"
  | "Underrated"
  | "Hidden Gem";

export interface MediaMemory {
  firstExperiencedAt: string;
  finishedAt: string | null;
  location: string;
  season: Season;
  weather: Weather;
  mood: Mood;
  companion: Companion;
  memoryTitle: string;
  memoryExcerpt: string;
  personalImpact: PersonalImpact;
  wouldRevisit: boolean;
  favoriteMoment: string;
  daysSpent: number;
  revisits: number;
  journalEntries: number;
  collectionCount: number;
  timelineAppearances: number;
  badges: MemoryBadge[];
}

/* ============================================================
 * Deterministic helpers
 * ============================================================ */
function hash(id: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

const SEASONS: Season[] = ["Spring", "Summer", "Autumn", "Winter"];
const WEATHERS: Weather[] = ["Sunny", "Rainy", "Snowy", "Stormy", "Foggy", "Clear Night"];
const MOODS: Mood[] = [
  "Awe",
  "Joy",
  "Melancholy",
  "Triumph",
  "Tender",
  "Wonder",
  "Comfort",
  "Heartbreak",
  "Curious",
  "Obsessed",
];
const COMPANIONS: Companion[] = [
  "Alone",
  "Friends",
  "Family",
  "Partner",
  "Online Community",
  "Classmates",
];
const IMPACTS: PersonalImpact[] = [
  "Changed my perspective",
  "Comfort story",
  "Inspired my career",
  "Childhood memory",
  "Watched during exams",
  "Helped through difficult times",
];
const LOCATIONS = [
  "Brooklyn, NY",
  "Lisbon",
  "Tokyo",
  "London",
  "Bangalore",
  "Seoul",
  "Berlin",
  "Mumbai",
  "Paris",
  "Toronto",
  "Home",
];
const ALL_BADGES: MemoryBadge[] = [
  "Comfort",
  "Life Changing",
  "Classic",
  "Nostalgic",
  "Rewatch Worthy",
  "Emotional",
  "Mind Blowing",
  "Underrated",
  "Hidden Gem",
];
const EXCERPTS = [
  "I still remember the silence after the credits — I didn't move for an hour.",
  "It felt like the story had been waiting for me, not the other way around.",
  "There's a version of me that ends, gently, when this story ends.",
  "I read the last page twice. Then closed the book and watched the rain.",
  "Some stories age with you. This one grew up alongside me.",
  "The kind of evening you only realise was important years later.",
  "I keep returning, the way you return to a familiar street at night.",
];
const TITLES = [
  "The night it finally clicked",
  "A quiet Sunday with this one",
  "Watched alone, remembered forever",
  "Returned to this on a difficult week",
  "The chapter that ended me",
  "Some endings you don't recover from",
  "Where I was when this finished",
];
const FAV_MOMENTS = [
  "The docking scene — six viewings in, still wrecks me.",
  "That single line, halfway through chapter four.",
  "The slow walk back to camp at dawn.",
  "The boss fight where the music drops out.",
  "The penultimate episode's final shot.",
  "The reunion no one in the room expected.",
];

function daysAgo(n: number): string {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

/* ============================================================
 * Seeded memory build
 * ============================================================ */
function buildMemory(item: MediaItem): MediaMemory | null {
  const rng = mulberry(hash(item.id));
  // 70% of items have memory.
  if (rng() > 0.7 && item.status !== "completed") return null;

  const finishedDays = Math.floor(rng() * 1100); // 0..3 years
  const daysSpent = 3 + Math.floor(rng() * 80);
  const finished = item.status === "completed" ? daysAgo(finishedDays) : null;

  const badgeCount = 1 + Math.floor(rng() * 2);
  const badges: MemoryBadge[] = [];
  for (let i = 0; i < badgeCount; i++) {
    const b = pick(rng, ALL_BADGES);
    if (!badges.includes(b)) badges.push(b);
  }

  return {
    firstExperiencedAt: daysAgo(finishedDays + daysSpent),
    finishedAt: finished,
    location: pick(rng, LOCATIONS),
    season: pick(rng, SEASONS),
    weather: pick(rng, WEATHERS),
    mood: pick(rng, MOODS),
    companion: pick(rng, COMPANIONS),
    memoryTitle: pick(rng, TITLES),
    memoryExcerpt: pick(rng, EXCERPTS),
    personalImpact: pick(rng, IMPACTS),
    wouldRevisit: rng() > 0.25,
    favoriteMoment: pick(rng, FAV_MOMENTS),
    daysSpent,
    revisits: Math.floor(rng() * 5),
    journalEntries: Math.floor(rng() * 6),
    collectionCount: Math.floor(rng() * 3),
    timelineAppearances: 1 + Math.floor(rng() * 6),
    badges,
  };
}

export const MEMORIES_BY_MEDIA: Record<string, MediaMemory | null> = Object.fromEntries(
  MEDIA.map((m) => [m.id, buildMemory(m)] as const),
);

/* ============================================================
 * Selectors
 * ============================================================ */
export const getMemory = (id: string): MediaMemory | null => MEMORIES_BY_MEDIA[id] ?? null;
export const hasMemory = (id: string): boolean => !!MEMORIES_BY_MEDIA[id];

const withMemory = () =>
  MEDIA.map((m) => ({ media: m, memory: MEMORIES_BY_MEDIA[m.id] })).filter(
    (x): x is { media: MediaItem; memory: MediaMemory } => !!x.memory,
  );

export function getFavoriteMemories() {
  return withMemory().filter(({ media }) => media.rating >= 4.7);
}
export function getEmotionalMemories() {
  return withMemory().filter(({ memory }) =>
    ["Heartbreak", "Melancholy", "Tender", "Awe"].includes(memory.mood),
  );
}
export function getComfortStories() {
  return withMemory().filter(
    ({ memory }) => memory.badges.includes("Comfort") || memory.personalImpact === "Comfort story",
  );
}
export function getCompanionMemories(companion?: Companion) {
  return withMemory().filter(({ memory }) =>
    companion ? memory.companion === companion : memory.companion !== "Alone",
  );
}
export function getSeasonalMemories(season?: Season) {
  const arr = withMemory();
  return season ? arr.filter(({ memory }) => memory.season === season) : arr;
}
export function getForgottenStories() {
  return withMemory().filter(({ memory }) => {
    if (!memory.finishedAt) return false;
    const days = Math.floor((TODAY.getTime() - new Date(memory.finishedAt).getTime()) / 86_400_000);
    return days > 600;
  });
}
export function getRecentlyRemembered() {
  return [...withMemory()]
    .sort((a, b) => (b.memory.finishedAt ?? "").localeCompare(a.memory.finishedAt ?? ""))
    .slice(0, 6);
}
export function getLifeChangingStories() {
  return withMemory().filter(
    ({ memory }) =>
      memory.badges.includes("Life Changing") || memory.personalImpact === "Changed my perspective",
  );
}

/* ============================================================
 * Cross-references used by Part 02/03 selectors
 * ============================================================ */
export const JOURNAL_REF = JOURNAL;
export const COLLECTIONS_REF = COLLECTIONS;
