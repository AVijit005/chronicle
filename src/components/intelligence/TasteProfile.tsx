import { buildTasteProfile } from "@/lib/intelligence";
import { TasteChip } from "./TasteChip";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { cn } from "@/lib/utils";
import { cascade } from "@/lib/motion";

const cardMotion = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: cascade(i),
});

export function TasteProfile({ className }: { className?: string }) {
  const t = buildTasteProfile();
  return (
    <section aria-label="Taste profile" className={cn("space-y-4", className)}>
      <header>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
          Taste profile
        </div>
        <h2 className="font-display text-2xl tracking-tight">This is how you watch</h2>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        <PremiumGlass variant="subtle" {...cardMotion(0)}>
          <div className="p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Favorite genres
            </div>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {t.favoriteGenres.map((g) => (
                <li key={g.name}>
                  <TasteChip label={g.name} count={g.count} />
                </li>
              ))}
            </ul>
          </div>
        </PremiumGlass>
        <PremiumGlass variant="subtle" {...cardMotion(1)}>
          <div className="p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Favorite creators
            </div>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {t.favoriteCreators.map((c) => (
                <li key={c.name}>
                  <TasteChip label={c.name} count={c.count} />
                </li>
              ))}
            </ul>
          </div>
        </PremiumGlass>
        <PremiumGlass variant="subtle" {...cardMotion(2)}>
          <div className="grid gap-3 p-4 md:grid-cols-2">
            <Fact label="Era" value={t.favoriteEras.map((e) => e.name).join(", ")} />
            <Fact label="Runtime" value={t.favoriteRuntime} />
            <Fact label="Time of day" value={t.favoriteTimeOfDay} />
            <Fact label="Season" value={t.favoriteSeasons.join(", ")} />
            <Fact label="Mood" value={t.favoriteMood} />
            <Fact label="Companion" value={t.favoriteCompanion} />
          </div>
        </PremiumGlass>
        <PremiumGlass variant="subtle" {...cardMotion(3)}>
          <div className="p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Completion pattern
            </div>
            <p className="mt-2 text-sm">{t.favoriteCompletionPattern}</p>
          </div>
        </PremiumGlass>
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
        {label}
      </div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
