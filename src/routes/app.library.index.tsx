import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { SectionHeader, RevealSection } from "@/components/dashboard/SectionHeader";
import { FeaturedCollections } from "@/components/collections/FeaturedCollections";
import { MediaCard } from "@/components/media/MediaCard";

import { LibraryHero } from "@/components/library/LibraryHero";
import { InsightStrip } from "@/components/library/InsightStrip";
import { StatsGrid } from "@/components/library/StatsGrid";
import { StatusOverviewRow } from "@/components/library/StatusOverviewRow";
import { ContinueCard } from "@/components/library/ContinueCard";
import { PlanningRow } from "@/components/library/PlanningRow";
import { RecentlyFinishedTimeline } from "@/components/library/RecentlyFinishedTimeline";
import { FavoritesGallery } from "@/components/library/FavoritesGallery";
import { MemoryHighlights } from "@/components/memory/MemoryHighlights";
import { RememberAgain } from "@/components/memory/RememberAgain";
import { ComfortStories } from "@/components/discovery/ComfortStories";
import { GoalCard } from "@/components/goals/GoalCard";
import { getPrimaryGoal } from "@/lib/goals";
import { LibraryMap } from "@/components/intelligence/LibraryMap";
import { Collage } from "@/components/editorial/Collage";
import { PullQuote } from "@/components/editorial/PullQuote";

import { continueJourney, favorites, planning } from "@/lib/library";
import { MEDIA } from "@/lib/mock";

export const Route = createFileRoute("/app/library/")({
  component: LibraryIndex,
});

function LibraryIndex() {
  const cont = continueJourney().slice(0, 8);
  const plan = planning().slice(0, 5);
  const favs = favorites().slice(0, 8);
  const recentlyAdded = MEDIA.slice(0, 8);
  const wall = favs.slice(0, 4);

  return (
    <div className="space-y-16 pt-2 pb-24">
      <LibraryHero />

      <section>
        <InsightStrip />
      </section>

      <section>
        <SectionHeader
          eyebrow="Life dashboard"
          title="Where you are right now"
          subtitle="A live read on every story passing through your days."
        />
        <StatsGrid favoritesCount={favs.length} />
      </section>

      {/* Editorial memory wall — replaces 'just another grid' rhythm */}
      {wall.length >= 4 && (
        <RevealSection>
          <SectionHeader
            eyebrow="Memory wall"
            title="A glance through your archive"
            subtitle="Pinned moments — the gallery you'd hang in your own room."
          />
          <Collage
            items={wall.map((m) => ({
              id: m.id,
              image: m.poster,
              alt: m.title,
              node: (
                <div className="rounded-2xl bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-12">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-white/70">
                    {m.kind}
                  </div>
                  <div className="font-display text-xl tracking-tight text-white">{m.title}</div>
                </div>
              ),
            }))}
          />
        </RevealSection>
      )}

      <RevealSection>
        <SectionHeader
          eyebrow="Status"
          title="Status overview"
          subtitle="The seven shapes of your library."
        />
        <StatusOverviewRow />
      </RevealSection>

      {cont.length > 0 && (
        <RevealSection>
          <SectionHeader
            eyebrow="Continue"
            title="Continue Journey"
            subtitle="Pick up where you left off — across every medium."
            action={
              <Link
                to="/app/library/continue"
                className="press-scale inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
          <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-2 lg:-mx-10 lg:px-10">
            {cont.map((m) => (
              <ContinueCard key={m.id} item={m} />
            ))}
          </div>
        </RevealSection>
      )}

      {plan.length > 0 && (
        <RevealSection>
          <SectionHeader
            eyebrow="Planning"
            title="Planning Queue"
            subtitle="Stories waiting for the right night."
            action={
              <Link
                to="/app/library/planning"
                className="press-scale inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Open queue <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {plan.map((m) => (
              <PlanningRow key={m.id} item={m} />
            ))}
          </div>
        </RevealSection>
      )}

      <PullQuote attribution="The shape of an archive">
        A library isn't what you've finished. It's the company you keep across years.
      </PullQuote>

      <RevealSection>
        <SectionHeader
          eyebrow="Recently"
          title="Recently Finished"
          subtitle="The stories you closed this season."
          action={
            <Link
              to="/app/library/recently-finished"
              className="press-scale inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              See timeline <ArrowRight className="h-3 w-3" />
            </Link>
          }
        />
        <RecentlyFinishedTimeline limit={8} />
      </RevealSection>

      {favs.length > 0 && (
        <RevealSection>
          <SectionHeader
            eyebrow="Favorites"
            title="The ones you'd live again"
            subtitle="Hand-picked from every medium."
            action={
              <Link
                to="/app/library/favorites"
                className="press-scale inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Open gallery <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
          <FavoritesGallery items={favs} />
        </RevealSection>
      )}

      <RevealSection>
        <SectionHeader
          eyebrow="Recent"
          title="Recently added"
          subtitle="Newest additions to your library."
        />
        <motion.div className="-mx-6 flex gap-5 overflow-x-auto px-6 pb-2 lg:-mx-10 lg:px-10">
          {recentlyAdded.map((m) => (
            <MediaCard key={m.id} item={m} />
          ))}
        </motion.div>
      </RevealSection>

      <RevealSection>
        <MemoryHighlights />
      </RevealSection>

      <RevealSection>
        <RememberAgain />
      </RevealSection>

      <RevealSection>
        <SectionHeader
          eyebrow="Collections"
          title="Curated collections"
          subtitle="Editorial sets that map your taste."
        />
        <FeaturedCollections />
      </RevealSection>

      <RevealSection>
        <Link
          to="/app/library/all"
          className="glass group flex items-center justify-between gap-4 rounded-3xl p-6 transition hover-lift md:p-8"
        >
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.22em] text-primary/90">
              Master database
            </div>
            <div className="mt-2 font-display text-2xl tracking-tight md:text-3xl">
              All Library →
            </div>
            <p className="mt-1 max-w-lg text-sm text-muted-foreground">
              Every item across every status, every type, every collection — with full search,
              filters and sort.
            </p>
          </div>
          <ArrowRight className="h-6 w-6 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
        </Link>
      </RevealSection>

      <RevealSection>{getPrimaryGoal() && <GoalCard goal={getPrimaryGoal()!} />}</RevealSection>

      <RevealSection>
        <ComfortStories />
      </RevealSection>

      <RevealSection>
        <LibraryMap />
      </RevealSection>
    </div>
  );
}
