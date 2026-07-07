import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Sparkles, BookmarkPlus, NotebookPen, X, RefreshCw } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { getRecommendedToday } from "@/lib/discovery";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const secondaryBtnClass =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white/[0.03] text-xs text-muted-foreground ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 ease-out press-scale hover:-translate-y-[2px] hover:bg-white/[0.08] hover:text-foreground hover:ring-white/20 hover:shadow-[0_8px_16px_-4px_oklch(0_0_0/0.5),0_0_16px_oklch(1_1_1/0.1)]";

export function DiscoveryHero({ className }: Props) {
  const r = getRecommendedToday();
  if (!r) return null;
  const { media, reason, confidence } = r;
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      aria-label="Today's recommendation"
      className={cn("relative", className)}
    >
      <PremiumGlass variant="strong" glow={media.accent ?? undefined} className="overflow-hidden">
        <div className="grid gap-6 p-6 md:grid-cols-[260px_1fr] md:gap-8 md:p-8">
          <Link to="/app/media/$id" params={{ id: media.id }} className="block">
            <img
              src={media.poster}
              alt=""
              className="aspect-[2/3] w-full rounded-2xl object-cover ring-1 ring-white/10"
            />
          </Link>
          <div className="flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-primary/85">
                <Sparkles className="h-3 w-3" /> Today's recommendation
              </div>
              <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
                {media.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{reason}</p>
              <p className="mt-4 max-w-prose text-[13px] leading-relaxed text-foreground/75">
                {media.synopsis}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {Math.round(confidence * 100)}% match
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/app/media/$id" params={{ id: media.id }}>
                <PremiumButton>Explore</PremiumButton>
              </Link>
              <button className={cn(secondaryBtnClass, "px-4 py-2")}>
                <BookmarkPlus className="h-3.5 w-3.5" /> Save
              </button>
              <button className={cn(secondaryBtnClass, "px-4 py-2")}>
                <NotebookPen className="h-3.5 w-3.5" /> Journal later
              </button>
              <button className={cn(secondaryBtnClass, "px-4 py-2")}>
                <RefreshCw className="h-3.5 w-3.5" /> Rotate
              </button>
              <button
                className={cn(secondaryBtnClass, "h-8 w-8")}
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </PremiumGlass>
    </motion.section>
  );
}
