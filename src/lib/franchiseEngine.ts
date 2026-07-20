// Franchise engine — manual seed grouping of MEDIA into franchises.
import { MEDIA, COLLECTIONS, type MediaItem, type Collection } from "@/lib/types";

export interface Franchise {
  id: string;
  name: string;
  description: string;
  accent: string;
  mediaIds: string[];
  cover: string;
}

export const FRANCHISES: Franchise[] = [
  {
    id: "nolan",
    name: "The Nolan Universe",
    description: "Every Christopher Nolan film.",
    accent: "oklch(0.65 0.2 230)",
    mediaIds: ["interstellar"],
    cover: MEDIA.find((m) => m.id === "interstellar")!.poster,
  },
  {
    id: "one-piece",
    name: "One Piece",
    description: "The Grand Line saga.",
    accent: "oklch(0.78 0.18 50)",
    mediaIds: ["one-piece"],
    cover: MEDIA.find((m) => m.id === "one-piece")!.poster,
  },
  {
    id: "dune",
    name: "Dune Saga",
    description: "Arrakis and the Atreides line.",
    accent: "oklch(0.75 0.15 65)",
    mediaIds: ["dune"],
    cover: MEDIA.find((m) => m.id === "dune")!.poster,
  },
  {
    id: "harry-potter",
    name: "Wizarding World",
    description: "Hogwarts and beyond.",
    accent: "oklch(0.62 0.2 295)",
    mediaIds: ["harry-potter"],
    cover: MEDIA.find((m) => m.id === "harry-potter")!.poster,
  },
  {
    id: "souls",
    name: "Soulslike",
    description: "From Demon's Souls to Elden Ring.",
    accent: "oklch(0.72 0.16 80)",
    mediaIds: ["elden-ring"],
    cover: MEDIA.find((m) => m.id === "elden-ring")!.poster,
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk Universe",
    description: "Night City stories.",
    accent: "oklch(0.78 0.2 320)",
    mediaIds: ["cyberpunk"],
    cover: MEDIA.find((m) => m.id === "cyberpunk")!.poster,
  },
];

export function getFranchise(id: string): Franchise | undefined {
  return FRANCHISES.find((f) => f.id === id);
}

export interface FranchiseProfile {
  franchise: Franchise;
  entries: MediaItem[];
  collections: Collection[];
  completion: number;
  timeline: { id: string; label: string; when: string }[];
}

export function buildFranchiseProfile(id: string): FranchiseProfile | undefined {
  const f = getFranchise(id);
  if (!f) return undefined;
  const entries = MEDIA.filter((m) => f.mediaIds.includes(m.id));
  const collections = COLLECTIONS.filter((c) =>
    c.mediaIds?.some((mid) => f.mediaIds.includes(mid)),
  );
  const completed = entries.filter((m) => m.status === "completed").length;
  return {
    franchise: f,
    entries,
    collections,
    completion: entries.length ? Math.round((completed / entries.length) * 100) : 0,
    timeline: entries
      .map((e) => ({ id: e.id, label: e.title, when: String(e.year) }))
      .sort((a, b) => Number(a.when) - Number(b.when)),
  };
}
