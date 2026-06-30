import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getCreatorRecommendations } from "@/lib/discovery";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function CreatorExplorer({ className }: Props) {
  const creators = getCreatorRecommendations();
  if (!creators.length) return null;
  return (
    <section aria-label="Creator explorer" className={cn("space-y-4", className)}>
      <header>
        <h2 className="font-display text-2xl tracking-tight">Creators in your library</h2>
      </header>
      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {creators.map((c) => (
          <li key={c.creator}>
            <PremiumGlass variant="subtle">
              <article className="p-4">
                <div className="font-display text-base tracking-tight">{c.creator}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {c.experienced} experienced · {c.remaining} remaining
                </div>
                {c.recommendedNext && (
                  <Link
                    to="/app/media/$id"
                    params={{ id: c.recommendedNext.id }}
                    className="mt-3 flex items-center gap-2 rounded-xl bg-white/[0.04] p-2 transition hover:bg-white/[0.08]"
                  >
                    <img
                      src={c.recommendedNext.poster}
                      alt=""
                      className="h-10 w-8 rounded-sm object-cover"
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
                        Next
                      </div>
                      <div className="truncate text-xs">{c.recommendedNext.title}</div>
                    </div>
                  </Link>
                )}
              </article>
            </PremiumGlass>
          </li>
        ))}
      </ul>
    </section>
  );
}
