import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { Film, NotebookPen, Trophy, Target, Layers, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS: { icon: typeof Film; label: string; when: string }[] = [
  { icon: Film, label: "Watched Dune: Part Two", when: "Yesterday" },
  { icon: NotebookPen, label: "Journaled about Interstellar", when: "2d" },
  { icon: Trophy, label: "Earned Marathoner", when: "2d" },
  { icon: CheckCircle2, label: "Completed Succession", when: "4d" },
  { icon: Layers, label: "Added 3 stories to Weekend Comfort", when: "5d" },
  { icon: Target, label: "Reached 70% of Read 20 books", when: "6d" },
  { icon: Film, label: "Started Chainsaw Man", when: "1w" },
  { icon: NotebookPen, label: "Journal: Sunja's chapter", when: "1w" },
  { icon: CheckCircle2, label: "Completed Dark Side of the Moon", when: "2w" },
  { icon: Layers, label: "Created The Nolan Universe", when: "3w" },
];

export function MiniTimeline({ className }: { className?: string }) {
  return (
    <PremiumGlass variant="subtle" className={className}>
      <div className="p-6">
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Lately</div>
        <ol className="mt-4 space-y-3 border-l border-white/10 pl-5">
          {ITEMS.map((i) => (
            <li key={i.label} className="relative">
              <span className="absolute -left-[26px] top-1 grid h-4 w-4 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10">
                <i.icon className="h-2.5 w-2.5 text-primary" />
              </span>
              <div className="text-sm">{i.label}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                {i.when}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </PremiumGlass>
  );
}
