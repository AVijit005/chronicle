import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";

export function CollectionFooter() {
  return (
    <section aria-label="Collection footer" className="pb-16">
      <div className="text-center">
        <p className="font-display text-2xl tracking-tight md:text-3xl">
          This collection is still growing.
        </p>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <PremiumGlass variant="subtle">
          <div className="p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Planning queue
            </div>
            <Link to="/app/library/planning" className="story-link mt-2 inline-block text-sm">
              Open planning
            </Link>
          </div>
        </PremiumGlass>
        <PremiumGlass variant="subtle">
          <div className="p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Discover
            </div>
            <Link to="/app/library" className="story-link mt-2 inline-block text-sm">
              Find new additions
            </Link>
          </div>
        </PremiumGlass>
        <PremiumGlass variant="subtle">
          <div className="p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Journal
            </div>
            <Link to="/app/journal" className="story-link mt-2 inline-block text-sm">
              Write about it
            </Link>
          </div>
        </PremiumGlass>
      </div>
    </section>
  );
}
