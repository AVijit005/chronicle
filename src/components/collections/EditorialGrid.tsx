import { CollectionCard } from "./CollectionCard";
import type { Collection } from "@/lib/mock";

export function EditorialGrid({ collections }: { collections: Collection[] }) {
  // editorial rhythm: alternate large/medium/small
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-6">
      {collections.map((c, i) => {
        const pattern = i % 6;
        // 0: span 4, 1: span 2, 2: span 2, 3: span 2, 4: span 2, 5: span 2 (then large)
        const span =
          pattern === 0
            ? "col-span-2 md:col-span-4"
            : pattern === 3
              ? "col-span-2 md:col-span-2"
              : "col-span-2 md:col-span-2";
        const size = pattern === 0 ? "lg" : "md";
        return (
          <div key={c.id} className={span}>
            <CollectionCard collection={c} size={size as "lg" | "md"} />
          </div>
        );
      })}
    </div>
  );
}
