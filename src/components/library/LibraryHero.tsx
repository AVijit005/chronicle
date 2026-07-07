import { motion } from "motion/react";
import { collageRecent, statusCounts } from "@/lib/library";
import { PremiumGlass } from "@/components/ui/PremiumGlass";

export function LibraryHero() {
  const posters = collageRecent(9);
  const c = statusCounts();
  return (
    <PremiumGlass className="relative overflow-hidden border border-border/60">
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

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 md:max-w-3xl md:grid-cols-4 pointer-events-auto">
          {[
            {
              k: "Total",
              v:
                c.completed +
                c.in_progress +
                c.planning +
                c.paused +
                c.dropped +
                c.rewatching +
                c.archived,
            },
            { k: "Completed", v: c.completed },
            { k: "In Progress", v: c.in_progress },
            { k: "Planning", v: c.planning },
          ].map((s) => (
            <PremiumGlass key={s.k} interactive className="rounded-2xl px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground cursor-pointer">
                {s.k}
              </div>
              <div className="mt-1 font-display text-2xl md:text-3xl cursor-pointer">{s.v}</div>
            </PremiumGlass>
          ))}
        </div>
      </div>
    </PremiumGlass>
  );
}
