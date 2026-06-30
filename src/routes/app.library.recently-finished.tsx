import { createFileRoute } from "@tanstack/react-router";
import { StatusPageShell } from "@/components/library/StatusPageShell";
import { RecentlyFinishedTimeline } from "@/components/library/RecentlyFinishedTimeline";
import { recentlyFinished } from "@/lib/library";

export const Route = createFileRoute("/app/library/recently-finished")({
  component: RecentlyFinishedPage,
});

function RecentlyFinishedPage() {
  const items = recentlyFinished();
  return (
    <StatusPageShell
      status="completed"
      title="Just Lived"
      description="Stories that became yours this week."
      count={items.length}
    >
      <RecentlyFinishedTimeline />
    </StatusPageShell>
  );
}
