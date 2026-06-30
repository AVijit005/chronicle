import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getCharacters } from "@/lib/mediaStory";
import type { MediaItem } from "@/lib/mock";

export function CharactersYouLoved({ item }: { item: MediaItem }) {
  const chars = getCharacters(item);
  return (
    <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {chars.map((c) => (
        <li key={c.name}>
          <PremiumGlass variant="subtle">
            <div className="p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">
                {c.mood}
              </div>
              <div className="mt-1 font-display text-base tracking-tight">{c.name}</div>
              <p className="mt-1 text-[11px] text-muted-foreground">{c.note}</p>
              <div className="mt-2 text-[11px] text-muted-foreground">
                Personal rating {c.rating.toFixed(1)}
              </div>
            </div>
          </PremiumGlass>
        </li>
      ))}
    </ul>
  );
}
