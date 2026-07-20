import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getSessions } from "@/lib/mediaStory";
import type { MediaItem } from "@/lib/types";

export function SessionHistory({ item }: { item: MediaItem }) {
  const sessions = getSessions(item);
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {sessions.map((s, i) => (
        <li key={i}>
          <PremiumGlass variant="subtle">
            <div className="p-4">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <span>{s.date}</span>
                <span>{s.duration}</span>
              </div>
              <div className="mt-1 text-sm">
                Progress {s.progress} · {s.mood}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">{s.note}</p>
            </div>
          </PremiumGlass>
        </li>
      ))}
    </ul>
  );
}
