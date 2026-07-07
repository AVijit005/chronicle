import { motion } from "motion/react";
import { Compass } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { cn } from "@/lib/utils";
import { fadeBlurIn } from "@/lib/motion";

export function QuietRecommendations({ className }: { className?: string }) {
  return (
    <section aria-label="Because today" className={cn(className)}>
      <div className="mb-4">
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Because today…
        </div>
        <h2 className="font-display text-2xl tracking-tight">Quiet recommendations</h2>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeBlurIn}
      >
        <PremiumGlass variant="subtle" className="flex flex-col items-center gap-3 p-8 text-center text-muted-foreground">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] text-primary ring-1 ring-white/10">
            <Compass className="h-4 w-4" />
          </span>
          Nothing quiet to surface yet — keep exploring and this space will start noticing patterns.
        </PremiumGlass>
      </motion.div>
    </section>
  );
}
