import { motion } from "motion/react";
import { Play, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { MediaItem } from "@/lib/mock";

export function TodaysJourney({ item }: { item: MediaItem }) {
  const remaining = item.progress ? Math.round(((100 - item.progress) / 100) * 168) : 58;
  return (
    <div
      className="group relative overflow-hidden rounded-[36px] ring-1 ring-white/10"
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      <div className="relative aspect-[16/9] min-h-[420px] w-full md:aspect-[21/9]">
        <img
          src={item.backdrop ?? item.poster}
          alt=""
          className="h-full w-full object-cover transition duration-1000 group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(110deg, oklch(0.1 0.02 270 / 0.92) 0%, oklch(0.1 0.02 270 / 0.55) 45%, transparent 80%), radial-gradient(70% 60% at 90% 10%, ${item.accent ?? "oklch(0.65 0.2 230)"} / 0.4, transparent 60%)`,
          }}
        />

        <div className="relative grid h-full grid-cols-1 items-end gap-6 p-7 md:grid-cols-[1.4fr_1fr] md:p-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/80 backdrop-blur-md">
              Today's journey
            </div>
            <h3 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-white md:text-6xl">
              {item.title}
            </h3>
            <p className="mt-3 max-w-lg text-sm text-white/70 md:text-base">{item.synopsis}</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong relative overflow-hidden rounded-3xl p-6"
          >
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">
              Continue watching
            </div>
            <div className="mt-1 font-display text-3xl text-white">{item.progress ?? 0}%</div>
            <div className="mt-1 text-xs text-white/70">~ {remaining} minutes remaining</div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/12">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${item.progress ?? 0}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-primary"
              />
            </div>

            <div className="mt-6 flex items-center gap-2">
              <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black press-scale">
                <Play className="h-4 w-4 fill-black" /> Continue
              </button>
              <Link
                to="/app/media/$id"
                params={{ id: item.id }}
                className="glass inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm text-white press-scale"
              >
                Details <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
