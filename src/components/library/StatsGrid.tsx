import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { CountUp } from "@/components/landing/CountUp";
import { STATUS_TINT, statusCounts, trendFor, type MediaStatus } from "@/lib/library";

const ITEMS: { key: "total" | MediaStatus | "favorite"; label: string }[] = [
  { key: "total", label: "Total" },
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
    <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full">
      {ITEMS.map((it) => {
        const tint = STATUS_TINT[it.key === "total" ? "in_progress" : it.key];
        const trend =
          it.key === "total" || it.key === "favorite" ? 0 : trendFor(it.key as MediaStatus);
        const TrendIcon = trend > 0 ? ArrowUp : trend < 0 ? ArrowDown : Minus;
        return (
          <button 
            key={it.key} 
            className="group/pill relative flex flex-col items-start justify-between min-w-[120px] flex-1 sm:flex-none overflow-hidden rounded-[2rem] px-5 py-4 text-left transition-all duration-400 ease-out hover:-translate-y-1.5 hover:scale-[1.02]"
            style={{ 
              background: "rgba(255, 255, 255, 0.02)",
              backdropFilter: "blur(24px)",
              boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${tint} 20%, transparent), 0 8px 32px -8px rgba(0,0,0,0.4)`
            }}
          >
            {/* Native radial bloom, correctly inheriting corner radius */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-500 ease-out group-hover/pill:opacity-70"
              style={{
                borderRadius: "inherit",
                background: `radial-gradient(120px circle at 50% 100%, color-mix(in oklab, ${tint} 50%, transparent), transparent 100%)`
              }}
            />
            {/* Native outer glow simulating edge bleed (native shadow) */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover/pill:opacity-100"
              style={{
                borderRadius: "inherit",
                boxShadow: `0 0 24px -4px color-mix(in oklab, ${tint} 40%, transparent)`
              }}
            />
            
            <div className="relative z-10 w-full mb-3">
              <span 
                className="text-[10px] font-semibold uppercase tracking-[0.25em]"
                style={{ color: `color-mix(in oklab, ${tint} 85%, white)` }}
              >
                {it.label}
              </span>
            </div>

            <div className="relative z-10 flex items-end justify-between w-full">
              <CountUp
                to={values[it.key]}
                className="font-display text-4xl leading-[0.85] tracking-tight text-white drop-shadow-md"
              />
              {trend !== 0 && (
                <span
                  className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm transition-colors"
                  style={{
                    background: `color-mix(in oklab, ${tint} 25%, transparent)`,
                    color: "white",
                    boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${tint} 40%, transparent)`
                  }}
                >
                  <TrendIcon className="h-2.5 w-2.5" />
                  {Math.abs(trend)}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
