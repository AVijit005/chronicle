import { STATUS_LABEL, STATUS_TINT, type MediaStatus } from "@/lib/library";
import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  className,
  size = "sm",
}: {
  status: MediaStatus | "favorite";
  className?: string;
  size?: "xs" | "sm";
}) {
  const label = status === "favorite" ? "Favorite" : STATUS_LABEL[status];
  const tint = STATUS_TINT[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium uppercase tracking-[0.16em]",
        size === "xs" ? "px-2 py-[3px] text-[9px]" : "px-2.5 py-1 text-[10px]",
        className,
      )}
      style={{
        background: `color-mix(in oklab, ${tint} 12%, transparent)`,
        borderColor: `color-mix(in oklab, ${tint} 30%, transparent)`,
        color: `color-mix(in oklab, ${tint} 80%, oklch(0.97 0 0))`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: tint }} />
      {label}
    </span>
  );
}
