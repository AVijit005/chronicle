import { motion, useReducedMotion } from "motion/react";

const DEMO_COLLECTIONS = [
  { id: "1", name: "Cyberpunk Vibe", count: 12, cover: "https://images.unsplash.com/photo-1518770660439-4636190af475", accent: "oklch(0.7 0.2 295)", description: "Neon-drenched stories." },
  { id: "2", name: "Ghibli Magic", count: 8, cover: "https://images.unsplash.com/photo-1542204165-65bf26472b9b", accent: "oklch(0.78 0.18 50)", description: "Whimsical adventures." },
  { id: "3", name: "Space Operas", count: 24, cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa", accent: "oklch(0.72 0.18 255)", description: "Across the universe." },
  { id: "4", name: "Comfort Games", count: 5, cover: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f", accent: "oklch(0.72 0.16 80)", description: "Cozy weekends." }
];

export function CollectionsPreview() {
  const reduced = useReducedMotion();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {DEMO_COLLECTIONS.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6 }}
          className="group relative aspect-[3/4] overflow-hidden rounded-3xl ring-1 ring-white/10"
        >
          <motion.img
            src={c.cover}
            alt=""
            className="h-full w-full object-cover"
            animate={reduced ? undefined : { scale: [1, 1.04, 1] }}
            transition={reduced ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, transparent 40%, ${c.accent.replace(")", " / 0.5)")}, oklch(0 0 0 / 0.85))`,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 mix-blend-overlay transition group-hover:opacity-100"
          />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="glass-subtle inline-block rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.22em] text-white/80">
              {c.count} items
            </div>
            <div className="mt-2 font-display text-xl text-white">{c.name}</div>
            <div className="mt-1 text-[11px] text-white/70 opacity-0 transition group-hover:opacity-100">
              {c.description}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
