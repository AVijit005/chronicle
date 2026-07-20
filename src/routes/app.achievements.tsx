import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";
export const Route = createFileRoute("/app/achievements")({ component: Page });

function Page() {
  return (
    <ComingSoon
      eyebrow="Milestones"
      title="The quiet markers along the way."
      description="Not trophies, not streaks to defend. Small acknowledgements for the kind of attention you've already been paying."
    />
  );
}
