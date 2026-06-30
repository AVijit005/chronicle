import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { COLLECTIONS } from "@/lib/mock";
import { SectionHeader, RevealSection } from "@/components/dashboard/SectionHeader";
import { CollectionsHero } from "@/components/collections/CollectionsHero";
import { FeaturedCollections } from "@/components/collections/FeaturedCollections";
import { EditorialGrid } from "@/components/collections/EditorialGrid";
import { CreateCollectionFab } from "@/components/collections/CreateCollectionFab";
import { CreateCollectionModal } from "@/components/collections/CreateCollectionModal";
import { MemoryCapsule } from "@/components/memory/MemoryCapsule";
import { CAPSULES } from "@/lib/memoryInsights";
import { DiscoveryCollections } from "@/components/discovery/DiscoveryCollections";
import { SmartCollectionCard } from "@/components/challenges/SmartCollectionCard";
import { getAllSmartCollections } from "@/lib/smartCollections";
import { RelatedJourney } from "@/components/intelligence/RelatedJourney";

export const Route = createFileRoute("/app/collections/")({
  component: CollectionsIndex,
});

function CollectionsIndex() {
  const [open, setOpen] = useState(false);
  const pinned = COLLECTIONS.filter((c) => c.pinned);
  const recent = [...COLLECTIONS].sort((a, b) => a.updatedAt!.localeCompare(b.updatedAt!));
  const categories = Array.from(
    new Set(COLLECTIONS.map((c) => c.category).filter(Boolean)),
  ) as string[];

  return (
    <div className="-mt-3 pb-24">
      <CollectionsHero />

      <RevealSection>
        <SectionHeader
          eyebrow="Featured"
          title="Editor's shelves"
          subtitle="Larger-than-life collections worth opening tonight."
        />
        <FeaturedCollections />
      </RevealSection>

      <RevealSection>
        <SectionHeader eyebrow="Pinned" title="Always within reach" />
        <EditorialGrid collections={pinned} />
      </RevealSection>

      <RevealSection>
        <SectionHeader eyebrow="Recent activity" title="Recently updated" />
        <EditorialGrid collections={recent} />
      </RevealSection>

      <RevealSection>
        <SectionHeader eyebrow="Browse" title="By category" />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className="glass-subtle rounded-full px-4 py-2 text-xs hover:bg-white/[0.08] press-scale"
            >
              {cat}
            </button>
          ))}
        </div>
      </RevealSection>

      <RevealSection>
        <SectionHeader
          eyebrow="Memory"
          title="Memory capsules"
          subtitle="Periods and weekends grouped into one feeling."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CAPSULES.map((c) => (
            <MemoryCapsule key={c.id} capsule={c} />
          ))}
        </div>
      </RevealSection>

      <RevealSection>
        <SectionHeader eyebrow="Smart" title="Built from your patterns" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {getAllSmartCollections()
            .slice(0, 6)
            .map((c) => (
              <SmartCollectionCard key={c.id} collection={c} />
            ))}
        </div>
      </RevealSection>

      <RevealSection>
        <DiscoveryCollections />
      </RevealSection>

      <RevealSection>
        <RelatedJourney mediaId="interstellar" />
      </RevealSection>

      <CreateCollectionFab onClick={() => setOpen(true)} />
      <CreateCollectionModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
