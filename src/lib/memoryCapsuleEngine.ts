// Memory capsule grouper — editorial capsules generated deterministically.
import { MEDIA, type MediaItem } from "@/lib/mock";

export interface Capsule {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  cover: string;
  mediaIds: string[];
}

export function getCapsules(): Capsule[] {
  const anime = MEDIA.filter((m) => m.kind === "anime" || m.kind === "manga");
  const ghibli = MEDIA.filter(
    (m) => m.creator?.toLowerCase().includes("oda") || m.kind === "anime",
  );
  const reading = MEDIA.filter((m) => m.kind === "book" || m.kind === "manga");
  const lateNight = MEDIA.filter((m) => m.kind === "movie");
  const games = MEDIA.filter((m) => m.kind === "game");
  const placement = MEDIA.filter((m) => m.kind === "course" || m.kind === "podcast");
  const pick = (a: MediaItem[]) => a[0]?.poster ?? MEDIA[0]!.poster;

  return [
    {
      id: "summer-anime",
      title: "Your Summer of Anime",
      subtitle: "Late-night marathons & morning episodes.",
      accent: "oklch(0.78 0.18 50)",
      cover: pick(anime),
      mediaIds: anime.map((m) => m.id),
    },
    {
      id: "placement",
      title: "Placement Preparation",
      subtitle: "When learning became your nightly ritual.",
      accent: "oklch(0.7 0.2 145)",
      cover: pick(placement),
      mediaIds: placement.map((m) => m.id),
    },
    {
      id: "reading-2025",
      title: "2025 Reading Journey",
      subtitle: "Pages turned, one quiet morning at a time.",
      accent: "oklch(0.62 0.2 295)",
      cover: pick(reading),
      mediaIds: reading.map((m) => m.id),
    },
    {
      id: "one-piece-era",
      title: "One Piece Era",
      subtitle: "The sail that never ends.",
      accent: "oklch(0.78 0.18 50)",
      cover: pick(anime),
      mediaIds: ["one-piece"],
    },
    {
      id: "late-night-movies",
      title: "Late Night Movies",
      subtitle: "Films that found you after midnight.",
      accent: "oklch(0.65 0.2 230)",
      cover: pick(lateNight),
      mediaIds: lateNight.map((m) => m.id),
    },
    {
      id: "ghibli-phase",
      title: "Studio Ghibli Phase",
      subtitle: "Hand-drawn worlds you returned to.",
      accent: "oklch(0.75 0.15 145)",
      cover: pick(ghibli),
      mediaIds: ghibli.slice(0, 4).map((m) => m.id),
    },
    {
      id: "elden-pilgrimage",
      title: "Elden Pilgrimage",
      subtitle: "Lands Between, hours uncounted.",
      accent: "oklch(0.72 0.16 80)",
      cover: pick(games),
      mediaIds: games.map((m) => m.id),
    },
  ];
}
