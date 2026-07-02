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
  kind: MediaKind;
  year: number;
  poster: string;
  backdrop?: string;
  rating: number; // 0-5
  progress?: number; // 0-100
  status: "watching" | "completed" | "planned" | "paused";
  genres: string[];
  runtime?: string;
  creator?: string;
  accent?: string; // oklch
  synopsis: string;
  _libraryId?: string; // from api adapters
  _mediaId?: string; // from api adapters
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
