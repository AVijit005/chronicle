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
  return [];
}
