import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import type { SmartCollection } from "@/lib/smartCollections";
import { cn } from "@/lib/utils";

export function SmartCollectionCard({
  collection: c,
  className,
}: {
  collection: SmartCollection;
  className?: string;
}) {
  const covers = c.items.slice(0, 4);
  return (
    <PremiumGlass variant="subtle" className={cn("h-full", className)}>
      <Link to="/app/collections" className="block">
        <div className="grid aspect-[16/9] grid-cols-2 grid-rows-2 gap-px overflow-hidden rounded-t-3xl">
          {covers.map((m) => (
            <img key={m.id} src={m.poster} alt="" className="h-full w-full object-cover" />
          ))}
          {covers.length === 0 && <div className="col-span-2 row-span-2 bg-white/[0.04]" />}
        </div>
        <article className="p-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">
            Smart collection
          </div>
          <div className="mt-1 font-display text-base tracking-tight">{c.name}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">{c.reason}</p>
          <p className="mt-2 text-[11px] italic text-foreground/70">{c.insight}</p>
          <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            <span>{c.items.length} stories</span>
            <span>{c.updatedAt}</span>
          </div>
        </article>
      </Link>
    </PremiumGlass>
  );
}
