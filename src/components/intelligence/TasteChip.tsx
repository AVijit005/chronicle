import { cn } from "@/lib/utils";

export function TasteChip({
  label,
  count,
  className,
}: {
  label: string;
  count?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1 text-[11px] text-foreground/80",
        className,
      )}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className="text-muted-foreground/70 tabular-nums">{count}</span>
      )}
    </span>
  );
}
