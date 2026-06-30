// Challenges — deterministic personal prompts.
import { MEDIA, type MediaItem } from "@/lib/mock";

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

export const CHALLENGES: Challenge[] = [
  {
    id: "ch-month",
    kind: "Monthly",
    title: "Watch 3 documentaries",
    description: "Anything you wouldn't normally pick.",
    target: 3,
    current: 1,
    reward: "A new genre opened.",
    expiresIn: "12 days",
    suggestions: MEDIA.filter((m) => m.kind === "course" || m.kind === "youtube").slice(0, 3),
    accent: "oklch(0.7 0.18 200)",
  },
  {
    id: "ch-season",
    kind: "Season",
    title: "Read 2 classics this season",
    description: "Slowly, by lamplight.",
    target: 2,
    current: 0,
    reward: "Two long evenings.",
    expiresIn: "Until autumn",
    suggestions: MEDIA.filter((m) => m.kind === "book").slice(0, 2),
    accent: "oklch(0.62 0.2 295)",
  },
  {
    id: "ch-weekend",
    kind: "Weekend",
    title: "Finish one unfinished game",
    description: "The one you keep meaning to.",
    target: 1,
    current: 0,
    reward: "A closed chapter.",
    expiresIn: "This weekend",
    suggestions: MEDIA.filter((m) => m.kind === "game").slice(0, 2),
    accent: "oklch(0.72 0.16 80)",
  },
  {
    id: "ch-creator",
    kind: "Creator",
    title: "Explore one new creator",
    description: "Outside your usual library.",
    target: 1,
    current: 0,
    reward: "A new direction.",
    expiresIn: "This month",
    suggestions: MEDIA.slice(2, 4),
    accent: "oklch(0.78 0.18 50)",
  },
  {
    id: "ch-genre",
    kind: "Genre",
    title: "Try one genre you avoid",
    description: "Curiosity over comfort.",
    target: 1,
    current: 0,
    reward: "A widened map.",
    expiresIn: "This month",
    suggestions: MEDIA.slice(4, 6),
    accent: "oklch(0.65 0.22 25)",
  },
  {
    id: "ch-memory",
    kind: "Memory",
    title: "Revisit a comfort story",
    description: "Return to a familiar place.",
    target: 1,
    current: 1,
    reward: "Done — feel free to journal it.",
    expiresIn: "Always",
    suggestions: MEDIA.slice(0, 2),
    accent: "oklch(0.78 0.18 50)",
  },
  {
    id: "ch-journal",
    kind: "Journal",
    title: "Write 5 journal entries",
    description: "Memory becomes story when written.",
    target: 5,
    current: 2,
    reward: "Five remembered things.",
    expiresIn: "This month",
    suggestions: MEDIA.slice(0, 1),
    accent: "oklch(0.72 0.16 160)",
  },
];

export const getChallenges = () => CHALLENGES;
export const getRecommendedChallenge = (): Challenge => CHALLENGES[0]!;
export const getActiveChallenge = (): Challenge =>
  CHALLENGES.find((c) => c.current < c.target) ?? CHALLENGES[0]!;
