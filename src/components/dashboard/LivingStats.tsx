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
      accent: "oklch(0.72 0.18 255)", // Neon cyan/blue
    },
    {
      label: "Streak",
      to: streaks?.currentStreak ?? 0,
      suffix: "",
      accent: "oklch(0.65 0.22 295)", // Luminous violet
    },
    {
      label: "Total",
      to: overview?.totalItems ?? 0,
      suffix: "",
      accent: "oklch(0.72 0.16 160)", // Emerald green
    },
    {
      label: "Journals",
      to: overview?.journalEntries ?? 0,
      suffix: "",
      accent: "oklch(0.82 0.16 80)", // Amber/bronze
    },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .stat-glass-card-colored {
          box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--stat-accent) 25%, transparent), 0 0 0 0 transparent !important;
        }
        .stat-glass-card-colored:hover {
          box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--stat-accent) 80%, transparent), 0 12px 32px -12px color-mix(in oklch, var(--stat-accent) 45%, transparent) !important;
        }
      `}} />
      <ul className={cn("flex flex-row gap-4 pointer-events-auto", className)}>
        {STATS_LIST.map((s, i) => (
          <motion.li
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={cascade(i)}
            style={{ ["--stat-accent" as string]: s.accent }}
            className="flex-shrink-0"
          >
            <PremiumGlass interactive className="stat-glass-card-colored rounded-2xl px-6 py-4 h-full flex flex-col justify-center min-w-[120px]">
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
    </>
  );
}
