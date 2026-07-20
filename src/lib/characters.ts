// Character entity index — deterministic, derived from existing MEDIA.
import { MEDIA, type MediaItem } from "@/lib/types";

export interface Character {
  id: string;
  name: string;
  mediaId: string;
  role: string;
  bio: string;
  accent: string;
  quotes: string[];
  relationships: string[]; // other character ids
}

const RAW: Array<Omit<Character, "accent">> = [
  {
    id: "cooper",
    name: "Joseph Cooper",
    mediaId: "interstellar",
    role: "Pilot · Father",
    bio: "A widowed engineer who leaves Earth to find a future for his children.",
    quotes: [
      "We used to look up at the sky and wonder at our place in the stars.",
      "Love is the one thing we're capable of perceiving that transcends dimensions.",
    ],
    relationships: ["murph"],
  },
  {
    id: "murph",
    name: "Murphy Cooper",
    mediaId: "interstellar",
    role: "Daughter · Physicist",
    bio: "The daughter who solves gravity.",
    quotes: ["Eureka."],
    relationships: ["cooper"],
  },
  {
    id: "luffy",
    name: "Monkey D. Luffy",
    mediaId: "one-piece",
    role: "Captain",
    bio: "A rubber-bodied pirate sailing toward the One Piece.",
    quotes: [
      "I'm gonna be King of the Pirates!",
      "If you don't take risks, you can't create a future.",
    ],
    relationships: ["zoro"],
  },
  {
    id: "zoro",
    name: "Roronoa Zoro",
    mediaId: "one-piece",
    role: "Swordsman",
    bio: "The first mate who dreams of becoming the world's greatest swordsman.",
    quotes: ["Nothing happened."],
    relationships: ["luffy"],
  },
  {
    id: "v",
    name: "V",
    mediaId: "cyberpunk",
    role: "Mercenary",
    bio: "A street merc trying to outrun a death sentence in their head.",
    quotes: ["Wake the f*** up, samurai. We have a city to burn."],
    relationships: [],
  },
  {
    id: "paul",
    name: "Paul Atreides",
    mediaId: "dune",
    role: "Heir of House Atreides",
    bio: "A young noble who becomes the prophesied Kwisatz Haderach.",
    quotes: ["The mystery of life isn't a problem to solve, but a reality to experience."],
    relationships: [],
  },
  {
    id: "harry",
    name: "Harry Potter",
    mediaId: "harry-potter",
    role: "Wizard",
    bio: "The boy who lived, drawn into the Triwizard Tournament.",
    quotes: ["It does not do to dwell on dreams and forget to live."],
    relationships: [],
  },
  {
    id: "roy",
    name: "Logan Roy",
    mediaId: "succession",
    role: "Patriarch",
    bio: "Founder of a media empire who refuses to step down.",
    quotes: ["You are not serious people."],
    relationships: [],
  },
  {
    id: "denji",
    name: "Denji",
    mediaId: "chainsaw-man",
    role: "Devil Hunter",
    bio: "A boy fused with a chainsaw devil. Wants bread, jam, and a hug.",
    quotes: ["I just wanted a normal life."],
    relationships: [],
  },
  {
    id: "tarnished",
    name: "The Tarnished",
    mediaId: "elden-ring",
    role: "Player",
    bio: "An exile returned to the Lands Between to claim the Elden Ring.",
    quotes: ["Rise, Tarnished."],
    relationships: [],
  },
];

export const CHARACTERS: Character[] = RAW.map((c) => {
  const media = MEDIA.find((m) => m.id === c.mediaId);
  return { ...c, accent: media?.accent ?? "oklch(0.72 0.18 255)" };
});

export const charactersOfMedia = (mediaId: string): Character[] =>
  CHARACTERS.filter((c) => c.mediaId === mediaId);

export const charactersByMedia = (m: MediaItem) => charactersOfMedia(m.id);

export const getCharacter = (id: string): Character | undefined =>
  CHARACTERS.find((c) => c.id === id);
