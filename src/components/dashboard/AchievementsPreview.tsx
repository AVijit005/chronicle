import { motion } from "motion/react";
import { Flame, Film, BookOpen, Layers, Trophy } from "lucide-react";
import { ACHIEVEMENTS } from "@/lib/mock";

const ICONS = { Flame, Film, BookOpen, Layers } as const;

export function AchievementsPreview() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {ACHIEVEMENTS.map((a, i) => {
        const Icon = (ICONS as Record<string, typeof Trophy>)[a.icon] ?? Trophy;
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="glass relative overflow-hidden rounded-3xl p-5"
          >
            {/* gold sweep */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(60% 40% at 100% 0%, oklch(0.82 0.16 80 / 0.35), transparent 60%), radial-gradient(40% 30% at 0% 100%, oklch(0.78 0.16 50 / 0.25), transparent 60%)",
              }}
            />
            {/* celebration sparkles */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.06 }}
              aria-hidden
              className="pointer-events-none absolute inset-0"
            >
              {[...Array(8)].map((_, k) => (
                <motion.span
                  key={k}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: [0, 1, 0], scale: [0, 1, 0.5] }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: 0.3 + k * 0.08, ease: "easeOut" }}
                  className="absolute h-1 w-1 rounded-full bg-amber-200"
                  style={{
                    top: `${15 + ((k * 11) % 70)}%`,
                    left: `${10 + ((k * 23) % 80)}%`,
                    boxShadow: "0 0 8px oklch(0.85 0.18 80)",
                  }}
                />
              ))}
            </motion.div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-300/30 to-amber-500/10 ring-1 ring-amber-200/30">
                  <Icon className="h-5 w-5 text-amber-200" />
                </div>
                <span className="rounded-full bg-amber-200/15 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-amber-200">
                  {a.tier}
                </span>
              </div>
              <div className="mt-4 font-display text-xl">{a.name}</div>
              <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
              <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-amber-200/80">
                Earned {a.earned}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
