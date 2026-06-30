import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getCompanionCollections } from "@/lib/collectionRelationships";
import type { Collection } from "@/lib/mock";

export function SmartCollectionSuggestions({ collection }: { collection: Collection }) {
  const comps = getCompanionCollections(collection.id).slice(0, 4);
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {comps.map((c) => (
        <li key={c.id}>
          <Link to="/app/collections/$id" params={{ id: c.id }}>
            <PremiumGlass variant="subtle">
              <div className="flex items-center gap-3 p-4">
                <div
                  className="h-12 w-12 rounded-lg ring-1 ring-white/10"
                  style={{ background: `linear-gradient(135deg, ${c.accent}, transparent)` }}
                />
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">
                    Pairs beautifully with
                  </div>
                  <div className="text-sm">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {c.count} items · {c.category}
                  </div>
                </div>
              </div>
            </PremiumGlass>
          </Link>
        </li>
      ))}
    </ul>
  );
}
