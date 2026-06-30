// Dashboard Context Engine — deterministic, SSR-safe.
import { MEDIA, JOURNAL, COLLECTIONS, STATS } from "@/lib/mock";
import { MEMORIES_BY_MEDIA, TODAY, type Mood, type Season } from "@/lib/memory";
import { GOALS_FULL } from "@/lib/goals";
import { getRecommendedToday } from "@/lib/discovery";
import { rankCreators, rankGenres } from "@/lib/recommendationEngine";

function currentSeason(): Season {
  const m = TODAY.getUTCMonth();
  if (m < 2 || m === 11) return "Winter";
  if (m < 5) return "Spring";
  if (m < 8) return "Summer";
  return "Autumn";
}

export interface DashboardContext {
  greeting: {
    name: string;
    daysSinceVisit: number;
    streak: number;
    recentCompletions: number;
    unfinishedTitle?: string;
  };
  currentJourney: (typeof MEDIA)[number] | null;
  currentMood: Mood;
  season: Season;
  todaysPick: ReturnType<typeof getRecommendedToday>;
  memoryToRevisit: { mediaId: string; line: string } | null;
  goalProgress: { id: string; title: string; pct: number } | null;
  streak: number;
  recentlyAdded: typeof MEDIA;
  recentlyCompleted: typeof MEDIA;
  recentlyJournaled: typeof JOURNAL;
  growingCollections: typeof COLLECTIONS;
  favoriteCreator: string;
  topGenre: string;
  sectionOrder: SectionKey[];
}

export type SectionKey =
  | "continueJourney"
  | "todayMemory"
  | "recommendation"
  | "goalProgress"
  | "recentlyFinished"
  | "journalPrompt"
  | "discovery"
  | "collections"
  | "analyticsPreview"
  | "timelinePreview"
  | "achievements"
  | "footer";

const ALL_SECTIONS: SectionKey[] = [
  "continueJourney",
  "todayMemory",
  "recommendation",
  "goalProgress",
  "recentlyFinished",
  "journalPrompt",
  "discovery",
  "collections",
  "analyticsPreview",
  "timelinePreview",
  "achievements",
  "footer",
];

export function getDashboardContext(name = "Avijit"): DashboardContext {
  const watching = MEDIA.filter((m) => m.status === "watching");
  const completed = MEDIA.filter((m) => m.status === "completed");
  const journey = watching[0] ?? null;
  const lastMem = Object.entries(MEMORIES_BY_MEDIA).find(([, m]) => !!m && !!m.memoryExcerpt);
  const goal = GOALS_FULL[0]!;
  const creator = rankCreators(1)[0]?.creator ?? "Christopher Nolan";
  const genre = rankGenres(1)[0]?.genre ?? "Sci-Fi";

  // Deterministic reorder based on weekday — keeps SSR safe.
  const order = [...ALL_SECTIONS];
  const day = TODAY.getUTCDay();
  if (day === 0 || day === 6) {
    // weekend — surface discovery + collections earlier
    const i = order.indexOf("discovery");
    order.splice(i, 1);
    order.splice(2, 0, "discovery");
  }

  return {
    greeting: {
      name,
      daysSinceVisit: 0,
      streak: STATS.streak,
      recentCompletions: completed.length >= 3 ? 3 : completed.length,
      unfinishedTitle: journey?.title,
    },
    currentJourney: journey,
    currentMood: (MEMORIES_BY_MEDIA[journey?.id ?? ""]?.mood ?? "Awe") as Mood,
    season: currentSeason(),
    todaysPick: getRecommendedToday(),
    memoryToRevisit: lastMem ? { mediaId: lastMem[0]!, line: lastMem[1]!.memoryExcerpt } : null,
    goalProgress: {
      id: goal.id,
      title: goal.title,
      pct: Math.round((goal.current / goal.target) * 100),
    },
    streak: STATS.streak,
    recentlyAdded: MEDIA.slice(0, 4),
    recentlyCompleted: completed.slice(0, 6),
    recentlyJournaled: JOURNAL,
    growingCollections: COLLECTIONS.slice(0, 4),
    favoriteCreator: creator,
    topGenre: genre,
    sectionOrder: order,
  };
}
