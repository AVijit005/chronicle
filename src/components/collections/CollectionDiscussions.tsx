import { PremiumGlass } from "@/components/ui/PremiumGlass";
import type { Collection } from "@/lib/mock";

const NOTES = [
  "Why this collection exists.",
  "How I'd recommend watching it.",
  "Future additions I'm considering.",
  "Ranking thoughts that change every year.",
];

export function CollectionDiscussions({ collection: _c }: { collection: Collection }) {
  return (
    <PremiumGlass variant="subtle">
      <div className="p-5">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Notebook
        </div>
        <ol className="mt-3 space-y-2 text-sm">
          {NOTES.map((n, i) => (
            <li key={i}>
              {i + 1}. {n}
            </li>
          ))}
        </ol>
      </div>
    </PremiumGlass>
  );
}
