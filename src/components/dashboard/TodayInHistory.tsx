import { CalendarClock } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { useDashboard } from "@/hooks/use-analytics";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function TodayInHistory({ className }: { className?: string }) {
  const { data: dashboard } = useDashboard();
  const memories = dashboard?.recentMemories ?? [];

  if (memories.length === 0) {
    return null;
  }

  return (
    <PremiumGlass variant="subtle" className={className}>
      <div className="p-6 md:p-7">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <CalendarClock className="h-3 w-3" /> Recent Memories
        </div>
        <ol className="mt-4 space-y-3">
          {memories.map((e) => {
            const when = formatDistanceToNow(new Date(e.date), { addSuffix: true });
            const title = e.metadata?.mediaTitle as string | undefined;
            
            return (
              <li key={e.id} className="flex items-center gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-primary/75">
                    {when}
                  </div>
                  <div className="text-sm">
                    {e.title} {title && <span className="text-muted-foreground">— {title}</span>}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </PremiumGlass>
  );
}
