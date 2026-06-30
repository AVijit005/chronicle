// Smart Collections — deterministic editorial groupings.
import { MEDIA, type MediaItem } from "@/lib/mock";
import { MEMORIES_BY_MEDIA, type Season, type MediaMemory } from "@/lib/memory";

export type CollectionMode = "manual" | "smart" | "hybrid";

export interface SmartCollection {
  id: string;
  name: string;
  reason: string;
  insight: string;
  mode: CollectionMode;
  items: MediaItem[];
  updatedAt: string;
  mood?: string;
}

const withMem = () =>
  MEDIA.map((m) => ({ m, mem: MEMORIES_BY_MEDIA[m.id] })).filter(
    (x): x is { m: MediaItem; mem: MediaMemory } => !!x.mem,
  );

const make = (
  id: string,
  name: string,
  items: MediaItem[],
  reason: string,
  insight: string,
  mood?: string,
): SmartCollection => ({
  id,
  name,
  reason,
  insight,
  mode: "smart",
  items,
  updatedAt: "Updated this week",
  mood,
});

export function getComfortCollection() {
  return make(
    "smart-comfort",
    "Comfort",
    withMem()
      .filter((x) => x.mem.badges.includes("Comfort"))
      .map((x) => x.m),
    "Stories you keep returning to",
    "Most stories here are revisited at least twice.",
    "Comfort",
  );
}
export function getLifeChangingCollection() {
  return make(
    "smart-life",
    "Life Changing",
    withMem()
      .filter((x) => x.mem.badges.includes("Life Changing"))
      .map((x) => x.m),
    "Stories that shifted something in you",
    "This collection contains your highest rated memories.",
  );
}
export function getRainyDayCollection() {
  return make(
    "smart-rainy",
    "Rainy Day",
    withMem()
      .filter((x) => x.mem.weather === "Rainy")
      .map((x) => x.m),
    "For the quiet, grey hours",
    "You return here most in autumn.",
  );
}
export function getWeekendCollection() {
  return make(
    "smart-weekend",
    "Weekend",
    MEDIA.filter((m) => /^(1|2|3)h/.test(m.runtime ?? "")),
    "Short journeys for two days",
    "Mostly films, mostly under three hours.",
  );
}
export function getProductivityCollection() {
  return make(
    "smart-productivity",
    "Productivity Background",
    MEDIA.filter((m) => ["podcast", "music", "youtube"].includes(m.kind)),
    "For working hours",
    "Long-form audio dominates this shelf.",
  );
}
export function getShortStoriesCollection() {
  return make(
    "smart-short",
    "Short Stories",
    MEDIA.filter((m) => /m/.test(m.runtime ?? "") && !/h/.test(m.runtime ?? "")),
    "Under an hour",
    "Mostly creator videos and singles.",
  );
}
export function getLongJourneyCollection() {
  return make(
    "smart-long",
    "Long Journeys",
    MEDIA.filter((m) => /(\d+)h main|seasons|pages/.test(m.runtime ?? "")),
    "Stories that take time",
    "This collection has your longest completed journeys.",
  );
}
export function getCreatorCollection() {
  const top = MEDIA[0]!;
  return make(
    "smart-creator",
    `Creator: ${top.creator}`,
    MEDIA.filter((m) => m.creator === top.creator),
    `Everything by ${top.creator}`,
    "You finish creator collections consistently.",
  );
}
export function getMoodCollection() {
  return make(
    "smart-mood",
    "Quiet Awe",
    withMem()
      .filter((x) => x.mem.mood === "Awe")
      .map((x) => x.m),
    "Stories that leave silence behind",
    "Most are completed at night.",
    "Awe",
  );
}
export function getFavoriteUniverseCollection() {
  const fav = MEDIA.find((m) => m.rating >= 4.9) ?? MEDIA[0]!;
  return make(
    "smart-universe",
    `${fav.title} Universe`,
    MEDIA.filter((m) => m.creator === fav.creator),
    "Where your favorite story lives",
    "You revisit this universe every winter.",
  );
}
export function getLateNightCollection() {
  return make(
    "smart-late",
    "Late Night",
    withMem()
      .filter((x) => x.mem.weather === "Clear Night")
      .map((x) => x.m),
    "After midnight only",
    "You rate these higher than anything else.",
  );
}
export function getTravelCollection() {
  return make(
    "smart-travel",
    "Travel Companions",
    MEDIA.filter((m) => m.kind === "book" || m.kind === "podcast"),
    "For long trains and longer flights",
    "Mostly books with long chapters.",
  );
}
export function getEmotionalRecoveryCollection() {
  return make(
    "smart-recovery",
    "Emotional Recovery",
    withMem()
      .filter((x) => ["Tender", "Comfort"].includes(x.mem.mood))
      .map((x) => x.m),
    "Soft landings",
    "You open these after stressful weeks.",
  );
}
export function getSeasonCollection(season: Season = "Winter") {
  return make(
    `smart-${season.toLowerCase()}`,
    season,
    withMem()
      .filter((x) => x.mem.season === season)
      .map((x) => x.m),
    `Your ${season.toLowerCase()} library`,
    "You watch slower stories in this season.",
  );
}
export function getRandomEditorialCollection() {
  return make(
    "smart-editor",
    "Editor's Pick",
    MEDIA.slice(0, 5),
    "A handful curated this week",
    "Stories chosen for their honesty.",
  );
}
export function getMemoryCapsuleCollection() {
  return make(
    "smart-capsule",
    "Memory Capsule · Summer '25",
    MEDIA.slice(1, 5),
    "The summer of long evenings",
    "Eighteen memories collected here.",
  );
}
export function getRecentlyLovedCollection() {
  return make(
    "smart-recent",
    "Recently Loved",
    MEDIA.filter((m) => m.status === "completed" && m.rating >= 4.5).slice(0, 6),
    "From the last few weeks",
    "Your highest concentration of 5-star memories.",
  );
}
export function getForgottenFavoritesCollection() {
  return make(
    "smart-forgotten",
    "Forgotten Favorites",
    MEDIA.filter((m) => m.status === "completed").slice(2, 6),
    "Worth remembering again",
    "Not opened in over a year.",
  );
}
export function getCompletedThisYearCollection() {
  return make(
    "smart-yearcomplete",
    "Completed This Year",
    MEDIA.filter((m) => m.status === "completed"),
    "A year's worth of endings",
    "Mostly films, then games, then books.",
  );
}

export function getAllSmartCollections(): SmartCollection[] {
  return [
    getComfortCollection(),
    getLifeChangingCollection(),
    getRainyDayCollection(),
    getWeekendCollection(),
    getMoodCollection(),
    getRecentlyLovedCollection(),
    getForgottenFavoritesCollection(),
    getLateNightCollection(),
  ].filter((c) => c.items.length > 0);
}

export function getCollectionInsights(c: SmartCollection) {
  return [
    c.insight,
    `${c.items.length} stories.`,
    c.mood ? `Dominant mood: ${c.mood}.` : "Mixed moods.",
  ];
}
