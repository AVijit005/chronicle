import { Sparkles } from "lucide-react";
import { INSIGHT_LINES } from "@/lib/memoryInsights";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  max?: number;
}

export function MemoryInsights({ className, max = 4 }: Props) {
  const lines = INSIGHT_LINES.slice(0, max);
  return (
    <PremiumGlass variant="subtle" className={className}>
      <section className="p-5 md:p-6" aria-label="Memory insights">
        <header className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
          <Sparkles className="h-3 w-3" /> What Chronicle noticed
        </header>
        <ul className="mt-4 space-y-2.5">
          {lines.map((l) => (
            <li
              key={l}
              className={cn(
                "font-display text-base leading-snug tracking-tight text-foreground/85",
              )}
            >
              {l}
            </li>
          ))}
        </ul>
      </section>
    </PremiumGlass>
  );
}
