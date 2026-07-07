import { motion } from "motion/react";
import { Feather } from "lucide-react";
import { TODAY } from "@/lib/memory";
import { fadeBlurIn } from "@/lib/motion";

export function DailyRitual({ className }: { className?: string }) {
  const dateLabel = TODAY.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section
      aria-label="Today's ritual"
      className={`relative overflow-hidden rounded-3xl px-6 py-10 md:px-10 md:py-14 ${className ?? ""}`}
      style={{
        background:
          "radial-gradient(120% 80% at 0% 0%, oklch(0.72 0.18 255 / 0.10), transparent 55%), radial-gradient(100% 70% at 100% 100%, oklch(0.65 0.22 295 / 0.10), transparent 60%), oklch(0.16 0.012 270 / 0.6)",
        boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.04)",
      }}
    >
      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeBlurIn}
        className="mb-8 flex items-baseline justify-between"
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

      <div className="glass-subtle flex flex-col items-center gap-3 rounded-2xl p-8 text-center text-muted-foreground">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] text-primary ring-1 ring-white/10">
          <Feather className="h-4 w-4" />
        </span>
        Your ritual is still gathering — check back once there's more to reflect on.
      </div>
    </section>
  );
}
