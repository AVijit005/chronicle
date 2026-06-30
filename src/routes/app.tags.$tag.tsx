import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { bucketForTag } from "@/lib/tagEngine";
import { PremiumGlass } from "@/components/ui/PremiumGlass";

export const Route = createFileRoute("/app/tags/$tag")({
  loader: ({ params }) => {
    const bucket = bucketForTag(params.tag);
    if (!bucket) throw notFound();
    return { bucket };
  },
  component: TagPage,
});

function TagPage() {
  const { bucket } = Route.useLoaderData() as {
    bucket: NonNullable<ReturnType<typeof bucketForTag>>;
  };
  return (
    <div className="space-y-6 pb-16">
      <Link
        to="/app"
        className="story-link inline-flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>
      <header>
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Tag</div>
        <h1 className="mt-2 font-display text-4xl tracking-tight">#{bucket.tag}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {bucket.count} references across your library.
        </p>
      </header>
      <PremiumGlass variant="subtle">
        <ul className="divide-y divide-white/5 p-5">
          {bucket.refs.map((r) => (
            <li key={`${r.kind}-${r.id}`} className="flex items-center justify-between py-3">
              <span className="truncate text-sm">{r.title}</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {r.kind}
              </span>
            </li>
          ))}
        </ul>
      </PremiumGlass>
    </div>
  );
}
