import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { COLLECTIONS, type Collection } from "@/lib/mock";

export function RelatedCollections({ exclude }: { exclude: string }) {
  const items = COLLECTIONS.filter((c) => c.id !== exclude);
  return (
    <div className="-mx-2 flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
      {items.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="px-2"
        >
          <Mini c={c} />
        </motion.div>
      ))}
    </div>
  );
}

function Mini({ c }: { c: Collection }) {
  return (
    <Link
      to="/app/collections/$id"
      params={{ id: c.id }}
      className="group relative block h-44 w-72 overflow-hidden rounded-2xl ring-1 ring-white/10"
    >
      <img
        src={c.cover}
        alt=""
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 40%, ${c.accent} / 0.4, oklch(0 0 0 / 0.85))`,
        }}
      />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="font-display text-lg text-white">{c.name}</div>
        <div className="text-[11px] text-white/70">{c.count} items</div>
      </div>
    </Link>
  );
}
