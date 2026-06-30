import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  NotebookPen,
  Film,
  BookOpen,
  Gamepad2,
  Music,
  CloudSun,
} from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { CountUp, ZoneHeading, ProgressRing } from "@/components/analytics/AnalyticsKit";
import {
  CALENDAR_YEAR,
  CALENDAR_HERO,
  CALENDAR_HIGHLIGHTS,
  MEMORY_STREAKS,
  UPCOMING_RELEASES,
  CALENDAR_INSIGHTS,
  YEAR_HEATMAP,
} from "@/lib/analytics-mock";
import { ThisWeekHistory } from "@/components/memory/ThisWeekHistory";

export const Route = createFileRoute("/app/calendar")({ component: CalendarPage });

const SEASON_TINT: Record<string, string> = {
  spring: "oklch(0.78 0.16 130 / 0.18)",
  summer: "oklch(0.82 0.16 80 / 0.18)",
  autumn: "oklch(0.7 0.2 35 / 0.18)",
  winter: "oklch(0.6 0.18 250 / 0.18)",
};
const seasonOf = (m: number) =>
  m < 2 || m === 11 ? "winter" : m < 5 ? "spring" : m < 8 ? "summer" : "autumn";

function CalendarPage() {
  const [monthIdx, setMonthIdx] = useState(2); // March
  const [selectedDay, setSelectedDay] = useState<number | null>(14);
  const month = CALENDAR_YEAR[monthIdx];
  const season = seasonOf(monthIdx);

  const grid = useMemo(() => {
    const cells: ({
      day: number;
      hasMedia: boolean;
      hasJournal: boolean;
      hasAchievement: boolean;
      intensity: number;
      mediaCount: number;
      poster: string;
    } | null)[] = [];
    for (let i = 0; i < month.startDay; i++) cells.push(null);
    month.cells.forEach((c) => cells.push(c));
    while (cells.length % 7) cells.push(null);
    return cells;
  }, [month]);

  return (
    <div className="pb-32 pt-2">
      {/* Seasonal tint */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 transition-colors duration-1000"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${SEASON_TINT[season]}, transparent 70%)`,
        }}
      />

      {/* Zone 1 — Memory Hero */}
      <motion.section
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <PremiumGlass
          variant="strong"
          className="relative overflow-hidden rounded-[40px] p-10 md:p-16"
          glow="oklch(0.65 0.2 250 / 0.4)"
        >
          <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground flex items-center gap-2">
            <CloudSun className="h-3 w-3 text-primary" /> Memory map · {CALENDAR_HERO.year}
          </div>
          <h1 className="mt-5 font-display text-5xl tracking-tight md:text-7xl">
            <span className="text-gradient-aurora">A year, day by day.</span>
          </h1>
          <p className="mt-5 max-w-xl text-muted-foreground md:text-lg">
            Every story, every chapter, every quiet evening — gently mapped onto your life.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { l: "Stories", v: CALENDAR_HERO.stories },
              { l: "Journals", v: CALENDAR_HERO.journals },
              { l: "Longest streak", v: CALENDAR_HERO.longestStreak, s: "d" },
              { l: "Favorite month", v: CALENDAR_HERO.favoriteMonth },
            ].map((s) => (
              <div key={s.l} className="glass-subtle relative overflow-hidden rounded-2xl p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {s.l}
                </div>
                <div className="mt-2 font-display text-3xl tracking-tight">
                  {typeof s.v === "number" ? <CountUp to={s.v} suffix={s.s ?? ""} /> : s.v}
                </div>
              </div>
            ))}
          </div>
        </PremiumGlass>
      </motion.section>

      {/* Zone 2 — Year overview */}
      <Zone eyebrow="Zone 02" title="Year overview">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {CALENDAR_YEAR.map((m) => {
            const active = m.index === monthIdx;
            return (
              <motion.button
                key={m.index}
                onClick={() => {
                  setMonthIdx(m.index);
                  setSelectedDay(null);
                }}
                whileHover={{ y: -3 }}
                className={`glass group relative overflow-hidden rounded-2xl p-4 text-left transition ${active ? "ring-2 ring-primary/60" : ""}`}
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl opacity-50 transition group-hover:opacity-80"
                  style={{ background: m.accent }}
                />
                <div className="relative">
                  <div className="grid grid-cols-2 gap-1">
                    {m.collage.map((src, i) => (
                      <div key={i} className="aspect-square overflow-hidden rounded-md">
                        <img src={src} alt="" className="h-full w-full object-cover opacity-80" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div className="font-display text-xl tracking-tight">{m.short}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {m.mediaCount} · {m.journalCount}j
                    </div>
                  </div>
                  <div className="mt-1 truncate text-xs" style={{ color: m.accent }}>
                    {m.favorite}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </Zone>

      {/* Zone 3+4 — Monthly grid + Daily memory panel */}
      <Zone
        eyebrow="Zone 03"
        title={`${month.name} 2026`}
        sub={`${month.mediaCount} stories · ${month.journalCount} journals · ${month.hours}h`}
        action={
          <div className="inline-flex items-center gap-1">
            <button
              onClick={() => {
                setMonthIdx((monthIdx + 11) % 12);
                setSelectedDay(null);
              }}
              className="glass-subtle grid h-9 w-9 place-items-center rounded-full hover:bg-white/[0.08]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setMonthIdx((monthIdx + 1) % 12);
                setSelectedDay(null);
              }}
              className="glass-subtle grid h-9 w-9 place-items-center rounded-full hover:bg-white/[0.08]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <PremiumGlass className="p-6 md:p-8">
            <div className="mb-3 grid grid-cols-7 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-center">
                  {d}
                </div>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={monthIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-7 gap-2"
              >
                {grid.map((c, i) => {
                  if (!c) return <div key={i} className="aspect-square" />;
                  const isSel = selectedDay === c.day;
                  return (
                    <motion.button
                      key={i}
                      onClick={() => setSelectedDay(c.day)}
                      whileHover={{ scale: 1.05 }}
                      className={`group relative aspect-square overflow-hidden rounded-lg border ${isSel ? "border-primary/70" : "border-white/[0.05]"} transition`}
                      style={{
                        background: c.hasMedia
                          ? `oklch(0.72 0.18 255 / ${0.05 + c.intensity * 0.4})`
                          : "oklch(1 0 0 / 0.02)",
                      }}
                    >
                      {c.hasMedia && (
                        <img
                          src={c.poster}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover opacity-0 transition group-hover:opacity-40"
                        />
                      )}
                      <div className="absolute inset-0 grid place-items-center">
                        <span className="text-xs text-foreground/80">{c.day}</span>
                      </div>
                      {c.hasJournal && (
                        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-300/80" />
                      )}
                      {c.hasAchievement && (
                        <Trophy className="absolute left-1 top-1 h-2.5 w-2.5 text-amber-300" />
                      )}
                      {isSel && (
                        <span className="absolute inset-0 ring-2 ring-primary/60 rounded-lg" />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
            <div className="mt-5 flex items-center gap-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary/70" />
                media
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-300/80" />
                journal
              </span>
              <span className="flex items-center gap-1.5">
                <Trophy className="h-3 w-3 text-amber-300" />
                achievement
              </span>
            </div>
          </PremiumGlass>

          {/* Daily memory panel */}
          <PremiumGlass className="p-6 md:p-8" glow={month.accent}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${monthIdx}-${selectedDay ?? "none"}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {month.name} {selectedDay ?? "—"}, 2026
                </div>
                <div className="mt-2 font-display text-3xl tracking-tight">
                  {selectedDay ? "An evening to remember" : "Pick a day"}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedDay
                    ? "What happened on this day, through stories."
                    : "Tap any cell to see its memories."}
                </p>

                {selectedDay && (
                  <div className="mt-6 space-y-2">
                    {[
                      {
                        icon: Film,
                        label: "Movie",
                        title: "Interstellar",
                        note: "Watched alone, 2 AM",
                      },
                      {
                        icon: BookOpen,
                        label: "Book",
                        title: "Pachinko · Ch. 14",
                        note: "32 pages",
                      },
                      { icon: Gamepad2, label: "Game", title: "Elden Ring", note: "1h 22m" },
                      {
                        icon: Music,
                        label: "Album",
                        title: "Dark Side of the Moon",
                        note: "Full listen",
                      },
                      {
                        icon: NotebookPen,
                        label: "Journal",
                        title: "Endless docking",
                        note: "418 words",
                      },
                      {
                        icon: Trophy,
                        label: "Achievement",
                        title: "Marathoner unlocked",
                        note: "Gold tier",
                      },
                    ].map((t) => (
                      <motion.div
                        key={t.label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="glass-subtle flex items-center gap-3 rounded-xl p-3"
                      >
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.06]">
                          <t.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                            {t.label}
                          </div>
                          <div className="truncate text-sm">{t.title}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">{t.note}</div>
                      </motion.div>
                    ))}
                    <div className="mt-3 flex items-center justify-between rounded-xl bg-white/[0.04] p-3 text-xs text-muted-foreground">
                      <span>Mood · Awe</span>
                      <span>Weather · Cold, clear</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </PremiumGlass>
        </div>
      </Zone>

      {/* Zone 5 — Media heatmap */}
      <Zone eyebrow="Zone 05" title="Media heatmap" sub="52 weeks of attention.">
        <PremiumGlass className="p-6 md:p-8">
          <div className="overflow-x-auto pb-2">
            <div
              className="grid grid-rows-7 gap-1"
              style={{ gridTemplateColumns: `repeat(52, minmax(10px, 1fr))` }}
            >
              {YEAR_HEATMAP.map((c) => (
                <div
                  key={`${c.w}-${c.d}`}
                  className="aspect-square rounded-[3px] transition hover:scale-150"
                  title={`week ${c.w + 1} · day ${c.d + 1} · ${(c.v * 100).toFixed(0)}%`}
                  style={{
                    background:
                      c.v < 0.15
                        ? "oklch(1 0 0 / 0.05)"
                        : c.v < 0.4
                          ? `oklch(0.65 0.18 230 / ${0.25 + c.v})`
                          : c.v < 0.7
                            ? `oklch(0.65 0.22 295 / ${0.4 + c.v * 0.4})`
                            : `oklch(0.78 0.16 80 / ${0.6 + c.v * 0.3})`,
                    gridColumnStart: c.w + 1,
                    gridRowStart: c.d + 1,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Less{" "}
            <span className="flex gap-1">
              {[0.1, 0.3, 0.5, 0.7, 0.95].map((v, i) => (
                <span
                  key={i}
                  className="h-3 w-3 rounded-[3px]"
                  style={{
                    background:
                      v < 0.15
                        ? "oklch(1 0 0 / 0.05)"
                        : v < 0.4
                          ? `oklch(0.65 0.18 230 / 0.5)`
                          : v < 0.7
                            ? `oklch(0.65 0.22 295 / 0.6)`
                            : `oklch(0.78 0.16 80 / 0.75)`,
                  }}
                />
              ))}
            </span>{" "}
            More
          </div>
        </PremiumGlass>
      </Zone>

      {/* Zone 6 — Highlights */}
      <Zone eyebrow="Zone 06" title="Memory highlights">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CALENDAR_HIGHLIGHTS.map((h) => (
            <motion.div
              key={h.label}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl"
            >
              <img
                src={h.media.backdrop ?? h.media.poster}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-40 transition group-hover:opacity-60 group-hover:scale-105 duration-[var(--dur-page)] ease-[var(--ease-out)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
              <div className="relative p-6 pt-32">
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {h.label}
                </div>
                <div className="mt-2 font-display text-2xl tracking-tight">{h.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{h.note}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Zone>

      {/* Zone 7 — Streaks */}
      <Zone eyebrow="Zone 07" title="Memory streaks">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {MEMORY_STREAKS.map((s) => (
            <PremiumGlass key={s.label} className="flex flex-col items-center gap-3 p-5">
              <ProgressRing value={(s.value / s.total) * 100} accent={s.accent}>
                <div className="text-center">
                  <div className="font-display text-2xl tracking-tight">
                    <CountUp to={s.value} />
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                    / {s.total}d
                  </div>
                </div>
              </ProgressRing>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </div>
            </PremiumGlass>
          ))}
        </div>
      </Zone>

      {/* Zone 8 — Upcoming releases */}
      <Zone eyebrow="Zone 08" title="Upcoming releases">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {UPCOMING_RELEASES.map((u) => (
            <PremiumGlass
              key={u.title}
              className="group flex items-center gap-3 overflow-hidden p-3"
            >
              <img src={u.poster} alt="" className="h-20 w-14 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{u.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{u.when}</div>
                <span
                  className="mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider"
                  style={{ background: u.accent, color: "oklch(0.12 0 0)" }}
                >
                  {u.countdown}
                </span>
              </div>
            </PremiumGlass>
          ))}
        </div>
      </Zone>

      {/* Zone 9 — Insights */}
      <Zone eyebrow="Zone 09" title="Calendar insights">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {CALENDAR_INSIGHTS.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="glass-subtle flex items-start gap-4 rounded-2xl p-5"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06]">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-foreground/90">{line}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <PremiumButton variant="secondary" size="sm">
            Export year as image
          </PremiumButton>
        </div>
      </Zone>

      {/* Memory · This week, in your life */}
      <Zone
        eyebrow="Memory"
        title="This week, in your life"
        sub="The same week of the year, across previous years."
      >
        <ThisWeekHistory />
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-16 md:mt-24"
    >
      <ZoneHeading eyebrow={eyebrow} title={title} sub={sub} action={action} />
      {children}
    </motion.section>
  );
}
