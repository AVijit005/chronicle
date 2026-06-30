import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getSimilarMemories } from "@/lib/mediaStory";
import type { MediaItem } from "@/lib/mock";

export function SimilarMemories({ item }: { item: MediaItem }) {
  const list = getSimilarMemories(item);
  if (!list.length) return null;
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {list.map((s) => (
        <li key={s.other.id}>
          <Link to="/app/media/$id" params={{ id: s.other.id }}>
            <PremiumGlass variant="subtle">
              <div className="flex items-center gap-4 p-4">
                <img
                  src={s.other.poster}
                  alt=""
                  className="h-16 w-12 rounded-md object-cover ring-1 ring-white/10"
                />
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">
                    Similar memory
                  </div>
                  <div className="mt-0.5 font-display text-base tracking-tight">
                    {s.other.title}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{s.reason}</p>
                </div>
              </div>
            </PremiumGlass>
          </Link>
        </li>
      ))}
    </ul>
  );
}
