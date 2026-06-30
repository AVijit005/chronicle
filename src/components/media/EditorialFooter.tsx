import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";

export function EditorialFooter() {
  return (
    <section aria-label="Editorial footer" className="pb-24">
      <div className="text-center">
        <p className="font-display text-2xl tracking-tight md:text-3xl">
          The story may be over, but the memory remains.
        </p>
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <PremiumGlass variant="subtle">
          <div className="p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Related memories
            </div>
            <Link to="/app/timeline" className="story-link mt-2 inline-block text-sm">
              Open timeline
            </Link>
          </div>
        </PremiumGlass>
        <PremiumGlass variant="subtle">
          <div className="p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Planning queue
            </div>
            <Link to="/app/library/planning" className="story-link mt-2 inline-block text-sm">
              View planning
            </Link>
          </div>
        </PremiumGlass>
        <PremiumGlass variant="subtle">
          <div className="p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Journal
            </div>
            <Link to="/app/journal" className="story-link mt-2 inline-block text-sm">
              Write something
            </Link>
          </div>
        </PremiumGlass>
      </div>
    </section>
  );
}
