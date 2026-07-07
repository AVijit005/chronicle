import { motion } from "motion/react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { CountUp } from "@/components/landing/CountUp";
import { useOverview, useStreaks } from "@/hooks/use-analytics";
import { adaptOverview } from "@/lib/adapters/analytics";
import { cn } from "@/lib/utils";
import { cascade } from "@/lib/motion";

export function LivingStats({ className }: { className?: string }) {
  const { data: rawOverview, isLoading: overviewLoading } = useOverview();
  const { data: streaks, isLoading: streaksLoading } = useStreaks();

  const overview = rawOverview ? adaptOverview(rawOverview) : null;

  if (overviewLoading || streaksLoading) {
    return (
      <div className={cn("grid grid-cols-2 gap-3 md:grid-cols-4", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <PremiumGlass key={i} variant="subtle">
            <div className="space-y-3 p-5">
              <div className="h-2.5 w-20 animate-pulse rounded bg-white/10" />
              <div className="h-7 w-14 animate-pulse rounded bg-white/10" />
              <div className="h-2.5 w-16 animate-pulse rounded bg-white/5" />
            </div>
          </PremiumGlass>
        ))}
      </div>
    );
  }

  const STATS_LIST = [
    {
      label: "Hours Tracked",
      to: Math.round(overview?.hoursSpent ?? 0),
      suffix: "h",
      ctx: "Total time.",
      accent: "oklch(0.72 0.18 255 / 0.35)",
    },
    {
      label: "Streak",
      to: streaks?.currentStreak ?? 0,
      suffix: "",
      ctx: "Days in a row.",
      accent: "oklch(0.65 0.22 295 / 0.35)",
    },
    {
      label: "Completed",
      to: overview?.totalItems ?? 0,
      suffix: "",
      ctx: "All time.",
      accent: "oklch(0.72 0.16 160 / 0.35)",
    },
    {
      label: "Journals",
      to: overview?.journalEntries ?? 0,
      suffix: "",
      ctx: "Memories saved.",
      accent: "oklch(0.82 0.16 80 / 0.35)",
    },
  ];

  return (
    <ul className={cn("grid grid-cols-2 gap-3 md:grid-cols-4", className)}>
      {STATS_LIST.map((s, i) => (
        <motion.li
          key={s.label}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={cascade(i)}
        >
          <PremiumGlass variant="subtle" glow={s.accent} className="hover-lift">
            <div className="p-5">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-2 font-display text-3xl tracking-tight tabular-nums">
                <CountUp to={s.to} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">{s.ctx}</div>
            </div>
          </PremiumGlass>
        </motion.li>
      ))}
    </ul>
  );
}
