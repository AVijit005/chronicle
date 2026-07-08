import { motion } from "motion/react";
import { Library as LibraryIcon } from "lucide-react";
import { statusCounts } from "@/lib/library";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { CountUp } from "@/components/analytics/AnalyticsKit";

export function LibraryHero() {
  const c = statusCounts();
  return (
    <motion.section
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <PremiumGlass 
        interactive
        variant="strong"
        className="relative overflow-hidden rounded-[40px] p-10 md:p-16 transform-gpu isolate"
        glow="oklch(0.72 0.18 255 / 0.35)"
      >
        <div className="relative z-10 pointer-events-auto">
          <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground flex items-center gap-2">
            <LibraryIcon className="h-3 w-3 text-primary" /> Library
          </div>
          <h1 className="mt-5 font-display text-5xl tracking-tight md:text-7xl">
            <span className="text-gradient-aurora">Your Library</span>
          </h1>
          <p className="mt-5 max-w-xl text-muted-foreground md:text-lg">
            Every story you've watched, read, played and lived.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                l: "Total",
                v:
                  c.completed +
                  c.in_progress +
                  c.planning +
                  c.paused +
                  c.dropped +
                  c.rewatching +
                  c.archived,
              },
              { l: "Completed", v: c.completed },
              { l: "In Progress", v: c.in_progress },
              { l: "Planning", v: c.planning },
            ].map((s) => (
              <PremiumGlass 
                key={s.l} 
                interactive
                variant="subtle"
                className="relative z-10 overflow-hidden p-4 cursor-pointer press-scale"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {s.l}
                </div>
                <div className="mt-2 font-display text-3xl tracking-tight">
                  <CountUp to={s.v} />
                </div>
              </PremiumGlass>
            ))}
          </div>
        </div>
      </PremiumGlass>
    </motion.section>
  );
}
