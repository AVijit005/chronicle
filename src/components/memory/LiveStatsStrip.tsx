// Live numbers strip — sourced from libraryStore, not editorial mocks.
import { CountUp } from "@/components/analytics/AnalyticsKit";
import { useLiveStats } from "@/lib/store/liveSelectors";

export function LiveStatsStrip({
  eyebrow = "Your real numbers",
  note,
  items,
}: {
  eyebrow?: string;
  note?: string;
  items?: { label: string; value: number | string; suffix?: string; color?: string }[];
}) {
  const s = useLiveStats();
  
  const defaultCells = [
    { label: "Stories tracked", value: s.total, color: "oklch(0.72 0.18 255 / 0.45)" },
    { label: "Completed", value: s.completed, color: "oklch(0.7 0.2 145 / 0.45)" },
    { label: "In progress", value: s.inProgress, color: "oklch(0.78 0.16 80 / 0.45)" },
    { label: "Favorites", value: s.favorites, color: "oklch(0.7 0.18 25 / 0.45)" },
    { label: "Reflections", value: s.reflections, color: "oklch(0.65 0.22 295 / 0.45)" },
    { label: "Quotes", value: s.userQuotes, color: "oklch(0.72 0.16 160 / 0.45)" },
  ];

  const cells = items || defaultCells;

  return (
    <section className="glass relative overflow-hidden rounded-3xl p-5 md:p-7">
      <div className="flex items-baseline justify-between">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </div>
        {note ?? (
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Live · from your library
          </div>
        )}
      </div>
      <div className={`mt-4 grid gap-3 ${cells.length > 3 ? "grid-cols-3 md:grid-cols-6" : "grid-cols-1 md:grid-cols-3"}`}>
        {cells.map((c) => (
          <div key={c.label} className="glass-subtle relative overflow-hidden rounded-2xl p-4">
            <div
              className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-60"
              style={{ background: c.color || "oklch(1 1 1 / 0.15)" }}
            />
            <div className="relative">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                {c.label}
              </div>
              <div className="mt-2 font-display text-3xl tracking-tight text-foreground">
                {typeof c.value === "number" ? <CountUp to={c.value} suffix={c.suffix ?? ""} /> : c.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      {(s.avgRating > 0 || s.topMood) && (
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {s.avgRating > 0 && (
            <span>
              Avg rating · <span className="text-foreground">{s.avgRating.toFixed(1)}</span> (
              {s.ratedCount} rated)
            </span>
          )}
          {s.topMood && (
            <span>
              Top mood · <span className="text-foreground">{s.topMood}</span>
            </span>
          )}
        </div>
      )}
    </section>
  );
}
