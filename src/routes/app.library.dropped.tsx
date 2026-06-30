import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { StatusPageShell } from "@/components/library/StatusPageShell";
import { dropped, metaOf } from "@/lib/library";

export const Route = createFileRoute("/app/library/dropped")({
  component: DroppedPage,
});

function DroppedPage() {
  const items = dropped();
  return (
    <StatusPageShell
      status="dropped"
      title="Stories Left Behind"
      description="It wasn't the right one. That's a kind of memory too."
      count={items.length}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((m) => {
          const meta = metaOf(m.id);
          return (
            <div key={m.id} className="glass flex items-center gap-4 rounded-2xl p-3 opacity-90">
              <img
                src={m.poster}
                alt=""
                className="h-20 w-14 shrink-0 rounded-md object-cover saturate-75"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{m.title}</div>
                <div
                  className="mt-0.5 text-[11px]"
                  style={{
                    color: "color-mix(in oklab, var(--status-dropped) 80%, oklch(0.97 0 0))",
                  }}
                >
                  {meta.droppedAtLabel ?? "Dropped"}
                </div>
                <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {m.year} · {m.kind}
                </div>
              </div>
              <Link
                to="/app/media/$id"
                params={{ id: m.id }}
                className="press-scale glass-subtle inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3" /> Restart
              </Link>
            </div>
          );
        })}
      </div>
    </StatusPageShell>
  );
}
