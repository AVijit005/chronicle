import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getCollectionIntelligence, getCollectionItems } from "@/lib/collectionEngine";
import type { Collection } from "@/lib/types";

export function CollectionAnalyticsPreview({ collection }: { collection: Collection }) {
  const intel = getCollectionIntelligence(collection);
  const items = getCollectionItems(collection);
  const stats = [
    { label: "Items", value: items.length },
    { label: "Avg rating", value: intel.averageRating.toFixed(1) },
    { label: "Completion", value: `${intel.completionPct}%` },
    { label: "Memory density", value: Math.round(intel.memoryDensity * 100) + "%" },
    { label: "Journal density", value: intel.journalDensity.toFixed(1) },
    { label: "Rewatch rate", value: intel.rewatchRate.toFixed(1) },
    { label: "Growth", value: intel.growthRate },
    { label: "Trend", value: intel.activityTrend },
  ];
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((s) => (
        <li key={s.label}>
          <PremiumGlass variant="subtle">
            <div className="p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-1 font-display text-lg tracking-tight">{s.value}</div>
            </div>
          </PremiumGlass>
        </li>
      ))}
    </ul>
  );
}
