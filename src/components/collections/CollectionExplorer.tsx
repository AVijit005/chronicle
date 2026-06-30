import { useState } from "react";
import { PosterCard } from "@/components/ui/PosterCard";
import { getCollectionItems } from "@/lib/collectionEngine";
import type { Collection } from "@/lib/mock";
import { cn } from "@/lib/utils";

type GroupBy = "Genre" | "Creator" | "Year" | "Rating" | "Status";
const GROUPS: GroupBy[] = ["Genre", "Creator", "Year", "Rating", "Status"];

export function CollectionExplorer({ collection }: { collection: Collection }) {
  const items = getCollectionItems(collection);
  const [g, setG] = useState<GroupBy>("Genre");

  const groups: Record<string, typeof items> = {};
  for (const m of items) {
    const key =
      g === "Genre"
        ? (m.genres[0] ?? "Other")
        : g === "Creator"
          ? (m.creator ?? "Unknown")
          : g === "Year"
            ? String(m.year)
            : g === "Rating"
              ? `${Math.round(m.rating)}★`
              : m.status;
    groups[key] = groups[key] ?? [];
    groups[key]!.push(m);
  }

  return (
    <section aria-label="Collection explorer" className="space-y-4">
      <ul className="flex flex-wrap gap-2">
        {GROUPS.map((k) => (
          <li key={k}>
            <button
              onClick={() => setG(k)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition",
                k === g
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground",
              )}
            >
              {k}
            </button>
          </li>
        ))}
      </ul>
      <div className="space-y-6">
        {Object.entries(groups).map(([k, list]) => (
          <div key={k}>
            <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
              {k} · {list.length}
            </div>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-5 lg:grid-cols-6">
              {list.map((m) => (
                <PosterCard key={m.id} item={m} size="sm" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
