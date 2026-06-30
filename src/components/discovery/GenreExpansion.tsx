import { getGenreExpansion } from "@/lib/discovery";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NEARBY: Record<string, string[]> = {
  Fantasy: ["Historical Fantasy", "Dark Fantasy", "Mythology", "Adventure"],
  "Sci-Fi": ["Hard Sci-Fi", "Space Opera", "Cyberpunk", "Speculative"],
  Drama: ["Family Drama", "Political", "Historical", "Crime"],
  Adventure: ["Exploration", "Survival", "Quest", "Travel"],
  Action: ["Heist", "Spy", "Martial Arts", "Thriller"],
};

interface Props {
  className?: string;
}

export function GenreExpansion({ className }: Props) {
  const top = getGenreExpansion();
  if (!top.length) return null;
  return (
    <section aria-label="Genre expansion" className={cn("space-y-4", className)}>
      <header>
        <h2 className="font-display text-2xl tracking-tight">Expand your map</h2>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Nearby genres
        </p>
      </header>
      <ul className="space-y-2">
        {top.map(({ genre }) => {
          const adjacent = NEARBY[genre] ?? ["Related", "Adjacent", "Nearby"];
          return (
            <li
              key={genre}
              className="glass-subtle flex flex-wrap items-center gap-2 rounded-2xl px-4 py-3 ring-1 ring-white/5"
            >
              <span className="font-display text-base tracking-tight">{genre}</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground/70" />
              {adjacent.map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[11px] text-muted-foreground"
                >
                  {g}
                </span>
              ))}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
