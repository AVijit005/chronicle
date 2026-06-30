import { motion } from "motion/react";
import { Star, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MEMORY_OF_DAY } from "@/lib/mock";

export function MemoryOfDay() {
  const m = MEMORY_OF_DAY;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong relative overflow-hidden rounded-[36px] p-6 md:p-10"
    >
      <img
        src={m.media.backdrop ?? m.media.poster}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
      <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-[200px_1fr_auto]">
        <img
          src={m.media.poster}
          alt=""
          className="h-64 w-44 justify-self-center rounded-2xl object-cover ring-1 ring-white/10 md:justify-self-start"
        />
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-primary/85">
            Memory of the day
          </div>
          <div className="mt-2 text-xs text-muted-foreground">{m.when}</div>
          <div className="mt-2 font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
            {m.media.title}
          </div>
          <div className="mt-2 inline-flex items-center gap-1 text-amber-300">
            {Array.from({ length: 5 }).map((_, k) => (
              <Star
                key={k}
                className={`h-3.5 w-3.5 ${k < m.rating ? "fill-amber-300" : "opacity-30"}`}
              />
            ))}
          </div>
          <p className="mt-4 max-w-lg font-display text-xl italic leading-snug text-foreground/85">
            "{m.excerpt}"
          </p>
        </div>
        <Link
          to="/app/media/$id"
          params={{ id: m.media.id }}
          className="glass inline-flex items-center gap-2 self-start justify-self-start rounded-2xl px-4 py-3 text-sm press-scale md:self-center md:justify-self-end"
        >
          Open memory <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
