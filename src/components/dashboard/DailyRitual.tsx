import { motion } from "motion/react";
import { Feather } from "lucide-react";
import { TODAY } from "@/lib/memory";
import { fadeBlurIn } from "@/lib/motion";

import { PremiumGlass } from "@/components/ui/PremiumGlass";

export function DailyRitual({ className }: { className?: string }) {
  const dateLabel = TODAY.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <PremiumGlass
      aria-label="Today's ritual"
      interactive
      glow="oklch(0.72 0.18 255 / 0.15)"
      className={`group/ritual px-6 py-10 md:px-10 md:py-14 hover:translate-y-0 active:scale-100 ${className ?? ""}`}
    >
      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeBlurIn}
        className="mb-8 flex items-baseline justify-between relative z-10"
      >
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-primary/85">
            Today's ritual
          </div>
          <h2 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
            What your library is whispering today
          </h2>
          <p className="mt-2 max-w-xl text-sm text-foreground/65">
            A small daily resurfacing — pulled from your own memory, not from a feed.
          </p>
        </div>
        <div className="hidden text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:block">
          {dateLabel}
        </div>
      </motion.header>

      <div className="group/empty relative z-10 flex flex-col items-center gap-4 rounded-2xl border border-white/[0.03] bg-white/[0.02] p-10 text-center shadow-2xl backdrop-blur-xl transition duration-500 ease-out hover:border-white/[0.08] hover:bg-white/[0.04]">
        <motion.span
          className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-[inset_0_1px_0_oklch(1_1_1/0.1)] ring-1 ring-primary/20 transition-all duration-500 ease-out group-hover/empty:scale-110 group-hover/empty:from-primary/20 group-hover/empty:to-primary/10 group-hover/empty:text-primary-foreground group-hover/empty:shadow-[0_0_30px_oklch(0.72_0.18_255/0.5)] group-hover/empty:ring-primary/50"
        >
          <Feather className="h-6 w-6 transition-transform duration-500 group-hover/empty:-rotate-12" />
        </motion.span>
        <p className="text-sm text-foreground/70">
          Your ritual is still gathering — check back once there's more to reflect on.
        </p>
      </div>
    </PremiumGlass>
  );
}
