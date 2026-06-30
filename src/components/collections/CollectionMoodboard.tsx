import { getCollectionItems } from "@/lib/collectionEngine";
import type { Collection } from "@/lib/mock";

export function CollectionMoodboard({ collection }: { collection: Collection }) {
  const items = getCollectionItems(collection);
  if (!items.length) return null;
  return (
    <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
      {items.map((m, i) => (
        <div
          key={m.id}
          className="mb-3 break-inside-avoid overflow-hidden rounded-2xl ring-1 ring-white/10"
        >
          <img
            src={m.poster}
            alt=""
            className={
              i % 3 === 0
                ? "h-72 w-full object-cover"
                : i % 3 === 1
                  ? "h-56 w-full object-cover"
                  : "h-48 w-full object-cover"
            }
          />
        </div>
      ))}
      <div className="mb-3 break-inside-avoid rounded-2xl bg-white/[0.04] p-4 text-sm italic text-muted-foreground ring-1 ring-white/5">
        "A line that keeps coming back."
      </div>
    </div>
  );
}
