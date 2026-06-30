import { motion } from "motion/react";
import { Target } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { PremiumProgress } from "@/components/ui/PremiumProgress";
import { getPrimaryGoal } from "@/lib/goals";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function GoalHero({ className }: Props) {
  const g = getPrimaryGoal();
  if (!g) return null;
  const pct = Math.round((g.current / g.target) * 100);
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      aria-label="Current goal"
      className={cn("relative", className)}
    >
      <PremiumGlass variant="strong" glow={g.accent}>
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-primary/85">
            <Target className="h-3 w-3" /> Current chapter
          </div>
          <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">{g.title}</h2>
          <p className="mt-2 max-w-prose text-sm text-muted-foreground">{g.description}</p>
          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <div className="font-display text-2xl tracking-tight">
                {g.current}
                <span className="text-muted-foreground"> / {g.target}</span>
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
                {pct}% — {g.reward}
              </div>
            </div>
            <div className="text-right text-[11px] text-muted-foreground/80">
              Started {g.startedAt}
              {g.deadline ? ` · Ends ${g.deadline}` : ""}
            </div>
          </div>
          <PremiumProgress value={pct} accent={g.accent} className="mt-4" />
        </div>
      </PremiumGlass>
    </motion.section>
  );
}
