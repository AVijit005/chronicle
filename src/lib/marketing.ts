import type { MediaItem, MediaKind } from "./types";

export const MARKETING_MEDIA: MediaItem[] = [
  {
    id: "interstellar",
    title: "Interstellar",
    kind: "movie",
    year: 2014,
    poster:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800",
    backdrop:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=2000",
    rating: 5,
    progress: 100,
    status: "completed",
    genres: ["Sci-Fi", "Drama"],
    runtime: "2h 49m",
    creator: "Christopher Nolan",
    accent: "oklch(0.35 0.1 250)",
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
  },
  {
    id: "one-piece",
    title: "One Piece",
    kind: "anime",
    year: 1999,
    poster:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800",
    backdrop:
      "https://images.unsplash.com/photo-1578022761797-b8636ac1773c?auto=format&fit=crop&q=80&w=2000",
    rating: 4.8,
    progress: 85,
    status: "watching",
    genres: ["Action", "Adventure"],
    runtime: "24m",
    creator: "Eiichiro Oda",
    accent: "oklch(0.55 0.2 25)",
    synopsis: "Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger."
  },
  {
    id: "dune",
    title: "Dune",
    kind: "movie",
    year: 2021,
    poster:
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    status: "completed",
    genres: ["Sci-Fi", "Adventure"],
    synopsis: "Feature adaptation of Frank Herbert's science fiction novel, about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy."
  },
  {
    id: "succession",
    title: "Succession",
    kind: "series",
    year: 2018,
    poster:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    status: "completed",
    genres: ["Drama"],
    synopsis: "The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their father steps down from the company."
  },
  {
    id: "harry-potter",
    title: "Harry Potter",
    kind: "movie",
    year: 2001,
    poster:
      "https://images.unsplash.com/photo-1618944847023-38aa001235f0?auto=format&fit=crop&q=80&w=800",
    rating: 4.2,
    status: "completed",
    genres: ["Fantasy"],
    synopsis: "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world."
  },
  {
    id: "dark-side",
    title: "Dark Side",
    kind: "music",
    year: 1973,
    poster:
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    status: "completed",
    genres: ["Rock"],
    synopsis: "The Dark Side of the Moon is the eighth studio album by the English rock band Pink Floyd."
  },
  {
    id: "lex",
    title: "Lex Fridman",
    kind: "podcast",
    year: 2018,
    poster:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    status: "watching",
    genres: ["Technology"],
    synopsis: "Conversations about science, technology, history, philosophy and the nature of intelligence, consciousness, love, and power."
  },
  {
    id: "mkbhd",
    title: "MKBHD",
    kind: "youtube",
    year: 2008,
    poster:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    status: "watching",
    genres: ["Technology"],
    synopsis: "Quality Tech Videos | YouTuber | Geek | Consumer Electronics | Tech Head | Internet Personality!"
  },
  {
    id: "chainsaw-man",
    title: "Chainsaw Man",
    kind: "anime",
    year: 2022,
    poster:
      "https://images.unsplash.com/photo-1613376023733-f542472d2426?auto=format&fit=crop&q=80&w=800",
    rating: 4.6,
    status: "completed",
    genres: ["Action"],
    synopsis: "Following a betrayal, a young man left for the dead is reborn as a powerful devil-human hybrid after merging with his pet devil and is soon enlisted into an organization dedicated to hunting devils."
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    kind: "game",
    year: 2022,
    poster:
      "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    status: "watching",
    genres: ["RPG"],
    synopsis: "The Golden Order has been broken. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between."
  },
  {
    id: "cyberpunk",
    title: "Cyberpunk 2077",
    kind: "game",
    year: 2020,
    poster:
      "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=800",
    rating: 4.1,
    status: "completed",
    genres: ["RPG"],
    synopsis: "Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification."
  }
];

export const MARKETING_COLLECTIONS = [
  {
    id: "c1",
    name: "Masterpieces",
    count: 24,
    cover: MARKETING_MEDIA[0].poster,
    accent: "oklch(0.72 0.18 255)",
    description: "The greatest stories ever told.",
  },
];
