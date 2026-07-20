// Discovery — deterministic SSR-safe selectors.
import { MEDIA, type MediaItem } from "@/lib/types";
import { MEMORIES_BY_MEDIA, TODAY, type Season } from "@/lib/memory";
import {
  buildReason,
  calculateDiscoveryWeight,
  findRelatedMedia,
  rankComfortStories,
  rankSeasonalStories,
  rankFranchises,
  rankCreators,
  rankGenres,
  pickDeterministic,
  type Recommendation,
} from "@/lib/recommendationEngine";

const currentSeason = (): Season =>
  (["Winter", "Spring", "Summer", "Autumn"] as Season[])[
    Math.floor(((TODAY.getUTCMonth() + 1) % 12) / 3)
  ];

function rec(
  media: MediaItem,
  source: Recommendation["source"],
  reason: string,
  tags: string[] = [],
): Recommendation {
  const compat = calculateDiscoveryWeight(media);
  return {
    media,
    compatibility: compat,
    confidence: 0.55 + compat * 0.4,
    reason,
    source,
    discoveryTags: tags,
  };
}

export function getRecommendedToday(): Recommendation | null {
  // Highest rated planned or completed item, deterministic.
  const pool = MEDIA.filter((m) => (m.rating ?? 0) >= 4.6);
  const m = pickDeterministic(pool, TODAY.getUTCDate() + TODAY.getUTCMonth() * 31);
  return m ? rec(m, "editorial", buildReason("editorial"), ["Today's Pick"]) : null;
}

export function getContinueMood(): Recommendation[] {
  return MEDIA.filter((m) => (m.status === "watching" || m.status === "in_progress"))
    .slice(0, 6)
    .map((m) => rec(m, "mood", "Continue this mood", ["Continue"]));
}

export function getComfortRecommendations() {
  return rankComfortStories(8);
}
export function getSeasonRecommendations() {
  return rankSeasonalStories(currentSeason(), 8);
}

export function getHiddenGems(): Recommendation[] {
  return MEDIA.filter(
    (m) =>
      (m.rating ?? 0) >= 4.4 &&
      (MEMORIES_BY_MEDIA[m.id]?.badges.includes("Hidden Gem") ||
        MEMORIES_BY_MEDIA[m.id]?.badges.includes("Underrated")),
  )
    .slice(0, 8)
    .map((m) => rec(m, "editorial", "Hidden gem in your library", ["Hidden Gem"]));
}

export function getTrendingInLibrary(): Recommendation[] {
  return [...MEDIA]
    .sort((a, b) => ((b.rating ?? 0) ?? 0) - ((a.rating ?? 0) ?? 0))
    .slice(0, 6)
    .map((m) => rec(m, "trending", buildReason("trending"), ["Trending"]));
}

export function getBecauseYouLoved(id: string) {
  return findRelatedMedia(id, 6);
}

export function getContinueFranchise() {
  return rankFranchises(6);
}
export function getCreatorRecommendations() {
  return rankCreators(6);
}
export function getGenreExpansion() {
  return rankGenres(5);
}

export function getUndiscoveredFavorites(): Recommendation[] {
  return MEDIA.filter((m) => m.status === "planned" && (m.rating ?? 0) >= 4.5)
    .slice(0, 6)
    .map((m) => rec(m, "editorial", "An undiscovered favorite waiting", ["Saved"]));
}

const runtimeHours = (m: MediaItem) => {
  const r = m.runtime ?? "";
  const h = r.match(/(\d+)h/);
  const min = r.match(/(\d+)m/);
  if (h) return parseInt(h[1]!, 10) + (min ? parseInt(min[1]!, 10) / 60 : 0);
  if (/pages/.test(r)) return parseInt(r, 10) / 60;
  if (/h main/.test(r)) return parseInt(r, 10);
  return 2;
};

export function getShortWeekendStories() {
  return MEDIA.filter((m) => runtimeHours(m) < 3)
    .slice(0, 6)
    .map((m) => rec(m, "editorial", "Short — fits a weekend", ["2h"]));
}
export function getLongJourneyRecommendations() {
  return MEDIA.filter((m) => runtimeHours(m) >= 10)
    .slice(0, 6)
    .map((m) => rec(m, "editorial", "A long, slow journey", ["Long"]));
}

export function getRewatchSuggestions(): Recommendation[] {
  return MEDIA.filter(
    (m) => m.status === "completed" && (MEMORIES_BY_MEDIA[m.id]?.wouldRevisit ?? false),
  )
    .slice(0, 6)
    .map((m) => rec(m, "comfort", "Worth a revisit", ["Rewatch"]));
}

export function getNightRecommendations() {
  return MEDIA.filter((m) => MEMORIES_BY_MEDIA[m.id]?.weather === "Clear Night")
    .slice(0, 6)
    .map((m) => rec(m, "season", "For late nights", ["Late Night"]));
}
export function getRainyDayRecommendations() {
  return MEDIA.filter((m) => MEMORIES_BY_MEDIA[m.id]?.weather === "Rainy")
    .slice(0, 6)
    .map((m) => rec(m, "season", "Perfect for rain", ["Rainy"]));
}

export function getEmotionalRecoveryStories() {
  return MEDIA.filter((m) => ["Comfort", "Tender"].includes(MEMORIES_BY_MEDIA[m.id]?.mood ?? ""))
    .slice(0, 6)
    .map((m) => rec(m, "comfort", "Soft landing after a hard week", ["Recovery"]));
}

export function getProductivityBackgroundContent() {
  return MEDIA.filter((m) => m.kind === "podcast" || m.kind === "music" || m.kind === "youtube")
    .slice(0, 6)
    .map((m) => rec(m, "editorial", "For working hours", ["Background"]));
}

export function getRecentlyPopular() {
  return [...MEDIA]
    .sort((a, b) => b.year - a.year)
    .slice(0, 6)
    .map((m) => rec(m, "trending", "Recently popular", ["New"]));
}

export function getAlmostFinished() {
  return MEDIA.filter((m) => (m.progress ?? 0) >= 75 && m.status !== "completed")
    .slice(0, 6)
    .map((m) => rec(m, "almost-finished", buildReason("almost-finished"), ["Almost done"]));
}

export function getRandomEditorialPick(seed = 9): Recommendation | null {
  const m = pickDeterministic(MEDIA, seed);
  return m ? rec(m, "editorial", "An editorial pick for you", ["Editorial"]) : null;
}

export const currentDiscoverySeason = currentSeason;
