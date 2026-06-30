import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { MemoryChip } from "./MemoryChip";
import type { MemoryJournal } from "@/lib/memoryJournal";
import { t } from "@/lib/motion";

interface Props {
  journal: MemoryJournal;
  mediaTitle?: string;
  onOpen?: () => void;
  className?: string;
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MemoryJournalCard({ journal, mediaTitle, onOpen, className }: Props) {
  return (
    <PremiumGlass variant="default" className={className}>
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={t.normal}
        className="relative p-6 md:p-7"
      >
        {/* paper top-light */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24"
          style={{ background: "linear-gradient(180deg, oklch(1 0 0 / 0.04), transparent)" }}
        />
        <header className="relative flex items-center justify-between">
          <time className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
            {fmt(journal.createdAt)}
          </time>
          <MemoryChip variant="mood" label={journal.mood} />
        </header>
        <h3 className="relative mt-3 font-display text-xl tracking-tight md:text-2xl">
          {journal.title}
        </h3>
        {mediaTitle && (
          <p className="relative mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
            {mediaTitle}
          </p>
        )}
        <p className="relative mt-4 max-w-prose text-sm leading-relaxed text-foreground/80 line-clamp-4">
          {journal.summary} {journal.fullEntry}
        </p>
        <button
          type="button"
          onClick={onOpen}
          className="relative mt-5 inline-flex items-center gap-1.5 text-xs text-primary/90 hover:text-primary"
        >
          Read more <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </motion.article>
    </PremiumGlass>
  );
}
