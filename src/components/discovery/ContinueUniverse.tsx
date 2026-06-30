import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { PremiumProgress } from "@/components/ui/PremiumProgress";
import { getContinueFranchise } from "@/lib/discovery";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function ContinueUniverse({ className }: Props) {
  const franchises = getContinueFranchise();
  if (!franchises.length) return null;
  return (
    <section aria-label="Continue the universe" className={cn("space-y-4", className)}>
      <header className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl tracking-tight">Continue the universe</h2>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Worlds in progress
        </p>
      </header>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {franchises.map((f) => (
          <li key={f.creator}>
            <PremiumGlass variant="subtle">
              <article className="p-4">
                <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">
                  {f.creator}
                </div>
                <div className="mt-1 flex items-center gap-3">
                  {f.current && (
                    <Link to="/app/media/$id" params={{ id: f.current.id }}>
                      <img
                        src={f.current.poster}
                        alt=""
                        className="h-16 w-12 rounded-md object-cover ring-1 ring-white/10"
                      />
                    </Link>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-base tracking-tight">
                      {f.current?.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Next: {f.next?.title ?? "—"}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
                  <span>{f.remaining} remaining</span>
                  <span>{f.completion}%</span>
                </div>
                <PremiumProgress
                  value={f.completion}
                  accent="oklch(0.72 0.18 255)"
                  className="mt-2"
                />
              </article>
            </PremiumGlass>
          </li>
        ))}
      </ul>
    </section>
  );
}
