import { PremiumGlass } from "@/components/ui/PremiumGlass";
import type { Franchise } from "@/lib/franchiseEngine";

export function FranchiseHero({
  franchise,
  completion,
}: {
  franchise: Franchise;
  completion: number;
}) {
  return (
    <PremiumGlass variant="strong" glow={franchise.accent + " / 0.4"}>
      <div className="grid gap-0 md:grid-cols-[260px_minmax(0,1fr)]">
        <div className="relative aspect-[3/4] overflow-hidden md:rounded-l-3xl">
          <img src={franchise.cover} alt={franchise.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent md:hidden" />
        </div>
        <div className="p-6 md:p-10">
          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Franchise
          </div>
          <h1 className="mt-2 font-display text-3xl tracking-tight md:text-5xl">
            {franchise.name}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">{franchise.description}</p>
          <div className="mt-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Completion
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: `${completion}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{completion}%</div>
          </div>
        </div>
      </div>
    </PremiumGlass>
  );
}
