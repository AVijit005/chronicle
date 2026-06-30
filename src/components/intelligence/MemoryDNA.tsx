import { buildMemoryDNA } from "@/lib/intelligence";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { cn } from "@/lib/utils";

export function MemoryDNA({ mediaId, className }: { mediaId: string; className?: string }) {
  const dna = buildMemoryDNA(mediaId);
  if (!dna) return null;
  const rows = [
    ["Dominant emotion", dna.dominantEmotion],
    ["Season", dna.season],
    ["Companion", dna.companion],
    ["Importance", `${Math.round(dna.importance * 100)}%`],
    ["Reflection depth", `${Math.round(dna.reflectionDepth * 100)}%`],
    ["Journal richness", `${Math.round(dna.journalRichness * 100)}%`],
    ["Favorite level", `${Math.round(dna.favoriteLevel * 100)}%`],
    ["Memory strength", `${Math.round(dna.memoryStrength * 100)}%`],
  ] as const;
  return (
    <section aria-label="Memory DNA" className={cn("space-y-3", className)}>
      <header>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
          Memory DNA
        </div>
        <h2 className="font-display text-2xl tracking-tight">How you remember this</h2>
      </header>
      <PremiumGlass variant="subtle">
        <ul className="grid gap-px p-4 md:grid-cols-2">
          {rows.map(([k, v]) => (
            <li key={k} className="flex items-baseline justify-between p-2">
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {k}
              </span>
              <span className="text-sm">{v}</span>
            </li>
          ))}
        </ul>
      </PremiumGlass>
    </section>
  );
}
