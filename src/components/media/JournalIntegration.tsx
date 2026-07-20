import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { JOURNAL } from "@/lib/types";
import { NotebookPen } from "lucide-react";
import type { MediaItem } from "@/lib/types";

export function JournalIntegration({ item }: { item: MediaItem }) {
  const entries = JOURNAL.slice(0, 3);
  return (
    <PremiumGlass variant="subtle">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Journal
          </div>
          <Link to="/app/journal">
            <PremiumButton
              size="sm"
              variant="secondary"
              icon={<NotebookPen className="h-3.5 w-3.5" />}
            >
              New entry
            </PremiumButton>
          </Link>
        </div>
        <ul className="mt-4 space-y-3">
          {entries.map((j) => (
            <li key={j.id} className="border-l-2 border-primary/40 pl-3">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/75">
                {j.date} · {j.mood}
              </div>
              <div className="text-sm">{j.title}</div>
              <p className="text-[11px] text-muted-foreground">{j.excerpt}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-muted-foreground">About {item.title}.</p>
      </div>
    </PremiumGlass>
  );
}
