import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { FAVORITES } from "@/lib/mock";

export function FavoritesSpotlight() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((p) => (p + 1) % FAVORITES.length), 5000);
    return () => clearInterval(id);
  }, [paused]);
  const f = FAVORITES[i];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative overflow-hidden rounded-[36px] ring-1 ring-white/10"
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      <div className="relative h-[340px] md:h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={f.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img
              src={f.item.backdrop ?? f.item.poster}
              alt=""
              className="h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(110deg, oklch(0.1 0.02 270 / 0.92) 0%, oklch(0.1 0.02 270 / 0.5) 50%, transparent 80%), radial-gradient(60% 50% at 90% 20%, ${f.item.accent} / 0.4, transparent 60%)`,
              }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative grid h-full grid-cols-1 items-end gap-6 p-7 md:grid-cols-[1.5fr_1fr] md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={f.id + "-c"}
              initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/70">{f.label}</div>
              <div className="mt-3 font-display text-5xl leading-[1.02] tracking-tight text-white md:text-7xl">
                {f.item.title}
              </div>
              <div className="mt-3 inline-flex items-center gap-1 text-amber-300">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star
                    key={k}
                    className={`h-4 w-4 ${k < Math.round(f.item.rating) ? "fill-amber-300" : "opacity-30"}`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-end gap-1.5 md:flex-col md:items-end">
            {FAVORITES.map((x, k) => (
              <button
                key={x.id}
                onClick={() => setI(k)}
                aria-label={x.label}
                className={`h-1.5 rounded-full transition-all ${k === i ? "w-10 bg-white" : "w-4 bg-white/30 hover:bg-white/60"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
