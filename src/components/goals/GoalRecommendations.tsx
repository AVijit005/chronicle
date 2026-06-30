import { rankGoals } from "@/lib/goals";
import { GoalCard } from "./GoalCard";
import { cn } from "@/lib/utils";

export function GoalRecommendations({ className }: { className?: string }) {
  const recs = rankGoals().slice(0, 3);
  return (
    <section aria-label="Recommended next chapters" className={cn("space-y-3", className)}>
      <h2 className="font-display text-xl tracking-tight">Next, perhaps</h2>
      <ul className="grid gap-3 md:grid-cols-3">
        {recs.map((g) => (
          <li key={g.id}>
            <GoalCard goal={g} />
          </li>
        ))}
      </ul>
    </section>
  );
}
