import { motion } from "motion/react";
import { getGreeting } from "@/lib/dashboardGreeting";
import { useCurrentUser } from "@/hooks/use-auth";
import { useDashboard, useStreaks, useOverview } from "@/hooks/use-analytics";
import { cn } from "@/lib/utils";

export function DashboardGreeting({ className }: { className?: string }) {
  const { data: user } = useCurrentUser();
  const { data: dashboard } = useDashboard();
  const { data: streaks } = useStreaks();
  const { data: overview } = useOverview();
  
  const firstName = user?.fullName?.split(" ")[0] || "there";
  const g = getGreeting({
    name: firstName,
    streak: streaks?.currentStreak,
    recentCompletions: overview?.moviesCompleted, // using as proxy
    unfinishedTitle: dashboard?.continueWatching?.[0]?.title
  });
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
