import { PremiumGlass } from "@/components/ui/PremiumGlass";
import type { Collection } from "@/lib/types";

const ACHS = [
  { name: "Curator", caption: "Built this collection." },
  { name: "Steady Hand", caption: "Added something every month." },
  { name: "Completionist", caption: "Finished half the shelf." },
  { name: "Memory Keeper", caption: "Wrote about it 5 times." },
];

export function CollectionAchievements({ collection: _c }: { collection: Collection }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {ACHS.map((a) => (
        <li key={a.name}>
          <PremiumGlass variant="subtle">
            <div className="p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">
                Milestone
              </div>
              <div className="mt-1 font-display text-base tracking-tight">{a.name}</div>
              <p className="mt-1 text-[11px] text-muted-foreground">{a.caption}</p>
            </div>
          </PremiumGlass>
        </li>
      ))}
    </ul>
  );
}
