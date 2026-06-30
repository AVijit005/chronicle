import { PremiumProgress } from "@/components/ui/PremiumProgress";
import type { Goal } from "@/lib/goals";
import { cn } from "@/lib/utils";

export function GoalProgress({ goal, className }: { goal: Goal; className?: string }) {
  const pct = Math.round((goal.current / goal.target) * 100);
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          {goal.current} / {goal.target}
        </span>
        <span>{pct}%</span>
      </div>
      <PremiumProgress value={pct} accent={goal.accent} />
    </div>
  );
}
