import { Link } from "@tanstack/react-router";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { Play, NotebookPen, Clock, BarChart3, Share2, Pin, Archive } from "lucide-react";
import type { Collection } from "@/lib/types";

export function CollectionQuickActions({ collection: _c }: { collection: Collection }) {
  return (
    <div className="flex flex-wrap gap-2">
      <PremiumButton size="sm" icon={<Play className="h-3.5 w-3.5" />}>
        Continue collection
      </PremiumButton>
      <Link to="/app/journal">
        <PremiumButton size="sm" variant="secondary" icon={<NotebookPen className="h-3.5 w-3.5" />}>
          Journal
        </PremiumButton>
      </Link>
      <Link to="/app/timeline">
        <PremiumButton size="sm" variant="secondary" icon={<Clock className="h-3.5 w-3.5" />}>
          Timeline
        </PremiumButton>
      </Link>
      <Link to="/app/analytics">
        <PremiumButton size="sm" variant="secondary" icon={<BarChart3 className="h-3.5 w-3.5" />}>
          Analytics
        </PremiumButton>
      </Link>
      <PremiumButton size="sm" variant="ghost" icon={<Share2 className="h-3.5 w-3.5" />}>
        Share
      </PremiumButton>
      <PremiumButton size="sm" variant="ghost" icon={<Pin className="h-3.5 w-3.5" />}>
        Pin
      </PremiumButton>
      <PremiumButton size="sm" variant="ghost" icon={<Archive className="h-3.5 w-3.5" />}>
        Archive
      </PremiumButton>
    </div>
  );
}
