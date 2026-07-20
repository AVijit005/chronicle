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

export const KIND_LABEL: Record<MediaKind, string> = {
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

export interface MediaItem {
  id: string;
  title: string;
  kind: MediaKind | string;
  year: number;
  poster?: string | null;
  backdrop?: string | null;
  rating?: number | null; // 0-5
  progress?: number | null; // 0-100
  status: string;
  genres: string[];
  runtime?: string | null;
  creator?: string | null;
  accent?: string | null; // oklch
  synopsis: string;
  _libraryId?: string | null; // from api adapters
  _mediaId?: string | null; // from api adapters
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

export const MEDIA: MediaItem[] = [];
export const COLLECTIONS: Collection[] = [];
export const JOURNAL: any[] = [];
export const THIS_WEEK: any[] = [];
export const ACTIVITY_30D: any[] = [];
export const STATS: any = {};
export const CALENDAR_HERO: any = {};
export const CALENDAR_INSIGHTS: any = {};
export const YEAR_HEATMAP: any = {};
export const CALENDAR_HIGHLIGHTS: any[] = [];
export const MEMORY_STREAKS: any = {};
export const UPCOMING_RELEASES: any[] = [];
export const CALENDAR_YEAR: any = {};
export const JOURNAL_PROMPTS: any[] = [];

export const MEMORY_CLUSTERS: any[] = [];

export const QUOTES: any[] = [];
export const PINNED_MEDIA: any[] = [];
export const RECENT_JOURNALS: any[] = [];
export const SEARCHABLE_SETTINGS: any[] = [];
export const ACHIEVEMENTS: any[] = [];
