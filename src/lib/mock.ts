// Realistic placeholder data for Chronicle. Frontend-only.

export type MediaKind =
  | "movie"
  | "series"
  | "anime"
  | "book"
  | "manga"
  | "game"
  | "music"
  | "podcast"
  | "course"
  | "youtube";

export interface MediaItem {
  [key: string]: any;
  mediaId?: string;
  mediaType?: string;
  lastInteractionAt?: string | null;
  progressLabel?: string | null;
  favorite?: boolean | null;
  slug?: string | null;
  rewatchCount?: number | null;
  id: string;
  title: string;
  kind: MediaKind | string;
  year: number;
  poster: string;
  backdrop?: string | null;
  rating?: number | null; // 0-5
  progress?: number | null; // 0-100
  status: "watching" | "completed" | "planned" | "paused" | string;
  genres: string[];
  runtime?: string | null;
  creator?: string | null;
  accent?: string | null; // oklch
  synopsis: string;
}

const u = (id: string, w = 800, h = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const MEDIA: MediaItem[] = [
  {
    id: "interstellar",
    title: "Interstellar",
    kind: "movie",
    year: 2014,
    poster: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    rating: 4.8,
    progress: 100,
    status: "completed",
    genres: ["Sci-Fi", "Drama"],
    runtime: "2h 49m",
    creator: "Christopher Nolan",
    accent: "oklch(0.65 0.2 230)",
    synopsis:
      "A team of explorers travels through a wormhole in space to ensure humanity's survival.",
  },
  {
    id: "one-piece",
    title: "One Piece",
    kind: "anime",
    year: 1999,
    poster: u("photo-1578632767115-351597cf2477"),
    backdrop: u("photo-1505142468610-359e7d316be0", 1920, 1080),
    rating: 4.9,
    progress: 67,
    status: "watching",
    genres: ["Adventure", "Shōnen"],
    runtime: "24m / ep",
    creator: "Eiichiro Oda",
    accent: "oklch(0.78 0.18 50)",
    synopsis:
      "Monkey D. Luffy sets out on a journey to find the legendary treasure known as One Piece.",
  },
  {
    id: "cyberpunk",
    title: "Cyberpunk 2077",
    kind: "game",
    year: 2020,
    poster: u("photo-1542751371-adc38448a05e"),
    backdrop: u("photo-1518709268805-4e9042af9f23", 1920, 1080),
    rating: 4.4,
    progress: 42,
    status: "watching",
    genres: ["RPG", "Open World"],
    runtime: "70h main",
    creator: "CD Projekt Red",
    accent: "oklch(0.78 0.2 320)",
    synopsis:
      "An open-world RPG set in the dystopian Night City — a city obsessed with power, glamor and body modification.",
  },
  {
    id: "dune",
    title: "Dune: Part Two",
    kind: "movie",
    year: 2024,
    poster: u("photo-1518929458119-e5bf444c30f4"),
    backdrop: u("photo-1419242902214-272b3f66ee7a", 1920, 1080),
    rating: 4.7,
    progress: 100,
    status: "completed",
    genres: ["Sci-Fi", "Epic"],
    runtime: "2h 46m",
    creator: "Denis Villeneuve",
    accent: "oklch(0.75 0.15 65)",
    synopsis:
      "Paul Atreides unites with the Fremen to wage war against the conspirators who destroyed his family.",
  },
  {
    id: "harry-potter",
    title: "Harry Potter & the Goblet of Fire",
    kind: "book",
    year: 2000,
    poster: u("photo-1500673922987-e212871fec22"),
    rating: 4.6,
    progress: 84,
    status: "watching",
    genres: ["Fantasy", "YA"],
    runtime: "636 pages",
    creator: "J. K. Rowling",
    accent: "oklch(0.62 0.2 295)",
    synopsis:
      "Harry's name emerges from the Goblet of Fire, drawing him into the deadly Triwizard Tournament.",
  },
  {
    id: "succession",
    title: "Succession",
    kind: "series",
    year: 2018,
    poster: u("photo-1485846234645-a62644f84728"),
    backdrop: u("photo-1480714378408-67cf0d13bc1b", 1920, 1080),
    rating: 4.8,
    progress: 100,
    status: "completed",
    genres: ["Drama", "Satire"],
    runtime: "4 seasons",
    creator: "Jesse Armstrong",
    accent: "oklch(0.6 0.05 240)",
    synopsis:
      "The Roy family controls one of the world's largest media empires — and the question of who will succeed.",
  },
  {
    id: "chainsaw-man",
    title: "Chainsaw Man",
    kind: "manga",
    year: 2018,
    poster: u("photo-1611673025387-78f3fb1cb56e"),
    rating: 4.7,
    progress: 55,
    status: "watching",
    genres: ["Action", "Dark"],
    runtime: "150 ch",
    creator: "Tatsuki Fujimoto",
    accent: "oklch(0.65 0.25 25)",
    synopsis: "Denji merges with his chainsaw devil dog Pochita to become the Chainsaw Man.",
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    kind: "game",
    year: 2022,
    poster: u("photo-1538481199705-c710c4e965fc"),
    backdrop: u("photo-1531297484001-80022131f5a1", 1920, 1080),
    rating: 4.9,
    progress: 78,
    status: "watching",
    genres: ["Soulslike", "Open World"],
    runtime: "100h main",
    creator: "FromSoftware",
    accent: "oklch(0.72 0.16 80)",
    synopsis: "Rise, Tarnished. Wield the power of the Elden Ring and become the new Elden Lord.",
  },
  {
    id: "dark-side",
    title: "The Dark Side of the Moon",
    kind: "music",
    year: 1973,
    poster: u("photo-1470225620780-dba8ba36b745"),
    rating: 5.0,
    progress: 100,
    status: "completed",
    genres: ["Prog Rock"],
    runtime: "43m",
    creator: "Pink Floyd",
    accent: "oklch(0.7 0.18 25)",
    synopsis: "A landmark concept album exploring conflict, greed, time and mental illness.",
  },
  {
    id: "lex",
    title: "Lex Fridman Podcast",
    kind: "podcast",
    year: 2018,
    poster: u("photo-1478737270239-2f02b77fc618"),
    rating: 4.3,
    progress: 30,
    status: "watching",
    genres: ["Tech", "Long-form"],
    runtime: "3h avg",
    creator: "Lex Fridman",
    accent: "oklch(0.65 0.15 220)",
    synopsis:
      "Conversations about science, technology, history, philosophy and the nature of intelligence.",
  },
  {
    id: "cs50",
    title: "CS50: Intro to Computer Science",
    kind: "course",
    year: 2024,
    poster: u("photo-1517694712202-14dd9538aa97"),
    rating: 4.9,
    progress: 60,
    status: "watching",
    genres: ["Programming"],
    runtime: "24h",
    creator: "Harvard / David Malan",
    accent: "oklch(0.7 0.2 145)",
    synopsis: "Harvard's introduction to the intellectual enterprises of computer science.",
  },
  {
    id: "mkbhd",
    title: "MKBHD — Studio Tour",
    kind: "youtube",
    year: 2024,
    poster: u("photo-1574375927938-d5a98e8ffe85"),
    rating: 4.4,
    progress: 100,
    status: "completed",
    genres: ["Tech"],
    runtime: "18m",
    creator: "Marques Brownlee",
    accent: "oklch(0.7 0.22 25)",
    synopsis: "A walk-through of MKBHD's new production studio in New Jersey.",
  },
];

export const continueWatching = MEDIA.filter((m) => (m.status === "watching" || m.status === "in_progress"));
export const recentlyCompleted = MEDIA.filter((m) => m.status === "completed").slice(0, 6);
export const featured = MEDIA[1]; // One Piece

export interface RecentActivityItem {
  [key: string]: any;
  libraryId?: string;
  mediaId?: string;
  slug?: string | null;
  posterUrl?: string;
  id: string;
  title: string;
  type: string;
  date: string; // ISO
}

export interface Collection {
  id: string;
  name: string;
  count: number;
  cover: string;
  accent: string;
  description: string;
  covers?: string[]; // for collage
  mediaIds?: string[];
  createdAt?: string;
  updatedAt?: string;
  creator?: string;
  pinned?: boolean;
  featured?: boolean;
  category?: string;
  privacy?: "private" | "public" | "friends";
  completion?: number;
  avgRating?: number;
}
export const COLLECTIONS: Collection[] = [
  {
    id: "nolan",
    name: "The Nolan Universe",
    count: 12,
    cover: u("photo-1462331940025-496dfbfc7564", 1200, 800),
    accent: "oklch(0.65 0.2 230)",
    description: "Every Christopher Nolan film, ranked by rewatch count.",
    covers: [
      u("photo-1462331940025-496dfbfc7564", 800, 800),
      u("photo-1446776877081-d282a0f896e2", 800, 800),
      u("photo-1485846234645-a62644f84728", 800, 800),
      u("photo-1518929458119-e5bf444c30f4", 800, 800),
    ],
    mediaIds: ["interstellar", "dune"],
    createdAt: "Jan 2024",
    updatedAt: "2 days ago",
    creator: "You",
    pinned: true,
    featured: true,
    category: "Director",
    privacy: "private",
    completion: 92,
    avgRating: 4.8,
  },
  {
    id: "ghibli",
    name: "Studio Ghibli",
    count: 18,
    cover: u("photo-1490902931801-d6f80ca94fe4", 1200, 800),
    accent: "oklch(0.75 0.15 145)",
    description: "Hand-drawn worlds I keep returning to.",
    covers: [
      u("photo-1490902931801-d6f80ca94fe4", 800, 800),
      u("photo-1578632767115-351597cf2477", 800, 800),
      u("photo-1611673025387-78f3fb1cb56e", 800, 800),
      u("photo-1532012197267-da84d127e765", 800, 800),
    ],
    mediaIds: ["one-piece", "chainsaw-man"],
    createdAt: "Feb 2024",
    updatedAt: "Last week",
    creator: "You",
    pinned: true,
    featured: true,
    category: "Studio",
    privacy: "public",
    completion: 78,
    avgRating: 4.9,
  },
  {
    id: "souls",
    name: "Soulslike Pilgrimage",
    count: 7,
    cover: u("photo-1531297484001-80022131f5a1", 1200, 800),
    accent: "oklch(0.7 0.18 35)",
    description: "From Demon's Souls to Elden Ring.",
    covers: [
      u("photo-1531297484001-80022131f5a1", 800, 800),
      u("photo-1538481199705-c710c4e965fc", 800, 800),
      u("photo-1542751371-adc38448a05e", 800, 800),
      u("photo-1518709268805-4e9042af9f23", 800, 800),
    ],
    mediaIds: ["elden-ring", "cyberpunk"],
    createdAt: "Mar 2024",
    updatedAt: "Yesterday",
    creator: "You",
    pinned: false,
    featured: true,
    category: "Genre",
    privacy: "private",
    completion: 64,
    avgRating: 4.7,
  },
  {
    id: "shelf",
    name: "2025 Reading Shelf",
    count: 24,
    cover: u("photo-1532012197267-da84d127e765", 1200, 800),
    accent: "oklch(0.7 0.16 80)",
    description: "Books I'm working through this year.",
    covers: [
      u("photo-1532012197267-da84d127e765", 800, 800),
      u("photo-1500673922987-e212871fec22", 800, 800),
      u("photo-1470225620780-dba8ba36b745", 800, 800),
      u("photo-1478737270239-2f02b77fc618", 800, 800),
    ],
    mediaIds: ["harry-potter"],
    createdAt: "Jan 2025",
    updatedAt: "3 days ago",
    creator: "You",
    pinned: true,
    featured: false,
    category: "Year",
    privacy: "private",
    completion: 41,
    avgRating: 4.4,
  },
  {
    id: "mindbender",
    name: "Mind Bending Cinema",
    count: 9,
    cover: u("photo-1517694712202-14dd9538aa97", 1200, 800),
    accent: "oklch(0.65 0.22 295)",
    description: "Films that change shape after the credits roll.",
    covers: [
      u("photo-1517694712202-14dd9538aa97", 800, 800),
      u("photo-1446776877081-d282a0f896e2", 800, 800),
      u("photo-1485846234645-a62644f84728", 800, 800),
      u("photo-1480714378408-67cf0d13bc1b", 800, 800),
    ],
    mediaIds: ["interstellar", "succession"],
    createdAt: "Aug 2024",
    updatedAt: "1 week ago",
    creator: "You",
    pinned: false,
    featured: true,
    category: "Theme",
    privacy: "public",
    completion: 89,
    avgRating: 4.6,
  },
  {
    id: "comfort",
    name: "Weekend Comfort",
    count: 14,
    cover: u("photo-1470225620780-dba8ba36b745", 1200, 800),
    accent: "oklch(0.78 0.18 50)",
    description: "Sunday mornings, soft mornings, warm light.",
    covers: [
      u("photo-1470225620780-dba8ba36b745", 800, 800),
      u("photo-1578632767115-351597cf2477", 800, 800),
      u("photo-1490902931801-d6f80ca94fe4", 800, 800),
      u("photo-1574375927938-d5a98e8ffe85", 800, 800),
    ],
    mediaIds: ["one-piece", "dark-side"],
    createdAt: "Dec 2023",
    updatedAt: "Today",
    creator: "You",
    pinned: false,
    featured: false,
    category: "Mood",
    privacy: "friends",
    completion: 70,
    avgRating: 4.5,
  },
];

export const KIND_LABEL: Record<string, string> = {
  movie: "Movies",
  series: "Series",
  anime: "Anime",
  book: "Books",
  manga: "Manga",
  game: "Games",
  music: "Music",
  podcast: "Podcasts",
  course: "Courses",
  youtube: "YouTube",
};

export const STATS = {
  totalHours: 1284,
  thisWeek: 14.5,
  streak: 47,
  completed: 312,
  inProgress: 11,
  collections: 18,
};

import { mulberry } from "@/lib/seed";
const _r1 = mulberry(42);
export const ACTIVITY_30D = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  hours: Math.round((Math.sin(i / 3) * 2 + 2.5 + _r1() * 1.5) * 10) / 10,
}));

export const JOURNAL = [
  {
    id: "j1",
    date: "Mar 14",
    mood: "Awe",
    title: "Endless docking",
    media: "Interstellar",
    excerpt: "Watched alone, at 2 AM. The docking scene still wrecks me — six viewings in.",
    accent: "oklch(0.65 0.2 230)",
  },
  {
    id: "j2",
    date: "Mar 11",
    mood: "Triumph",
    title: "Malenia, finally",
    media: "Elden Ring",
    excerpt: "Beat Malenia after 41 tries. Felt nothing for an hour, then everything.",
    accent: "oklch(0.72 0.16 80)",
  },
  {
    id: "j3",
    date: "Mar 09",
    mood: "Tender",
    title: "Sunja",
    media: "Pachinko (Lee)",
    excerpt: "Sunja's chapter ended me on the train. Closed the book and just sat there.",
    accent: "oklch(0.7 0.16 25)",
  },
];

export const ACHIEVEMENTS = [
  {
    id: "a1",
    name: "Marathoner",
    description: "Watched 24+ hours in a single week",
    icon: "Flame",
    earned: "2 days ago",
    tier: "Gold",
  },
  {
    id: "a2",
    name: "Cinephile",
    description: "Completed 100 films",
    icon: "Film",
    earned: "Last week",
    tier: "Platinum",
  },
  {
    id: "a3",
    name: "Bookworm",
    description: "Finished 25 books this year",
    icon: "BookOpen",
    earned: "Mar 10",
    tier: "Silver",
  },
  {
    id: "a4",
    name: "Curator",
    description: "Built 10 collections",
    icon: "Layers",
    earned: "Mar 02",
    tier: "Gold",
  },
];

// Memories — emotional feed
export const MEMORIES = [
  {
    id: "m1",
    when: "Yesterday",
    media: MEDIA[0],
    rating: 5,
    note: "One of the greatest endings I've ever experienced.",
    kindLabel: "Completed",
    accent: "oklch(0.65 0.2 230)",
  },
  {
    id: "m2",
    when: "2 weeks ago",
    media: MEDIA[1],
    rating: 0,
    note: "Egghead arc keeps surprising me — episode 1092.",
    kindLabel: "Watching · Ep 1092",
    accent: "oklch(0.78 0.18 50)",
  },
  {
    id: "m3",
    when: "1 month ago",
    media: MEDIA[7],
    rating: 5,
    note: "Finished. Memory saved. Years from now I'll still be there.",
    kindLabel: "Memory saved",
    accent: "oklch(0.72 0.16 80)",
  },
  {
    id: "m4",
    when: "6 weeks ago",
    media: MEDIA[3],
    rating: 4.7,
    note: "The chants. The dunes. The silence after.",
    kindLabel: "Completed",
    accent: "oklch(0.75 0.15 65)",
  },
];

// Memory of the day (nostalgic, one year ago)
export const MEMORY_OF_DAY = {
  when: "One year ago today",
  media: MEDIA[0],
  rating: 5,
  excerpt: "I still remember that ending. Sitting in the dark, not wanting to move.",
};

// Discover Again
export const REDISCOVER = [
  { id: "r1", label: "You rated 5★", item: MEDIA[8] },
  { id: "r2", label: "Finished one year ago", item: MEDIA[0] },
  { id: "r3", label: "You never finished", item: MEDIA[2] },
  { id: "r4", label: "Abandoned midway", item: MEDIA[6] },
  { id: "r5", label: "Haven't played in a while", item: MEDIA[8] },
];

// Upcoming continuations
export const UPCOMING = [
  { id: "u1", media: MEDIA[1], label: "Next episode", when: "Tomorrow", countdown: "21h" },
  { id: "u2", media: MEDIA[5], label: "Next season", when: "Coming soon", countdown: "Q3" },
  { id: "u3", media: MEDIA[3], label: "Part Three", when: "Expected 2026", countdown: "~14mo" },
  { id: "u4", media: MEDIA[7], label: "DLC", when: "Shadow of the Erdtree", countdown: "Out now" },
];

// This week
export const THIS_WEEK = {
  watchTime: 14.5,
  readingTime: 4.2,
  gamingTime: 8.1,
  listeningTime: 6.4,
  completionRate: 82,
  streak: 47,
  favoriteGenre: "Sci-Fi",
};

// Universe distribution
export const UNIVERSE: { kind: MediaKind; count: number; accent: string }[] = [
  { kind: "movie", count: 312, accent: "oklch(0.72 0.18 255)" },
  { kind: "series", count: 47, accent: "oklch(0.6 0.05 240)" },
  { kind: "anime", count: 28, accent: "oklch(0.78 0.18 50)" },
  { kind: "book", count: 64, accent: "oklch(0.62 0.2 295)" },
  { kind: "manga", count: 18, accent: "oklch(0.65 0.25 25)" },
  { kind: "game", count: 41, accent: "oklch(0.72 0.16 80)" },
  { kind: "music", count: 220, accent: "oklch(0.7 0.18 25)" },
  { kind: "podcast", count: 9, accent: "oklch(0.65 0.15 220)" },
];

// Goals
export const GOALS = [
  { id: "g1", label: "Watch 100 movies", current: 72, target: 100, accent: "oklch(0.72 0.18 255)" },
  { id: "g2", label: "Read 52 books", current: 19, target: 52, accent: "oklch(0.62 0.2 295)" },
  {
    id: "g3",
    label: "365 journal entries",
    current: 94,
    target: 365,
    accent: "oklch(0.72 0.16 160)",
  },
  { id: "g4", label: "Complete 10 games", current: 4, target: 10, accent: "oklch(0.72 0.16 80)" },
];

// Favorites spotlight
export const FAVORITES = [
  { id: "f1", label: "Favorite Movie", item: MEDIA[0] },
  { id: "f2", label: "Favorite Anime", item: MEDIA[1] },
  { id: "f3", label: "Favorite Book", item: MEDIA[4] },
  { id: "f4", label: "Favorite Game", item: MEDIA[7] },
  { id: "f5", label: "Favorite Album", item: MEDIA[8] },
];

// Insights — floating cards
export const INSIGHTS = [
  "You watched 14.5 hours this week — your highest in a month.",
  "You've completed 82% of your current goals.",
  "More Sci-Fi than Drama this month for the first time.",
  "You haven't written a journal in 6 days.",
];

// Quotes
export const QUOTES = [
  "Every story you finish becomes part of your story.",
  "Pay attention. It's the most basic form of love.",
  "Stories are the wildest things of all.",
  "You read to know you are not alone.",
];

// ============================================================
// Media Detail extensions (per-media memory, info, timeline, stats)
// ============================================================
export interface MediaDetail {
  memory: {
    date: string;
    rating: number;
    mood: string;
    location: string;
    note: string;
    tags: string[];
  };
  info: { label: string; value: string }[];
  timeline: {
    type: "started" | "paused" | "continued" | "completed" | "journal" | "collection";
    label: string;
    when: string;
  }[];
  stats: { rewatches: number; totalHours: number; firstSeen: string; lastSeen: string };
  relatedIds: string[];
  collectionIds: string[];
  continueLabel: string;
  continueDetail: string;
}
const baseDetail: MediaDetail = {
  memory: {
    date: "March 18, 2025",
    rating: 5,
    mood: "Awe",
    location: "Brooklyn, NY",
    note: "I still remember the ending. Sitting in the dark, not wanting to move.",
    tags: ["late-night", "tears", "alone", "rewatch"],
  },
  info: [
    { label: "Director", value: "Christopher Nolan" },
    { label: "Studio", value: "Paramount" },
    { label: "Genres", value: "Sci-Fi · Drama" },
    { label: "Runtime", value: "2h 49m" },
    { label: "Language", value: "English" },
    { label: "Release", value: "2014" },
    { label: "Platform", value: "Personal library" },
    { label: "Status", value: "Completed" },
  ],
  timeline: [
    { type: "started", label: "Started watching", when: "Mar 14, 2025" },
    { type: "paused", label: "Paused at 1h 12m", when: "Mar 14" },
    { type: "continued", label: "Continued", when: "Mar 18" },
    { type: "completed", label: "Completed", when: "Mar 18, 2025" },
    { type: "journal", label: "Added journal entry", when: "Mar 18" },
    { type: "collection", label: "Added to Mind Bending Cinema", when: "Mar 19" },
  ],
  stats: { rewatches: 4, totalHours: 11, firstSeen: "Nov 2014", lastSeen: "Mar 2025" },
  relatedIds: ["dune", "succession", "elden-ring", "harry-potter"],
  collectionIds: ["nolan", "mindbender"],
  continueLabel: "Continue Watching",
  continueDetail: "1h 37m remaining",
};
export const MEDIA_DETAIL: Record<string, MediaDetail> = Object.fromEntries(
  MEDIA.map((m) => {
    const kindLabel: Record<string, string> = {
      movie: "Continue Watching",
      series: "Continue Watching",
      anime: "Continue Watching",
      book: "Continue Reading",
      manga: "Continue Reading",
      game: "Continue Playing",
      music: "Continue Listening",
      podcast: "Continue Listening",
      course: "Continue Learning",
      youtube: "Continue Watching",
    };
    return [
      m.id,
      {
        ...baseDetail,
        continueLabel: kindLabel[m.kind],
        continueDetail:
          m.kind === "book" || m.kind === "manga"
            ? `Page ${Math.round((m.progress ?? 50) * 6.4)} of 640`
            : m.kind === "game"
              ? `Save ${Math.round((m.progress ?? 30) / 10)} · ${100 - (m.progress ?? 30)}% to go`
              : m.kind === "anime" || m.kind === "series"
                ? `Episode ${Math.round((m.progress ?? 30) / 2)} · 18m left`
                : `${Math.round(((100 - (m.progress ?? 30)) / 100) * 170)}m remaining`,
        info: [
          { label: "Creator", value: m.creator ?? "—" },
          { label: "Year", value: String(m.year) },
          { label: "Kind", value: KIND_LABEL[m.kind] },
          { label: "Genres", value: m.genres.join(" · ") },
          { label: "Runtime", value: m.runtime ?? "—" },
          { label: "Language", value: "English" },
          { label: "Status", value: m.status.charAt(0).toUpperCase() + m.status.slice(1) },
          { label: "Rating", value: `${((m.rating ?? 0) ?? 0).toFixed(1)} / 5` },
        ],
        relatedIds: MEDIA.filter((x) => x.id !== m.id && x.kind === m.kind)
          .slice(0, 4)
          .map((x) => x.id)
          .concat(
            MEDIA.filter((x) => x.id !== m.id)
              .slice(0, 4)
              .map((x) => x.id),
          )
          .slice(0, 4),
        collectionIds: COLLECTIONS.filter((c) => c.mediaIds?.includes(m.id)).map((c) => c.id),
      },
    ];
  }),
);

// ============================================================
// Universal Search data
// ============================================================
export const RECENT_SEARCHES = ["interstellar", "ghibli", "elden ring", "journal", "dune"];
export const PINNED_MEDIA = ["interstellar", "one-piece", "elden-ring"]
  .map((id) => MEDIA.find((m) => m.id === id)!)
  .filter(Boolean);
export const POPULAR_MEDIA = ["dune", "succession", "chainsaw-man", "harry-potter"]
  .map((id) => MEDIA.find((m) => m.id === id)!)
  .filter(Boolean);
export const RECENT_JOURNALS = JOURNAL.slice(0, 3);
export const SEARCHABLE_SETTINGS = [
  { id: "s1", label: "Appearance", hint: "Theme, density, motion", to: "/app/settings" as const },
  { id: "s2", label: "Notifications", hint: "Emails, reminders", to: "/app/settings" as const },
  { id: "s3", label: "Privacy", hint: "Visibility, sharing", to: "/app/settings" as const },
  {
    id: "s4",
    label: "Connections",
    hint: "Trakt, Last.fm, Goodreads",
    to: "/app/settings" as const,
  },
];
