import { PremiumGlass } from "@/components/ui/PremiumGlass";
import type { Collection } from "@/lib/types";

export function CuratorNotes({ collection: c }: { collection: Collection }) {
  return (
    <PremiumGlass variant="subtle">
      <div className="p-6 md:p-7">
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Curator notes
        </div>
        <p className="mt-3 max-w-prose font-display text-lg leading-snug tracking-tight">
          {c.name} exists because of a feeling I wanted to keep. Every addition has to share that
          feeling. The shelf grows slowly — sometimes only one story a season. That's the point.
        </p>
      </div>
    </PremiumGlass>
  );
}
