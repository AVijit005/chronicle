// Life chapter grouper — editorial life eras across the timeline.
import { MEDIA } from "@/lib/types";

export interface LifeChapter {
  id: string;
  title: string;
  era: string;
  description: string;
  accent: string;
  mediaIds: string[];
}

export function getLifeChapters(): LifeChapter[] {
  return [
    {
      id: "school",
      title: "School Era",
      era: "2014–2018",
      description: "When stories first felt important.",
      accent: "oklch(0.62 0.2 295)",
      mediaIds: ["interstellar", "harry-potter"],
    },
    {
      id: "college",
      title: "College",
      era: "2018–2022",
      description: "Late-night anime, library books, the first long journeys.",
      accent: "oklch(0.78 0.18 50)",
      mediaIds: ["one-piece", "chainsaw-man"],
    },
    {
      id: "internship",
      title: "Internship",
      era: "Summer 2022",
      description: "Subway commutes and podcast queues.",
      accent: "oklch(0.65 0.15 220)",
      mediaIds: ["lex"],
    },
    {
      id: "placement",
      title: "Placement Season",
      era: "Late 2022",
      description: "CS50 became your nightly ritual.",
      accent: "oklch(0.7 0.2 145)",
      mediaIds: ["cs50"],
    },
    {
      id: "vacation",
      title: "Vacation",
      era: "Winter 2023",
      description: "Books on the balcony, films on the floor.",
      accent: "oklch(0.7 0.18 25)",
      mediaIds: ["dark-side"],
    },
    {
      id: "summer-2025",
      title: "Summer 2025",
      era: "2025",
      description: "Dune in IMAX. Long evenings.",
      accent: "oklch(0.75 0.15 65)",
      mediaIds: ["dune"],
    },
    {
      id: "winter-memories",
      title: "Winter Memories",
      era: "Now",
      description: "Soulslike pilgrimages and quiet rewatches.",
      accent: "oklch(0.72 0.16 80)",
      mediaIds: ["elden-ring", "spirited-away"],
    },
  ];
}
