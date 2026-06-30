import { Link } from "@tanstack/react-router";
import { buildLibraryMap } from "@/lib/intelligence";
import { cn } from "@/lib/utils";

export function LibraryMap({ className }: { className?: string }) {
  const shelves = buildLibraryMap();
  return (
    <section aria-label="Library map" className={cn("space-y-4", className)}>
      <header>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
          Library map
        </div>
        <h2 className="font-display text-2xl tracking-tight">Shelves you keep returning to</h2>
      </header>
      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {shelves.map((s) => (
          <li key={s.id} className="glass-subtle rounded-2xl p-4 ring-1 ring-white/5">
            <div className="font-display text-base tracking-tight">{s.name}</div>
            <ul className="mt-3 flex gap-2">
              {s.items.slice(0, 4).map((m) => (
                <li key={m.id}>
                  <Link to="/app/media/$id" params={{ id: m.id }}>
                    <img
                      src={m.poster}
                      alt=""
                      className="h-16 w-12 rounded-md object-cover ring-1 ring-white/10 transition hover:ring-white/25"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
