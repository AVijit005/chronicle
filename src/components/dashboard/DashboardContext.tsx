import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { useDashboard, useInsights, useStreaks } from "@/hooks/use-analytics";
import { cn } from "@/lib/utils";

function currentSeason(): string {
  const m = new Date().getMonth();
  if (m < 2 || m === 11) return "Winter";
  if (m < 5) return "Spring";
  if (m < 8) return "Summer";
  return "Autumn";
}

export function DashboardContext({ className }: { className?: string }) {
  const { data: dashboard } = useDashboard();
  const { data: insights } = useInsights();
  const { data: streaks } = useStreaks();

  const items = [
    { k: "Current journey", v: dashboard?.continueWatching?.[0]?.title ?? "—" },
    { k: "Top genre", v: insights?.favoriteGenre ?? "—" },
    { k: "Season", v: currentSeason() },
    { k: "Streak", v: `${streaks?.currentStreak ?? 0} days` },
    { k: "Top Media", v: insights?.favoriteMediaType ?? "—" },
    { k: "Hours Tracked", v: `${Math.round(insights?.totalHoursSpent ?? 0)}h` },
  ];
  return (
    <PremiumGlass variant="subtle" className={className}>
      <ul className="grid grid-cols-2 gap-px md:grid-cols-3">
        {items.map((i) => (
          <li key={i.k} className={cn("p-4")}>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
              {i.k}
            </div>
            <div className="mt-1 text-sm">{i.v}</div>
          </li>
        ))}
      </ul>
    </PremiumGlass>
  );
}
