import { motion } from "motion/react";
import type { MediaItem } from "@/lib/mock";
import { MEDIA_DETAIL } from "@/lib/mock";
import {
  User,
  Clapperboard,
  Tags,
  Clock,
  Languages,
  Calendar,
  Monitor,
  Activity,
  Star,
} from "lucide-react";

const ICONS: Record<string, typeof User> = {
  Creator: User,
  Director: Clapperboard,
  Studio: Clapperboard,
  Genres: Tags,
  Runtime: Clock,
  Language: Languages,
  Release: Calendar,
  Year: Calendar,
  Platform: Monitor,
  Status: Activity,
  Rating: Star,
  Kind: Activity,
};

export function MediaInformation({ item }: { item: MediaItem }) {
  const info = MEDIA_DETAIL[item.id].info;
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {info.map((row, i) => {
        const Icon = ICONS[row.label] ?? Activity;
        return (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            className="glass group relative overflow-hidden rounded-2xl p-5 hover-lift"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(125deg, transparent 40%, oklch(1 0 0 / 0.05) 50%, transparent 60%)",
              }}
            />
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.05] ring-1 ring-white/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>
            <div className="mt-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {row.label}
            </div>
            <div className="mt-1 font-display text-lg tracking-tight">{row.value}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
