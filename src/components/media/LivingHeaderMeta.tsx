import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getLivingHeader } from "@/lib/mediaStory";
import type { MediaItem } from "@/lib/mock";

export function LivingHeaderMeta({ item }: { item: MediaItem }) {
  const h = getLivingHeader(item);
  const items = [
    { k: "Started", v: h.firstStarted },
    { k: "Last activity", v: h.lastActivity },
    { k: "Current streak", v: `${h.streak} days` },
    { k: "Memory score", v: `${h.memoryScore}%` },
    { k: "Emotion", v: "★".repeat(Math.round(h.emotionScore)) },
    { k: "Completion", v: `${h.completionPct}%` },
  ];
  return (
    <PremiumGlass variant="subtle" className="mt-6">
      <ul className="grid grid-cols-2 gap-px md:grid-cols-3 lg:grid-cols-6">
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
