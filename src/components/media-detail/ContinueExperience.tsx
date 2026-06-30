import { motion } from "motion/react";
import { Play, RefreshCw } from "lucide-react";
import type { MediaItem } from "@/lib/mock";
import { MEDIA_DETAIL } from "@/lib/mock";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumProgress } from "@/components/ui/PremiumProgress";

export function ContinueExperience({ item }: { item: MediaItem }) {
  const d = MEDIA_DETAIL[item.id];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass relative overflow-hidden rounded-3xl p-6 md:p-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-30 blur-3xl"
        style={{ background: item.accent }}
      />
      <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {d.continueLabel}
          </div>
          <h3 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">{item.title}</h3>
          <div className="mt-1 text-sm text-muted-foreground">{d.continueDetail}</div>
          <div className="mt-5">
            <PremiumProgress value={item.progress ?? 0} accent={item.accent} />
            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
              <span>{item.progress ?? 0}%</span>
              <span>{item.runtime}</span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 md:flex-row">
          <PremiumButton variant="primary" icon={<Play className="h-4 w-4 fill-black" />}>
            Continue
          </PremiumButton>
          <PremiumButton variant="secondary" icon={<RefreshCw className="h-4 w-4" />}>
            Update progress
          </PremiumButton>
        </div>
      </div>
    </motion.div>
  );
}
