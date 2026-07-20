import { createFileRoute } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";

export const Route = createFileRoute("/app/tags/$tag")({
  component: TagPage,
});

function TagPage() {
  const { tag } = Route.useParams();
  return (
    <div className="mx-auto max-w-3xl pt-2 pb-32">
      <PremiumGlass className="p-8 text-center text-muted-foreground">
        Tag #{tag} content coming soon.
      </PremiumGlass>
    </div>
  );
}
