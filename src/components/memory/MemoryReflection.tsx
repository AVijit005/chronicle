import type { MemoryReflectionData } from "@/lib/memoryJournal";
import { cn } from "@/lib/utils";

interface Props {
  reflection: MemoryReflectionData;
  className?: string;
}

const QS: { key: keyof MemoryReflectionData; q: string }[] = [
  { key: "changed", q: "How did this change you?" },
  { key: "recommend", q: "Would you recommend it?" },
  { key: "revisit", q: "Would you revisit it?" },
  { key: "audience", q: "Who would enjoy this?" },
];

export function MemoryReflection({ reflection, className }: Props) {
  return (
    <section aria-label="Reflection" className={cn("max-w-prose space-y-5", className)}>
      <header className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
        Reflection
      </header>
      {QS.map(({ key, q }) => (
        <div key={key}>
          <h4 className="font-display text-base tracking-tight text-foreground/85">{q}</h4>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{reflection[key]}</p>
        </div>
      ))}
    </section>
  );
}
