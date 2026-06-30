import { Gift } from "lucide-react";
import type { Goal } from "@/lib/goals";

export function GoalReward({ goal }: { goal: Goal }) {
  return (
    <div className="glass-subtle flex items-center gap-3 rounded-2xl p-4 ring-1 ring-white/5">
      <Gift className="h-4 w-4 text-primary" />
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Reward</div>
        <div className="text-sm">{goal.reward}</div>
      </div>
    </div>
  );
}
