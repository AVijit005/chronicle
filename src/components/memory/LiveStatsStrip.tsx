// Live numbers strip — sourced from libraryStore, not editorial mocks.
import { CountUp } from "@/components/analytics/AnalyticsKit";
import { useLiveStats } from "@/lib/store/liveSelectors";

export function LiveStatsStrip({
  eyebrow = "Your real numbers",
  note,
}: {
  eyebrow?: string;
  note?: string;
}) {
  const s = useLiveStats();
  const cells: { l: string; v: number | string; suffix?: string; a: string }[] = [
    { l: "Stories tracked", v: s.total, a: "oklch(0.72 0.18 255 / 0.45)" },
    { l: "Completed", v: s.completed, a: "oklch(0.7 0.2 145 / 0.45)" },
    { l: "In progress", v: s.inProgress, a: "oklch(0.78 0.16 80 / 0.45)" },
    { l: "Favorites", v: s.favorites, a: "oklch(0.7 0.18 25 / 0.45)" },
    { l: "Reflections", v: s.reflections, a: "oklch(0.65 0.22 295 / 0.45)" },
    { l: "Quotes", v: s.userQuotes, a: "oklch(0.72 0.16 160 / 0.45)" },
  ];
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
      <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-6">
        {cells.map((c) => (
          <div key={c.l} className="glass-subtle relative overflow-hidden rounded-2xl p-3">
            <div
              className="absolute -right-8 -top-8 h-20 w-20 rounded-full blur-2xl"
              style={{ background: c.a }}
            />
            <div className="relative">
              <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                {c.l}
              </div>
              <div className="mt-1.5 font-display text-2xl tracking-tight">
                {typeof c.v === "number" ? <CountUp to={c.v} suffix={c.suffix ?? ""} /> : c.v}
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
