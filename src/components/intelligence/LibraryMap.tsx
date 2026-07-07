import { Link } from "@tanstack/react-router";
import { buildLibraryMap } from "@/lib/intelligence";
import { cn } from "@/lib/utils";
import { PremiumGlass } from "@/components/ui/PremiumGlass";

export function LibraryMap({ className }: { className?: string }) {
  const shelves = buildLibraryMap();
  return (
    <section aria-label="Library map" className={cn("space-y-4", className)}>
      <header className="cursor-default pointer-events-auto">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
          Library map
        </div>
        <h2 className="font-display text-2xl tracking-tight">Shelves you keep returning to</h2>
      </header>
      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 pointer-events-auto">
        {shelves.map((s) => (
          <li key={s.id}>
            <PremiumGlass className="h-full rounded-2xl p-4 ring-1 ring-white/5">
              <div className="font-display text-base tracking-tight cursor-default">{s.name}</div>
              <ul className="mt-4 flex gap-3">
                {s.items.slice(0, 4).map((m) => (
                  <li 
                    key={m.id} 
                    className="relative z-10 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.4),0_0_12px_rgba(99,102,241,0.15)] active:scale-95"
                  >
                    <Link to="/app/media/$id" params={{ id: m.id }} className="block cursor-pointer">
                      <img
                        src={m.poster}
                        alt=""
                        className="h-16 w-11 rounded-md object-cover ring-1 ring-white/10 transition hover:ring-white/30"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </PremiumGlass>
          </li>
        ))}
      </ul>
    </section>
  );
}
