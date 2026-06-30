import { createFileRoute } from "@tanstack/react-router";
import { StatusPageShell } from "@/components/library/StatusPageShell";
import { FavoritesGallery } from "@/components/library/FavoritesGallery";
import { favorites } from "@/lib/library";

export const Route = createFileRoute("/app/library/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const items = favorites();
  return (
    <StatusPageShell
      status="favorite"
      title="The Permanent Ones"
      description="Stories you'll carry forever."
      count={items.length}
    >
      <FavoritesGallery items={items} />
    </StatusPageShell>
  );
}
