import type { MediaMemory } from "@/lib/memory";
import { cn } from "@/lib/utils";

interface Props {
  memory: MediaMemory;
  className?: string;
}

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MemoryMetadata({ memory, className }: Props) {
  const items: { label: string; value: string }[] = [
    { label: "Started", value: fmt(memory.firstExperiencedAt) },
    { label: "Finished", value: fmt(memory.finishedAt) },
    { label: "Days spent", value: `${memory.daysSpent}` },
    { label: "Revisited", value: memory.revisits ? `${memory.revisits}×` : "—" },
    { label: "Journal", value: `${memory.journalEntries} entries` },
    { label: "Collections", value: `${memory.collectionCount}` },
    { label: "Timeline", value: `${memory.timelineAppearances} marks` },
  ];
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-3 text-[11px] sm:grid-cols-3 md:grid-cols-7",
        className,
      )}
      aria-label="Memory metadata"
    >
      {items.map((it) => (
        <div key={it.label} className="flex flex-col">
          <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            {it.label}
          </dt>
          <dd className="mt-1 text-foreground/85">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}
