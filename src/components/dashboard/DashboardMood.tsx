import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getDashboardContext } from "@/lib/dashboardContext";
import { cn } from "@/lib/utils";

export function DashboardMood({ className }: { className?: string }) {
  const c = getDashboardContext();
  return (
    <PremiumGlass variant="subtle" className={className}>
      <div className="p-6">
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Current atmosphere
        </div>
        <p className="mt-3 font-display text-xl leading-snug tracking-tight">
          Your week leans toward{" "}
          <span className="text-foreground">{c.currentMood.toLowerCase()}</span>. The journal sounds
          slower than usual, and you've returned to {c.favoriteCreator}'s world more than once.
          {c.season === "Winter" ? " The season is quiet — comfort stories surface easily." : ""}
        </p>
      </div>
    </PremiumGlass>
  );
}
