import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import {
  Film,
  NotebookPen,
  Trophy,
  Target,
  Layers,
  CheckCircle2,
  Sparkles,
  Heart,
} from "lucide-react";
import { getActivityFeed, type Activity } from "@/lib/activityFeed";
import { cn } from "@/lib/utils";

const ICONS: Record<Activity["kind"], typeof Film> = {
  Journal: NotebookPen,
  Complete: CheckCircle2,
  Achievement: Trophy,
  Collection: Layers,
  Timeline: Film,
  Goal: Target,
  Discovery: Sparkles,
  Memory: Sparkles,
  Favorite: Heart,
};

export function ActivityFeed({ className, limit = 10 }: { className?: string; limit?: number }) {
  const feed = getActivityFeed().slice(0, limit);
  return (
    <PremiumGlass variant="subtle" className={cn(className)}>
      <div className="p-5">
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Activity
        </div>
        <ol className="mt-4 space-y-3">
          {feed.map((a) => {
            const Icon = ICONS[a.kind];
            const node = (
              <div className="flex items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm">{a.label}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                    {a.when} · {a.kind}
                  </div>
                </div>
              </div>
            );
            return (
              <li key={a.id}>
                {a.mediaId ? (
                  <Link to="/app/media/$id" params={{ id: a.mediaId }} className="block">
                    {node}
                  </Link>
                ) : (
                  node
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </PremiumGlass>
  );
}
