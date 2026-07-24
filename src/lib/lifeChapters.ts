// Life chapter grouper — editorial life eras across the timeline.

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
