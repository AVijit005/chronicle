import { cn } from "@/lib/utils";

export function EditorialFact({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
        {label}
      </div>
      <div className="font-display text-base tracking-tight">{value}</div>
    </div>
  );
}
