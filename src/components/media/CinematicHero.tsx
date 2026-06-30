import { motion } from "motion/react";
import { Play, BookmarkPlus } from "lucide-react";
import type { MediaItem } from "@/lib/mock";

export function CinematicHero({ item }: { item: MediaItem }) {
  return (
    <motion.section
      initial={{ opacity: 0, filter: "blur(12px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[40px]"
      style={{ boxShadow: "0 40px 100px -30px oklch(0 0 0 / 0.6)" }}
    >
      <div className="relative h-[58vh] min-h-[420px] w-full">
        <img src={item.backdrop ?? item.poster} alt="" className="h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(115deg, oklch(0.1 0.02 270 / 0.92) 0%, oklch(0.1 0.02 270 / 0.55) 40%, transparent 75%),
                         radial-gradient(60% 80% at 100% 0%, ${item.accent ?? "var(--primary)"} / 0.25, transparent 60%)`,
          }}
        />

        <div className="absolute inset-0 flex items-end p-6 md:p-12">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Continue your story
            </div>
            <h2 className="font-display text-4xl leading-[1.05] tracking-tight text-white md:text-6xl">
              {item.title}
            </h2>
            <p className="mt-4 max-w-md text-sm text-white/70 md:text-base">{item.synopsis}</p>

            {item.progress !== undefined && (
              <div className="mt-5 max-w-sm">
                <div className="mb-1.5 flex items-center justify-between text-[11px] uppercase tracking-wider text-white/60">
                  <span>{item.progress}% complete</span>
                  <span>{item.runtime}</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-white/15">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition press-scale hover:bg-white/90">
                <Play className="h-4 w-4 fill-black" /> Continue
              </button>
              <button className="glass inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium press-scale">
                <BookmarkPlus className="h-4 w-4" /> Add to journal
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
