import { PremiumGlass } from "@/components/ui/PremiumGlass";
import type { Collection } from "@/lib/types";

export function CollectionStory({ collection: c }: { collection: Collection }) {
  return (
    <PremiumGlass variant="subtle">
      <div className="p-7 md:p-8">
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          The story
        </div>
        <p className="mt-3 max-w-prose font-display text-xl leading-snug tracking-tight md:text-2xl">
          You began collecting <span className="text-foreground">{c.name}</span> in {c.createdAt}.
          It slowly became one of the shelves you keep returning to. Today it contains {c.count}{" "}
          stories — quiet additions, mostly on weekends.
        </p>
      </div>
    </PremiumGlass>
  );
}
