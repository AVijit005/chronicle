import { getCurrentGoals } from "@/lib/goals";
import { GoalCard } from "./GoalCard";
import { cn } from "@/lib/utils";

export function GoalSummary({ className }: { className?: string }) {
  const goals = getCurrentGoals();
  if (!goals.length) return null;
  return (
    <section aria-label="Goals summary" className={cn("space-y-4", className)}>
      <header>
        <h2 className="font-display text-2xl tracking-tight">Current chapters</h2>
      </header>
      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((g) => (
          <li key={g.id}>
            <GoalCard goal={g} />
          </li>
        ))}
      </ul>
    </section>
  );
}
