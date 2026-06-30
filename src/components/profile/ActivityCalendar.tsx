import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { ACTIVITY_30D } from "@/lib/mock";

export function ActivityCalendar() {
  const cols = 30;
  const max = Math.max(...ACTIVITY_30D.map((a) => a.hours));
  return (
    <PremiumGlass variant="subtle">
      <div className="p-5">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Activity (last 30 days)
        </div>
        <div
          className="mt-4 grid gap-1"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {ACTIVITY_30D.map((a) => {
            const alpha = 0.1 + (a.hours / max) * 0.75;
            return (
              <div
                key={a.day}
                title={`Day ${a.day}: ${a.hours}h`}
                className="aspect-square rounded-[4px]"
                style={{ background: `oklch(0.72 0.18 255 / ${alpha})` }}
              />
            );
          })}
        </div>
      </div>
    </PremiumGlass>
  );
}
