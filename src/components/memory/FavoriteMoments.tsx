import type { FavoriteMoment } from "@/lib/memoryJournal";
import { cn } from "@/lib/utils";

interface Props {
  moments: FavoriteMoment[];
  className?: string;
}

const labels: Record<FavoriteMoment["kind"], string> = {
  quote: "Favorite Quote",
  scene: "Favorite Scene",
  character: "Favorite Character",
  episode: "Favorite Episode",
  chapter: "Favorite Chapter",
  song: "Favorite Song",
  mission: "Favorite Mission",
  boss: "Favorite Boss",
};

export function FavoriteMoments({ moments, className }: Props) {
  if (!moments.length) return null;
  return (
    <section aria-label="Favorite moments" className={cn("max-w-prose", className)}>
      <header className="mb-4 text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
        Favorite moments
      </header>
      <dl className="space-y-4">
        {moments.map((m, i) => (
          <div key={i} className="border-l border-white/10 pl-4">
            <dt className="text-[11px] uppercase tracking-[0.18em] text-primary/80">
              {labels[m.kind]}
            </dt>
            <dd className="mt-1 font-display text-lg tracking-tight">{m.label}</dd>
            <dd className="text-sm italic leading-relaxed text-muted-foreground">{m.detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
