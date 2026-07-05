/**
 * Media type adapter: Backend mediaType → Frontend UIMediaKind
 *
 * Backend uses granular types: tvShow, musicAlbum, tvSeason, etc.
 * Frontend uses simplified kinds: series, music, etc.
 */

import type { UIMediaKind } from "./types";

const MEDIA_TYPE_MAP: Record<string, UIMediaKind> = {
  movie: "movie",
  tvShow: "series",
  anime: "anime",
  book: "book",
  manga: "manga",
  game: "game",
  musicAlbum: "music",
  podcast: "podcast",
  course: "course",
  // Sub-entity types map to parent kind
  tvSeason: "series",
  tvEpisode: "series",
  animeEpisode: "anime",
  musicArtist: "music",
  musicTrack: "music",
  podcastEpisode: "podcast",
  courseModule: "course",
  courseLesson: "course",
};

export function adaptMediaType(backendType: string): UIMediaKind {
  return MEDIA_TYPE_MAP[backendType] ?? "movie";
}

export function adaptMediaTypeToBackend(uiKind: UIMediaKind): string {
  const REVERSE_MAP: Record<UIMediaKind, string> = {
    movie: "movie",
    series: "tvShow",
    anime: "anime",
    book: "book",
    manga: "manga",
    game: "game",
    music: "musicAlbum",
    podcast: "podcast",
    course: "course",
    youtube: "youtube",
  };
  return REVERSE_MAP[uiKind] ?? "movie";
}
