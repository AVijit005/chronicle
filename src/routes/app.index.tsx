import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Plus, Search as SearchIcon, NotebookPen, Layers, ChevronRight } from "lucide-react";
import { CinematicHero } from "@/components/media/CinematicHero";
import { MediaCard } from "@/components/media/MediaCard";
import { Section } from "@/components/common/Section";
import { recentlyCompleted, featured, COLLECTIONS } from "@/lib/mock";
import { OnThisDay } from "@/components/memory/OnThisDay";
import { DiscoveryHero } from "@/components/discovery/DiscoveryHero";
import { ContinueUniverse } from "@/components/discovery/ContinueUniverse";
import { GoalHero } from "@/components/goals/GoalHero";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { getActiveChallenge } from "@/lib/challenges";
import { TasteProfile } from "@/components/intelligence/TasteProfile";
import { DashboardGreeting } from "@/components/dashboard/DashboardGreeting";
import { DashboardContext } from "@/components/dashboard/DashboardContext";
import { ContinueJourneyHero } from "@/components/dashboard/ContinueJourneyHero";
import { DailyRitual } from "@/components/dashboard/DailyRitual";
import { DailyFocus } from "@/components/dashboard/DailyFocus";
import { TodayInHistory } from "@/components/dashboard/TodayInHistory";
import { DashboardMood } from "@/components/dashboard/DashboardMood";
import { WeeklyReflection } from "@/components/dashboard/WeeklyReflection";
import { NotificationStrip } from "@/components/dashboard/NotificationStrip";
import { MiniTimeline } from "@/components/dashboard/MiniTimeline";
import { LivingStats } from "@/components/dashboard/LivingStats";
import { QuietRecommendations } from "@/components/dashboard/QuietRecommendations";
import { SmartFooter } from "@/components/dashboard/SmartFooter";
import { PullQuote } from "@/components/editorial/PullQuote";
import { Collage } from "@/components/editorial/Collage";
import { SplitBlock } from "@/components/editorial/SplitBlock";

export const Route = createFileRoute("/app/")({
  component: Home,
});

function Home() {
  return (
    <div className="pt-2">
      <CinematicHero item={featured} />

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4"
      >
        {[
          { icon: Plus, label: "Add media" },
          { icon: SearchIcon, label: "Spotlight" },
          { icon: NotebookPen, label: "Journal entry" },
          { icon: Layers, label: "New collection" },
        ].map((q, i) => (
          <button
            key={i}
            className="glass group flex items-center gap-3 rounded-2xl p-4 text-left transition hover-lift"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06]">
              <q.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm">{q.label}</div>
              <div className="text-[11px] text-muted-foreground">Press ⌘K</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
          </button>
        ))}
      </motion.div>

      <DashboardGreeting className="mt-10" />
      <NotificationStrip className="mt-4" />

      <DailyRitual className="mt-8" />

      <ContinueJourneyHero className="mt-8" />

      {/* Asymmetric pair — left-heavy */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <DailyFocus />
        <TodayInHistory />
      </div>

      {/* Memory · On this day */}
      <OnThisDay variant="compact" className="mt-12" />

      {/* Editorial breath — pull quote between practical and discovery */}
      <PullQuote attribution="Your weekly reflection · this Sunday">
        Some stories ask you to finish them. Others wait quietly until you're ready to be changed.
      </PullQuote>

      {/* Discovery · Today's pick */}
      <DiscoveryHero className="mt-4" />

      <QuietRecommendations className="mt-16" />

      {/* Current chapter + challenge — right-heavy this time */}
      <div className="mt-16 grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <ChallengeCard challenge={getActiveChallenge()} />
        <GoalHero />
      </div>

      <DashboardContext className="mt-10" />

      <ContinueUniverse className="mt-16" />

      <DashboardMood className="mt-16" />
      <WeeklyReflection className="mt-6" />

      <TasteProfile className="mt-16" />

      {/* Stats — living, in a split block with interpretive copy */}
      <div className="mt-16">
        <SplitBlock
          ratio="60/40"
          primary={<LivingStats />}
          secondary={
            <div className="pt-2">
              <div className="text-[10px] uppercase tracking-[0.28em] text-primary/85">
                This is you
              </div>
              <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
                A quiet glance at your patterns
              </h2>
              <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-foreground/80">
                Not metrics — moods. The shape of how you've been spending your stories this month.
                Look softly. Nothing here demands a goal.
              </p>
            </div>
          }
        />
      </div>

      {/* Collections — editorial collage instead of yet another 4-up grid */}
      <Section
        title="Collections"
        subtitle="Stories grouped by feeling."
        action={
          <Link
            to="/app/collections"
            className="story-link text-sm text-muted-foreground hover:text-foreground"
          >
            All collections
          </Link>
        }
      >
        <Collage
          items={COLLECTIONS.slice(0, 4).map((c) => ({
            id: c.id,
            image: c.cover,
            alt: c.name,
            node: (
              <div className="rounded-2xl bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-12">
                <div className="font-display text-xl tracking-tight text-white">{c.name}</div>
                <div className="text-xs text-white/70">{c.count} items</div>
              </div>
            ),
          }))}
        />
      </Section>

      <Section title="Lately" subtitle="A small editorial timeline.">
        <MiniTimeline />
      </Section>

      {/* Recently completed */}
      <Section title="Recently completed" subtitle="The stories that just became yours.">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-6">
          {recentlyCompleted.slice(0, 6).map((m) => (
            <MediaCard key={m.id} item={m} />
          ))}
        </div>
      </Section>

      <SmartFooter className="mt-20" />
    </div>
  );
}
