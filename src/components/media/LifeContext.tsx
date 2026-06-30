import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getLifeContext } from "@/lib/mediaStory";
import type { MediaItem } from "@/lib/mock";

export function LifeContext({ item }: { item: MediaItem }) {
  const c = getLifeContext(item);
  const items = [
    { k: "Semester", v: c.semester ?? "—" },
    { k: "Travel", v: c.travel ?? "—" },
    { k: "Weather", v: c.weather },
    { k: "Location", v: c.location },
    { k: "Mood", v: c.mood },
    { k: "Journal entries", v: String(c.journalCount) },
  ];
  return (
    <PremiumGlass variant="subtle">
      <ul className="grid grid-cols-2 gap-px md:grid-cols-3">
        {items.map((i) => (
          <li key={i.k} className="p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
              {i.k}
            </div>
            <div className="mt-1 text-sm">{i.v}</div>
          </li>
        ))}
      </ul>
    </PremiumGlass>
  );
}
