import { motion } from "motion/react";
import { Star } from "lucide-react";
import type { MediaItem } from "@/lib/mock";
import { useArtworkAccent } from "@/lib/useArtworkAccent";
import { PremiumProgress } from "@/components/ui/PremiumProgress";
import { ItemActionBar } from "@/components/media/ItemActionBar";
import { useLibraryStore } from "@/lib/store/libraryStore";

const ease = [0.22, 1, 0.36, 1] as const;

export function CinematicHero({ item }: { item: MediaItem }) {
  const accent = useArtworkAccent(item.accent);
  const meta = useLibraryStore((s) => s.meta[item.id]);
  const progress = meta?.progress ?? item.progress;

  return (
    <section
      className="relative overflow-hidden rounded-[40px]"
      style={{
        ...accent.style,
        boxShadow: "0 60px 140px -40px oklch(0 0 0 / 0.7), 0 0 0 1px oklch(1 0 0 / 0.04)",
      }}
    >
      {/* backdrop */}
      <div className="absolute inset-0">
        <motion.img
          src={item.backdrop ?? item.poster}
          alt=""
          initial={{ scale: 1.08, opacity: 0, filter: "blur(14px)" }}
          animate={{ scale: 1.04, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.4, ease }}
          className="h-full w-full object-cover"
          style={{ animation: "ken-burns 26s ease-in-out infinite" }}
        />
        {/* dark gradient */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(115deg, oklch(0.1 0.02 270 / 0.92) 0%, oklch(0.1 0.02 270 / 0.55) 42%, transparent 78%)`,
          }}
        />
        {/* artwork radial */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(80% 80% at 100% 0%, color-mix(in oklab, ${accent.glow} 35%, transparent), transparent 60%),
                         radial-gradient(60% 50% at 0% 100%, color-mix(in oklab, ${accent.deep} 60%, transparent), transparent 65%)`,
          }}
        />
        {/* fog */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2.5, delay: 0.6 }}
          style={{
            background:
              "radial-gradient(80% 50% at 50% 100%, oklch(0.14 0.012 270 / 0.65), transparent 70%)",
          }}
        />
        {/* light rays */}
        <motion.div
          aria-hidden
          className="absolute inset-0 mix-blend-screen opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2, delay: 0.8 }}
          style={{
            background:
              "conic-gradient(from 200deg at 80% 0%, transparent 0deg, oklch(1 0 0 / 0.06) 30deg, transparent 60deg)",
          }}
        />
      </div>

      <div className="relative grid grid-cols-1 gap-8 p-7 pt-32 md:grid-cols-[auto_1fr] md:items-end md:gap-12 md:p-12 md:pt-48 lg:p-16 lg:pt-56">
        {/* poster */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="relative hidden w-56 md:block lg:w-64"
        >
          <div className="relative aspect-[2/3] overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-[0_40px_80px_-20px_oklch(0_0_0/0.7)]">
            <img src={item.poster} alt={item.title} className="h-full w-full object-cover" />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: "linear-gradient(125deg, oklch(1 0 0 / 0.12), transparent 45%)",
              }}
            />
          </div>
        </motion.div>

        {/* glass info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
          className="glass-strong relative max-w-2xl overflow-hidden rounded-3xl p-6 md:p-8"
          style={{ boxShadow: "0 30px 80px -30px oklch(0 0 0 / 0.7)" }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.4), transparent)",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full opacity-40 blur-3xl"
            style={{ background: accent.glow }}
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/75 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {item.status === "watching"
              ? "Currently in your story"
              : item.status === "completed"
                ? "A chapter you finished"
                : item.status}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease }}
            className="mt-3 font-display text-4xl leading-[1.02] tracking-tight text-white md:text-6xl"
          >
            {item.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease }}
            className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/70"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {item.rating.toFixed(1)}
            </span>
            <span className="rounded-full border border-white/15 px-2.5 py-1">{item.year}</span>
            {item.genres.map((g) => (
              <span key={g} className="rounded-full border border-white/15 px-2.5 py-1">
                {g}
              </span>
            ))}
            {item.runtime && <span className="text-white/55">· {item.runtime}</span>}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease }}
            className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 md:text-base"
          >
            {item.synopsis}
          </motion.p>

          {progress !== undefined && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              className="mt-6 max-w-md"
            >
              <div className="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/55">
                <span>{progress}% complete</span>
                <span className="tabular-nums">{meta?.progressLabel ?? item.runtime}</span>
              </div>
              <PremiumProgress value={progress} accent={accent.base} />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7, ease }}
            className="mt-7"
          >
            <ItemActionBar id={item.id} title={item.title} variant="hero" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
