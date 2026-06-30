import { motion } from "motion/react";
import { CountUp } from "@/components/landing/CountUp";
import { dur, ease } from "@/lib/motion";

const STATS = [
  { v: 312, l: "Stories that stayed" },
  { v: 47, l: "Days of curiosity" },
  { v: 1284, l: "Hours remembered" },
];

export function MemoryStats({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      {STATS.map((s, i) => (
        <motion.div
          key={s.l}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.large, ease: ease.out, delay: 1.05 + i * 0.08 }}
          whileHover={{ y: -2 }}
          className="group glass rounded-2xl p-4 text-center ring-1 ring-white/[0.04] transition-shadow duration-300 hover:ring-primary/25 hover:shadow-[0_0_28px_-10px_oklch(0.72_0.18_255_/_0.45),inset_0_1px_0_oklch(1_0_0_/_0.04)]"
        >
          <div className="font-display text-2xl text-foreground/90 transition-colors duration-300 group-hover:text-foreground">
            <CountUp to={s.v} />
          </div>
          <div className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            {s.l}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
