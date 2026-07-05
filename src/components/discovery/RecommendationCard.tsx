import { Link } from "@tanstack/react-router";
import { BookmarkPlus, X } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import type { Recommendation } from "@/lib/recommendationEngine";
import { cn } from "@/lib/utils";

interface Props {
  rec: Recommendation;
  className?: string;
  compact?: boolean;
}

export function RecommendationCard({ rec, className, compact }: Props) {
  const { media, reason, confidence, discoveryTags } = rec;
  return (
    <PremiumGlass variant="subtle" glow={media.accent ?? undefined} className={cn("h-full", className)}>
      <article className={cn("flex h-full flex-col gap-3", compact ? "p-3" : "p-4")}>
        <Link
          to="/app/media/$id"
          params={{ id: media.id }}
          className="relative block overflow-hidden rounded-xl"
        >
          <img
            src={media.poster}
            alt=""
            className="aspect-[2/3] w-full object-cover transition duration-[var(--dur-page)] ease-[var(--ease-out)] group-hover:scale-105"
          />
          {discoveryTags[0] && (
            <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-white/90 backdrop-blur">
              {discoveryTags[0]}
            </span>
          )}
        </Link>
        <div className="flex-1">
          <Link to="/app/media/$id" params={{ id: media.id }} className="block">
            <h3 className="line-clamp-1 font-display text-base tracking-tight">{media.title}</h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{reason}</p>
        </div>
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
          <span>{Math.round(confidence * 100)}% match</span>
          <div className="flex gap-1">
            <button className="rounded-full p-1 transition hover:text-foreground" aria-label="Save">
              <BookmarkPlus className="h-3 w-3" />
            </button>
            <button
              className="rounded-full p-1 transition hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      </article>
    </PremiumGlass>
  );
}
