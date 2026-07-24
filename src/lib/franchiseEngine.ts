// Franchise engine — manual seed grouping of media into franchises.
// Covers resolve from live library data passed by consuming components.
import type { MediaItem, Collection } from "@/lib/types";

export interface Franchise {
  id: string;
  name: string;
  description: string;
  cover: string;
  mediaIds: string[];
}

export const FRANCHISES: Franchise[] = [
  {
    id: "nolan",
    name: "Christopher Nolan",
    description: "Time, space, and the weight of a single choice.",
    cover: "",
    mediaIds: ["interstellar", "inception", "dunkirk", "tenet", "oppenheimer"],
  },
  {
    id: "one-piece",
    name: "One Piece",
    description: "The grandest voyage ever put to page or screen.",
    cover: "",
    mediaIds: ["one-piece"],
  },
  {
    id: "dune",
    name: "Dune",
    description: "Spice, sand, and prophecy.",
    cover: "",
    mediaIds: ["dune", "dune-part-two"],
  },
  {
    id: "harry-potter",
    name: "Harry Potter",
    description: "The boy who lived, and the world that lived with him.",
    cover: "",
    mediaIds: ["harry-potter"],
  },
  {
    id: "elden-ring",
    name: "Elden Ring",
    description: "A shattered world, waiting to be reforged.",
    cover: "",
    mediaIds: ["elden-ring"],
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "High-tech, low-life. Neon and chrome.",
    cover: "",
    mediaIds: ["cyberpunk-2077", "edgerunners"],
  },
];

export function getFranchiseCovers(_items: MediaItem[]): Record<string, string> {
  return {};
}

export function getFranchiseMedia(franchise: Franchise, _items: MediaItem[]): MediaItem[] {
  return [];
}

export function getAllFranchises(_items: MediaItem[]): Franchise[] {
  return FRANCHISES;
}

export function buildFranchiseProfile(id: string): Franchise | undefined {
  return FRANCHISES.find((f) => f.id === id);
}
