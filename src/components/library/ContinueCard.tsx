import { Link } from "@tanstack/react-router";
import { Play, NotebookPen } from "lucide-react";
import type { MediaItem } from "@/lib/mock";
import { MEDIA_DETAIL } from "@/lib/mock";
import { useMediaActions } from "@/lib/store/MediaActionsContext";
import { useLibraryStore } from "@/lib/store/libraryStore";

export function ContinueCard({ item }: { item: MediaItem }) {
  const d = MEDIA_DETAIL[item.id];
  const { openProgress } = useMediaActions();
  const meta = useLibraryStore((s) => s.meta[item.id]);
  const pct = meta?.progress ?? item.progress ?? 0;
  const label = meta?.progressLabel ?? d?.continueDetail ?? `${pct}% complete`;
  return (
    <div className="group relative w-[300px] shrink-0 overflow-hidden rounded-2xl border border-border/60">
      <Link to="/app/media/$id" params={{ id: item.id }} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={item.backdrop ?? item.poster}
            alt={item.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div
            className="absolute inset-0 opacity-0 transition group-hover:opacity-60"
            style={{
              background: `radial-gradient(60% 80% at 50% 100%, ${item.accent ?? "oklch(0.72 0.18 255)"} / 0.35, transparent 70%)`,
            }}
          />
        </div>
      </Link>
      <div className="relative p-4">
        <div className="text-[10px] uppercase tracking-[0.2em] text-primary/90">
          {d?.continueLabel ?? "Continue"}
        </div>
        <div className="mt-1 truncate font-medium">{item.title}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => openProgress(item.id)}
            className="press-scale inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-1.5 text-xs font-medium text-primary-foreground"
          >
            <Play className="h-3 w-3 fill-current" /> Pick up
          </button>
          <Link
            to="/app/journal"
            className="press-scale glass-subtle inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <NotebookPen className="h-3 w-3" /> Journal
          </Link>
        </div>
      </div>
    </div>
  );
}
