import { motion } from "motion/react";
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
          <div key={i} className="rounded-3xl bg-white/[0.02] p-6 ring-1 ring-white/5">
            <div className="space-y-4">
              <div className="h-2.5 w-20 animate-pulse rounded bg-white/10" />
              <div className="h-8 w-14 animate-pulse rounded bg-white/10" />
              <div className="h-2 w-16 animate-pulse rounded bg-white/5" />
            </div>
          </div>
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
      accent: "oklch(0.72 0.18 255)", // Neon cyan/blue
    },
    {
      label: "Streak",
      to: streaks?.currentStreak ?? 0,
      suffix: "",
      ctx: "Days in a row.",
      accent: "oklch(0.65 0.22 295)", // Luminous violet
    },
    {
      label: "Completed",
      to: overview?.totalItems ?? 0,
      suffix: "",
      ctx: "All time.",
      accent: "oklch(0.72 0.16 160)", // Emerald green
    },
    {
      label: "Journals",
      to: overview?.journalEntries ?? 0,
      suffix: "",
      ctx: "Memories saved.",
      accent: "oklch(0.82 0.16 80)", // Amber/bronze
    },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .stat-glass-card {
          box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--stat-accent) 25%, transparent), 0 0 0 0 transparent;
        }
        .stat-glass-card:hover {
          box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--stat-accent) 80%, transparent), 0 12px 32px -12px color-mix(in oklch, var(--stat-accent) 35%, transparent);
        }
      `}} />
      <ul className={cn("grid grid-cols-2 gap-3 md:grid-cols-4", className)}>
        {STATS_LIST.map((s, i) => (
          <motion.li
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={cascade(i)}
          >
            <div 
              className="stat-glass-card group/stat flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-white/[0.03] p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 ease-out hover:-translate-y-[2px] hover:bg-white/[0.05] cursor-pointer"
              style={{ ["--stat-accent" as string]: s.accent }}
            >
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/70 transition-colors group-hover/stat:text-white/90">
                {s.label}
              </div>
              <div className="mt-4 font-display text-4xl tracking-tight text-white tabular-nums">
                <CountUp to={s.to} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-xs text-white/50 transition-colors group-hover/stat:text-white/70">
                {s.ctx}
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </>
  );
}
