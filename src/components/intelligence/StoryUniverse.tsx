import { buildStoryUniverse } from "@/lib/intelligence";
import { getSharedCollection } from "@/lib/mediaGraph";
import { RelationshipCard } from "./RelationshipCard";
import { cn } from "@/lib/utils";

export function StoryUniverse({ mediaId, className }: { mediaId: string; className?: string }) {
  const u = buildStoryUniverse(mediaId);
  if (!u) return null;
  const collections = getSharedCollection(mediaId);
  return (
    <section aria-label="Story universe" className={cn("space-y-5", className)}>
      <header>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
          This story's universe
        </div>
        <h2 className="font-display text-2xl tracking-tight">Connected stories</h2>
      </header>
      {u.creator.length > 0 && (
        <Group label="Same creator">
          {u.creator.slice(0, 4).map((m) => (
            <RelationshipCard key={m.id} media={m} label="Creator" />
          ))}
        </Group>
      )}
      {u.genre.length > 0 && (
        <Group label="Same kind of story">
          {u.genre.slice(0, 4).map((m) => (
            <RelationshipCard key={m.id} media={m} label="Genre" />
          ))}
        </Group>
      )}
      {collections.length > 0 && (
        <Group label="In your collections">
          {collections.slice(0, 4).map((c) => (
            <div key={c.id} className="glass-subtle rounded-2xl p-3 ring-1 ring-white/5">
              <div className="text-[10px] uppercase tracking-[0.18em] text-primary/75">
                Collection
              </div>
              <div className="text-sm">{c.name}</div>
            </div>
          ))}
        </Group>
      )}
    </section>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
        {label}
      </div>
      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">{children}</ul>
    </div>
  );
}
