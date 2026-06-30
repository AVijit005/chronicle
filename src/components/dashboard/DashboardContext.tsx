import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getDashboardContext } from "@/lib/dashboardContext";
import { cn } from "@/lib/utils";

export function DashboardContext({ className }: { className?: string }) {
  const c = getDashboardContext();
  const items = [
    { k: "Current journey", v: c.currentJourney?.title ?? "—" },
    { k: "Mood", v: c.currentMood },
    { k: "Season", v: c.season },
    { k: "Streak", v: `${c.streak} days` },
    { k: "Favorite creator", v: c.favoriteCreator },
    { k: "Top genre", v: c.topGenre },
  ];
  return (
    <PremiumGlass variant="subtle" className={className}>
      <ul className="grid grid-cols-2 gap-px md:grid-cols-3">
        {items.map((i) => (
          <li key={i.k} className={cn("p-4")}>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
              {i.k}
            </div>
            <div className="mt-1 text-sm">{i.v}</div>
          </li>
        ))}
      </ul>
    </PremiumGlass>
  );
}
