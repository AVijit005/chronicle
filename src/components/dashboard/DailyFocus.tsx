import { Target } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getDashboardContext } from "@/lib/dashboardContext";
import { cn } from "@/lib/utils";

export function DailyFocus({ className }: { className?: string }) {
  const c = getDashboardContext();
  const focus = c.currentJourney ? `Continue ${c.currentJourney.title}.` : "Write today's journal.";
  return (
    <PremiumGlass variant="strong" glow={c.currentJourney?.accent} className={className}>
      <div className="p-6 md:p-7">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-primary/85">
          <Target className="h-3 w-3" /> Today's focus
        </div>
        <h3 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">{focus}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          A single, gentle goal for the day. Small wins compound.
        </p>
      </div>
    </PremiumGlass>
  );
}
