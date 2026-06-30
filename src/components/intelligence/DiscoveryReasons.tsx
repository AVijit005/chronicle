import { cn } from "@/lib/utils";

const REASONS = [
  "You usually enjoy emotional stories after finishing long series.",
  "You revisit fantasy every winter.",
  "You finish documentaries quickly.",
  "You rate higher when watching alone.",
  "You journal more about quiet stories than loud ones.",
];

export function DiscoveryReasons({ className }: { className?: string }) {
  return (
    <section aria-label="Why we recommended this" className={cn("space-y-3", className)}>
      <header>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
          Why this, why now
        </div>
        <h2 className="font-display text-2xl tracking-tight">Reasons, not algorithms</h2>
      </header>
      <ul className="grid gap-2 md:grid-cols-2">
        {REASONS.map((r) => (
          <li
            key={r}
            className="glass-subtle rounded-2xl p-4 text-sm text-foreground/80 ring-1 ring-white/5"
          >
            {r}
          </li>
        ))}
      </ul>
    </section>
  );
}
