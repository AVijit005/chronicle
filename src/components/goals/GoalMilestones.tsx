import type { Goal } from "@/lib/goals";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export function GoalMilestones({ goal, className }: { goal: Goal; className?: string }) {
  return (
    <ul aria-label="Milestones" className={cn("space-y-2", className)}>
      {goal.milestones.map((m) => (
        <li key={m.label} className="flex items-center gap-2 text-sm">
          {m.reached ? (
            <Check className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Circle className="h-3.5 w-3.5 text-muted-foreground/60" />
          )}
          <span className={cn(!m.reached && "text-muted-foreground")}>{m.label}</span>
        </li>
      ))}
    </ul>
  );
}
