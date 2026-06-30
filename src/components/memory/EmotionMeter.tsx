import type { EmotionScores } from "@/lib/memoryJournal";
import { PremiumProgress } from "@/components/ui/PremiumProgress";
import { cn } from "@/lib/utils";

interface Props {
  scores: EmotionScores;
  className?: string;
}

const ORDER: { key: keyof EmotionScores; label: string }[] = [
  { key: "comfort", label: "Comfort" },
  { key: "excitement", label: "Excitement" },
  { key: "sadness", label: "Sadness" },
  { key: "wonder", label: "Wonder" },
  { key: "inspiration", label: "Inspiration" },
  { key: "addiction", label: "Addiction" },
  { key: "relaxation", label: "Relaxation" },
];

export function EmotionMeter({ scores, className }: Props) {
  return (
    <section aria-label="Emotional scores" className={cn("space-y-3", className)}>
      <header className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
        How it felt
      </header>
      <ul className="space-y-2.5">
        {ORDER.map(({ key, label }) => (
          <li key={key} className="grid grid-cols-[110px_1fr_36px] items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/85">
              {label}
            </span>
            <PremiumProgress value={Math.round(scores[key] * 100)} height={3} />
            <span className="text-right text-[11px] tabular-nums text-muted-foreground">
              {Math.round(scores[key] * 100)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
