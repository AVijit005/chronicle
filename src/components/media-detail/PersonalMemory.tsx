import { motion } from "motion/react";
import { Star, MapPin, CalendarDays, Sparkles } from "lucide-react";
import type { MediaItem } from "@/lib/mock";
import { MEDIA_DETAIL } from "@/lib/mock";

export function PersonalMemory({ item }: { item: MediaItem }) {
  const m = MEDIA_DETAIL[item.id].memory;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr]"
    >
      <div className="relative hidden h-64 w-44 overflow-hidden rounded-2xl ring-1 ring-white/10 md:block">
        <img src={item.poster} alt="" className="h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, transparent 60%, oklch(0 0 0 / 0.7))" }}
        />
      </div>
      <div className="glass relative overflow-hidden rounded-3xl p-7 md:p-9">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full opacity-30 blur-3xl"
          style={{ background: item.accent }}
        />
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          A memory you wrote
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" /> {m.date}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {m.location}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> {m.mood}
          </span>
        </div>
        <div className="mt-3 flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < m.rating ? "fill-amber-400 text-amber-400" : "text-white/15"}`}
            />
          ))}
        </div>
        <blockquote className="mt-5 font-display text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
          &ldquo;{m.note}&rdquo;
        </blockquote>
        <div className="mt-6 flex flex-wrap gap-2">
          {m.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/[0.05] px-3 py-1 text-[11px] text-muted-foreground ring-1 ring-white/5"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
