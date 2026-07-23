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

export const GOALS_FULL: Goal[] = [];

export const getCurrentGoals = () => GOALS_FULL.filter((g) => g.status === "Active");
export const getCompletedGoals = () => GOALS_FULL.filter((g) => g.status === "Completed");
export const getUpcomingGoals = () => GOALS_FULL.filter((g) => g.status === "Planning");
export const getPrimaryGoal = (): Goal | null =>
  getCurrentGoals().sort((a, b) => b.current / b.target - a.current / a.target)[0] ?? null;

export function getGoalInsights() {
  return [];
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
