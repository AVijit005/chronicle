import { buildMediaEvolution } from "@/lib/intelligence";
import { cn } from "@/lib/utils";

export function MediaEvolution({ className }: { className?: string }) {
  const years = buildMediaEvolution();
  return (
    <section aria-label="Media evolution" className={cn("space-y-3", className)}>
      <header>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
          Taste evolution
        </div>
        <h2 className="font-display text-2xl tracking-tight">How you've changed</h2>
      </header>
      <ol className="relative space-y-3 border-l border-white/10 pl-6">
        {years.map((y) => (
          <li key={y.year} className="flex items-baseline gap-3">
            <span className="font-display text-base tabular-nums text-primary/80">{y.year}</span>
            <span className="text-sm">{y.focus}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
