import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getFavoriteSceneStrip } from "@/lib/mediaStory";
import type { MediaItem } from "@/lib/mock";

export function FavoriteMoments({ item }: { item: MediaItem }) {
  const moments = getFavoriteSceneStrip(item);
  return (
    <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {moments.map((m, i) => (
        <li key={i}>
          <PremiumGlass variant="subtle">
            <div className="p-4">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <span>
                  {m.episode} · {m.timestamp}
                </span>
                <span className="text-primary/80">{m.reaction}</span>
              </div>
              <p className="mt-2 font-display text-base tracking-tight">"{m.quote}"</p>
            </div>
          </PremiumGlass>
        </li>
      ))}
    </ul>
  );
}
