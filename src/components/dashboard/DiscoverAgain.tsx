import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { REDISCOVER } from "@/lib/mock";

export function DiscoverAgain() {
  return (
    <div
      className="-mx-6 flex gap-5 overflow-x-auto px-6 pb-3 lg:-mx-10 lg:px-10"
      style={{ scrollSnapType: "x mandatory" }}
    >
      {REDISCOVER.map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          style={{ scrollSnapAlign: "start" }}
          className="shrink-0"
        >
          <Link to="/app/media/$id" params={{ id: r.item.id }} className="group block w-[280px]">
            <div className="glass relative overflow-hidden rounded-3xl p-3 transition hover-lift">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                <img
                  src={r.item.backdrop ?? r.item.poster}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -bottom-10 h-24 opacity-70 blur-2xl"
                  style={{ background: r.item.accent }}
                />
                <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[10px] text-white backdrop-blur-md">
                  <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-300" />{" "}
                  {r.item.rating.toFixed(1)}
                </div>
              </div>
              <div className="mt-3 px-2 pb-1">
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary/85">
                  {r.label}
                </div>
                <div className="mt-1 truncate font-display text-lg">{r.item.title}</div>
                <div className="text-[11px] text-muted-foreground">{r.item.creator}</div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
