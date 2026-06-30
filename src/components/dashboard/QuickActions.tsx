import { motion } from "motion/react";
import { Plus, Search, NotebookPen, Layers, Clock, CalendarDays, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

const ACTIONS = [
  {
    icon: Plus,
    label: "Add media",
    hint: "Anything",
    to: "/app/library",
    color: "oklch(0.72 0.18 255)",
  },
  {
    icon: Search,
    label: "Spotlight",
    hint: "⌘K",
    to: "/app/search",
    color: "oklch(0.65 0.22 295)",
  },
  {
    icon: Layers,
    label: "New collection",
    hint: "Curate",
    to: "/app/collections",
    color: "oklch(0.7 0.16 25)",
  },
  {
    icon: NotebookPen,
    label: "Write journal",
    hint: "A memory",
    to: "/app/journal",
    color: "oklch(0.72 0.16 160)",
  },
  {
    icon: Clock,
    label: "Timeline",
    hint: "Your year",
    to: "/app/timeline",
    color: "oklch(0.78 0.16 50)",
  },
  {
    icon: CalendarDays,
    label: "Today",
    hint: "Calendar",
    to: "/app/calendar",
    color: "oklch(0.7 0.18 200)",
  },
  {
    icon: Sparkles,
    label: "Wrapped",
    hint: "Preview",
    to: "/app/wrapped",
    color: "oklch(0.65 0.25 25)",
  },
];

export function QuickActions({ onOpenSearch }: { onOpenSearch?: () => void }) {
  return (
    <div className="-mx-6 overflow-x-auto px-6 pb-2 lg:mx-0 lg:overflow-visible lg:px-0">
      <div className="flex gap-3 lg:grid lg:grid-cols-7 lg:gap-3">
        {ACTIONS.map((a, i) => {
          const inner = (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              className="glass group relative flex w-[160px] shrink-0 flex-col gap-3 overflow-hidden rounded-2xl p-4 lg:w-auto"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-50 blur-2xl transition group-hover:opacity-90"
                style={{ background: a.color }}
              />
              <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
                <a.icon className="h-4 w-4 text-foreground" />
              </div>
              <div className="relative">
                <div className="text-sm font-medium">{a.label}</div>
                <div className="text-[11px] text-muted-foreground">{a.hint}</div>
              </div>
            </motion.div>
          );
          if (a.label === "Spotlight" && onOpenSearch) {
            return (
              <button key={a.label} onClick={onOpenSearch} className="text-left">
                {inner}
              </button>
            );
          }
          return (
            <Link key={a.label} to={a.to}>
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
