import { createFileRoute, notFound } from "@tanstack/react-router";
import { MediaCard } from "@/components/media/MediaCard";
import { MEDIA, KIND_LABEL, type MediaKind } from "@/lib/mock";
import { EmptyState } from "@/components/common/Section";

const KINDS = new Set<MediaKind>([
  "movie",
  "series",
  "anime",
  "book",
  "manga",
  "game",
  "music",
  "podcast",
  "course",
  "youtube",
]);

export const Route = createFileRoute("/app/library/$kind")({
  loader: ({ params }) => {
    if (!KINDS.has(params.kind as MediaKind)) throw notFound();
    return { kind: params.kind as MediaKind };
  },
  component: LibraryKind,
});

function LibraryKind() {
  const data = Route.useLoaderData() as { kind: MediaKind };
  const kind = data.kind;
  const items = MEDIA.filter((m) => m.kind === kind);
  return (
    <div className="pt-2">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-primary">Library</div>
          <h1 className="mt-2 font-display text-4xl tracking-tight">{KIND_LABEL[kind]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} items in your collection.
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title={`No ${KIND_LABEL[kind].toLowerCase()} yet`}
          description="When you add something here, it'll appear with all the cinematic care it deserves."
        />
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((m) => (
            <MediaCard key={m.id} item={m as any} />
          ))}
        </div>
      )}
    </div>
  );
}
