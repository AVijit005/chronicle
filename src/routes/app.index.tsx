import { createFileRoute, Link } from "@tanstack/react-router";
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
import { InteractiveWidgets } from "@/components/dashboard/QuickActions";
import { PullQuote } from "@/components/editorial/PullQuote";
import { Collage } from "@/components/editorial/Collage";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { useDashboard, useInsights, useOverview, useDiscovery, useChallenges, useIntelligence } from "@/hooks/use-analytics";
import { useCollections } from "@/hooks/use-collections";
import { adaptContinueItem, activityToContinueItem } from "@/lib/adapters/media";
import { adaptCollectionResponse } from "@/lib/adapters/collection";
import { adaptInsights, adaptOverview } from "@/lib/adapters/analytics";
import { ShimmerSkeleton } from "@/components/ui/ShimmerSkeleton";
import { PremiumErrorState } from "@/components/common/PremiumErrorState";

export const Route = createFileRoute("/app/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Dashboard — Chronicle" },
      { name: "description", content: "Your personal media headquarters. Continue stories, track progress, and discover what to watch next." },
      { property: "og:title", content: "Chronicle Dashboard" },
      { property: "og:description", content: "Your personal media headquarters." },
    ],
  }),
});

function Home() {
  const { data: dashboard, isLoading, isError, error } = useDashboard();
  const { data: insights } = useInsights();
  const { data: overview } = useOverview();
  const { data: discovery } = useDiscovery();
  const { data: challengesData } = useChallenges();
  const { data: intelligence } = useIntelligence();
  const { data: collections } = useCollections();

  if (isLoading) {
    return (
      <div className="pt-2 space-y-8">
        <ShimmerSkeleton className="h-[520px] rounded-b-[40px]" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <ShimmerSkeleton key={i} className="h-20 rounded-2xl" />)}
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
        <PremiumErrorState title="Couldn't load your dashboard" description={error?.message ?? "Something went wrong. Please try again."} />
      </div>
    );
  }

  const continueItems = dashboard?.continueWatching ?? [];
  const recentlyCompletedItems = dashboard?.recentlyCompleted ?? [];
  const collectionList = collections?.map(adaptCollectionResponse) ?? [];
  const uiInsights = insights ? adaptInsights(insights) : null;
  const uiOverview = overview ? adaptOverview(overview) : null;

  const featuredItem = continueItems[0]
    ? adaptContinueItem(continueItems[0])
    : recentlyCompletedItems[0]
      ? adaptContinueItem(activityToContinueItem(recentlyCompletedItems[0]))
      : null;

  const QUOTES = [
    { quote: "Some stories ask you to finish them. Others wait quietly until you're ready to be changed.", attr: "Your weekly reflection" },
    { quote: "The stories we return to say more about us than the stories we finish.", attr: "Your taste profile" },
    { quote: "Memory isn't about perfect recall. It's about what chooses to stay.", attr: "From your journal" },
    { quote: "Every library is a self-portrait painted in other people's stories.", attr: "A quiet thought" },
  ];
  const dailyQuote = QUOTES[new Date().getDate() % QUOTES.length];

  return (
    <div className="pt-2">
      {featuredItem ? <CinematicHero item={featuredItem} /> : (
        <div className="glass-strong rounded-b-[40px] p-16 text-center">
          <p className="text-muted-foreground">Add some media to your library to see your dashboard come alive.</p>
        </div>
      )}

      <InteractiveWidgets />
      <DashboardGreeting className="mt-10" />
      <NotificationStrip className="mt-4" />
      <DailyRitual className="mt-8" insights={uiInsights} />
      <ContinueJourneyHero className="mt-8" />
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <DailyFocus />
        <TodayInHistory />
      </div>
      <OnThisDay variant="compact" className="mt-12" />
      <PullQuote attribution={dailyQuote.attr}>{dailyQuote.quote}</PullQuote>
      <DiscoveryHero className="mt-4" recommendedToday={discovery?.recommendedToday ?? null} />
      <QuietRecommendations className="mt-16" insights={uiInsights} />
      <div className="mt-16 grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <ChallengeCard challenge={(challengesData?.challenges?.[0] ?? getActiveChallenge()) as any} />
        <GoalHero />
      </div>
      <DashboardContext className="mt-10" />
      <ContinueUniverse className="mt-16" franchises={discovery?.continueFranchises ?? []} />
      <DashboardMood className="mt-16" />
      <WeeklyReflection className="mt-6" overview={uiOverview} />
      <TasteProfile className="mt-16" tasteProfile={intelligence?.tasteProfile ?? null} />
      <div className="mt-16 pointer-events-auto">
        <PremiumGlass interactive variant="strong" glow="oklch(0.72 0.18 255 / 0.2)" className="group/master rounded-[2.5rem]">
          <div className="flex flex-col text-left p-10 w-full">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-primary/85 mb-3">This is you</div>
              <h2 className="font-display text-3xl tracking-tight md:text-4xl">A quiet glance at your patterns</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/80">Not metrics — moods. The shape of how you've been spending your stories this month. Look softly. Nothing here demands a goal.</p>
            </div>
            <div className="flex flex-row flex-wrap gap-5 mt-8">
              <LivingStats className="flex flex-row flex-wrap gap-5 m-0 p-0" />
            </div>
          </div>
        </PremiumGlass>
      </div>
      {collectionList.length > 0 && (
        <Section title="Collections" subtitle="Stories grouped by feeling." action={<Link to="/app/collections" className="story-link text-sm text-muted-foreground hover:text-foreground">All collections</Link>}>
          <Collage items={collectionList.slice(0, 4).map((c) => ({ id: c.id, image: c.cover ?? "", alt: c.name, node: (<div className="rounded-2xl bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-12"><div className="font-display text-xl tracking-tight text-white">{c.name}</div><div className="text-xs text-white/70">{c.itemCount} items</div></div>) }))} />
        </Section>
      )}
      <Section title="Lately" subtitle="A small editorial timeline.">
        <MiniTimeline />
      </Section>
      {recentlyCompletedItems.length > 0 && (
        <Section title="Recently completed" subtitle="The stories that just became yours.">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-6">
            {recentlyCompletedItems.slice(0, 6).map((item) => {
              const uiItem = adaptContinueItem(activityToContinueItem(item));
              return <MediaCard key={uiItem.id} item={uiItem} />;
            })}
          </div>
        </Section>
      )}
      <SmartFooter className="mt-20" />
    </div>
  );
}
