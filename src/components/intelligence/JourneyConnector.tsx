import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function JourneyConnector({ label, className }: { label?: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70",
        className,
      )}
    >
      <ArrowRight className="h-3 w-3" />
      {label && <span>{label}</span>}
    </div>
  );
}
