import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getCollectionInsights } from "@/lib/collectionInsights";
import type { Collection } from "@/lib/types";

export function CollectionInsights({ collection }: { collection: Collection }) {
  const insights = getCollectionInsights(collection);
  return (
    <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {insights.map((i) => (
        <li key={i.label}>
          {i.mediaId ? (
            <Link to="/app/media/$id" params={{ id: i.mediaId }}>
              <Card label={i.label} title={i.title} subtitle={i.subtitle} />
            </Link>
          ) : (
            <Card label={i.label} title={i.title} subtitle={i.subtitle} />
          )}
        </li>
      ))}
    </ul>
  );
}

function Card({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <PremiumGlass variant="subtle">
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">{label}</div>
        <div className="mt-1 font-display text-base tracking-tight">{title}</div>
        {subtitle && <p className="mt-1 text-[11px] text-muted-foreground">{subtitle}</p>}
      </div>
    </PremiumGlass>
  );
}
