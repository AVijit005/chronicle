import { getJourneyEvents } from "@/lib/mediaStory";
import type { MediaItem } from "@/lib/mock";

export function StoryJourney({ item }: { item: MediaItem }) {
  const events = getJourneyEvents(item);
  return (
    <ol className="relative space-y-4 border-l border-white/10 pl-6">
      {events.map((e, i) => (
        <li key={i}>
          <span className="absolute -left-[7px] mt-2 h-3 w-3 rounded-full bg-white/10 ring-1 ring-white/20" />
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">{e.kind}</div>
          <div className="text-sm">{e.label}</div>
          <div className="text-[11px] text-muted-foreground">{e.when}</div>
        </li>
      ))}
    </ol>
  );
}
