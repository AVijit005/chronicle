import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MemoryChipVariant = "mood" | "season" | "weather" | "companion" | "location" | "impact";

interface Props {
  variant: MemoryChipVariant;
  label: string;
  icon?: ReactNode;
  className?: string;
}

const labelByVariant: Record<MemoryChipVariant, string> = {
  mood: "Mood",
  season: "Season",
  weather: "Weather",
  companion: "With",
  location: "Where",
  impact: "Impact",
};

export function MemoryChip({ variant, label, icon, className }: Props) {
  return (
    <span
      aria-label={`${labelByVariant[variant]}: ${label}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] tracking-tight",
        "bg-white/[0.04] text-foreground/80 ring-1 ring-white/10 backdrop-blur-md",
        className,
      )}
    >
      {icon && <span className="opacity-70">{icon}</span>}
      <span className="uppercase tracking-[0.16em] text-muted-foreground/80">
        {labelByVariant[variant]}
      </span>
      <span className="text-foreground/90">{label}</span>
    </span>
  );
}
