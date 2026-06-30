import type { ReactNode } from "react";

/** Editorial year transition for the timeline.
 *  Large display-serif numeral, soft accent rule, breathing space. */
export function TimelineYearMark({ year, caption }: { year: number | string; caption?: string }) {
  return (
    <div className="relative my-20 first:mt-0 md:my-28">
      <div className="flex items-baseline gap-6">
        <span className="font-display text-7xl leading-none tracking-tighter text-foreground/12 md:text-[9rem]">
          {year}
        </span>
        <span
          aria-hidden
          className="h-px flex-1 bg-gradient-to-r from-foreground/30 via-foreground/10 to-transparent"
        />
      </div>
      {caption && (
        <div className="mt-3 text-[10px] uppercase tracking-[0.32em] text-primary/80">
          {caption}
        </div>
      )}
    </div>
  );
}

/** Season separator — thin editorial rule with a season tag. */
export function TimelineSeasonRule({
  season,
  children,
}: {
  season: "Spring" | "Summer" | "Autumn" | "Winter" | string;
  children?: ReactNode;
}) {
  return (
    <div className="my-10 flex items-center gap-4 md:my-14">
      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
        {season}
      </span>
      <span aria-hidden className="h-px flex-1 bg-foreground/8" />
      {children && <span className="text-[11px] italic text-muted-foreground/70">{children}</span>}
    </div>
  );
}
