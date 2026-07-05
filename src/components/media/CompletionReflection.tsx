import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getCompletionReflection } from "@/lib/mediaStory";
import type { MediaItem } from "@/lib/mock";

export function CompletionReflection({ item }: { item: MediaItem }) {
  if (item.status !== "completed") return null;
  const r = getCompletionReflection(item);
  return (
    <PremiumGlass variant="strong" glow={item.accent ?? undefined}>
      <div className="p-7 md:p-10">
        <div className="text-[10px] uppercase tracking-[0.24em] text-primary/85">Reflection</div>
        <p className="mt-3 font-display text-2xl leading-snug tracking-tight md:text-3xl">
          You spent <span className="text-foreground">{r.hours} hours</span> across{" "}
          <span className="text-foreground">{r.days} days</span> finishing this journey.
        </p>
        <p className="mt-3 font-display text-lg text-muted-foreground">
          Your journal mentions it {r.journalMentions} times. It became one of your{" "}
          <span className="text-foreground">{r.top}</span>.
        </p>
      </div>
    </PremiumGlass>
  );
}
