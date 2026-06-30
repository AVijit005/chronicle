import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getEditorialStats } from "@/lib/mediaStory";
import type { MediaItem } from "@/lib/mock";

export function EditorialStats({ item }: { item: MediaItem }) {
  const stats = getEditorialStats(item);
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((s) => (
        <li key={s.label}>
          <PremiumGlass variant="subtle">
            <div className="p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-1 font-display text-2xl tracking-tight tabular-nums">
                {s.value}
              </div>
            </div>
          </PremiumGlass>
        </li>
      ))}
    </ul>
  );
}
