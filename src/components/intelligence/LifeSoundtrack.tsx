import { buildLifeSoundtrack } from "@/lib/intelligence";
import { cn } from "@/lib/utils";

export function LifeSoundtrack({ className }: { className?: string }) {
  const items = buildLifeSoundtrack();
  return (
    <section aria-label="Life soundtrack" className={cn("space-y-3", className)}>
      <header>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
          Life soundtrack
        </div>
        <h2 className="font-display text-2xl tracking-tight">The story behind the story</h2>
      </header>
      <ul className="grid gap-3 md:grid-cols-2">
        {items.map((s) => (
          <li
            key={s.label}
            className="glass-subtle flex items-center gap-3 rounded-2xl p-3 ring-1 ring-white/5"
          >
            {s.media && (
              <img
                src={s.media.poster}
                alt=""
                className="h-14 w-10 flex-none rounded-md object-cover"
              />
            )}
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.18em] text-primary/80">
                {s.label}
              </div>
              <div className="text-sm">{s.media?.title}</div>
              <p className="mt-1 text-[11px] text-muted-foreground">{s.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
