import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { cn } from "@/lib/utils";

export function SmartFooter({ className }: { className?: string }) {
  return (
    <section aria-label="Your story continues" className={cn("relative pb-24", className)}>
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 h-24"
        style={{ background: "linear-gradient(180deg, transparent, oklch(0.1 0.02 270 / 0.4))" }}
      />
      <div className="text-center">
        <p className="font-display text-3xl tracking-tight md:text-4xl">Your story never stops.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Quiet shelves keep growing while you sleep.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <PremiumGlass variant="subtle">
          <div className="p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Active goals
            </div>
            <p className="mt-3 text-sm text-muted-foreground">No active goals found.</p>
            <Link
              to="/app/goals"
              className="story-link mt-3 inline-block text-xs text-muted-foreground hover:text-foreground"
            >
              Open goals
            </Link>
          </div>
        </PremiumGlass>
        <PremiumGlass variant="subtle">
          <div className="p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Upcoming
            </div>
            <p className="mt-3 text-sm text-muted-foreground">No upcoming releases tracked.</p>
            <Link
              to="/app/calendar"
              className="story-link mt-3 inline-block text-xs text-muted-foreground hover:text-foreground"
            >
              Open calendar
            </Link>
          </div>
        </PremiumGlass>
        <PremiumGlass variant="subtle">
          <div className="p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Reminder
            </div>
            <p className="mt-3 text-sm">Write something quiet.</p>
            <Link
              to="/app/journal"
              className="story-link mt-3 inline-block text-xs text-muted-foreground hover:text-foreground"
            >
              Open Journal
            </Link>
          </div>
        </PremiumGlass>
      </div>
    </section>
  );
}
