import { motion } from "motion/react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { useDashboard, useInsights, useStreaks, useOverview } from "@/hooks/use-analytics";
import { cn } from "@/lib/utils";
import { cascade } from "@/lib/motion";

function currentSeason(): string {
  const m = new Date().getMonth();
  if (m < 2 || m === 11) return "Winter";
  if (m < 5) return "Spring";
  if (m < 8) return "Summer";
  return "Autumn";
}

export function DashboardContext({ className }: { className?: string }) {
  const { data: dashboard, isLoading: l1 } = useDashboard();
  const { data: insights, isLoading: l2 } = useInsights();
  const { data: streaks, isLoading: l3 } = useStreaks();
  const { data: overview, isLoading: l4 } = useOverview();
  const isLoading = l1 || l2 || l3 || l4;

  if (isLoading) {
    return (
      <PremiumGlass variant="subtle" className={className}>
        <ul className="grid grid-cols-2 gap-px md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="space-y-2 p-4">
              <div className="h-2.5 w-20 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-16 animate-pulse rounded bg-white/5" />
            </li>
          ))}
        </ul>
      </PremiumGlass>
    );
  }

  const items = [
    { k: "Current journey", v: dashboard?.continueWatching?.[0]?.title ?? "—" },
    { k: "Top genre", v: insights?.favoriteGenre ?? "—" },
    { k: "Season", v: currentSeason() },
    { k: "Streak", v: `${streaks?.currentStreak ?? 0} days` },
    { k: "Top Media", v: overview?.favoriteMediaType ?? "—" },
    { k: "Hours Tracked", v: `${Math.round(insights?.totalHoursSpent ?? 0)}h` },
  ];
  return (
    <PremiumGlass variant="subtle" className={className}>
      <ul className="grid grid-cols-2 gap-px md:grid-cols-3">
        {items.map((i, idx) => (
          <motion.li
            key={i.k}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={cascade(idx, 0.05)}
            className={cn("p-4")}
          >
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
              {i.k}
            </div>
            <div className="mt-1 text-sm">{i.v}</div>
          </motion.li>
        ))}
      </ul>
    </PremiumGlass>
  );
}
