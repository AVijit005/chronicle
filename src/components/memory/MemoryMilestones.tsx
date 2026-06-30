import { Trophy } from "lucide-react";
import { MILESTONES } from "@/lib/memoryInsights";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function MemoryMilestones({ className }: Props) {
  return (
    <section aria-label="Milestones" className={cn("space-y-5", className)}>
      <header className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl tracking-tight">Milestones</h2>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Quiet, earned celebrations
        </p>
      </header>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MILESTONES.map((ms) => (
          <li key={ms.id}>
            <PremiumGlass variant="default">
              <article className="flex items-center gap-3 p-4">
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-white/[0.04] text-primary/85 ring-1 ring-white/10">
                  <Trophy className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="font-display text-base tracking-tight">{ms.label}</div>
                  <time className="mt-0.5 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
                    Reached {ms.reached}
                  </time>
                </div>
              </article>
            </PremiumGlass>
          </li>
        ))}
      </ul>
    </section>
  );
}
