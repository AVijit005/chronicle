import { PremiumGlass } from "@/components/ui/PremiumGlass";
import type { Creator } from "@/lib/creatorEngine";

export function CreatorHeader({
  creator,
  stats,
}: {
  creator: Creator;
  stats: { works: number; completed: number; avgRating: number; totalHours: number };
}) {
  return (
    <PremiumGlass variant="strong" glow={creator.accent + " / 0.4"}>
      <div className="p-8 md:p-10">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Creator</div>
        <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">{creator.name}</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">{creator.bio}</p>
        <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="glass-subtle rounded-full px-3 py-1.5">{stats.works} works</span>
          <span className="glass-subtle rounded-full px-3 py-1.5">{stats.completed} completed</span>
          <span className="glass-subtle rounded-full px-3 py-1.5">
            {stats.avgRating.toFixed(1)} ★ avg
          </span>
          <span className="glass-subtle rounded-full px-3 py-1.5">{stats.totalHours} h lived</span>
        </div>
      </div>
    </PremiumGlass>
  );
}
