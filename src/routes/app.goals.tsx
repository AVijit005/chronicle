import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/app/goals")({ component: Page });

function Page() {
  const goals = [
    { label: "Read 24 books", value: 17, total: 24, accent: "oklch(0.72 0.16 80)" },
    { label: "Watch 50 films", value: 32, total: 50, accent: "oklch(0.65 0.2 230)" },
    { label: "Finish 6 games", value: 4, total: 6, accent: "oklch(0.65 0.22 295)" },
  ];
  return (
    <ComingSoon
      eyebrow="Goals"
      title="Quiet intentions."
      description="Set the year's reading pile, your film count, the games you owe yourself. Chronicle nudges, never nags."
      preview={
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {goals.map((g) => {
            const pct = Math.round((g.value / g.total) * 100);
            return (
              <div key={g.label} className="glass rounded-2xl p-5">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {g.label}
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl">{g.value}</span>
                  <span className="text-sm text-muted-foreground">/ {g.total}</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: g.accent }}
                  />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{pct}% complete</div>
              </div>
            );
          })}
        </div>
      }
    />
  );
}
