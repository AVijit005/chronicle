// Goals — deterministic lifelong-journey models.
import { MEDIA } from "@/lib/types";

export type GoalStatus = "Planning" | "Active" | "Paused" | "Completed" | "Archived";

export interface GoalMilestone {
  label: string;
  reached: boolean;
  when?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  deadline?: string;
  priority: "low" | "med" | "high";
  reward: string;
  reason: string;
  status: GoalStatus;
  startedAt: string;
  completedAt?: string;
  accent: string;
  coverIds: string[];
  milestones: GoalMilestone[];
  kind: "creator" | "count" | "collection" | "genre" | "memory";
}

const m = (label: string, reached = false, when?: string): GoalMilestone => ({
  label,
  reached,
  when,
});

export const GOALS_FULL: Goal[] = [
  {
    id: "one-piece",
    title: "Finish One Piece",
    description: "Sail to the end of the Grand Line.",
    current: 1092,
    target: 1110,
    priority: "high",
    reward: "A long, slow ending.",
    reason: "A story you grew up alongside.",
    status: "Active",
    startedAt: "Jul 2018",
    accent: "oklch(0.78 0.18 50)",
    coverIds: ["one-piece"],
    kind: "creator",
    milestones: [
      m("East Blue", true, "2018"),
      m("Skypiea", true, "2019"),
      m("Wano", true, "2023"),
      m("Egghead", false),
      m("Final saga", false),
    ],
  },
  {
    id: "read-20",
    title: "Read 20 books this year",
    description: "One a fortnight, slowly.",
    current: 14,
    target: 20,
    priority: "med",
    reward: "A complete shelf.",
    reason: "You've been reading less.",
    status: "Active",
    startedAt: "Jan 2026",
    deadline: "Dec 2026",
    accent: "oklch(0.62 0.2 295)",
    coverIds: ["harry-potter"],
    kind: "count",
    milestones: [m("First 5", true), m("Halfway", true), m("15", false), m("20", false)],
  },
  {
    id: "nolan",
    title: "Every Nolan film",
    description: "From Following to Oppenheimer.",
    current: 9,
    target: 12,
    priority: "med",
    reward: "A complete director shelf.",
    reason: "Your most-loved director.",
    status: "Active",
    startedAt: "Jan 2024",
    accent: "oklch(0.65 0.2 230)",
    coverIds: ["interstellar", "dune"],
    kind: "creator",
    milestones: [
      m("Memento", true),
      m("Dark Knight", true),
      m("Inception", true),
      m("Tenet", false),
      m("Oppenheimer", false),
    ],
  },
  {
    id: "ghibli",
    title: "Complete Studio Ghibli",
    description: "Hand-drawn worlds, one weekend at a time.",
    current: 14,
    target: 22,
    priority: "low",
    reward: "A full shelf of childhood.",
    reason: "You return here in winter.",
    status: "Active",
    startedAt: "Mar 2024",
    accent: "oklch(0.75 0.15 145)",
    coverIds: ["one-piece"],
    kind: "creator",
    milestones: [
      m("Totoro", true),
      m("Spirited Away", true),
      m("Mononoke", true),
      m("Wind Rises", false),
    ],
  },
  {
    id: "journal-100",
    title: "Journal 100 memories",
    description: "Write more than you think to.",
    current: 78,
    target: 100,
    priority: "high",
    reward: "A year of remembered things.",
    reason: "Memory becomes story when written.",
    status: "Active",
    startedAt: "Jan 2026",
    accent: "oklch(0.72 0.16 160)",
    coverIds: ["interstellar"],
    kind: "memory",
    milestones: [m("First 25", true), m("Halfway", true), m("75", true), m("100", false)],
  },
];

export const getCurrentGoals = () => GOALS_FULL.filter((g) => g.status === "Active");
export const getCompletedGoals = () => GOALS_FULL.filter((g) => g.status === "Completed");
export const getUpcomingGoals = () => GOALS_FULL.filter((g) => g.status === "Planning");
export const getPrimaryGoal = (): Goal | null =>
  getCurrentGoals().sort((a, b) => b.current / b.target - a.current / a.target)[0] ?? null;

export function getGoalInsights() {
  return [
    "You complete creator collections consistently.",
    "Fantasy goals finish faster than Sci-Fi.",
    "Your reading goals slow in summer.",
    "You always reach the 75% milestone — finishing is the hard part.",
  ];
}

export function getJourneyStatistics() {
  return {
    completionRate: 68,
    averageJourneyDays: 142,
    successfulGenre: "Fantasy",
    successfulCreator: "Nolan",
    favoriteType: "Creator collections",
    challengeSuccess: 74,
  };
}

export function rankGoals(): Goal[] {
  return [...GOALS_FULL].sort((a, b) => b.current / b.target - a.current / a.target);
}

export function getRelatedGoal(mediaId: string): Goal | null {
  return (
    GOALS_FULL.find(
      (g) => g.coverIds.includes(mediaId) || g.title.toLowerCase().includes(mediaId.toLowerCase()),
    ) ?? null
  );
}

export const _media = MEDIA;
