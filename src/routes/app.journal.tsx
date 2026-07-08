import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { NotebookPen, Sparkles, Heart, Bookmark, Clock } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { CountUp, ZoneHeading, StatCardPremium } from "@/components/analytics/AnalyticsKit";
import {
  JOURNAL_PROMPTS,
} from "@/lib/analytics-mock";
import { MemoryBookmarks } from "@/components/memory/MemoryBookmarks";
import { RecommendationCard } from "@/components/discovery/RecommendationCard";
import { getContinueMood } from "@/lib/discovery";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { getActiveChallenge } from "@/lib/challenges";
import { MemoryDNA } from "@/components/intelligence/MemoryDNA";
import { JournalPage as PaperPage } from "@/components/journal/Page";
import { DropCap } from "@/components/editorial/DropCap";
import { cascade } from "@/lib/motion";
import { YourReflectionsRail } from "@/components/memory/YourReflectionsRail";
import { YourQuotesRail } from "@/components/memory/YourQuotesRail";
import { LiveStatsStrip } from "@/components/memory/LiveStatsStrip";
import { useJournalEntries, useJournalStats, useTimelineEvents } from "@/hooks/use-journal";
import { adaptJournalEntry, adaptTimelineEvent } from "@/lib/adapters/journal";
import { MEDIA } from "@/lib/mock";
import { useMemo } from "react";

export const Route = createFileRoute("/app/journal")({ component: JournalPage });

function JournalPage() {
  const { data: journalData, isLoading: isLoadingJournal } = useJournalEntries();
  const { data: statsData } = useJournalStats();
  const { data: timelineData } = useTimelineEvents();

  const entries = useMemo(() => {
    return journalData?.pages.flatMap((p) => p.data).map(adaptJournalEntry) ?? [];
  }, [journalData]);

  const timelineEvents = useMemo(() => {
    return (timelineData ?? []).map(adaptTimelineEvent);
  }, [timelineData]);

  // Derive mood timeline from timeline events or entries with moods
  const moodTimeline = useMemo(() => {
    const points = entries.filter(e => e.mood).slice(0, 30).map((e, i) => {
      // Map basic moods to a rough 1-5 scale for the chart
      let val = 3;
      if (e.mood?.toLowerCase().includes("happy") || e.mood?.toLowerCase().includes("excited")) val = 4.5;
      if (e.mood?.toLowerCase().includes("sad") || e.mood?.toLowerCase().includes("angry")) val = 1.5;
      return { day: i + 1, mood: val };
    });
    if (points.length === 0) {
      // Fallback if no real moods exist
      return Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        mood: Math.round((Math.sin(i / 4) * 1.5 + 3) * 10) / 10,
      }));
    }
    return points;
  }, [entries]);

  // Pinned or favorites
  const favoriteEntries = useMemo(() => {
    return entries.slice(0, 2); // For now, just show top 2 as favorites
  }, [entries]);

  return (
    <div className="pb-32 pt-2">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <PremiumGlass
          interactive
          variant="strong"
          className="group/master relative overflow-hidden rounded-[40px] p-10 md:p-16 transform-gpu isolate"
        >
          {/* Subtle top inner reflective edge */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          
          {/* paper texture overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            }}
          />
          
          <div className="relative z-10 pointer-events-auto">
            <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground flex items-center gap-2">
              <NotebookPen className="h-3 w-3 text-primary" /> Journal
            </div>
            <h1 className="mt-5 font-display text-5xl tracking-tight md:text-7xl">
              <span className="text-gradient-aurora">Words for the stories</span>
              <br />
              that stayed.
            </h1>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { l: "Entries", v: statsData?.journalCount ?? 0, s: "", accent: "oklch(0.72 0.18 255)" }, // Cyan/Blue
                { l: "Current streak", v: statsData?.writingStreak ?? 0, s: "d", accent: "oklch(0.65 0.22 295)" }, // Violet
                { l: "Words written", v: entries.reduce((acc, cur) => acc + cur.content.length / 5, 0) | 0, s: "", accent: "oklch(0.72 0.16 160)" }, // Emerald
                { l: "Favorite mood", v: "Reflective" as string | number, s: "", accent: "oklch(0.82 0.16 80)" }, // Amber
              ].map((s) => (
                <PremiumGlass 
                  key={s.l} 
                  interactive
                  className="journal-stat-card cursor-pointer rounded-2xl p-5"
                  style={{ "--journal-accent": s.accent } as React.CSSProperties}
                >
                  <div className="relative z-10 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 group-hover:text-white">
                    {s.l}
                  </div>
                  <div className="relative z-10 mt-2 font-display text-3xl tracking-tight text-white drop-shadow-sm transition-transform duration-300">
                    {typeof s.v === "number" ? <CountUp to={s.v} suffix={s.s ?? ""} /> : s.v}
                  </div>
                </PremiumGlass>
              ))}
            </div>
          </div>
        </PremiumGlass>
      </motion.section>

      {/* Today's prompt — wrapped as a notebook page */}
      <Zone eyebrow="Today" title="A prompt for tonight" sub="One question. No pressure.">
        <PaperPage date="Tonight" mood="Reflective" mode="reflect">
          <Sparkles className="mx-auto h-5 w-5 text-primary" />
          <p className="mt-4 font-display text-3xl tracking-tight md:text-4xl leading-snug">
            "{JOURNAL_PROMPTS[0]}"
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <PremiumButton variant="primary" icon={<NotebookPen className="h-4 w-4" />}>
              Start writing
            </PremiumButton>
            <PremiumButton variant="ghost" size="sm">
              Different prompt
            </PremiumButton>
          </div>
        </PaperPage>
      </Zone>

      {/* Live: your real numbers */}
      <Zone
        eyebrow="Live"
        title="Your writing, today"
        sub="Pulled straight from your library — no demo data."
      >
        <LiveStatsStrip />
      </Zone>

      {/* Live: reflections you've written via the Reflect drawer */}
      <Zone
        eyebrow="Memory"
        title="Your reflections"
        sub="Everything you've written when finishing a story."
      >
        <YourReflectionsRail />
      </Zone>

      {/* Live: quotes you've saved from media pages */}
      <Zone
        eyebrow="Quotes"
        title="Lines you kept"
        sub="Saved via More → Save a quote on any media page."
      >
        <YourQuotesRail limit={6} />
      </Zone>

      {/* Recent entries — first one gets a drop cap; rest cascade in */}
      <Zone eyebrow="Recent" title="Lately">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {entries.length === 0 && !isLoadingJournal && (
            <div className="text-muted-foreground">No recent journal entries found.</div>
          )}
          {entries.slice(0, 4).map((j, i) => (
            <motion.article
              key={j.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={cascade(i, 0.05)}
              whileHover={{ scale: 1.008 }}
              className="glass group relative overflow-hidden rounded-3xl p-6"
            >
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl opacity-50 transition group-hover:opacity-80"
                style={{ background: "oklch(0.7 0.18 35)" }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {new Date(j.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {j.mood ?? "Neutral"}
                  </div>
                </div>
                <h3 className="mt-3 font-display text-2xl tracking-tight">{j.title || "Untitled Entry"}</h3>
                {i === 0 ? (
                  <div className="mt-3">
                    <DropCap tone="warm">{j.content}</DropCap>
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-foreground/85 line-clamp-3">{j.content}</p>
                )}
                <div className="mt-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {Math.max(1, Math.round(j.content.length / 800))} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" /> Saved
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Zone>

      {/* Mood timeline */}
      <Zone eyebrow="Mood" title="Moods across the month">
        <PremiumGlass className="p-6 md:p-8">
          <svg viewBox="0 0 600 160" className="h-44 w-full">
            <defs>
              <linearGradient id="mood-stroke" x1="0" x2="1">
                <stop offset="0%" stopColor="oklch(0.65 0.22 295)" />
                <stop offset="50%" stopColor="oklch(0.72 0.18 255)" />
                <stop offset="100%" stopColor="oklch(0.78 0.16 80)" />
              </linearGradient>
              <linearGradient id="mood-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.18 255)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="oklch(0.72 0.18 255)" stopOpacity={0} />
              </linearGradient>
            </defs>
            {(() => {
              const w = 600,
                h = 160;
              const max = 5;
              const pts = moodTimeline.map(
                (d, i) =>
                  [
                    (i / (moodTimeline.length - 1 || 1)) * w,
                    h - (d.mood / max) * (h - 20) - 10,
                  ] as const,
              );
              if (pts.length === 0) return null;
              const path = pts
                .map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`))
                .join(" ");
              const fill = `${path} L${w},${h} L0,${h} Z`;
              return (
                <>
                  <motion.path
                    d={fill}
                    fill="url(#mood-fill)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                  />
                  <motion.path
                    d={path}
                    stroke="url(#mood-stroke)"
                    strokeWidth={2.5}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                  {pts
                    .filter((_, i) => i % 4 === 0)
                    .map((p, i) => (
                      <circle key={i} cx={p[0]} cy={p[1]} r={3} fill="oklch(0.95 0 0)" />
                    ))}
                </>
              );
            })()}
          </svg>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {["Happy", "Inspired", "Emotional", "Excited", "Relaxed", "Thoughtful"].map((m, i) => (
              <span key={m} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: [
                      "oklch(0.78 0.16 80)",
                      "oklch(0.7 0.2 145)",
                      "oklch(0.65 0.22 295)",
                      "oklch(0.7 0.18 25)",
                      "oklch(0.72 0.18 255)",
                      "oklch(0.55 0.18 280)",
                    ][i],
                  }}
                />
                {m}
              </span>
            ))}
          </div>
        </PremiumGlass>
      </Zone>


      {/* Writing statistics */}
      <Zone eyebrow="Stats" title="Writing statistics">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <StatCardPremium label="Entries" value={statsData?.journalCount ?? 0} delta="+8" />
          <StatCardPremium
            label="Words"
            value={entries.reduce((acc, cur) => acc + cur.content.length / 5, 0) | 0}
            delta="+1,420"
            accent="oklch(0.65 0.22 295 / 0.4)"
          />
          <StatCardPremium
            label="Longest streak"
            value={statsData?.writingStreak ?? 0}
            delta="days"
            accent="oklch(0.82 0.16 80 / 0.4)"
          />
          <StatCardPremium
            label="Average length"
            value={entries.length ? (entries.reduce((acc, cur) => acc + cur.content.length / 5, 0) / entries.length) | 0 : 0}
            delta="words"
            accent="oklch(0.72 0.16 160 / 0.4)"
          />
          <StatCardPremium
            label="Top category"
            value="Movies"
            accent="oklch(0.78 0.18 50 / 0.4)"
          />
        </div>
      </Zone>

      {/* Memory drafts */}
      <Zone eyebrow="Drafts" title="Threads you started">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            "Why I keep rewatching Interstellar",
            "Notes after finishing Pachinko",
            "What Cyberpunk taught me about cities",
          ].map((t) => (
            <PremiumGlass key={t} className="p-5">
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Draft
              </div>
              <div className="mt-2 font-display text-lg tracking-tight">{t}</div>
              <div className="mt-3 text-xs text-muted-foreground">
                Last edited 3 days ago · 84 words
              </div>
            </PremiumGlass>
          ))}
        </div>
      </Zone>

      {/* Favorites */}
      <Zone eyebrow="Favorites" title="Pinned entries">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {favoriteEntries.map((j) => (
            <PremiumGlass key={j.id} className="p-6">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <Bookmark className="h-3 w-3 text-amber-300 fill-current" /> {new Date(j.createdAt).toLocaleDateString()} · {j.mood ?? "Neutral"}
              </div>
              <h3 className="mt-2 font-display text-2xl tracking-tight">{j.title || "Untitled Entry"}</h3>
              <p className="mt-2 text-sm text-foreground/85 leading-relaxed line-clamp-3">{j.content}</p>
            </PremiumGlass>
          ))}
          {favoriteEntries.length === 0 && (
             <div className="text-muted-foreground text-sm">No favorite entries yet.</div>
          )}
        </div>
      </Zone>

      {/* Memory · Bookmarked memories */}
      <Zone
        eyebrow="Memory"
        title="Bookmarked memories"
        sub="Saved to return to, separate from favorites."
      >
        <MemoryBookmarks />
      </Zone>
      <Zone eyebrow="DNA" title="Your memory, dissected">
        <MemoryDNA mediaId="interstellar" />
      </Zone>
      <Zone eyebrow="Challenge" title="This month's prompt">
        <ChallengeCard challenge={getActiveChallenge()} />
      </Zone>
      <Zone eyebrow="Discovery" title="Continue this mood">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {getContinueMood()
            .slice(0, 4)
            .map((r) => (
              <li key={r.media.id}>
                <RecommendationCard rec={r} compact />
              </li>
            ))}
        </ul>
      </Zone>
    </div>
  );
}

function Zone({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
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
      <ZoneHeading eyebrow={eyebrow} title={title} sub={sub} />
      {children}
    </motion.section>
  );
}
