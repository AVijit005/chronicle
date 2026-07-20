import { getEmotionPath } from "@/lib/mediaStory";
import type { MediaItem } from "@/lib/types";

export function EmotionJourney({ item }: { item: MediaItem }) {
  const path = getEmotionPath(item);
  const points = path
    .map((p, i) => `${(i / (path.length - 1)) * 100},${(1 - p.joy) * 100}`)
    .join(" ");
  return (
    <section aria-label="Emotional journey" className="space-y-4">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-40 w-full overflow-visible"
      >
        <defs>
          <linearGradient id="ej" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.7 0.18 255)" />
            <stop offset="50%" stopColor="oklch(0.65 0.22 295)" />
            <stop offset="100%" stopColor="oklch(0.78 0.18 50)" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="url(#ej)"
          strokeWidth="1.6"
          points={points}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
      </svg>
      <ul className="grid grid-cols-3 gap-3">
        {path.map((p) => (
          <li key={p.label}>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
              {p.label}
            </div>
            <div className="text-sm">
              Energy {Math.round(p.energy * 100)} · Joy {Math.round(p.joy * 100)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
