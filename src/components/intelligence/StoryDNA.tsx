import { buildMediaDNA } from "@/lib/intelligence";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { cn } from "@/lib/utils";

export function StoryDNA({ mediaId, className }: { mediaId: string; className?: string }) {
  const axes = buildMediaDNA(mediaId);
  if (!axes.length) return null;
  return (
    <section aria-label="Story DNA" className={cn("space-y-3", className)}>
      <header>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
          Story DNA
        </div>
        <h2 className="font-display text-2xl tracking-tight">The shape of this story</h2>
      </header>
      <PremiumGlass variant="subtle">
        <ul className="grid gap-2 p-4 md:grid-cols-2">
          {axes.map((a) => (
            <li key={a.label}>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{a.label}</span>
                <span className="tabular-nums">{Math.round(a.value * 100)}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${Math.round(a.value * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </PremiumGlass>
    </section>
  );
}
