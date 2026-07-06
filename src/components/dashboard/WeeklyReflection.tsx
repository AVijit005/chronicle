import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { cn } from "@/lib/utils";

export function WeeklyReflection({ className }: { className?: string }) {
  return (
    <PremiumGlass variant="subtle" className={className}>
      <div className="p-6">
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          This week, gently
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Weekly reflection unavailable (API limitation)
        </div>
      </div>
    </PremiumGlass>
  );
}
