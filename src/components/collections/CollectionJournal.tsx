import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { } from "@/lib/types";
import type { Collection } from "@/lib/types";
const JOURNAL: any[] = [];



export function CollectionJournal({ collection: _c }: { collection: Collection }) {
  return (
    <PremiumGlass variant="subtle">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Journal · pinned
          </div>
          <Link
            to="/app/journal"
            className="story-link text-xs text-muted-foreground hover:text-foreground"
          >
            Open journal
          </Link>
        </div>
        <ul className="mt-4 space-y-3">
          {JOURNAL.map((j) => (
            <li key={j.id} className="border-l-2 border-primary/40 pl-3">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
                {j.date} · {j.mood}
              </div>
              <div className="text-sm">{j.title}</div>
              <p className="text-[11px] text-muted-foreground">{j.excerpt}</p>
            </li>
          ))}
        </ul>
      </div>
    </PremiumGlass>
  );
}
