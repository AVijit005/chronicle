import { cn } from "@/lib/utils";

export function ImportanceBadge({
  level,
  className,
}: {
  level: number /* 0..1 */;
  className?: string;
}) {
  const label =
    level > 0.8 ? "Pivotal" : level > 0.6 ? "Important" : level > 0.4 ? "Notable" : "Quiet";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em]",
        className,
      )}
    >
      {label}
    </span>
  );
}
