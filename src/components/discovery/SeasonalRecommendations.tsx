import { getSeasonRecommendations, currentDiscoverySeason } from "@/lib/discovery";
import { RecommendationCard } from "./RecommendationCard";
import { cn } from "@/lib/utils";

const BUCKETS = [
  { label: "Perfect for Rain" },
  { label: "Late Night" },
  { label: "Winter Weekend" },
  { label: "Summer Vacation" },
  { label: "Exam Break" },
  { label: "Sunday Morning" },
  { label: "Travel Companion" },
];

interface Props {
  className?: string;
}

export function SeasonalRecommendations({ className }: Props) {
  const items = getSeasonRecommendations();
  if (!items.length) return null;
  const season = currentDiscoverySeason();
  return (
    <section aria-label="Seasonal picks" className={cn("space-y-4", className)}>
      <header className="flex items-baseline justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
            This season
          </div>
          <h2 className="font-display text-2xl tracking-tight">For {season}</h2>
        </div>
        <ul className="hidden flex-wrap gap-1.5 md:flex">
          {BUCKETS.slice(0, 4).map((b) => (
            <li
              key={b.label}
              className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80"
            >
              {b.label}
            </li>
          ))}
        </ul>
      </header>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.slice(0, 4).map((r) => (
          <li key={r.media.id}>
            <RecommendationCard rec={r} compact />
          </li>
        ))}
      </ul>
    </section>
  );
}
