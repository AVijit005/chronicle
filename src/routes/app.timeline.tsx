import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Star, NotebookPen, Trophy, Layers } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { CountUp, SegmentedFilter, ZoneHeading } from "@/components/analytics/AnalyticsKit";
import {
  TIMELINE_EVENTS,
  TIMELINE_YEARS,
  MEMORY_CLUSTERS,
  TIMELINE_STATS,
} from "@/lib/analytics-mock";
import { MEDIA } from "@/lib/mock";
import { LIFE_CHAPTERS } from "@/lib/memoryInsights";
import { LifeChapterCard } from "@/components/memory/LifeChapterCard";
import { SeasonalRecommendations } from "@/components/discovery/SeasonalRecommendations";
import { JourneyTracker } from "@/components/challenges/JourneyTracker";
import { MediaEvolution } from "@/components/intelligence/MediaEvolution";
import { LiveStatsStrip } from "@/components/memory/LiveStatsStrip";
import { YourReflectionsRail } from "@/components/memory/YourReflectionsRail";

export const Route = createFileRoute("/app/timeline")({ component: TimelinePage });

function TimelinePage() {
  const [year, setYear] = useState<string>("2026");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="pb-32 pt-2">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <PremiumGlass
          variant="strong"
          className="relative overflow-hidden rounded-[40px] p-10 md:p-16"
          glow="oklch(0.65 0.22 295 / 0.4)"
        >
          {/* collage */}
          <div className="pointer-events-none absolute inset-0 grid grid-cols-6 gap-1 opacity-25">
            {MEDIA.concat(MEDIA)
              .slice(0, 18)
              .map((m, i) => (
                <img key={i} src={m.poster} alt="" className="h-full w-full object-cover" />
              ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
          <div className="relative">
            <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              Life through media
            </div>
            <h1 className="mt-5 font-display text-5xl tracking-tight md:text-7xl">
              <span className="text-gradient-aurora">Your timeline.</span>
            </h1>
            <p className="mt-5 max-w-xl text-muted-foreground md:text-lg">
              A vertical river of every story you've finished — from years ago to last night.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { l: "Years tracked", v: TIMELINE_STATS.years },
                { l: "Stories", v: TIMELINE_STATS.stories },
                { l: "Favorite era", v: TIMELINE_STATS.era as string | number },
                { l: "Longest streak", v: TIMELINE_STATS.longest, s: "d" },
              ].map((s) => (
                <div key={s.l} className="glass-subtle rounded-2xl p-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {s.l}
                  </div>
                  <div className="mt-2 font-display text-3xl tracking-tight">
                    {typeof s.v === "number" ? <CountUp to={s.v} suffix={s.s ?? ""} /> : s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PremiumGlass>
      </motion.section>

      {/* Live numbers from libraryStore */}
      <section className="mt-10">
        <LiveStatsStrip eyebrow="Your timeline · live" />
      </section>

      {/* Reflections written along the way */}
      <section className="mt-12">
        <YourReflectionsRail limit={4} title="Reflections along the way" eyebrow="Your words" />
      </section>

      {/* Year selector */}
      <div className="mt-10 flex justify-center">
        <SegmentedFilter
          value={year}
          onChange={setYear}
          options={TIMELINE_YEARS.map((y) => ({ value: String(y), label: String(y) }))}
        />
      </div>

      {/* Life timeline */}
      <section ref={ref} className="relative mt-16">
        <ZoneHeading
          eyebrow="Year"
          title={`${year} in stories`}
          sub="Scroll. The line grows with you."
        />
        <div className="relative pl-2 md:pl-4">
          {/* growing line */}
          <div className="absolute left-5 top-0 bottom-0 w-px overflow-hidden bg-white/[0.05] md:left-7">
            <motion.div
              className="w-full bg-gradient-to-b from-primary via-secondary to-amber-300/70"
              style={{ height: lineHeight }}
            />
          </div>
          <div className="space-y-8">
            {TIMELINE_EVENTS.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.04 }}
                className="relative pl-14 md:pl-20"
              >
                <motion.span
                  className="absolute left-2 top-4 grid h-7 w-7 place-items-center rounded-full md:left-4"
                  style={{
                    background: "oklch(0.18 0.014 270)",
                    border: `2px solid ${e.media.accent ?? "var(--primary)"}`,
                    boxShadow: `0 0 18px ${e.media.accent}`,
                  }}
                  whileInView={{ scale: [0.6, 1.1, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: e.media.accent ?? "var(--primary)" }}
                  />
                </motion.span>

                <PremiumGlass className="flex gap-5 p-5">
                  <img
                    src={e.media.poster}
                    alt=""
                    className="h-28 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {e.when} · {e.mood}
                    </div>
                    <div className="mt-1 truncate font-display text-2xl tracking-tight">
                      {e.media.title}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                      {e.media.creator}
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm italic text-foreground/85">
                      "{e.journal}"
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" /> {e.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <NotebookPen className="h-3 w-3" /> Journal
                      </span>
                      {e.achievement && (
                        <span className="flex items-center gap-1 text-amber-300/90">
                          <Trophy className="h-3 w-3" /> {e.achievement}
                        </span>
                      )}
                      {e.collection && (
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" /> {e.collection}
                        </span>
                      )}
                    </div>
                  </div>
                </PremiumGlass>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Memory clusters */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mt-24"
      >
        <ZoneHeading
          eyebrow="Clusters"
          title="Memory clusters"
          sub="Things you experienced together."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MEMORY_CLUSTERS.map((c) => (
            <motion.div
              key={c.id}
              whileHover={{ y: -4 }}
              className="glass group relative overflow-hidden rounded-3xl p-5"
            >
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full blur-3xl opacity-60"
                style={{ background: c.accent }}
              />
              <div className="relative">
                <div className="flex gap-1">
                  {c.covers.map((src, i) => (
                    <img key={i} src={src} alt="" className="h-20 w-14 rounded-md object-cover" />
                  ))}
                </div>
                <div className="mt-4 font-display text-2xl tracking-tight">{c.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {c.period} · {c.count} stories
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Editorial highlights */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mt-24"
      >
        <ZoneHeading eyebrow="Highlights" title="Editorial highlights" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[MEDIA[0], MEDIA[7], MEDIA[1]].map((m) => (
            <Link key={m.id} to="/app/media/$id" params={{ id: m.id }} className="block">
              <motion.div
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-3xl h-72"
              >
                <img
                  src={m.backdrop ?? m.poster}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-[var(--dur-page)] ease-[var(--ease-out)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Defining story
                  </div>
                  <div className="mt-1 font-display text-2xl tracking-tight">{m.title}</div>
                  <div className="text-xs text-muted-foreground">{m.creator}</div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Journey statistics */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-24"
      >
        <ZoneHeading eyebrow="Journey" title="The numbers behind it" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { l: "Years tracked", v: 4 },
            { l: "Stories", v: 312 },
            { l: "Words journaled", v: 38_412 },
            { l: "Achievements", v: 24 },
          ].map((s) => (
            <PremiumGlass key={s.l} className="p-6">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {s.l}
              </div>
              <div className="mt-2 font-display text-4xl tracking-tight">
                <CountUp to={s.v} />
              </div>
            </PremiumGlass>
          ))}
        </div>
      </motion.section>

      {/* Memory · Life Chapters */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-24"
      >
        <ZoneHeading
          eyebrow="Memory"
          title="Life chapters"
          sub="Periods of your life, told through stories."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {LIFE_CHAPTERS.map((c) => (
            <LifeChapterCard key={c.id} chapter={c} />
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-24"
      >
        <SeasonalRecommendations />
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-24"
      >
        <JourneyTracker />
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-24"
      >
        <MediaEvolution />
      </motion.section>
    </div>
  );
}
