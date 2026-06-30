import { Link } from "@tanstack/react-router";
import { getComfortRecommendations } from "@/lib/discovery";
import { MEMORIES_BY_MEDIA } from "@/lib/memory";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function ComfortStories({ className }: Props) {
  const items = getComfortRecommendations();
  if (!items.length) return null;
  return (
    <section aria-label="Comfort stories" className={cn("space-y-4", className)}>
      <header className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl tracking-tight">Comfort stories</h2>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Memories you revisit
        </p>
      </header>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {items.map(({ media }) => {
          const mem = MEMORIES_BY_MEDIA[media.id];
          return (
            <li key={media.id}>
              <Link
                to="/app/media/$id"
                params={{ id: media.id }}
                className="glass-subtle group flex gap-3 rounded-2xl p-3 ring-1 ring-white/5 transition hover:ring-white/15"
              >
                <img
                  src={media.poster}
                  alt=""
                  className="h-20 w-14 flex-none rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm tracking-tight">{media.title}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
                    {mem?.revisits ?? 0}× revisited
                  </div>
                  <div className="mt-1 text-[10px] text-muted-foreground/70">
                    Last: {mem?.finishedAt ?? "—"}
                  </div>
                  <div className="mt-1 text-[10px] text-primary/80">{mem?.mood}</div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
