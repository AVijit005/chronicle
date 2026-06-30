import { cn } from "@/lib/utils";
import type { MemoryBadge } from "@/lib/memory";

interface Props {
  badges: MemoryBadge[];
  className?: string;
  max?: number;
}

export function MemoryBadges({ badges, className, max }: Props) {
  const list = max ? badges.slice(0, max) : badges;
  if (!list.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Memory badges">
      {list.map((b) => (
        <li
          key={b}
          className="rounded-full bg-white/[0.03] px-2 py-[3px] text-[10px] uppercase tracking-[0.18em] text-foreground/70 ring-1 ring-white/10"
        >
          {b}
        </li>
      ))}
    </ul>
  );
}
