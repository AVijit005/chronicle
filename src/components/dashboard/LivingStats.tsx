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
          <PremiumGlass key={i} interactive className="rounded-2xl px-4 py-3">
            <div className="space-y-3">
              <div className="h-2.5 w-20 animate-pulse rounded bg-white/10" />
              <div className="h-7 w-14 animate-pulse rounded bg-white/10" />
            </div>
          </PremiumGlass>
        ))}
      </div>
    );
  }

  const STATS_LIST = [
    {
      label: "Hours",
      to: Math.round(overview?.hoursSpent ?? 0),
      suffix: "h",
    },
    {
      label: "Streak",
      to: streaks?.currentStreak ?? 0,
      suffix: "",
    },
    {
      label: "Total",
      to: overview?.totalItems ?? 0,
      suffix: "",
    },
    {
      label: "Journals",
      to: overview?.journalEntries ?? 0,
      suffix: "",
    },
  ];

  return (
    <ul className={cn("grid grid-cols-2 gap-3 md:grid-cols-4 pointer-events-auto", className)}>
      {STATS_LIST.map((s, i) => (
        <motion.li
          key={s.label}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={cascade(i)}
        >
          <PremiumGlass interactive className="rounded-2xl px-4 py-3 h-full flex flex-col justify-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground cursor-pointer whitespace-nowrap">
              {s.label}
            </div>
            <div className="mt-1 font-display text-2xl md:text-3xl cursor-pointer">
              <CountUp to={s.to} suffix={s.suffix} />
            </div>
          </PremiumGlass>
        </motion.li>
      ))}
    </ul>
  );
}
