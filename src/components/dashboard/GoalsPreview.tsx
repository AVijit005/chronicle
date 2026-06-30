import { motion } from "motion/react";
import { GOALS } from "@/lib/mock";

export function GoalsPreview() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {GOALS.map((g, i) => {
        const pct = Math.round((g.current / g.target) * 100);
        const C = 2 * Math.PI * 36;
        return (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative flex items-center gap-4 overflow-hidden rounded-3xl p-5"
          >
            <div
              className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-3xl"
              style={{ background: g.accent }}
            />
            <div className="relative">
              <svg width="84" height="84" viewBox="0 0 84 84">
                <circle
                  cx="42"
                  cy="42"
                  r="36"
                  stroke="oklch(1 0 0 / 0.08)"
                  strokeWidth="6"
                  fill="none"
                />
                <motion.circle
                  cx="42"
                  cy="42"
                  r="36"
                  stroke={g.accent}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  transform="rotate(-90 42 42)"
                  initial={{ strokeDasharray: `0 ${C}` }}
                  whileInView={{ strokeDasharray: `${(pct / 100) * C} ${C}` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
                <text
                  x="42"
                  y="46"
                  textAnchor="middle"
                  className="font-display fill-foreground"
                  fontSize="18"
                >
                  {pct}%
                </text>
              </svg>
            </div>
            <div className="relative min-w-0">
              <div className="truncate font-display text-lg">{g.label}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {g.current} of {g.target}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
