import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { cn } from "@/lib/utils";

export function QuietRecommendations({ className }: { className?: string }) {
  return (
    <section aria-label="Because today" className={cn(className)}>
      <div className="mb-4">
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Because today…
        </div>
        <h2 className="font-display text-2xl tracking-tight">Quiet recommendations</h2>
      </div>
      <PremiumGlass variant="subtle" className="p-8 text-center text-muted-foreground">
        Recommendations are currently unavailable.
      </PremiumGlass>
    </section>
  );
}
