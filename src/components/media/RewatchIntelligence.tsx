import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getRewatchReasons } from "@/lib/mediaStory";
import type { MediaItem } from "@/lib/types";

export function RewatchIntelligence({ item }: { item: MediaItem }) {
  const reasons = getRewatchReasons(item);
  return (
    <PremiumGlass variant="subtle">
      <div className="p-5">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Why revisit?
        </div>
        <ul className="mt-3 space-y-1.5 text-sm">
          {reasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </PremiumGlass>
  );
}
