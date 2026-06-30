import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { cn } from "@/lib/utils";

const LINES = [
  "You slowed down this week.",
  "You spent more time reading than usual.",
  "Gaming replaced movies for a few quiet nights.",
  "You completed more stories than last week.",
  "Journal activity increased on weekends.",
];

export function WeeklyReflection({ className }: { className?: string }) {
  return (
    <PremiumGlass variant="subtle" className={className}>
      <div className="p-6">
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          This week, gently
        </div>
        <ul className="mt-4 space-y-2 font-display text-lg leading-snug tracking-tight">
          {LINES.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>
    </PremiumGlass>
  );
}
