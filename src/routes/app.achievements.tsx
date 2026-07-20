import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";
import { Flame, Film, BookOpen, Layers } from "lucide-react";

export const Route = createFileRoute("/app/achievements")({ component: Page });

const ICONS = { Flame, Film, BookOpen, Layers };

function Page() {
  return (
    <ComingSoon
      eyebrow="Milestones"
      title="The quiet markers along the way."
      description="Not trophies, not streaks to defend. Small acknowledgements for the kind of attention you've already been paying."
    />
  );
}
