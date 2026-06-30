import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ease } from "@/lib/motion";

interface Props {
  observation?: string;
  why?: string;
  meaning?: string;
  memory?: string;
  children: ReactNode;
  reverse?: boolean;
}

/** Wraps a chart with an editorial interpretation rail.
 *  Every number gets a story instead of standing alone.
 *  Copy is passed in by the page (deterministic — derived from existing stats). */
export function ChartStory({ observation, why, meaning, memory, children, reverse }: Props) {
  const rail = (
    <motion.aside
      initial={{ opacity: 0, x: reverse ? 20 : -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: ease.reveal }}
      className="space-y-5 self-start lg:sticky lg:top-24"
    >
      {observation && (
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-primary/85">Observation</div>
          <p className="mt-2 font-display text-lg leading-snug tracking-tight text-foreground/90 md:text-xl">
            {observation}
          </p>
        </div>
      )}
      {why && (
        <div className="border-l-2 border-primary/30 pl-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Why</div>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">{why}</p>
        </div>
      )}
      {meaning && (
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            What it means
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">{meaning}</p>
        </div>
      )}
      {memory && (
        <div className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
          <div className="text-[10px] uppercase tracking-[0.22em] text-amber-200/70">Memory</div>
          <p className="mt-1.5 font-display italic text-sm leading-relaxed text-foreground/80">
            {memory}
          </p>
        </div>
      )}
    </motion.aside>
  );

  return (
    <div
      className={`grid items-start gap-8 lg:gap-12 ${reverse ? "lg:grid-cols-[1fr_minmax(260px,320px)]" : "lg:grid-cols-[minmax(260px,320px)_1fr]"}`}
    >
      {!reverse && rail}
      <div className="min-w-0">{children}</div>
      {reverse && rail}
    </div>
  );
}
