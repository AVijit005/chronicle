import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Flame,
  Film,
  Tv,
  BookOpen,
  Gamepad2,
  Music,
  Headphones,
  GraduationCap,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Trophy,
  Heart,
  Clock,
  Repeat,
  Pause,
  Star,
  ChevronRight,
} from "lucide-react";
import {
  CountUp,
  SegmentedFilter,
  StatCardPremium,
  ProgressRing,
  GlassTooltip,
  ZoneHeading,
} from "@/components/analytics/AnalyticsKit";
import { ChartStory } from "@/components/analytics/ChartStory";

import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PosterCard } from "@/components/ui/PosterCard";
import {
  ANALYTICS_HERO,
  LIFETIME_STATS,
  MONTHLY_ACTIVITY,
  MEDIA_DISTRIBUTION,
  COMPLETION_INSIGHTS,
  GENRE_STATS,
  TIME_INVESTMENT,
  RECENT_TRENDS,
  SMART_INSIGHTS,
  MEDIA_JOURNEY_YEARS,
  DAY_TIME_HEATMAP,
  VIEWING_HABITS,
  MEDIA_RELATIONSHIPS,
  MEMORY_IMPACT,
  PERSONAL_RECORDS,
  MEDIA_BALANCE,
  SMART_COMPARISONS,
  INSIGHT_FEED,
} from "@/lib/analytics-mock";
import { ACHIEVEMENTS, CALENDAR_YEAR } from "@/lib/analytics-mock";
import { MemoryInsights } from "@/components/memory/MemoryInsights";
import { RecommendationInsights } from "@/components/discovery/RecommendationInsights";
import { getGoalInsights, getJourneyStatistics } from "@/lib/goals";
import { PersonalStatements } from "@/components/intelligence/PersonalStatements";
import { LiveStatsStrip } from "@/components/memory/LiveStatsStrip";
import { YourReflectionsRail } from "@/components/memory/YourReflectionsRail";

export const Route = createFileRoute("/app/analytics")({ component: AnalyticsPage });

const KIND_ICON: Record<string, typeof Film> = {
  Movies: Film,
  Anime: Tv,
  Books: BookOpen,
  Games: Gamepad2,
  Music,
  Podcasts: Headphones,
  Courses: GraduationCap,
  "Hours Watched": Clock,
  "Hours Read": BookOpen,
  "Hours Played": Gamepad2,
  "Hours Listened": Headphones,
};

function AnalyticsPage() {
  const [range, setRange] = useState<"lifetime" | "year" | "month" | "week">("year");
  const [scope, setScope] = useState<"all" | "movies" | "anime" | "books" | "games">("all");

  return (
    <div className="pb-32 pt-2">
      {/* ============ Zone 1 — Hero ============ */}
      <motion.section
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <PremiumGlass
          variant="strong"
          className="relative overflow-hidden rounded-[40px] p-10 md:p-16"
          glow="oklch(0.72 0.18 255 / 0.4)"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 20% 20%, oklch(0.65 0.22 295 / 0.25), transparent 60%),radial-gradient(ellipse 60% 60% at 80% 70%, oklch(0.72 0.18 255 / 0.25), transparent 60%)",
            }}
          />
          <div className="relative">
            <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-primary" /> {ANALYTICS_HERO.greeting} ·{" "}
              {ANALYTICS_HERO.date}
            </div>
            <h1 className="mt-5 font-display text-5xl tracking-tight md:text-7xl">
              <span className="text-gradient-aurora">A year of stories,</span>
              <br />
              told back to you.
            </h1>
            <p className="mt-5 max-w-xl text-muted-foreground md:text-lg">
              {ANALYTICS_HERO.monthSummary}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
              {[
                {
                  l: "Current streak",
                  v: ANALYTICS_HERO.streak,
                  s: " days",
                  a: "oklch(0.82 0.16 80 / 0.45)",
                },
                { l: "Total stories", v: ANALYTICS_HERO.stories, a: "oklch(0.72 0.18 255 / 0.45)" },
                {
                  l: "Hours experienced",
                  v: ANALYTICS_HERO.hours,
                  s: "h",
                  a: "oklch(0.65 0.22 295 / 0.45)",
                },
                {
                  l: "Journal entries",
                  v: ANALYTICS_HERO.journals,
                  a: "oklch(0.72 0.16 160 / 0.45)",
                },
                { l: "Collections", v: ANALYTICS_HERO.collections, a: "oklch(0.7 0.18 25 / 0.45)" },
              ].map((s) => (
                <div key={s.l} className="glass-subtle relative overflow-hidden rounded-2xl p-4">
                  <div
                    className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl"
                    style={{ background: s.a }}
                  />
                  <div className="relative">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {s.l}
                    </div>
                    <div className="mt-2 font-display text-3xl tracking-tight">
                      <CountUp to={s.v} suffix={s.s ?? ""} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PremiumGlass>

        {/* Filter bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <SegmentedFilter
            value={range}
            onChange={setRange}
            options={[
              { value: "lifetime", label: "Lifetime" },
              { value: "year", label: "Year" },
              { value: "month", label: "Month" },
              { value: "week", label: "Week" },
            ]}
          />
          <SegmentedFilter
            value={scope}
            onChange={setScope}
            options={[
              { value: "all", label: "Everything" },
              { value: "movies", label: "Movies" },
              { value: "anime", label: "Anime" },
              { value: "books", label: "Books" },
              { value: "games", label: "Games" },
            ]}
          />
        </div>
      </motion.section>

      {/* ============ Live numbers (real, not editorial) ============ */}
      <Zone
        eyebrow="Live"
        title="Your real numbers"
        sub="Sourced from your library — updates as you act."
      >
        <LiveStatsStrip />
        <div className="mt-10">
          <YourReflectionsRail limit={4} title="Reflections you've written" eyebrow="Memory" />
        </div>
      </Zone>

      {/* ============ Zone 2 — Lifetime stats ============ */}
      <Zone
        eyebrow="Zone 02"
        title="Lifetime statistics"
        sub="Everything you've experienced, gently counted."
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
          {LIFETIME_STATS.map((s) => {
            const Icon = KIND_ICON[s.label] ?? Film;
            return (
              <StatCardPremium
                key={s.label}
                label={s.label}
                value={s.value}
                delta={s.delta}
                accent={s.accent + " / 0.4"}
                icon={<Icon className="h-4 w-4 text-muted-foreground/70" />}
              />
            );
          })}
        </div>
      </Zone>

      {/* ============ Zone 3 — Monthly activity ============ */}
      <Zone eyebrow="Zone 03" title="Monthly activity" sub="Sixty days of attention.">
        <ChartStory
          observation="Your attention peaked in week three — 47 hours across four mediums."
          why="A long weekend, two delayed flights, and one show you couldn't put down."
          meaning="You read more after dark this month, and watched more at noon. That's a season shift, not a streak."
          memory="The week of Interstellar's rewatch."
        >
          <PremiumGlass className="p-6 md:p-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { l: "Monthly total", v: 142, s: "h" },
                { l: "Weekly average", v: 32.5, s: "h", d: 1 },
                { l: "Longest streak", v: 97, s: "d" },
                { l: "Current streak", v: 47, s: "d" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {s.l}
                  </div>
                  <div className="mt-1.5 font-display text-3xl tracking-tight">
                    <CountUp to={s.v} suffix={s.s} decimals={s.d ?? 0} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 h-72">
              <ResponsiveContainer>
                <AreaChart data={MONTHLY_ACTIVITY}>
                  <defs>
                    <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.18 255)" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="oklch(0.72 0.18 255)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="oklch(0.55 0 0)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    interval={6}
                  />
                  <YAxis
                    stroke="oklch(0.55 0 0)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={28}
                  />
                  <Tooltip
                    content={<GlassTooltip />}
                    cursor={{ stroke: "oklch(1 0 0 / 0.1)", strokeWidth: 1 }}
                  />
                  <Area
                    dataKey="hours"
                    name="Hours"
                    stroke="oklch(0.78 0.18 255)"
                    strokeWidth={2}
                    fill="url(#aGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PremiumGlass>
        </ChartStory>
      </Zone>

      {/* ============ Zone 4 — Media distribution ============ */}
      <Zone eyebrow="Zone 04" title="Media distribution" sub="The shape of your library.">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PremiumGlass className="p-6 md:p-8">
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={MEDIA_DISTRIBUTION}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {MEDIA_DISTRIBUTION.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<GlassTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </PremiumGlass>
          <PremiumGlass className="p-6 md:p-8">
            <div className="space-y-3">
              {MEDIA_DISTRIBUTION.map((d) => {
                const total = MEDIA_DISTRIBUTION.reduce((a, b) => a + b.value, 0);
                const pct = (d.value / total) * 100;
                return (
                  <div key={d.name} className="group flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="w-24 text-sm">{d.name}</span>
                    <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{ background: d.color, boxShadow: `0 0 12px ${d.color}` }}
                      />
                    </div>
                    <span className="w-12 text-right text-xs text-muted-foreground tabular-nums">
                      {pct.toFixed(1)}%
                    </span>
                    <span className="w-10 text-right text-xs tabular-nums">{d.value}</span>
                  </div>
                );
              })}
            </div>
          </PremiumGlass>
        </div>
      </Zone>

      {/* ============ Zone 5 — Completion insights ============ */}
      <Zone eyebrow="Zone 05" title="Completion insights">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {COMPLETION_INSIGHTS.map((c) => (
            <PremiumGlass
              key={c.label}
              className="flex flex-col items-center gap-3 p-5 text-center"
            >
              <ProgressRing value={c.ring} accent={c.accent}>
                <div className="font-display text-2xl tracking-tight">
                  <CountUp to={c.value} />
                </div>
              </ProgressRing>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {c.label}
              </div>
            </PremiumGlass>
          ))}
        </div>
      </Zone>

      {/* ============ Zone 6 — Genre analysis ============ */}
      <Zone eyebrow="Zone 06" title="Genre analysis" sub="What you reach for.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GENRE_STATS.map((g) => (
            <motion.div
              key={g.name}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4 }}
              className="glass group relative overflow-hidden rounded-3xl p-5"
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-60 transition group-hover:opacity-100"
                style={{ background: g.accent }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="font-display text-2xl tracking-tight">{g.name}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-current" /> {g.rating}
                  </div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {g.completed} completed · favorite {g.fav}
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.min(100, g.hours / 2)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: g.accent, boxShadow: `0 0 10px ${g.accent}` }}
                  />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{g.hours}h</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Zone>

      {/* ============ Zone 7 — Time investment ============ */}
      <Zone eyebrow="Zone 07" title="Time investment" sub="Stacked across the year.">
        <PremiumGlass className="p-6 md:p-8">
          <div className="h-80">
            <ResponsiveContainer>
              <BarChart data={TIME_INVESTMENT} barCategoryGap={16}>
                <XAxis
                  dataKey="month"
                  stroke="oklch(0.55 0 0)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="oklch(0.55 0 0)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={28}
                />
                <Tooltip content={<GlassTooltip />} cursor={{ fill: "oklch(1 0 0 / 0.04)" }} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, color: "oklch(0.7 0 0)" }}
                />
                <Bar
                  dataKey="watching"
                  stackId="a"
                  fill="oklch(0.72 0.18 255)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar dataKey="reading" stackId="a" fill="oklch(0.62 0.2 295)" />
                <Bar dataKey="gaming" stackId="a" fill="oklch(0.72 0.16 80)" />
                <Bar
                  dataKey="listening"
                  stackId="a"
                  fill="oklch(0.7 0.18 25)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PremiumGlass>
      </Zone>

      {/* ============ Zone 8 — Recent trends ============ */}
      <Zone eyebrow="Zone 08" title="Recent trends">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RECENT_TRENDS.map((t) => (
            <motion.div
              key={t.label}
              whileHover={{ y: -3 }}
              className="glass relative overflow-hidden rounded-2xl p-5"
            >
              <div
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-60"
                style={{ background: t.accent }}
              />
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="text-sm">{t.label}</div>
                  <div className="mt-1 font-display text-3xl tracking-tight">{t.delta}</div>
                </div>
                {t.up ? (
                  <TrendingUp className="h-6 w-6 text-emerald-300" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-rose-300/80" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Zone>

      {/* ============ Zone 9 — Achievements preview ============ */}
      <Zone
        eyebrow="Zone 09"
        title="Recent milestones"
        action={
          <Link
            to="/app/achievements"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
          >
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ACHIEVEMENTS.map((a) => (
            <PremiumGlass key={a.id} className="relative overflow-hidden p-5">
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl opacity-50"
                style={{ background: "oklch(0.82 0.18 80 / 0.6)" }}
              />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-300" />
                  <span className="text-[10px] uppercase tracking-[0.22em] text-amber-200/80">
                    {a.tier}
                  </span>
                </div>
                <div className="mt-3 font-display text-xl tracking-tight">{a.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{a.description}</div>
                <div className="mt-3 text-[11px] text-muted-foreground">Earned {a.earned}</div>
              </div>
            </PremiumGlass>
          ))}
        </div>
      </Zone>

      {/* ============ Zone 10 — Smart insights ============ */}
      <Zone eyebrow="Zone 10" title="Smart insights" sub="Patterns Chronicle noticed.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {SMART_INSIGHTS.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="glass-subtle group flex items-start gap-4 rounded-2xl p-5"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06]">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">{line}</p>
            </motion.div>
          ))}
        </div>
      </Zone>

      {/* ============ Zone 11 — Year in review preview ============ */}
      <Zone
        eyebrow="Zone 11"
        title="Year in review"
        sub="Twelve months of memory."
        action={
          <Link to="/app/wrapped">
            <PremiumButton variant="secondary" size="sm">
              Open Wrapped
            </PremiumButton>
          </Link>
        }
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {CALENDAR_YEAR.map((m) => (
            <motion.div
              key={m.index}
              whileHover={{ y: -4 }}
              className="glass group relative overflow-hidden rounded-2xl p-4"
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl opacity-60"
                style={{ background: m.accent }}
              />
              <div className="relative">
                <div className="grid grid-cols-2 gap-1">
                  {m.collage.map((src, i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded-md">
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 font-display text-xl tracking-tight">{m.short}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">
                  {m.mediaCount} stories · {m.hours}h
                </div>
                <div className="mt-2 truncate text-xs" style={{ color: m.accent }}>
                  {m.favorite}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Zone>

      {/* ============ Zone 12 — Media Journey ============ */}
      <Zone eyebrow="Zone 12" title="Media journey" sub="How your taste evolved.">
        <div className="relative overflow-x-auto pb-4">
          <div className="relative flex min-w-max items-center gap-10 px-2">
            <div
              className="absolute left-2 right-2 top-1/2 h-px -translate-y-1/2"
              style={{
                background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.25), transparent)",
              }}
            />
            {MEDIA_JOURNEY_YEARS.map((y) => (
              <motion.div
                key={y.year}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <PremiumGlass className="w-64 p-5">
                  <span
                    className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: y.accent, boxShadow: `0 0 16px ${y.accent}` }}
                  />
                  <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {y.year}
                  </div>
                  <div className="mt-2 font-display text-2xl tracking-tight">{y.label}</div>
                  <p className="mt-2 text-xs text-muted-foreground">{y.note}</p>
                </PremiumGlass>
              </motion.div>
            ))}
          </div>
        </div>
      </Zone>

      {/* ============ Zone 13 — Day & time patterns ============ */}
      <Zone eyebrow="Zone 13" title="Day & time patterns" sub="When you press play.">
        <PremiumGlass className="p-6 md:p-8">
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <div className="flex flex-col justify-around pr-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-rows-7 gap-1">
              {Array.from({ length: 7 }).map((_, d) => (
                <div
                  key={d}
                  className="grid grid-cols-24 gap-1"
                  style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
                >
                  {DAY_TIME_HEATMAP.filter((c) => c.d === d).map((c) => (
                    <div
                      key={`${c.d}-${c.h}`}
                      className="aspect-square rounded-[3px]"
                      style={{ background: `oklch(0.72 0.18 255 / ${0.05 + c.v * 0.7})` }}
                      title={`${c.h}:00 · ${(c.v * 60).toFixed(0)}m`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>12am</span>
            <span>6am</span>
            <span>noon</span>
            <span>6pm</span>
            <span>11pm</span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Peak hour
              </div>
              <div className="mt-1 font-display text-2xl">9pm</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Avg session
              </div>
              <div className="mt-1 font-display text-2xl">1h 24m</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Busiest day
              </div>
              <div className="mt-1 font-display text-2xl">Saturday</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Quietest day
              </div>
              <div className="mt-1 font-display text-2xl">Tuesday</div>
            </div>
          </div>
        </PremiumGlass>
      </Zone>

      {/* ============ Zone 14 — Viewing habits ============ */}
      <Zone eyebrow="Zone 14" title="Viewing habits">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {VIEWING_HABITS.map((h) => {
            const Icon = h.label.includes("session")
              ? Clock
              : h.label.includes("binge")
                ? Flame
                : h.label.includes("completion")
                  ? Trophy
                  : h.label.includes("revisited")
                    ? Repeat
                    : h.label.includes("paused")
                      ? Pause
                      : BookOpen;
            return (
              <StatCardPremium
                key={h.label}
                label={h.label}
                value={h.value}
                delta={h.trend}
                accent={h.accent + " / 0.4"}
                icon={<Icon className="h-4 w-4 text-muted-foreground/70" />}
              />
            );
          })}
        </div>
      </Zone>

      {/* ============ Zone 15 — Media relationships ============ */}
      <Zone eyebrow="Zone 15" title="Media relationships" sub="One thing leads to another.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {MEDIA_RELATIONSHIPS.map((rel) => (
            <PremiumGlass key={rel.from + rel.to} className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-white/[0.06] px-3 py-2 text-sm">{rel.from}</div>
              <div className="relative h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent">
                <ArrowRight className="absolute -top-2 right-0 h-4 w-4 text-primary" />
              </div>
              <div className="rounded-xl bg-white/[0.06] px-3 py-2 text-sm">{rel.to}</div>
              <div className="ml-2 hidden text-xs text-muted-foreground md:block">{rel.note}</div>
            </PremiumGlass>
          ))}
        </div>
      </Zone>

      {/* ============ Zone 16 — Memory impact ============ */}
      <Zone eyebrow="Zone 16" title="Memory impact" sub="The stories that left a mark.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MEMORY_IMPACT.map((m) => (
            <Link key={m.label} to="/app/media/$id" params={{ id: m.to }} className="block">
              <PremiumGlass className="group flex gap-4 overflow-hidden p-4 hover:-translate-y-1 transition-transform duration-[var(--dur-large)] ease-[var(--ease-out)]">
                <img
                  src={m.media.poster}
                  alt={m.media.title}
                  className="h-32 w-24 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <Heart className="h-3 w-3" /> {m.label}
                  </div>
                  <div className="mt-1 truncate font-display text-xl tracking-tight">
                    {m.media.title}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    {m.media.creator}
                  </div>
                  <p className="mt-2 line-clamp-3 text-xs italic text-foreground/80">
                    "{m.snippet}"
                  </p>
                </div>
              </PremiumGlass>
            </Link>
          ))}
        </div>
      </Zone>

      {/* ============ Zone 17 — Personal records ============ */}
      <Zone eyebrow="Zone 17" title="Personal records">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {PERSONAL_RECORDS.map((r) => (
            <PremiumGlass key={r.label} className="relative overflow-hidden p-6">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-60"
                style={{ background: r.accent }}
              />
              <div className="relative">
                <Trophy className="h-5 w-5 text-amber-300" />
                <div className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {r.label}
                </div>
                <div className="mt-2 font-display text-3xl tracking-tight">{r.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{r.date}</div>
              </div>
            </PremiumGlass>
          ))}
        </div>
      </Zone>

      {/* ============ Zone 18 — Media balance ============ */}
      <Zone eyebrow="Zone 18" title="Media balance" sub="Are you in rhythm?">
        <PremiumGlass className="p-6 md:p-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
            {MEDIA_BALANCE.map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-2">
                <ProgressRing value={b.v} accent={b.accent} size={84} stroke={7}>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {b.label}
                  </div>
                </ProgressRing>
                <div className="text-xs text-muted-foreground">
                  <CountUp to={b.v} suffix="%" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center text-xs text-muted-foreground">
            Balance score · <span className="text-foreground font-display text-base">78/100</span>
          </div>
        </PremiumGlass>
      </Zone>

      {/* ============ Zone 19 — Smart comparisons ============ */}
      <Zone eyebrow="Zone 19" title="Smart comparisons">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SMART_COMPARISONS.map((c) => {
            const delta = (((c.a - c.b) / c.b) * 100).toFixed(0);
            return (
              <PremiumGlass key={c.label} className="p-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {c.label}
                </div>
                <div className="mt-4 flex items-end gap-3">
                  <div className="font-display text-4xl tracking-tight">
                    <CountUp to={c.a} decimals={c.unit === "h" ? 1 : 0} suffix={c.unit} />
                  </div>
                  <div
                    className={`mb-1 flex items-center gap-1 text-xs ${c.up ? "text-emerald-300" : "text-rose-300"}`}
                  >
                    {c.up ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}{" "}
                    {delta}%
                  </div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  prev{" "}
                  <span className="font-medium text-foreground/80">
                    {c.b}
                    {c.unit}
                  </span>
                </div>
              </PremiumGlass>
            );
          })}
        </div>
      </Zone>

      {/* ============ Zone 20 — Insight feed ============ */}
      <Zone eyebrow="Zone 20" title="Personal insight feed">
        <div className="space-y-3">
          {INSIGHT_FEED.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass flex items-start gap-4 rounded-2xl p-5"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30">
                <Sparkles className="h-4 w-4 text-foreground" />
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">{line}</p>
            </motion.div>
          ))}
        </div>
      </Zone>

      {/* Memory · What Chronicle noticed */}
      <Zone
        eyebrow="Memory"
        title="What Chronicle noticed"
        sub="Observations from your reading, watching and listening."
      >
        <MemoryInsights max={6} />
      </Zone>
      <Zone eyebrow="Discovery" title="What Chronicle notices">
        <RecommendationInsights />
      </Zone>
      <Zone eyebrow="Portrait" title="What Chronicle has learned about you">
        <PersonalStatements />
      </Zone>
      <Zone eyebrow="Goals" title="How your journeys behave">
        <ul className="grid gap-2 md:grid-cols-2">
          {getGoalInsights().map((l) => (
            <li key={l} className="glass-subtle rounded-2xl p-4 text-sm text-foreground/80">
              {l}
            </li>
          ))}
        </ul>
        <div className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
          Completion rate {getJourneyStatistics().completionRate}% · Avg{" "}
          {getJourneyStatistics().averageJourneyDays} days
        </div>
      </Zone>
    </div>
  );
}

function Zone({
  eyebrow,
  title,
  sub,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mt-16 md:mt-24"
    >
      <ZoneHeading eyebrow={eyebrow} title={title} sub={sub} action={action} />
      {children}
    </motion.section>
  );
}
