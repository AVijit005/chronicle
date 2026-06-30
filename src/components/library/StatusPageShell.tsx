import { motion } from "motion/react";
import type { ReactNode } from "react";
import { StatusBadge } from "./StatusBadge";
import type { MediaStatus } from "@/lib/library";

export function StatusPageShell({
  status,
  title,
  description,
  count,
  action,
  children,
}: {
  status: MediaStatus | "favorite";
  title: string;
  description: string;
  count: number;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="pt-2">
      <motion.header
        initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"
      >
        <div className="min-w-0">
          <StatusBadge status={status} />
          <h1 className="mt-3 truncate font-display text-4xl tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>
          <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground/80">
            {count} items
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </motion.header>
      {children}
    </div>
  );
}
