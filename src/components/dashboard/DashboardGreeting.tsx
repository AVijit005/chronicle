import { motion } from "motion/react";
import { getGreeting } from "@/lib/dashboardGreeting";
import { getDashboardContext } from "@/lib/dashboardContext";
import { cn } from "@/lib/utils";

export function DashboardGreeting({ className }: { className?: string }) {
  const ctx = getDashboardContext();
  const g = getGreeting(ctx.greeting);
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Greeting"
      className={cn("space-y-1", className)}
    >
      <h2 className="font-display text-2xl tracking-tight md:text-3xl">{g.title}</h2>
      {g.subtitle && <p className="text-sm text-muted-foreground">{g.subtitle}</p>}
    </motion.section>
  );
}
