import type { Goal } from "@/lib/goals";
import { cn } from "@/lib/utils";

export function GoalTimeline({ goal, className }: { goal: Goal; className?: string }) {
  return (
    <ol
      aria-label="Goal timeline"
      className={cn("relative space-y-4 border-l border-white/10 pl-5", className)}
    >
      <li>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Started</div>
        <div className="text-sm">{goal.startedAt}</div>
      </li>
      {goal.milestones.map((m) => (
        <li key={m.label}>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {m.reached ? "Reached" : "Upcoming"}
          </div>
          <div className={cn("text-sm", !m.reached && "text-muted-foreground")}>
            {m.label}
            {m.when ? ` · ${m.when}` : ""}
          </div>
        </li>
      ))}
      <li>
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">Finish</div>
        <div className="text-sm">{goal.deadline ?? "When it's ready"}</div>
      </li>
    </ol>
  );
}
