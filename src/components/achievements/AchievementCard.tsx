import { PremiumGlass } from "@/components/ui/PremiumGlass";
import type { Achievement } from "@/lib/achievements";
import { cn } from "@/lib/utils";

export function AchievementCard({
  achievement: a,
  className,
}: {
  achievement: Achievement;
  className?: string;
}) {
  return (
    <PremiumGlass variant="subtle" className={cn("h-full", className)}>
      <article className="p-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">{a.category}</div>
        <div className="mt-1 font-display text-base tracking-tight">{a.name}</div>
        <p className="mt-1 text-[11px] text-muted-foreground">{a.caption}</p>
        <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          {a.earnedAt}
        </div>
      </article>
    </PremiumGlass>
  );
}
