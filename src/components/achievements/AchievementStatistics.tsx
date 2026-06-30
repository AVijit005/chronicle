import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getAchievements, getAchievementsByCategory } from "@/lib/achievements";
import { cn } from "@/lib/utils";

export function AchievementStatistics({ className }: { className?: string }) {
  const total = getAchievements().length;
  const byCat = getAchievementsByCategory();
  const stats = [
    { label: "Earned", value: total },
    { label: "Categories", value: Object.keys(byCat).length },
    { label: "Latest", value: getAchievements()[0]?.earnedAt ?? "—" },
    {
      label: "Favorite category",
      value: Object.entries(byCat).sort((a, b) => b[1].length - a[1].length)[0]?.[0] ?? "—",
    },
  ];
  return (
    <ul className={cn("grid grid-cols-2 gap-3 md:grid-cols-4", className)}>
      {stats.map((s) => (
        <li key={s.label}>
          <PremiumGlass variant="subtle">
            <article className="p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-1 font-display text-xl tracking-tight">{s.value}</div>
            </article>
          </PremiumGlass>
        </li>
      ))}
    </ul>
  );
}
