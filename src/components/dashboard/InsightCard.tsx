import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import { INSIGHTS } from "@/lib/types";

export function InsightCard() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % INSIGHTS.length), 6000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="glass-strong relative overflow-hidden rounded-3xl p-6">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-secondary/25 blur-3xl" />
      <div className="relative flex items-start gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
          <Lightbulb className="h-5 w-5 text-amber-200" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary/85">Insight</div>
          <AnimatePresence mode="wait">
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-1.5 font-display text-2xl leading-snug md:text-3xl"
            >
              {INSIGHTS[i]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
