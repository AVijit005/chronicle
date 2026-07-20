import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getCompanionStories } from "@/lib/mediaStory";
import type { MediaItem } from "@/lib/types";

export function CompanionStories({ item }: { item: MediaItem }) {
  const list = getCompanionStories(item);
  return (
    <ul className="grid gap-3 md:grid-cols-3">
      {list.map((c) => (
        <li key={c.media.id}>
          <Link to="/app/media/$id" params={{ id: c.media.id }}>
            <PremiumGlass variant="subtle">
              <div className="flex items-center gap-3 p-4">
                <img
                  src={c.media.poster}
                  alt=""
                  className="h-14 w-10 rounded-md object-cover ring-1 ring-white/10"
                />
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">
                    {c.label}
                  </div>
                  <div className="text-sm">{c.media.title}</div>
                </div>
              </div>
            </PremiumGlass>
          </Link>
        </li>
      ))}
    </ul>
  );
}
