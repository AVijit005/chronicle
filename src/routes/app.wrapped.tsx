import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Share2, Download } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { CountUp } from "@/components/analytics/AnalyticsKit";
import { WRAPPED_SLIDES } from "@/lib/analytics-mock";
import { MemoryMilestones } from "@/components/memory/MemoryMilestones";
import { FirstMoments } from "@/components/memory/FirstMoments";
import { RecommendationCard } from "@/components/discovery/RecommendationCard";
import { getHiddenGems } from "@/lib/discovery";
import { AchievementHero } from "@/components/achievements/AchievementHero";
import { StoryImpact } from "@/components/intelligence/StoryImpact";
import { buildEditorialInsight } from "@/lib/intelligence";
import { LiveStatsStrip } from "@/components/memory/LiveStatsStrip";
import { YourReflectionsRail } from "@/components/memory/YourReflectionsRail";
import { YourQuotesRail } from "@/components/memory/YourQuotesRail";

export const Route = createFileRoute("/app/wrapped")({ component: WrappedPage });

function WrappedPage() {
  return (
    <div className="-mx-4 -mt-6 md:-mx-8">
      {/* Snap-scroll container */}
      <div
        className="snap-y snap-mandatory overflow-y-auto"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {WRAPPED_SLIDES.map((s, i) => (
          <Slide key={s.key} index={i} slide={s} last={i === WRAPPED_SLIDES.length - 1} />
        ))}
        <ShareSection />
      </div>

      {/* Memory · Milestones & firsts */}
      <div className="mx-4 mt-12 space-y-16 pb-24 md:mx-8">
        <LiveStatsStrip eyebrow="Your real year" />
        <AchievementHero />
        <p className="glass-subtle rounded-3xl p-6 text-center font-display text-xl tracking-tight text-foreground/85">
          {buildEditorialInsight()}
        </p>
        <StoryImpact />
        <MemoryMilestones />
        <FirstMoments />
        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-tight">Hidden gems from your year</h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {getHiddenGems()
              .slice(0, 4)
              .map((r) => (
                <li key={r.media.id}>
                  <RecommendationCard rec={r} compact />
                </li>
              ))}
          </ul>
        </section>
        <YourReflectionsRail title="Reflections that defined your year" eyebrow="Your words" />
        <YourQuotesRail title="Lines you kept" eyebrow="Your quotes" />
      </div>
    </div>
  );
}

type Slide = (typeof WRAPPED_SLIDES)[number];

function Slide({ slide, index, last }: { slide: Slide; index: number; last: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const accent = "accent" in slide ? slide.accent : "oklch(0.65 0.22 295)";
  const poster = "poster" in slide ? slide.poster : undefined;

  // intro / outro / value slides
  const isText = slide.key === "intro" || slide.key === "thanks";

  return (
    <section
      ref={ref}
      className="relative grid min-h-[100svh] snap-start place-items-center overflow-hidden px-6 py-16"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Background lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              `radial-gradient(ellipse 80% 60% at 50% 40%, ${accent}/25, transparent 60%)`.replace(
                "/25",
                " / 0.25",
              ),
          }}
        />
        {poster && (
          <>
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
          </>
        )}
      </div>

      <motion.div style={{ y, opacity }} className="relative mx-auto w-full max-w-3xl text-center">
        {isText ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground"
            >
              {slide.eyebrow}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, filter: "blur(0)" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1 }}
              className="mt-8 font-display text-6xl tracking-tight md:text-8xl leading-[1]"
            >
              <span className="text-gradient-aurora">
                {"title" in slide ? slide.title : slide.value}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-lg text-muted-foreground"
            >
              {"subtitle" in slide ? slide.subtitle : slide.caption}
            </motion.p>
            {last && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="mt-10 flex justify-center gap-3"
              >
                <PremiumButton variant="primary" icon={<Share2 className="h-4 w-4" />}>
                  Share your year
                </PremiumButton>
                <PremiumButton variant="secondary" icon={<Download className="h-4 w-4" />}>
                  Save as image
                </PremiumButton>
              </motion.div>
            )}
          </>
        ) : (
          <div
            className={`grid items-center gap-10 ${
              index % 3 === 0
                ? "md:grid-cols-[auto_1fr]"
                : index % 3 === 1
                  ? "md:grid-cols-[1fr_auto]"
                  : "md:grid-cols-1 md:text-center"
            }`}
          >
            {poster && index % 3 !== 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, rotate: index % 2 === 0 ? -2 : 2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className={`relative mx-auto overflow-hidden rounded-3xl ${
                  index % 4 === 0 ? "h-80 w-56" : index % 4 === 1 ? "h-72 w-72" : "h-96 w-64"
                } ${index % 3 === 1 ? "md:order-2" : ""}`}
              >
                <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10" />
                <img src={poster} alt="" className="h-full w-full object-cover" />
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl"
                  style={{ boxShadow: `0 0 60px ${accent}` }}
                />
              </motion.div>
            )}
            <div
              className={
                poster && index % 3 !== 2
                  ? index % 3 === 1
                    ? "text-right md:order-1"
                    : "text-left"
                  : "text-center"
              }
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground"
              >
                {slide.eyebrow}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0)" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.15 }}
                className={`mt-6 font-display tracking-tight leading-[0.95] ${
                  index % 5 === 0
                    ? "text-7xl md:text-[10rem]"
                    : index % 5 === 1
                      ? "text-5xl md:text-7xl"
                      : "text-6xl md:text-8xl"
                }`}
              >
                {typeof slide.value === "number" ? (
                  <span style={{ color: accent }}>
                    <CountUp to={slide.value} suffix={"unit" in slide ? (slide.unit ?? "") : ""} />
                  </span>
                ) : (
                  <span className="text-gradient-aurora">{slide.value}</span>
                )}
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-5 text-lg text-muted-foreground max-w-md"
              >
                {slide.caption}
              </motion.p>
            </div>
          </div>
        )}

        {/* Progress dots */}
        <div className="mt-12 flex justify-center gap-1.5">
          {WRAPPED_SLIDES.map((_, i) => (
            <span
              key={i}
              className="h-1 w-6 rounded-full"
              style={{ background: i === index ? "var(--foreground)" : "oklch(1 0 0 / 0.15)" }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ShareSection() {
  return (
    <section
      className="relative grid min-h-[100svh] snap-start place-items-center px-6 py-16"
      style={{ scrollSnapAlign: "start" }}
    >
      <PremiumGlass
        variant="strong"
        className="relative w-full max-w-md overflow-hidden rounded-[36px] p-8"
        glow="oklch(0.65 0.22 295 / 0.5)"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/15 to-amber-300/10" />
        <div className="relative">
          <div className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
            Chronicle 2026 · Share card
          </div>
          <div className="mt-4 font-display text-4xl tracking-tight">Your year in stories</div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { l: "Top Movie", v: "Interstellar" },
              { l: "Hours", v: "1,284" },
              { l: "Favorite Genre", v: "Sci-Fi" },
              { l: "Stories Completed", v: "312" },
            ].map((s) => (
              <div key={s.l} className="glass-subtle rounded-2xl p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {s.l}
                </div>
                <div className="mt-1 font-display text-xl tracking-tight">{s.v}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center gap-2">
            <PremiumButton variant="primary" size="sm" icon={<Share2 className="h-3.5 w-3.5" />}>
              Share
            </PremiumButton>
            <PremiumButton
              variant="secondary"
              size="sm"
              icon={<Download className="h-3.5 w-3.5" />}
            >
              Download
            </PremiumButton>
          </div>
        </div>
      </PremiumGlass>
    </section>
  );
}
