import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { cn } from "@/lib/utils";

export function InsightCard({
  children,
  eyebrow,
  className,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  className?: string;
}) {
  return (
    <PremiumGlass variant="subtle" className={cn("h-full", className)}>
      <div className="p-4">
        {eyebrow && (
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">{eyebrow}</div>
        )}
        <div className="mt-1 text-sm leading-relaxed text-foreground/85">{children}</div>
      </div>
    </PremiumGlass>
  );
}
