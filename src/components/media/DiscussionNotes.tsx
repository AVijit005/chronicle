import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getDiscussionNotes } from "@/lib/mediaStory";
import type { MediaItem } from "@/lib/types";

export function DiscussionNotes({ item }: { item: MediaItem }) {
  const notes = getDiscussionNotes(item);
  return (
    <PremiumGlass variant="subtle">
      <div className="p-5">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Notebook
        </div>
        <ol className="mt-3 space-y-2 text-sm">
          {notes.map((n, i) => (
            <li key={i} className="leading-relaxed">
              {i + 1}. {n}
            </li>
          ))}
        </ol>
      </div>
    </PremiumGlass>
  );
}
