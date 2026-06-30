import { buildPersonalStatements } from "@/lib/intelligence";
import { cn } from "@/lib/utils";

export function PersonalStatements({ className }: { className?: string }) {
  const lines = buildPersonalStatements();
  return (
    <section aria-label="Personal statements" className={cn("space-y-3", className)}>
      <header>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
          A quiet portrait
        </div>
        <h2 className="font-display text-2xl tracking-tight">This, in short, is you</h2>
      </header>
      <ul className="grid gap-2 md:grid-cols-2">
        {lines.map((l) => (
          <li
            key={l}
            className="glass-subtle rounded-2xl p-4 text-[15px] leading-relaxed text-foreground/85 ring-1 ring-white/5"
          >
            {l}
          </li>
        ))}
      </ul>
    </section>
  );
}
