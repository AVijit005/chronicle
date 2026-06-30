import { getAchievements } from "@/lib/achievements";
import { AchievementCard } from "./AchievementCard";
import { cn } from "@/lib/utils";

export function AchievementGallery({ className }: { className?: string }) {
  const items = getAchievements();
  return (
    <ul className={cn("grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4", className)}>
      {items.map((a) => (
        <li key={a.id}>
          <AchievementCard achievement={a} />
        </li>
      ))}
    </ul>
  );
}
