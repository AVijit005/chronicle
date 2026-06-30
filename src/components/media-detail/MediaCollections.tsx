import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import type { MediaItem } from "@/lib/mock";
import { MEDIA_DETAIL, COLLECTIONS } from "@/lib/mock";

export function MediaCollections({ item }: { item: MediaItem }) {
  const ids = MEDIA_DETAIL[item.id].collectionIds;
  const cols = COLLECTIONS.filter((c) => ids.includes(c.id));
  if (cols.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
        Not in any collection yet.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cols.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            to="/app/collections/$id"
            params={{ id: c.id }}
            className="group relative block aspect-[16/9] overflow-hidden rounded-2xl ring-1 ring-white/10"
          >
            <img
              src={c.cover}
              alt=""
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 35%, ${c.accent} / 0.45, oklch(0 0 0 / 0.85))`,
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="font-display text-lg text-white">{c.name}</div>
              <div className="text-[11px] text-white/70">{c.count} items</div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
