import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { MEMORIES } from "@/lib/mock";

export function MemoryFeed() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-white/0 via-white/15 to-white/0 md:left-[31px]"
      />
      <ol className="space-y-5">
        {MEMORIES.map((m, i) => (
          <motion.li
            key={m.id}
            initial={{ opacity: 0, x: -16, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="relative pl-16 md:pl-20"
          >
            <div
              className="absolute left-4 top-6 h-4 w-4 rounded-full ring-2 ring-background md:left-5"
              style={{ background: m.accent, boxShadow: `0 0 20px ${m.accent}` }}
            />
            <div className="glass group relative overflow-hidden rounded-3xl p-5 transition hover-lift md:p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-40 blur-3xl"
                style={{ background: m.accent }}
              />
              <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
                <img
                  src={m.media.poster}
                  alt=""
                  className="h-28 w-20 shrink-0 rounded-2xl object-cover ring-1 ring-white/10"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <span>{m.when}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                    <span>{m.kindLabel}</span>
                  </div>
                  <div className="mt-1.5 font-display text-2xl">{m.media.title}</div>
                  {m.rating > 0 && (
                    <div className="mt-1.5 inline-flex items-center gap-1 text-amber-300">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Star
                          key={k}
                          className={`h-3.5 w-3.5 ${k < Math.round(m.rating) ? "fill-amber-300" : "opacity-30"}`}
                        />
                      ))}
                    </div>
                  )}
                  <p className="mt-3 flex gap-2 text-sm text-foreground/85">
                    <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="font-display text-base italic leading-snug">{m.note}</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
