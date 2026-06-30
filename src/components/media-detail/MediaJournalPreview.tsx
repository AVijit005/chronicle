import { motion } from "motion/react";
import { Pencil, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { MediaItem } from "@/lib/mock";
import { MEDIA_DETAIL } from "@/lib/mock";
import { PremiumButton } from "@/components/ui/PremiumButton";

export function MediaJournalPreview({ item }: { item: MediaItem }) {
  const m = MEDIA_DETAIL[item.id].memory;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[28px] p-7 md:p-9"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.96 0.005 90 / 0.06), oklch(0.96 0.005 90 / 0.02))",
        boxShadow: "0 30px 60px -30px oklch(0 0 0 / 0.6), inset 0 1px 0 oklch(1 0 0 / 0.06)",
        border: "1px solid oklch(1 0 0 / 0.06)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {m.date} · {m.mood}
          </div>
          <h3 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">Latest entry</h3>
        </div>
        <PremiumButton variant="icon" icon={<Pencil className="h-4 w-4" />} aria-label="Edit" />
      </div>
      <p className="mt-5 font-display text-2xl leading-snug text-foreground/90 md:text-3xl">
        &ldquo;{m.note}&rdquo;
      </p>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {m.tags
            .slice(0, 3)
            .map((t) => `#${t}`)
            .join(" · ")}
        </span>
        <Link
          to="/app/journal"
          className="story-link inline-flex items-center gap-1 text-sm text-foreground"
        >
          Open journal <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
