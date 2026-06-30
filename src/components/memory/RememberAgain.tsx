import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { getForgottenFavorites } from "@/lib/resurfacing";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function RememberAgain({ className }: Props) {
  const items = getForgottenFavorites().slice(0, 3);
  if (!items.length) return null;
  return (
    <section aria-label="Remember again" className={cn("space-y-5", className)}>
      <header className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl tracking-tight">Remember again</h2>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Favorites you haven't visited in a while
        </p>
      </header>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map(({ media, memory }) => (
          <li key={media.id}>
            <PremiumGlass variant="default">
              <article className="overflow-hidden">
                <img
                  src={media.backdrop ?? media.poster}
                  alt=""
                  className="h-44 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-display text-lg tracking-tight">{media.title}</h3>
                  <p className="mt-1 text-[11px] italic text-muted-foreground line-clamp-2">
                    "{memory.memoryExcerpt}"
                  </p>
                  <Link
                    to="/app/media/$id"
                    params={{ id: media.id }}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary/90 hover:text-primary"
                  >
                    Open memory <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            </PremiumGlass>
          </li>
        ))}
      </ul>
    </section>
  );
}
