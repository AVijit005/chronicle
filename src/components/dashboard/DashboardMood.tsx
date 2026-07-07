import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { useInsights } from "@/hooks/use-analytics";
import { cn } from "@/lib/utils";
import { fadeBlurIn } from "@/lib/motion";

export function DashboardMood({ className }: { className?: string }) {
  const { data: insights } = useInsights();

  if (!insights) return null;

  return (
    <PremiumGlass
      variant="subtle"
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeBlurIn}
    >
      <div className="p-6">
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Current atmosphere
        </div>
        <p className="mt-3 font-display text-xl leading-snug tracking-tight">
          Your week leans toward{" "}
          <span className="text-foreground">{insights.favoriteGenre?.toLowerCase() || "exploration"}</span>. The journal sounds
          slower than usual, and you've returned to familiar worlds more than once.
        </p>
      </div>
    </PremiumGlass>
  );
}
