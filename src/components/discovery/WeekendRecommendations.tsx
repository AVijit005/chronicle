import { getShortWeekendStories, getLongJourneyRecommendations } from "@/lib/discovery";
import { RecommendationCard } from "./RecommendationCard";
import { cn } from "@/lib/utils";

const BUCKETS = [
  { label: "2 hours" },
  { label: "5 hours" },
  { label: "10 hours" },
  { label: "One weekend" },
  { label: "Long journey" },
];

interface Props {
  className?: string;
}

export function WeekendRecommendations({ className }: Props) {
  const short = getShortWeekendStories();
  const long = getLongJourneyRecommendations();
  const items = [...short, ...long].slice(0, 8);
  if (!items.length) return null;
  return (
    <section aria-label="Weekend picks" className={cn("space-y-4", className)}>
      <header className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl tracking-tight">For your weekend</h2>
        <ul className="hidden flex-wrap gap-1.5 md:flex">
          {BUCKETS.map((b) => (
            <li
              key={b.label}
              className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80"
            >
              {b.label}
            </li>
          ))}
        </ul>
      </header>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.slice(0, 4).map((r) => (
          <li key={r.media.id}>
            <RecommendationCard rec={r} compact />
          </li>
        ))}
      </ul>
    </section>
  );
}
