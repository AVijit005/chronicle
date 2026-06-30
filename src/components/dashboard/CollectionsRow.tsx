import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { COLLECTIONS } from "@/lib/mock";

export function CollectionsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {COLLECTIONS.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            to="/app/collections"
            className="group relative block aspect-[3/4] overflow-hidden rounded-3xl ring-1 ring-white/10"
          >
            <motion.img
              src={c.cover}
              alt=""
              className="h-full w-full object-cover"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 40%, ${c.accent.replace(")", " / 0.45)")}, oklch(0 0 0 / 0.88))`,
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
              style={{
                background: "linear-gradient(125deg, oklch(1 0 0 / 0.16), transparent 55%)",
                mixBlendMode: "overlay",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="glass-subtle inline-block rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.22em] text-white/85">
                {c.count} items
              </div>
              <div className="mt-2 font-display text-xl text-white">{c.name}</div>
              <div className="mt-1 max-w-xs translate-y-2 text-[11px] text-white/70 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                {c.description}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
