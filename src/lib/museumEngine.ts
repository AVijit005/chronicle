// Personal Museum — curated editorial selections from MEDIA.
import { MEDIA, type MediaItem } from "@/lib/types";

export interface MuseumGallery {
  id: string;
  title: string;
  subtitle: string;
  items: MediaItem[];
}

const by = (ids: string[]) => ids.map((id) => MEDIA.find((m) => m.id === id)!).filter(Boolean);

export function getMuseum(): MuseumGallery[] {
  return [
    {
      id: "emotional",
      title: "Most Emotional",
      subtitle: "Stories that left a mark.",
      items: by(["interstellar", "dune", "succession"]),
    },
    {
      id: "beautiful",
      title: "Most Beautiful",
      subtitle: "Visually unforgettable.",
      items: by(["dune", "interstellar", "one-piece"]),
    },
    {
      id: "impactful",
      title: "Most Impactful",
      subtitle: "Changed how you see things.",
      items: by(["succession", "interstellar", "cs50"]),
    },
    {
      id: "nostalgic",
      title: "Most Nostalgic",
      subtitle: "The early loves.",
      items: by(["harry-potter", "one-piece", "dark-side"]),
    },
    {
      id: "replayed",
      title: "Most Replayed",
      subtitle: "Returned to, again and again.",
      items: by(["interstellar", "elden-ring", "dark-side"]),
    },
    {
      id: "inspiring",
      title: "Most Inspiring",
      subtitle: "Lit something inside.",
      items: by(["cs50", "interstellar", "dune"]),
    },
    {
      id: "masterpieces",
      title: "Personal Masterpieces",
      subtitle: "Your highest shelf.",
      items: by(["dark-side", "interstellar", "elden-ring", "succession"]),
    },
  ];
}
