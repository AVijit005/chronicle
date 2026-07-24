// Challenges — deterministic personal prompts.
import type { MediaItem } from "@/lib/types";

export type ChallengeKind =
  | "Monthly"
  | "Season"
  | "Weekend"
  | "Creator"
  | "Genre"
  | "Memory"
  | "Journal"
  | "Comfort";

export interface Challenge {
  id: string;
  kind: ChallengeKind;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: string;
  expiresIn?: string;
  suggestions: MediaItem[];
  accent: string;
}

export const CHALLENGES: Challenge[] = [];

export const getChallenges = () => CHALLENGES;
export const getRecommendedChallenge = (): Challenge | undefined => CHALLENGES[0];
export const getActiveChallenge = (): Challenge | undefined =>
  CHALLENGES.find((c) => c.current < c.target) ?? CHALLENGES[0];
