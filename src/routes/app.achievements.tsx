import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";
import { Flame, Film, BookOpen, Layers } from "lucide-react";

export const Route = createFileRoute("/app/achievements")({ component: Page });

const ICONS = { Flame, Film, BookOpen, Layers };

function Page() {
  const items = [
    {
      name: "The long week",
      description: "A week spent deep inside one story",
      icon: "Flame" as const,
      unlocked: true,
    },
    {
      name: "A hundred films in",
      description: "Quietly, you crossed a hundred",
      icon: "Film" as const,
      unlocked: true,
    },
    {
      name: "Twenty-five books, one year",
      description: "A reader's year, by any measure",
      icon: "BookOpen" as const,
      unlocked: false,
    },
    {
      name: "Ten collections curated",
      description: "You don't just watch — you arrange",
      icon: "Layers" as const,
      unlocked: true,
    },
  ];
  return (
    <ComingSoon
      eyebrow="Milestones"
      title="The quiet markers along the way."
      description="Not trophies, not streaks to defend. Small acknowledgements for the kind of attention you've already been paying."
      preview={
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((a) => {
            const Icon = ICONS[a.icon];
            return (
              <div key={a.name} className="glass flex items-center gap-4 rounded-2xl p-5">
                <div
                  className={
                    "grid h-14 w-14 place-items-center rounded-2xl " +
                    (a.unlocked
                      ? "bg-gradient-to-br from-primary/30 to-secondary/30 text-foreground"
                      : "bg-white/5 text-muted-foreground")
                  }
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-base tracking-tight">{a.name}</div>
                  <div className="mt-0.5 text-[13px] leading-relaxed text-foreground/65">
                    {a.description}
                  </div>
                </div>
                <div
                  className={
                    "text-[10px] uppercase tracking-[0.22em] " +
                    (a.unlocked ? "text-success" : "text-muted-foreground/70")
                  }
                >
                  {a.unlocked ? "Reached" : "Ahead"}
                </div>
              </div>
            );
          })}
        </div>
      }
    />
  );
}
