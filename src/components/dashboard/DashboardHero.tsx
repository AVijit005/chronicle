import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Info, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { MediaItem } from "@/lib/mock";
import { useMouseParallax } from "@/lib/useParallax";
import { MagneticButton } from "@/components/landing/MagneticButton";

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 22) return "Good evening";
  return "Welcome back";
}

export function DashboardHero({ item, name = "Aydin" }: { item: MediaItem; name?: string }) {
  const { x, y } = useMouseParallax(8);
  const [greet, setGreet] = useState(greeting());
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setGreet(greeting());
      setNow(new Date());
    }, 30_000);
    return () => clearInterval(id);
  }, []);
  const remaining = item.progress ? Math.round(((100 - item.progress) / 100) * 58) : 58;

  return (
    <section className="relative -mx-6 overflow-hidden rounded-b-[40px] lg:-mx-10">
      {/* Backdrop */}
      <div className="relative aspect-[16/10] min-h-[460px] w-full md:aspect-[21/9] md:min-h-[520px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <motion.img
              src={item.backdrop ?? item.poster}
              alt=""
              style={{ x, y }}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic lighting */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, oklch(0.14 0.012 270 / 0.35) 0%, oklch(0.14 0.012 270 / 0.55) 55%, var(--background) 100%), radial-gradient(80% 60% at 80% 10%, ${item.accent ?? "oklch(0.65 0.2 230)"} / 0.35, transparent 60%)`,
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_10%_90%,oklch(0.55_0.25_280/0.18),transparent_60%)]" />

        {/* Content */}
        <div className="relative grid h-full grid-cols-1 items-end gap-8 px-6 pb-10 pt-10 md:px-12 md:pb-14 md:pt-16 lg:grid-cols-[1.4fr_1fr]">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/80 backdrop-blur-md"
            >
              <Sparkles className="h-3 w-3" /> {item.kind} · continuing
            </motion.div>
            <motion.h1
              key={greet}
              initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 font-display text-5xl leading-[1.02] tracking-tight text-white md:text-7xl"
            >
              {greet}, <span className="text-gradient-aurora">{name}</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mt-4 max-w-xl font-display text-xl text-white/85 md:text-2xl"
            >
              Continue your story.
            </motion.p>
            <div className="mt-3 text-xs text-white/55">
              {now.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {/* Glass continue panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id + "-panel"}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong relative overflow-hidden rounded-3xl p-5 md:p-6"
              style={{ boxShadow: "var(--shadow-elevated)" }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background: `linear-gradient(125deg, transparent 35%, oklch(1 0 0 / 0.08) 50%, transparent 65%)`,
                  mixBlendMode: "overlay",
                }}
              />
              <div className="relative flex items-center gap-4">
                <img
                  src={item.poster}
                  alt=""
                  className="h-20 w-14 rounded-xl object-cover ring-1 ring-white/15"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">
                    Continue {item.kind}
                  </div>
                  <div className="mt-0.5 truncate font-display text-xl text-white md:text-2xl">
                    {item.title}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-white/65">
                    {item.creator} · {item.runtime}
                  </div>
                </div>
              </div>
              <div className="relative mt-5">
                <div className="flex items-center justify-between text-[11px] text-white/60">
                  <span>{item.progress ?? 0}% complete</span>
                  <span>~ {remaining} min left</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/12">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress ?? 0}%` }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-primary"
                  />
                </div>
              </div>
              <div className="relative mt-5 flex items-center gap-2">
                <MagneticButton
                  as="button"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black press-scale"
                >
                  <Play className="h-4 w-4 fill-black" /> Continue
                </MagneticButton>
                <Link
                  to="/app/media/$id"
                  params={{ id: item.id }}
                  className="glass inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm text-white press-scale"
                >
                  <Info className="h-4 w-4" /> Details
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
