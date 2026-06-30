import { STREAKS } from "@/lib/memoryInsights";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function MemoryStreaks({ className }: Props) {
  return (
    <ul
      aria-label="Memory streaks"
      className={cn("grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5", className)}
    >
      {STREAKS.map((s) => (
        <li key={s.kind}>
          <PremiumGlass variant="subtle">
            <article className="p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">
                {s.kind}
              </div>
              <div className="mt-1 font-display text-2xl tracking-tight">{s.value}</div>
              <p className="mt-1 text-[11px] text-muted-foreground">{s.caption}</p>
            </article>
          </PremiumGlass>
        </li>
      ))}
    </ul>
  );
}
