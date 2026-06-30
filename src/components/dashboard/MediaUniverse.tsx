import { motion } from "motion/react";
import {
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
import { UNIVERSE, KIND_LABEL, type MediaKind } from "@/lib/mock";
import { CountUp } from "@/components/landing/CountUp";

const ICONS: Record<MediaKind, typeof Film> = {
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

export function MediaUniverse() {
  const max = Math.max(...UNIVERSE.map((u) => u.count));
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {UNIVERSE.map((u, i) => {
        const Icon = ICONS[u.kind];
        const pct = (u.count / max) * 100;
        return (
          <motion.div
            key={u.kind}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="glass relative overflow-hidden rounded-3xl p-5"
          >
            <div
              className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50 blur-2xl"
              style={{ background: u.accent }}
            />
            <div className="relative">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
                <Icon className="h-4 w-4" style={{ color: u.accent }} />
              </div>
              <div className="mt-4 font-display text-3xl tracking-tight">
                <CountUp to={u.count} />
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {KIND_LABEL[u.kind]}
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{ background: u.accent }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
