import { getWhyItWorked } from "@/lib/mediaStory";
import type { MediaItem } from "@/lib/mock";

export function WhyItWorked({ item }: { item: MediaItem }) {
  const tags = getWhyItWorked(item);
  return (
    <div className="space-y-3">
      <p className="font-display text-xl leading-snug tracking-tight">You enjoy</p>
      <ul className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <li
            key={t}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-foreground/85"
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
