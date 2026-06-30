import { motion } from "motion/react";
import { CountUp } from "@/components/landing/CountUp";
import { STATS } from "@/lib/mock";

export function TodaysMoment() {
  return (
    <div className="glass-strong relative overflow-hidden rounded-[36px] p-10 md:p-14">
      {/* background art */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-aurora" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-secondary/20 blur-3xl animate-aurora" />
        <svg
          className="absolute right-10 top-10 opacity-30"
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
        >
          {[...Array(6)].map((_, i) => (
            <motion.circle
              key={i}
              cx="100"
              cy="100"
              r={20 + i * 14}
              stroke="oklch(0.72 0.18 255 / 0.4)"
              strokeWidth="0.6"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </svg>
      </div>

      <div className="relative grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-primary/85">
            Today's moment
          </div>
          <h3 className="mt-4 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">
            You've spent{" "}
            <span className="text-gradient-aurora">
              <CountUp to={STATS.totalHours} />
            </span>{" "}
            hours
            <br /> exploring other worlds.
          </h3>
          <p className="mt-5 max-w-md text-base text-muted-foreground">
            Every story you finished became part of yours. Keep going — there are more chapters
            waiting.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Stories", v: STATS.completed },
            { label: "Memories", v: 94 },
            { label: "Adventures", v: 87 },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass rounded-3xl p-5 text-center"
            >
              <div className="font-display text-4xl tracking-tight">
                <CountUp to={s.v} />
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
