import { motion } from "motion/react";
import { Play, Pause, RotateCcw, CheckCircle2, BookOpen, Heart, Star } from "lucide-react";
import type { MediaMemory } from "@/lib/memory";
import { t } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Props {
  memory: MediaMemory;
  className?: string;
}

interface Step {
  icon: React.ReactNode;
  label: string;
  when: string;
}

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MemoryJourney({ memory, className }: Props) {
  const steps: Step[] = [
    { icon: <Play className="h-3 w-3" />, label: "Started", when: fmt(memory.firstExperiencedAt) },
    { icon: <Pause className="h-3 w-3" />, label: "Paused", when: "Briefly" },
    { icon: <RotateCcw className="h-3 w-3" />, label: "Resumed", when: "A week later" },
    { icon: <CheckCircle2 className="h-3 w-3" />, label: "Finished", when: fmt(memory.finishedAt) },
    {
      icon: <BookOpen className="h-3 w-3" />,
      label: "Journaled",
      when: `${memory.journalEntries} entries`,
    },
    {
      icon: <Heart className="h-3 w-3" />,
      label: "Favorited",
      when: memory.wouldRevisit ? "Yes" : "—",
    },
    {
      icon: <Star className="h-3 w-3" />,
      label: "Rewatched",
      when: memory.revisits ? `${memory.revisits}×` : "Once",
    },
  ];

  return (
    <section aria-label="Memory journey" className={cn("relative", className)}>
      <header className="mb-4 text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
        Journey
      </header>
      <ol className="relative space-y-4 border-l border-white/10 pl-5">
        {steps.map((s, i) => (
          <motion.li
            key={s.label}
            initial={{ opacity: 0, x: -4 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ ...t.normal, delay: i * 0.04 }}
            className="relative"
          >
            <span
              aria-hidden
              className="absolute -left-[27px] top-0.5 grid h-5 w-5 place-items-center rounded-full bg-background text-muted-foreground/90 ring-1 ring-white/15"
            >
              {s.icon}
            </span>
            <div className="text-sm tracking-tight">{s.label}</div>
            <div className="text-[11px] text-muted-foreground">{s.when}</div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
