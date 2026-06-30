import { motion } from "motion/react";
import { CountUp } from "@/components/landing/CountUp";
import type { MediaItem } from "@/lib/mock";
import { MEDIA_DETAIL } from "@/lib/mock";
import { Repeat, Clock, Eye, History } from "lucide-react";

export function MediaStatistics({ item }: { item: MediaItem }) {
  const s = MEDIA_DETAIL[item.id].stats;
  const cards = [
    { icon: Repeat, label: "Rewatches", value: s.rewatches, suffix: "" },
    { icon: Clock, label: "Total hours", value: s.totalHours, suffix: "h" },
    { icon: Eye, label: "First seen", text: s.firstSeen },
    { icon: History, label: "Last revisited", text: s.lastSeen },
  ] as const;
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative overflow-hidden rounded-2xl p-5 hover-lift"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-30 blur-3xl"
              style={{ background: item.accent }}
            />
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.05] ring-1 ring-white/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>
            <div className="mt-4 font-display text-3xl tracking-tight tabular-nums">
              {"value" in c ? (
                <>
                  <CountUp to={c.value} />
                  {c.suffix}
                </>
              ) : (
                c.text
              )}
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {c.label}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
