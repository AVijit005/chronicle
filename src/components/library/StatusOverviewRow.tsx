import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import {
  STATUS_LABEL,
  STATUS_TINT,
  byStatus,
  favorites,
  statusCounts,
  type MediaStatus,
} from "@/lib/library";

type Card = { status: MediaStatus | "favorite"; to: string; subtitle: string };

const CARDS: Card[] = [
  { status: "in_progress", to: "/app/library/continue", subtitle: "Pick up where you left off" },
  { status: "completed", to: "/app/library/completed", subtitle: "Every story you've lived" },
  { status: "planning", to: "/app/library/planning", subtitle: "What's next on the list" },
  { status: "favorite", to: "/app/library/favorites", subtitle: "The ones you'd live again" },
  { status: "paused", to: "/app/library/paused", subtitle: "Waiting for the right night" },
  { status: "dropped", to: "/app/library/dropped", subtitle: "Didn't land — that's okay" },
  { status: "archived", to: "/app/library/archived", subtitle: "Quiet, but never forgotten" },
];

export function StatusOverviewRow() {
  const counts = statusCounts();
  const favs = favorites();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {CARDS.map((c) => {
        const items = c.status === "favorite" ? favs : byStatus(c.status);
        const count = c.status === "favorite" ? favs.length : counts[c.status];
        const tint = STATUS_TINT[c.status];
        const label = c.status === "favorite" ? "Favorites" : STATUS_LABEL[c.status];
        const collage = items.slice(0, 3).map((m) => m.poster);
        while (collage.length < 3) collage.push(items[0]?.poster ?? favs[0]?.poster ?? "");
        return (
          <Link key={c.status} to={c.to}>
            <PremiumGlass className="group/sc h-full p-5">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover/sc:opacity-60"
                style={{ background: tint }}
              />
              <div className="relative flex items-center gap-4">
                <div className="flex shrink-0 -space-x-3">
                  {collage.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="h-16 w-12 rounded-lg border border-border/60 object-cover shadow-lg"
                      style={{ transform: `rotate(${(i - 1) * 5}deg)` }}
                      loading="lazy"
                    />
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: tint }} />
                    <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {label}
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-display text-3xl tracking-tight">{count}</span>
                    <span className="text-xs text-muted-foreground">items</span>
                  </div>
                  <div className="mt-1.5 truncate text-[11px] text-muted-foreground">
                    {c.subtitle}
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover/sc:text-foreground" />
              </div>
            </PremiumGlass>
          </Link>
        );
      })}
    </div>
  );
}
