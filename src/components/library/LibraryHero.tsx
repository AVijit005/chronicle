import { motion } from "motion/react";
import { collageRecent, statusCounts } from "@/lib/library";
import { PremiumGlass } from "@/components/ui/PremiumGlass";

import { CountUp } from "@/components/landing/CountUp";

export function LibraryHero() {
  const posters = collageRecent(9);
  const c = statusCounts();
  return (
    <PremiumGlass className="relative overflow-hidden border border-border/60">
      <style dangerouslySetInnerHTML={{ __html: `
        .stat-glass-card {
          box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--stat-accent) 25%, transparent), 0 0 0 0 transparent;
        }
        .stat-glass-card:hover {
          box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--stat-accent) 80%, transparent), 0 12px 32px -12px color-mix(in oklch, var(--stat-accent) 35%, transparent);
        }
      `}} />
      <div className="absolute inset-0 pointer-events-none">
        <div className="grid h-full w-full grid-cols-9 opacity-60">
          {posters.map((p, i) => (
            <div key={i} className="relative overflow-hidden">
              <img src={p} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.14 0.012 270 / 0.3), oklch(0.14 0.012 270 / 0.85) 60%, oklch(0.14 0.012 270 / 0.95))",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-aurora)", opacity: 0.45 }}
        />
      </div>

      <div className="relative px-6 py-12 md:px-12 md:py-20 cursor-default">
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto cursor-text"
        >
          <div className="text-[11px] uppercase tracking-[0.28em] text-primary/90">Library</div>
          <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">
            Your Library
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            Every story you've watched, read, played and lived.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 md:max-w-4xl pointer-events-auto">
          {[
            {
              k: "TOTAL",
              v:
                c.completed +
                c.in_progress +
                c.planning +
                c.paused +
                c.dropped +
                c.rewatching +
                c.archived,
              ctx: "All stories",
              accent: "oklch(0.72 0.18 255)", // Neon cyan/blue
            },
            { k: "COMPLETED", v: c.completed, ctx: "Finished", accent: "oklch(0.72 0.16 160)" }, // Emerald green
            { k: "IN PROGRESS", v: c.in_progress, ctx: "Currently", accent: "oklch(0.65 0.22 295)" }, // Violet
            { k: "PLANNING", v: c.planning, ctx: "Up next", accent: "oklch(0.82 0.16 80)" }, // Amber
          ].map((s) => (
            <div 
              key={s.k}
              className="stat-glass-card group/stat flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-white/[0.03] p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 ease-out hover:-translate-y-[2px] hover:bg-white/[0.05] cursor-pointer"
              style={{ ["--stat-accent" as string]: s.accent }}
            >
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/70 transition-colors group-hover/stat:text-white/90">
                {s.k}
              </div>
              <div className="mt-4 font-display text-4xl tracking-tight text-white tabular-nums">
                <CountUp to={s.v} />
              </div>
              <div className="mt-2 text-xs text-white/50 transition-colors group-hover/stat:text-white/70">
                {s.ctx}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PremiumGlass>
  );
}
