import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  Star,
  Film,
  Tv,
  Sparkles,
  BookOpen,
  BookMarked,
  Gamepad2,
  Music2,
  Mic,
  GraduationCap,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MediaItem, MediaKind } from "@/lib/mock";
import { cn } from "@/lib/utils";
import { ItemActionBar } from "@/components/media/ItemActionBar";

const KIND_GLYPH: Record<MediaKind, LucideIcon> = {
  movie: Film,
  series: Tv,
  anime: Sparkles,
  book: BookOpen,
  manga: BookMarked,
  game: Gamepad2,
  music: Music2,
  podcast: Mic,
  course: GraduationCap,
  youtube: Youtube,
};

export function MediaCard({ item, size = "md" }: { item: MediaItem; size?: "sm" | "md" | "lg" }) {
  const w = size === "sm" ? "w-36" : size === "lg" ? "w-56" : "w-44";
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className={cn("group relative shrink-0", w)}
    >
      <Link to="/app/media/$id" params={{ id: item.id }} className="block">
        <motion.div
          variants={{ rest: { y: 0 }, hover: { y: -6 } }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[2/3] overflow-hidden rounded-2xl"
          style={{ boxShadow: "0 20px 40px -20px oklch(0 0 0 / 0.7)" }}
        >
          <img
            src={item.poster}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
          />
          {/* gradient + sheen */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <motion.div
            variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(60% 80% at 50% 100%, ${item.accent ?? "oklch(0.72 0.18 255)"} / 0.35, transparent 70%)`,
            }}
          />

          {/* Rating chip */}
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] backdrop-blur-md">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" /> {item.rating.toFixed(1)}
          </div>

          {/* Cross-media glyph — subtle medium identity */}
          {(() => {
            const Glyph = KIND_GLYPH[item.kind];
            return (
              <div
                aria-hidden
                className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-black/45 text-white/85 ring-1 ring-white/10 backdrop-blur-md"
                title={item.kind}
                style={{
                  boxShadow: `inset 0 0 0 1px ${item.accent ?? "oklch(0.72 0.18 255)"} / 0.0`,
                }}
              >
                <Glyph className="h-3 w-3" />
              </div>
            );
          })()}

          {/* Progress bar (always when in-progress) */}
          {item.progress !== undefined && item.progress > 0 && item.progress < 100 && (
            <div className="absolute inset-x-2 bottom-2">
              <div className="h-1 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </Link>

      {/* Hover-revealed action bar (sits over the bottom of the poster) */}
      <motion.div
        variants={{ rest: { opacity: 0, y: 6 }, hover: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-x-2 bottom-16 z-10 flex justify-center"
      >
        <div className="pointer-events-auto">
          <ItemActionBar id={item.id} title={item.title} variant="overlay" />
        </div>
      </motion.div>
      <div className="mt-3 px-0.5">
        <div className="truncate text-sm font-medium">{item.title}</div>
        <div className="mt-0.5 truncate text-[11px] uppercase tracking-wider text-muted-foreground">
          {item.year} · {item.kind}
        </div>
      </div>
    </motion.div>
  );
}
