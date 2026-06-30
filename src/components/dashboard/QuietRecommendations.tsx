import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { MEDIA } from "@/lib/mock";
import { cn } from "@/lib/utils";

const ROWS = [
  { because: "Because it's raining", id: "interstellar" },
  { because: "Because you finished fantasy recently", id: "harry-potter" },
  { because: "Because you usually relax with documentaries on Sundays", id: "mkbhd" },
  { because: "Because you revisit comfort movies in winter", id: "one-piece" },
];

export function QuietRecommendations({ className }: { className?: string }) {
  return (
    <section aria-label="Because today" className={cn(className)}>
      <div className="mb-4">
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Because today…
        </div>
        <h2 className="font-display text-2xl tracking-tight">Quiet recommendations</h2>
      </div>
      <ul className="grid gap-3 md:grid-cols-2">
        {ROWS.map((r) => {
          const m = MEDIA.find((x) => x.id === r.id);
          if (!m) return null;
          return (
            <li key={r.id}>
              <Link to="/app/media/$id" params={{ id: m.id }}>
                <PremiumGlass variant="subtle">
                  <div className="flex items-center gap-4 p-4">
                    <img
                      src={m.poster}
                      alt=""
                      className="h-16 w-12 rounded-md object-cover ring-1 ring-white/10"
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">
                        {r.because}
                      </div>
                      <div className="mt-0.5 font-display text-base tracking-tight">{m.title}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {m.creator} · {m.year}
                      </div>
                    </div>
                  </div>
                </PremiumGlass>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
