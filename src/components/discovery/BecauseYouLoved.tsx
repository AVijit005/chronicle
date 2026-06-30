import { getBecauseYouLoved } from "@/lib/discovery";
import { MEDIA } from "@/lib/mock";
import { RecommendationCard } from "./RecommendationCard";
import { cn } from "@/lib/utils";

interface Props {
  anchorId?: string;
  className?: string;
}

export function BecauseYouLoved({ anchorId, className }: Props) {
  const id = anchorId ?? "interstellar";
  const anchor = MEDIA.find((m) => m.id === id);
  const items = getBecauseYouLoved(id);
  if (!anchor || !items.length) return null;
  return (
    <section
      aria-label={`Because you loved ${anchor.title}`}
      className={cn("space-y-4", className)}
    >
      <header>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
          Because you loved
        </div>
        <h2 className="font-display text-2xl tracking-tight">{anchor.title}</h2>
      </header>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {items.slice(0, 5).map((r) => (
          <li key={r.media.id}>
            <RecommendationCard rec={r} compact />
          </li>
        ))}
      </ul>
    </section>
  );
}
