import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { PremiumProgress } from "@/components/ui/PremiumProgress";
import type { Goal } from "@/lib/goals";
import { cn } from "@/lib/utils";

interface Props {
  goal?: Goal | null;
  className?: string;
}

export function GoalCard({ goal: g, className }: Props) {
  if (!g) return null;
  const pct = Math.round((g.current / g.target) * 100);
  return (
    <PremiumGlass variant="subtle" className={cn("h-full", className)}>
      <article className="p-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">{g.kind}</div>
        <div className="mt-1 font-display text-base tracking-tight">{g.title}</div>
        <p className="mt-1 text-[11px] text-muted-foreground">{g.reason}</p>
        <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
          <span>
            {g.current} / {g.target}
          </span>
          <span>{pct}%</span>
        </div>
        <PremiumProgress value={pct} accent={g.accent} className="mt-2" />
      </article>
    </PremiumGlass>
  );
}
