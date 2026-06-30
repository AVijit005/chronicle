import { Link } from "@tanstack/react-router";
import { COLLECTIONS } from "@/lib/mock";
import type { MediaItem } from "@/lib/mock";

export function CollectionsIntegration({ item }: { item: MediaItem }) {
  const cols = COLLECTIONS.filter((c) => c.mediaIds?.includes(item.id));
  const fallback = cols.length ? cols : COLLECTIONS.slice(0, 4);
  return (
    <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {fallback.map((c) => (
        <li key={c.id}>
          <Link
            to="/app/collections/$id"
            params={{ id: c.id }}
            className="glass-subtle group flex items-center gap-3 rounded-2xl p-3 ring-1 ring-white/5 hover-lift"
          >
            <div
              className="h-10 w-10 rounded-lg ring-1 ring-white/10"
              style={{ background: `linear-gradient(135deg, ${c.accent}, transparent)` }}
            />
            <div className="min-w-0">
              <div className="truncate text-sm">{c.name}</div>
              <div className="text-[11px] text-muted-foreground">{c.count} items</div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
