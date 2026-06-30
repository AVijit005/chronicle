import { buildJourneyContinuity } from "@/lib/intelligence";
import { RelationshipCard } from "./RelationshipCard";
import { JourneyConnector } from "./JourneyConnector";
import { cn } from "@/lib/utils";

export function JourneyContinuity({
  mediaId,
  className,
}: {
  mediaId?: string;
  className?: string;
}) {
  const j = buildJourneyContinuity(mediaId ?? "interstellar");
  if (!j) return null;
  return (
    <section aria-label="Journey continuity" className={cn("space-y-3", className)}>
      <header>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
          Continuity
        </div>
        <h2 className="font-display text-2xl tracking-tight">Before · Now · Next</h2>
      </header>
      <ul className="grid gap-3 md:grid-cols-3">
        {j.previous && (
          <li>
            <RelationshipCard media={j.previous} label="Previous" />
          </li>
        )}
        {j.current && (
          <li>
            <RelationshipCard media={j.current} label="Current" />
          </li>
        )}
        {j.next && (
          <li>
            <RelationshipCard media={j.next} label="Next" />
          </li>
        )}
      </ul>
      <JourneyConnector label="Connected memory, collection, journal" />
    </section>
  );
}
