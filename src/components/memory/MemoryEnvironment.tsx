import type { MediaMemory } from "@/lib/memory";
import type { MemoryEnvironmentData } from "@/lib/memoryJournal";
import { MemoryChip } from "./MemoryChip";
import { cn } from "@/lib/utils";

interface Props {
  memory: MediaMemory;
  environment: MemoryEnvironmentData;
  className?: string;
}

export function MemoryEnvironment({ memory, environment, className }: Props) {
  return (
    <section aria-label="Environment" className={cn("flex flex-wrap gap-1.5", className)}>
      <MemoryChip variant="season" label={memory.season} />
      <MemoryChip variant="weather" label={memory.weather} />
      <MemoryChip variant="location" label={memory.location} />
      <MemoryChip variant="mood" label={environment.timeOfDay} />
      <MemoryChip variant="impact" label={environment.occasion} />
      <MemoryChip variant="location" label={environment.travel} />
    </section>
  );
}
