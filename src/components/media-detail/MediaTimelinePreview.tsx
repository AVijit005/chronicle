import { motion } from "motion/react";
import { Play, Pause, RotateCcw, Check, NotebookPen, FolderPlus } from "lucide-react";
import type { MediaItem } from "@/lib/mock";
import { MEDIA_DETAIL } from "@/lib/mock";

const ICONS = {
  started: Play,
  paused: Pause,
  continued: RotateCcw,
  completed: Check,
  journal: NotebookPen,
  collection: FolderPlus,
} as const;

export function MediaTimelinePreview({ item }: { item: MediaItem }) {
  const tl = MEDIA_DETAIL[item.id].timeline;
  return (
    <div className="relative">
      <span
        aria-hidden
        className="absolute left-[19px] top-2 bottom-2 w-px"
        style={{
          background: "linear-gradient(180deg, transparent, oklch(1 0 0 / 0.15), transparent)",
        }}
      />
      <ul className="space-y-3">
        {tl.map((ev, i) => {
          const Icon = ICONS[ev.type];
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center gap-4"
            >
              <div className="glass relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="glass-subtle flex-1 rounded-2xl px-4 py-3">
                <div className="text-sm">{ev.label}</div>
                <div className="text-[11px] text-muted-foreground">{ev.when}</div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
