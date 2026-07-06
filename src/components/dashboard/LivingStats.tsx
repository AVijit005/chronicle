import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { useOverview, useStreaks } from "@/hooks/use-analytics";
import { cn } from "@/lib/utils";

export function LivingStats({ className }: { className?: string }) {
  const { data: overview } = useOverview();
  const { data: streaks } = useStreaks();

  const STATS_LIST = [
    {
      label: "Hours Tracked",
      value: `${Math.round(overview?.hoursSpent ?? 0)}h`,
      ctx: "Total time.",
      accent: "oklch(0.72 0.18 255 / 0.35)",
    },
    {
      label: "Streak",
      value: `${streaks?.currentStreak ?? 0}`,
      ctx: "Days in a row.",
      accent: "oklch(0.65 0.22 295 / 0.35)",
    },
    {
      label: "Completed",
      value: overview?.totalItems ?? 0,
      ctx: "All time.",
      accent: "oklch(0.72 0.16 160 / 0.35)",
    },
    {
      label: "Journals",
      value: overview?.journalEntries ?? 0,
      ctx: "Memories saved.",
      accent: "oklch(0.82 0.16 80 / 0.35)",
    },
  ];

  return (
    <ul className={cn("grid grid-cols-2 gap-3 md:grid-cols-4", className)}>
      {STATS_LIST.map((s) => (
        <li key={s.label}>
          <PremiumGlass variant="subtle" glow={s.accent}>
            <div className="p-5">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-2 font-display text-3xl tracking-tight tabular-nums">
                {s.value}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">{s.ctx}</div>
            </div>
          </PremiumGlass>
        </li>
      ))}
    </ul>
  );
}

function Spark({ data }: { data: number[] }) {
  if (!data.length) return null;
  const max = Math.max(...data),
    min = Math.min(...data),
    range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-8 w-full">
      <polyline
        fill="none"
        stroke="oklch(0.78 0.18 255)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
