// Character entity index — deterministic, derived from media references.
// Media lookups resolved by consuming components from live library data.
import type { MediaItem } from "@/lib/types";

export interface Character {
  id: string;
  name: string;
  mediaId: string;
  role: string;
  bio: string;
  accent: string;
  poster?: string;
}

export const CHARACTERS: Character[] = [
  {
    id: "cooper",
    name: "Cooper",
    mediaId: "interstellar",
    role: "Protagonist",
    bio: "A pilot and engineer who leaves everything behind to save humanity.",
    accent: "oklch(0.72 0.18 255)",
  },
  {
    id: "murph",
    name: "Murph",
    mediaId: "interstellar",
    role: "Scientist",
    bio: "The daughter who grew up solving the equation her father couldn't stay to finish.",
    accent: "oklch(0.65 0.22 295)",
  },
  {
    id: "luffy",
    name: "Monkey D. Luffy",
    mediaId: "one-piece",
    role: "Captain",
    bio: "A boy made of rubber who declared war on the world to protect his friends.",
    accent: "oklch(0.7 0.18 25)",
  },
  {
    id: "paul",
    name: "Paul Atreides",
    mediaId: "dune",
    role: "Protagonist",
    bio: "The heir who walked into the desert and found his destiny waiting.",
    accent: "oklch(0.82 0.16 80)",
  },
  {
    id: "v",
    name: "V",
    mediaId: "cyberpunk-2077",
    role: "Mercenary",
    bio: "A legend of Night City, carrying a chip and a ghost in their head.",
    accent: "oklch(0.72 0.16 160)",
  },
  {
    id: "tarnished",
    name: "The Tarnished",
    mediaId: "elden-ring",
    role: "Champion",
    bio: "One of the dead who yet lives, seeking the shattered Elden Ring.",
    accent: "oklch(0.85 0.2 100)",
  },
  {
    id: "guts",
    name: "Guts",
    mediaId: "berserk",
    role: "Warrior",
    bio: "The Black Swordsman. Branded, betrayed, and still standing.",
    accent: "oklch(0.6 0.2 15)",
  },
  {
    id: "harry",
    name: "Harry Potter",
    mediaId: "harry-potter",
    role: "Protagonist",
    bio: "The boy who lived, shaped by loss and the courage to face it.",
    accent: "oklch(0.65 0.2 265)",
  },
];

export function findCharacter(mediaId: string): Character | undefined {
  return CHARACTERS.find((c) => c.mediaId === mediaId);
}

export function getCharacter(id: string): Character | undefined {
  return CHARACTERS.find((c) => c.id === id);
}

export function getCharacterMedia(_character: Character, _items: MediaItem[]): MediaItem | undefined {
  return undefined;
}
