import { motion } from "motion/react";
import { Bell } from "lucide-react";
import { UPCOMING } from "@/lib/mock";

export function UpcomingList() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {UPCOMING.map((u, i) => (
        <motion.div
          key={u.id}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="glass group relative flex items-center gap-4 overflow-hidden rounded-2xl p-4 transition hover-lift"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-3xl"
            style={{ background: u.media.accent ?? "oklch(0.72 0.18 255)" }}
          />
          <img
            src={u.media.poster}
            alt=""
            className="relative h-16 w-12 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
          />
          <div className="relative min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary/85">{u.label}</div>
            <div className="mt-0.5 truncate font-display text-lg">{u.media.title}</div>
            <div className="text-[11px] text-muted-foreground">{u.when}</div>
          </div>
          <div className="relative flex shrink-0 items-center gap-2">
            <span className="glass-subtle rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground/80">
              {u.countdown}
            </span>
            <button
              aria-label="Remind me"
              className="glass-subtle grid h-9 w-9 place-items-center rounded-xl press-scale hover:text-primary"
            >
              <Bell className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
