import { getAchievements } from "@/lib/achievements";
import { cn } from "@/lib/utils";

export function AchievementJourney({ className }: { className?: string }) {
  const items = [...getAchievements()].sort(
    (a, b) => new Date(a.earnedAt).getTime() - new Date(b.earnedAt).getTime(),
  );
  return (
    <section aria-label="Achievement journey" className={cn("space-y-4", className)}>
      <h2 className="font-display text-2xl tracking-tight">Your journey so far</h2>
      <ol className="grid gap-2">
        {items.map((a, i) => (
          <li
            key={a.id}
            className="glass-subtle flex items-center gap-3 rounded-2xl p-3 ring-1 ring-white/5"
          >
            <div className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.06] text-[10px] tabular-nums text-muted-foreground">
              {i + 1}
            </div>
            <div className="min-w-0">
              <div className="text-sm">{a.name}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                {a.earnedAt} · {a.category}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
