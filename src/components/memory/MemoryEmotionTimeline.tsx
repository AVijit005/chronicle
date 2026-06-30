import { motion } from "motion/react";
import type { EmotionArcNode } from "@/lib/memoryJournal";
import { t } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Props {
  nodes: EmotionArcNode[];
  className?: string;
}

export function MemoryEmotionTimeline({ nodes, className }: Props) {
  if (!nodes.length) return null;
  return (
    <section aria-label="Emotional journey" className={cn("relative", className)}>
      <ol className="relative flex flex-col gap-5">
        <span
          aria-hidden
          className="pointer-events-none absolute left-[7px] top-2 bottom-2 w-px bg-white/10"
        />
        {nodes.map((n, i) => (
          <motion.li
            key={`${n.label}-${i}`}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ ...t.normal, delay: i * 0.05 }}
            className="relative flex items-start gap-4 pl-1"
          >
            <span
              aria-hidden
              className="relative mt-1.5 grid h-[15px] w-[15px] flex-none place-items-center rounded-full bg-background ring-1 ring-white/15"
            >
              <span
                className="h-[7px] w-[7px] rounded-full bg-foreground/70"
                style={{ opacity: 0.4 + n.intensity * 0.6 }}
              />
            </span>
            <div>
              <div className="text-sm tracking-tight text-foreground/90">{n.label}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{n.caption}</div>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
