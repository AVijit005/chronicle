import { MediaCard } from "@/components/media/MediaCard";
import type { MediaItem } from "@/lib/mock";

export function FranchiseEntries({ entries }: { entries: MediaItem[] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {entries.map((e) => (
        <MediaCard key={e.id} item={e as any} />
      ))}
    </div>
  );
}
