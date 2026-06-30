import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { Link } from "@tanstack/react-router";
import { MEDIA } from "@/lib/mock";
import { cn } from "@/lib/utils";

const TO_READ = MEDIA.filter((m) => m.kind === "book" || m.kind === "manga").map((m) => ({
  media: m,
  priority: "med" as const,
  estHours: 8,
  reason: "Saved for later.",
  mood: "Quiet",
}));

export function ReadingList({ className }: { className?: string }) {
  if (!TO_READ.length) return null;
  return (
    <section aria-label="Reading list" className={cn("space-y-3", className)}>
      <h2 className="font-display text-2xl tracking-tight">Reading list</h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {TO_READ.map(({ media, priority, estHours, reason, mood }) => (
          <li key={media.id}>
            <PremiumGlass variant="subtle">
              <Link to="/app/media/$id" params={{ id: media.id }} className="flex gap-3 p-3">
                <img
                  src={media.poster}
                  alt=""
                  className="h-20 w-14 flex-none rounded-md object-cover ring-1 ring-white/10"
                />
                <div className="min-w-0">
                  <div className="truncate text-sm">{media.title}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
                    {priority} priority · ~{estHours}h · {mood}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{reason}</p>
                </div>
              </Link>
            </PremiumGlass>
          </li>
        ))}
      </ul>
    </section>
  );
}
