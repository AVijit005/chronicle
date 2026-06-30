import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { CountUp } from "@/components/landing/CountUp";
import { STATUS_TINT, statusCounts, trendFor, type MediaStatus } from "@/lib/library";

const ITEMS: { key: "total" | MediaStatus | "favorite"; label: string }[] = [
  { key: "total", label: "Total Library" },
  { key: "completed", label: "Completed" },
  { key: "in_progress", label: "In Progress" },
  { key: "planning", label: "Planning" },
  { key: "favorite", label: "Favorites" },
  { key: "dropped", label: "Dropped" },
  { key: "rewatching", label: "Rewatching" },
];

export function StatsGrid({ favoritesCount }: { favoritesCount: number }) {
  const c = statusCounts();
  const total = Object.values(c).reduce((a, b) => a + b, 0);
  const values: Record<string, number> = { total, ...c, favorite: favoritesCount };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
      {ITEMS.map((it) => {
        const tint = STATUS_TINT[it.key === "total" ? "in_progress" : it.key];
        const trend =
          it.key === "total" || it.key === "favorite" ? 0 : trendFor(it.key as MediaStatus);
        const TrendIcon = trend > 0 ? ArrowUp : trend < 0 ? ArrowDown : Minus;
        return (
          <div key={it.key} className="glass relative overflow-hidden rounded-2xl px-4 py-4">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-40 blur-3xl"
              style={{ background: tint }}
            />
            <div className="relative">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {it.label}
              </div>
              <div className="mt-2 flex items-end gap-2">
                <CountUp
                  to={values[it.key]}
                  className="font-display text-3xl leading-none tracking-tight"
                />
                {trend !== 0 && (
                  <span
                    className="mb-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-medium"
                    style={{
                      background: `color-mix(in oklab, ${tint} 14%, transparent)`,
                      color: `color-mix(in oklab, ${tint} 80%, oklch(0.97 0 0))`,
                    }}
                  >
                    <TrendIcon className="h-2.5 w-2.5" />
                    {Math.abs(trend)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
