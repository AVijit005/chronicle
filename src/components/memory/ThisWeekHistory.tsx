import { Link } from "@tanstack/react-router";
import { getThisWeekYearsAgo } from "@/lib/resurfacing";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function ThisWeekHistory({ className }: Props) {
  const buckets = getThisWeekYearsAgo();
  if (!buckets.length) return null;
  return (
    <section aria-label="This week in your life" className={cn("space-y-5", className)}>
      <header className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl tracking-tight">This week, in your life</h2>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Same week, other years
        </p>
      </header>
      <ol className="relative space-y-6 border-l border-white/10 pl-6">
        {buckets.map((b) => (
          <li key={b.years}>
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">
              {b.years} {b.years === 1 ? "year" : "years"} ago
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {b.items.slice(0, 4).map(({ media, memory }) => (
                <li key={media.id}>
                  <Link
                    to="/app/media/$id"
                    params={{ id: media.id }}
                    className="glass-subtle group flex items-center gap-3 rounded-2xl p-2.5 ring-1 ring-white/5 transition hover:ring-white/15"
                  >
                    <img
                      src={media.poster}
                      alt=""
                      className="h-12 w-9 flex-none rounded-md object-cover"
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm tracking-tight">{media.title}</div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                        {memory.mood}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
