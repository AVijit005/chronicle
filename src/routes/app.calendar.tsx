import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  NotebookPen,
  Film,
  Tv,
  MonitorPlay,
  BookOpen,
  BookImage,
  Gamepad2,
  Music,
  Mic,
  GraduationCap,
  PlaySquare,
  CloudSun,
  Plus,
  X,
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
import { MediaConstellation } from "@/components/analytics/MediaConstellation";

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
              <PremiumGlass 
                key={s.l} 
                variant="subtle"
                className="relative z-10 overflow-hidden p-4 cursor-pointer press-scale"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {s.l}
                </div>
                <div className="mt-2 font-display text-3xl tracking-tight">
                  {typeof s.v === "number" ? <CountUp to={s.v} suffix={s.s ?? ""} /> : s.v}
                </div>
              </PremiumGlass>
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
          <div className="flex flex-col gap-6">
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
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                      className={`group relative aspect-square overflow-hidden rounded-[12px] transition-all duration-400 ease-out`}
                      style={{
                        background: c.hasMedia ? "transparent" : "rgba(255,255,255,0.02)",
                        backdropFilter: c.hasMedia ? "none" : "blur(12px)",
                        WebkitBackdropFilter: c.hasMedia ? "none" : "blur(12px)",
                        boxShadow: isSel 
                          ? `inset 0 1px 1px rgba(255,255,255,0.4), inset 0 0 0 1px rgba(255,255,255,0.2), 0 8px 24px -4px rgba(0,0,0,0.6), 0 0 0 2px oklch(0.72 0.18 255 / 0.8)`
                          : `inset 0 1px 1px rgba(255,255,255,0.2), inset 0 0 0 1px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.2)`
                      }}
                    >
                      {/* Fully visible poster */}
                      {c.hasMedia && (
                        <>
                          <img
                            src={c.poster}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover scale-100 transition-transform duration-500 group-hover:scale-110"
                          />
                          {/* Smooth gradient fade so the white day number is always readable */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />
                        </>
                      )}

                      {/* Day number */}
                      <div className="absolute inset-0 grid place-items-center z-10">
                        <span className={`text-xs font-semibold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${isSel || c.hasMedia ? 'text-white' : 'text-foreground/90'}`}>
                          {c.day}
                        </span>
                      </div>

                      {c.hasJournal && (
                        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)] z-10" />
                      )}
                      {c.hasAchievement && (
                        <Trophy className="absolute left-1.5 top-1.5 h-2.5 w-2.5 text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.8)] z-10" />
                      )}
                      
                      {/* Apple-style Diagonal Glass Reflection Overlay */}
                      <div 
                        className="absolute inset-0 pointer-events-none rounded-[12px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay z-20"
                        style={{
                          background: 'linear-gradient(110deg, transparent 15%, rgba(255,255,255,0.5) 30%, transparent 45%)'
                        }}
                      />
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
          
          <MediaConstellation />
          
          </div>

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
                      <PremiumGlass
                        key={t.label}
                        variant="subtle"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 rounded-xl p-3 cursor-pointer press-scale relative z-10"
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
                      </PremiumGlass>
                    ))}
                    <PremiumGlass
                      variant="subtle"
                      className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 p-3 text-xs text-muted-foreground hover:text-foreground cursor-pointer press-scale relative z-10"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      <Plus className="h-3 w-3" /> Add memory
                    </PremiumGlass>
                    <div className="mt-5 flex flex-col xl:flex-row items-center gap-3">
                      <motion.div 
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="group flex w-full flex-1 items-center gap-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] p-3 transition-colors hover:bg-white/[0.04] hover:border-white/[0.08] cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 shadow-[0_0_12px_-2px_rgba(245,158,11,0.3)] transition-transform duration-300 group-hover:scale-110">
                          <Sparkles className="h-4 w-4 text-amber-300" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-semibold mb-0.5">Mood</span>
                          <span className="font-display text-lg tracking-tight text-foreground/90 leading-none">Awe</span>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="group flex w-full flex-1 items-center gap-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] p-3 transition-colors hover:bg-white/[0.04] hover:border-white/[0.08] cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/10 border border-sky-500/20 shadow-[0_0_12px_-2px_rgba(14,165,233,0.3)] transition-transform duration-300 group-hover:scale-110">
                          <CloudSun className="h-4 w-4 text-sky-300" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-semibold mb-0.5">Weather</span>
                          <span className="font-display text-lg tracking-tight text-foreground/90 leading-none">Cold, clear</span>
                        </div>
                      </motion.div>
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
                          ? `oklch(0.72 0.18 255 / ${0.2 + c.v * 0.2})`
                          : c.v < 0.6
                            ? `oklch(0.72 0.18 255 / ${0.4 + c.v * 0.3})`
                            : c.v < 0.8
                              ? `oklch(0.72 0.18 255 / ${0.6 + c.v * 0.3})`
                              : `oklch(0.72 0.18 255 / 1)`,
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
                          ? `oklch(0.72 0.18 255 / 0.3)`
                          : v < 0.6
                            ? `oklch(0.72 0.18 255 / 0.55)`
                            : v < 0.8
                              ? `oklch(0.72 0.18 255 / 0.8)`
                              : `oklch(0.72 0.18 255 / 1)`,
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
          {MEMORY_STREAKS.map((s, idx) => {
            const progress = (s.value / s.total) * 100;
            const r = 36;
            const c = 2 * Math.PI * r;
            const easing = [0.16, 1, 0.3, 1];
            
            return (
              <PremiumGlass key={s.label} className="h-full group hover:-translate-y-1.5 transition-all duration-500 ease-out border-white/[0.03] hover:border-white/[0.08] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                <div className="flex flex-col items-center justify-between px-4 py-8 h-full relative box-border w-full z-10 min-h-[230px]">
                  
                  {/* Elegant Floating Ring */}
                  <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                    
                    {/* Soft Ambient Core */}
                    <div 
                      className="absolute inset-0 rounded-full blur-[20px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none mix-blend-screen"
                      style={{ backgroundColor: s.accent }}
                    />
                    
                    <svg width="96" height="96" className="-rotate-90 relative z-10" style={{ overflow: "visible" }} viewBox="0 0 96 96">
                      <defs>
                        {/* Dynamic Gradient for the Stroke */}
                        <linearGradient id={`grad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={s.accent} stopOpacity="0.6" />
                          <stop offset="100%" stopColor={s.accent} stopOpacity="1" />
                        </linearGradient>
                      </defs>

                      {/* Very faint background track */}
                      <circle cx="48" cy="48" r={r} stroke="oklch(1 1 1 / 0.05)" strokeWidth="4" fill="none" />
                      
                      {/* Premium Solid Progress */}
                      <motion.circle
                        cx="48" cy="48" r={r}
                        stroke={`url(#grad-${idx})`}
                        strokeWidth="5"
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray={c}
                        initial={{ strokeDashoffset: c }}
                        whileInView={{ strokeDashoffset: c - (c * Math.max(progress, 1)) / 100 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2.2 + idx * 0.1, ease: easing }}
                        style={{ filter: `drop-shadow(0 4px 12px ${s.accent}60)` }}
                      />
                    </svg>
                    
                    {/* Glowing Leading Edge Dot */}
                    <motion.div 
                      className="absolute inset-0 pointer-events-none z-20 flex justify-center"
                      initial={{ rotate: 0 }}
                      whileInView={{ rotate: (Math.max(progress, 1) / 100) * 360 }}
                      viewport={{ once: true }}
                      transition={{ duration: 2.2 + idx * 0.1, ease: easing }}
                    >
                      <div 
                        className="w-[5px] h-[5px] bg-white rounded-full"
                        style={{ 
                          marginTop: 12 - 2.5, 
                          boxShadow: `0 0 10px 2px ${s.accent}, 0 0 4px white` 
                        }} 
                      />
                    </motion.div>

                    {/* Minimalist Center Percentage */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <span className="font-display font-medium text-[16px] text-white tracking-tight drop-shadow-md">
                        <CountUp to={Math.round(progress)} />%
                      </span>
                    </div>
                  </div>

                  {/* Refined Typography */}
                  <div className="flex flex-col items-center justify-center text-center mt-auto">
                    <div className="flex items-baseline justify-center gap-1.5">
                      <div className="font-display text-[32px] font-medium tracking-tighter text-white drop-shadow-sm">
                        <CountUp to={s.value} />
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-widest">
                        / {s.total}d
                      </span>
                    </div>
                    
                    <div className="text-[9px] font-bold uppercase tracking-[0.25em] mt-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500" style={{ color: s.accent }}>
                      {s.label}
                    </div>
                  </div>

                </div>
              </PremiumGlass>
            );
          })}
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
            <PremiumGlass
              key={i}
              variant="subtle"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-start gap-4 p-5 cursor-pointer press-scale relative z-10"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06]">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-foreground/90">{line}</p>
            </PremiumGlass>
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

      {/* Add Memory Modal Overlay */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isAddModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-background/60 backdrop-blur-[32px] saturate-150"
                  onClick={() => setIsAddModalOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 40 }}
                  transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                  className="relative w-full max-w-3xl z-10"
                >
                  <PremiumGlass className="overflow-hidden p-0 rounded-[2.5rem]" glow="oklch(0.7 0.1 250)">
                    {/* Liquid glass inner overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative p-8 md:p-12">
                      <button
                        onClick={() => setIsAddModalOpen(false)}
                        className="absolute right-6 top-6 rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground z-10"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      
                      <div className="mb-10 text-center">
                        <h2 className="font-display text-4xl tracking-tight text-foreground/90">Log a memory</h2>
                        <p className="mt-2 text-sm text-muted-foreground/80">
                          {selectedDay ? `March ${selectedDay}, 2026` : "Select a medium to chronicle"}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-y-8 gap-x-4">
                        {[
                          { id: "movies", icon: Film, label: "Movies", color: "text-blue-400", bg: "bg-blue-500/10" },
                          { id: "anime", icon: Sparkles, label: "Anime", color: "text-pink-400", bg: "bg-pink-500/10" },
                          { id: "series", icon: Tv, label: "Series", color: "text-indigo-400", bg: "bg-indigo-500/10" },
                          { id: "books", icon: BookOpen, label: "Books", color: "text-amber-400", bg: "bg-amber-500/10" },
                          { id: "manga", icon: BookImage, label: "Manga", color: "text-orange-400", bg: "bg-orange-500/10" },
                          { id: "games", icon: Gamepad2, label: "Games", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                          { id: "music", icon: Music, label: "Music", color: "text-purple-400", bg: "bg-purple-500/10" },
                          { id: "podcasts", icon: Mic, label: "Podcasts", color: "text-violet-400", bg: "bg-violet-500/10" },
                          { id: "courses", icon: GraduationCap, label: "Courses", color: "text-teal-400", bg: "bg-teal-500/10" },
                          { id: "youtube", icon: PlaySquare, label: "YouTube", color: "text-red-400", bg: "bg-red-500/10" },
                        ].map((type) => (
                          <motion.button
                            key={type.id}
                            whileHover={{ y: -6, scale: 1.05 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="group flex flex-col items-center justify-center gap-3"
                          >
                            <div className={`relative flex h-[72px] w-[72px] sm:h-[84px] sm:w-[84px] items-center justify-center rounded-[1.5rem] sm:rounded-[1.75rem] border border-white/[0.06] ${type.bg} transition-all duration-500 group-hover:shadow-[0_0_40px_-10px_currentColor] group-hover:border-white/[0.2] ${type.color} overflow-hidden shadow-xl`}>
                              {/* Liquid glass highlight */}
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/0 to-white/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                              <type.icon className="h-7 w-7 sm:h-8 sm:w-8 relative z-10 drop-shadow-md transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <div className="text-[11px] sm:text-xs font-medium text-foreground/60 tracking-wide transition-colors duration-300 group-hover:text-foreground/90">
                              {type.label}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                  </div>
                </PremiumGlass>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
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
