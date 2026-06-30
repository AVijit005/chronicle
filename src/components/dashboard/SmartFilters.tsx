import { motion } from "motion/react";
import { useState } from "react";

const FILTERS = [
  "All",
  "Watching",
  "Reading",
  "Gaming",
  "Listening",
  "Completed",
  "Favorites",
] as const;

export function SmartFilters({ onChange }: { onChange?: (v: string) => void }) {
  const [active, setActive] = useState<string>("All");
  return (
    <div className="glass-subtle inline-flex items-center gap-1 rounded-full p-1">
      {FILTERS.map((f) => {
        const is = active === f;
        return (
          <button
            key={f}
            onClick={() => {
              setActive(f);
              onChange?.(f);
            }}
            className="relative rounded-full px-3.5 py-1.5 text-xs font-medium transition press-scale"
          >
            {is && (
              <motion.span
                layoutId="smartfilter-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/80 to-secondary/80"
              />
            )}
            <span
              className={`relative ${is ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {f}
            </span>
          </button>
        );
      })}
    </div>
  );
}
