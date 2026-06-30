import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { cn } from "@/lib/utils";

export function JourneyTracker({ className }: { className?: string }) {
  const steps = [
    { label: "Started", value: "Mar 14" },
    { label: "Current position", value: "Episode 1092" },
    { label: "Completed", value: "82 of 110" },
    { label: "Journaled", value: "24 entries" },
    { label: "Recommended next", value: "Stay with it" },
    { label: "Memory created", value: "On finishing" },
  ];
  return (
    <section aria-label="Journey tracker" className={cn("space-y-3", className)}>
      <h2 className="font-display text-2xl tracking-tight">Your journey, end to end</h2>
      <PremiumGlass variant="subtle">
        <ol className="grid gap-px md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.label} className="p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-1 text-sm">{s.value}</div>
            </li>
          ))}
        </ol>
      </PremiumGlass>
    </section>
  );
}
