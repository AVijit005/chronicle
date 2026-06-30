import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ease } from "@/lib/motion";

/** Oversized editorial quote — used to break dashboard rhythm. */
export function PullQuote({
  children,
  attribution,
}: {
  children: ReactNode;
  attribution?: string;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.9, ease: ease.reveal }}
      className="relative mx-auto max-w-3xl py-16 md:py-24"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-2 -top-4 select-none font-display text-[8rem] leading-none text-primary/15 md:-left-6 md:text-[11rem]"
      >
        “
      </span>
      <blockquote className="relative font-display text-2xl leading-snug tracking-tight text-foreground/90 md:text-4xl">
        {children}
      </blockquote>
      {attribution && (
        <figcaption className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <span aria-hidden className="h-px w-10 bg-foreground/30" />
          {attribution}
        </figcaption>
      )}
    </motion.figure>
  );
}
