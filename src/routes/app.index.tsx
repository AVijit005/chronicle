import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { Plus, Search as SearchIcon, NotebookPen, Layers, ChevronRight } from "lucide-react";
import { CinematicHero } from "@/components/media/CinematicHero";
import { MediaCard } from "@/components/media/MediaCard";
import { Section } from "@/components/common/Section";
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
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { useDashboard } from "@/hooks/use-analytics";
import { useCollections } from "@/hooks/use-collections";
import { adaptContinueItem } from "@/lib/adapters/media";
import { adaptCollectionResponse } from "@/lib/adapters/collection";
import { useMediaActions } from "@/lib/store/MediaActionsContext";
import { ShimmerSkeleton } from "@/components/ui/ShimmerSkeleton";
import { PremiumErrorState } from "@/components/common/PremiumErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { t as motionT } from "@/lib/motion";

export const Route = createFileRoute("/app/")({
  component: Home,
});

function Home() {
  const { data: dashboard, isLoading, isError, error } = useDashboard();
  const { data: collections } = useCollections();
  const navigate = useNavigate();
  const { openAdd } = useMediaActions();
  const reduced = useReducedMotion();

  if (isLoading) {
    return (
      <div className="pt-2 space-y-8">
        <ShimmerSkeleton className="h-[520px] rounded-b-[40px]" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ShimmerSkeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
        <ShimmerSkeleton className="h-24 rounded-3xl" />
        <ShimmerSkeleton className="h-64 rounded-3xl" />
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <ShimmerSkeleton className="h-48 rounded-3xl" />
          <ShimmerSkeleton className="h-48 rounded-3xl" />
        </div>
        <ShimmerSkeleton className="h-48 rounded-3xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-2">
        <PremiumErrorState
          title="Couldn't load your dashboard"
          description={error?.message ?? "Something went wrong. Please try again."}
        />
      </div>
    );
  }

  // Use real data from API, with fallback for empty states
  const continueItems = dashboard?.continueWatching ?? [];
  const recentlyCompletedItems = dashboard?.recentlyCompleted ?? [];
  const collectionList = collections?.map(adaptCollectionResponse) ?? [];

  // Pick a featured item from continue watching, or first recently completed
  const featuredItem = continueItems[0]
    ? adaptContinueItem(continueItems[0])
    : recentlyCompletedItems[0]
      ? adaptContinueItem(recentlyCompletedItems[0] as any)
      : null;

  return (
    <div className="pt-2">
      {featuredItem ? (
        <CinematicHero item={featuredItem as any} />
      ) : (
        <div className="glass-strong rounded-b-[40px] p-16 text-center">
          <p className="text-muted-foreground">Add some media to your library to see your dashboard come alive.</p>
        </div>
      )}

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4"
      >
        {[
          { icon: Plus, label: "Add media", hint: "Press ⌘N", onClick: () => openAdd() },
          { icon: SearchIcon, label: "Spotlight", hint: "Press ⌘K", onClick: () => window.dispatchEvent(new KeyboardEvent('keydown', { metaKey: true, key: 'k' })) },
          { icon: NotebookPen, label: "Journal entry", hint: "Press ⇧J", onClick: () => navigate({ to: '/app/journal' }) },
          { icon: Layers, label: "New collection", hint: "Press ⇧C", onClick: () => navigate({ to: '/app/collections' }) },
        ].map((q, i) => (
          <motion.button
            key={i}
            onClick={q.onClick}
            whileHover={reduced ? undefined : { scale: 1.02, y: -4, transition: motionT.spring }}
            whileTap={reduced ? undefined : { scale: 0.97, y: 0, transition: motionT.spring }}
            className="glass group flex items-center gap-3 rounded-2xl p-4 text-left transition"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06]">
              <q.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm">{q.label}</div>
              <div className="text-[11px] text-muted-foreground">{q.hint}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
          </motion.button>
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

      {/* Stats — living, in a master glass panel */}
      <div className="mt-16 pointer-events-auto">
        <PremiumGlass interactive className="group/master flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 p-6 md:p-10 rounded-[2rem]">
          {/* Left Column: Context Typography */}
          <div className="flex-1 max-w-md">
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

          {/* Right Column: The 4 Metric Pills */}
          <div className="flex-[1.2] w-full">
            <LivingStats />
          </div>
        </PremiumGlass>
      </div>

      {/* Collections — editorial collage instead of yet another 4-up grid */}
      {collectionList.length > 0 && (
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
            items={collectionList.slice(0, 4).map((c) => ({
              id: c.id,
              image: c.cover ?? "",
              alt: c.name,
              node: (
                <div className="rounded-2xl bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-12">
                  <div className="font-display text-xl tracking-tight text-white">{c.name}</div>
                  <div className="text-xs text-white/70">{c.itemCount} items</div>
                </div>
              ),
            }))}
          />
        </Section>
      )}

      <Section title="Lately" subtitle="A small editorial timeline.">
        <MiniTimeline />
      </Section>

      {/* Recently completed */}
      {recentlyCompletedItems.length > 0 && (
        <Section title="Recently completed" subtitle="The stories that just became yours.">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-6">
            {recentlyCompletedItems.slice(0, 6).map((item) => (
              <MediaCard key={(item as any).libraryId} item={adaptContinueItem(item as any)} />
            ))}
          </div>
        </Section>
      )}

      <SmartFooter className="mt-20" />
    </div>
  );
}
