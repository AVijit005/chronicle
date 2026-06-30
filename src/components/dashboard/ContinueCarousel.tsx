import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Play, Star } from "lucide-react";
import type { MediaItem } from "@/lib/mock";
import { KIND_LABEL } from "@/lib/mock";

export function ContinueCarousel({ items }: { items: MediaItem[] }) {
  return (
    <div
      className="-mx-6 flex gap-5 overflow-x-auto px-6 pb-3 lg:-mx-10 lg:px-10"
      style={{ scrollSnapType: "x mandatory" }}
    >
      {items.map((m, i) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          style={{ scrollSnapAlign: "start" }}
          className="group shrink-0"
        >
          <Link to="/app/media/$id" params={{ id: m.id }} className="block w-[260px]">
            <motion.div
              whileHover={{ y: -8, rotateX: 4, rotateY: -4 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 1200 }}
              className="relative aspect-[3/4] overflow-hidden rounded-3xl ring-1 ring-white/10"
            >
              <img
                src={m.poster}
                alt={m.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.07]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
              {/* reflection */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(125deg, transparent 35%, oklch(1 0 0 / 0.16) 50%, transparent 65%)",
                  mixBlendMode: "overlay",
                }}
              />
              {/* accent glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -bottom-10 h-32 opacity-70 blur-3xl"
                style={{ background: m.accent ?? "oklch(0.72 0.18 255 / 0.5)" }}
              />
              <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[10px] text-white backdrop-blur-md">
                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" /> {m.rating.toFixed(1)}
              </div>
              <div className="absolute right-3 top-3 rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
                {KIND_LABEL[m.kind]}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="font-display text-xl text-white">{m.title}</div>
                <div className="mt-0.5 text-[11px] text-white/70">
                  {m.creator} · {m.runtime}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.progress ?? 0}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>
                  <span className="text-[10px] text-white/65">{m.progress ?? 0}%</span>
                </div>
                <button className="glass-strong mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs text-white press-scale">
                  <Play className="h-3.5 w-3.5 fill-white" /> Continue
                </button>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
