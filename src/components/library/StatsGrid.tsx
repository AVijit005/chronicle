import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { CountUp } from "@/components/landing/CountUp";
import { STATUS_TINT, statusCounts, trendFor, type MediaStatus } from "@/lib/library";
import { PremiumGlass } from "@/components/ui/PremiumGlass";

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
          <PremiumGlass 
            key={it.key} 
            interactive 
            className="group/pill overflow-hidden rounded-3xl px-4 py-4 transition-transform duration-300 hover:scale-105"
            style={{ 
              background: `color-mix(in oklab, ${tint} 8%, transparent)`,
              borderColor: `color-mix(in oklab, ${tint} 15%, transparent)`
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-40 blur-3xl transition-opacity duration-300 group-hover/pill:opacity-80 group-hover/pill:scale-150"
              style={{ background: tint }}
            />
            <div className="relative pointer-events-none">
              <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: `color-mix(in oklab, ${tint} 80%, white)` }}>
                {it.label}
              </div>
              <div className="mt-2 flex items-end gap-2">
                <CountUp
                  to={values[it.key]}
                  className="font-display text-3xl leading-none tracking-tight text-white"
                />
                {trend !== 0 && (
                  <span
                    className="mb-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-medium transition-colors"
                    style={{
                      background: `color-mix(in oklab, ${tint} 20%, transparent)`,
                      color: `color-mix(in oklab, ${tint} 90%, white)`,
                    }}
                  >
                    <TrendIcon className="h-2.5 w-2.5" />
                    {Math.abs(trend)}
                  </span>
                )}
              </div>
            </div>
          </PremiumGlass>
        );
      })}
    </div>
  );
}
