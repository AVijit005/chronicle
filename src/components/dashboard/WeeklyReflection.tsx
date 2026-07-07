import { NotebookPen } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { cn } from "@/lib/utils";
import { fadeBlurIn } from "@/lib/motion";

export function WeeklyReflection({ className }: { className?: string }) {
  return (
    <PremiumGlass
      variant="subtle"
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeBlurIn}
    >
      <div className="flex items-start gap-3 p-6">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-primary ring-1 ring-white/10">
          <NotebookPen className="h-4 w-4" />
        </span>
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            This week, gently
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Nothing gathered yet this week — check back once there's a little more to reflect on.
          </div>
        </div>
      </div>
    </PremiumGlass>
  );
}
