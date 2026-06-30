import { buildImpactSummary } from "@/lib/intelligence";
import { PremiumProgress } from "@/components/ui/PremiumProgress";
import { cn } from "@/lib/utils";

export function StoryImpact({ className }: { className?: string }) {
  const rows = buildImpactSummary();
  return (
    <section aria-label="Story impact" className={cn("space-y-3", className)}>
      <header>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
          Impact
        </div>
        <h2 className="font-display text-2xl tracking-tight">What these stories did for you</h2>
      </header>
      <ul className="grid gap-3 md:grid-cols-2">
        {rows.map((r) => (
          <li key={r.label} className="glass-subtle rounded-2xl p-3 ring-1 ring-white/5">
            <div className="mb-2 flex items-center justify-between text-[11px]">
              <span>{r.label}</span>
              <span className="tabular-nums text-muted-foreground">
                {Math.round(r.value * 100)}
              </span>
            </div>
            <PremiumProgress value={r.value * 100} />
          </li>
        ))}
      </ul>
    </section>
  );
}
