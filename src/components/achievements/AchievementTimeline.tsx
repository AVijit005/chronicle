import { rankAchievements } from "@/lib/achievements";
import { cn } from "@/lib/utils";

export function AchievementTimeline({ className }: { className?: string }) {
  const items = rankAchievements();
  return (
    <ol
      aria-label="Achievements timeline"
      className={cn("relative space-y-4 border-l border-white/10 pl-5", className)}
    >
      {items.map((a) => (
        <li key={a.id}>
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">
            {a.earnedAt}
          </div>
          <div className="font-display text-base tracking-tight">{a.name}</div>
          <p className="text-[11px] text-muted-foreground">{a.caption}</p>
        </li>
      ))}
    </ol>
  );
}
