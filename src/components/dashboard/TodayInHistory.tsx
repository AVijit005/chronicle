import { CalendarClock } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { MEDIA } from "@/lib/mock";
import { cn } from "@/lib/utils";

const ENTRIES = [
  { when: "One year ago today", text: "You finished Interstellar.", id: "interstellar" },
  { when: "Two years ago", text: "You started One Piece.", id: "one-piece" },
  { when: "Three years ago", text: "Your first journal about exams.", id: "harry-potter" },
  { when: "Four years ago", text: "Your first completed anime.", id: "one-piece" },
];

export function TodayInHistory({ className }: { className?: string }) {
  return (
    <PremiumGlass variant="subtle" className={className}>
      <div className="p-6 md:p-7">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <CalendarClock className="h-3 w-3" /> Today in history
        </div>
        <ol className="mt-4 space-y-3">
          {ENTRIES.map((e) => {
            const m = MEDIA.find((x) => x.id === e.id);
            return (
              <li key={e.text} className="flex items-center gap-3">
                {m && (
                  <img
                    src={m.poster}
                    alt=""
                    className="h-10 w-7 rounded-md object-cover ring-1 ring-white/10"
                  />
                )}
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-primary/75">
                    {e.when}
                  </div>
                  <div className="text-sm">{e.text}</div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </PremiumGlass>
  );
}
