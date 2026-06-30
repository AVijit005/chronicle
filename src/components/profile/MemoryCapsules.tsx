import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getCapsules } from "@/lib/memoryCapsuleEngine";

export function MemoryCapsules() {
  const capsules = getCapsules();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {capsules.map((c) => (
        <PremiumGlass key={c.id} variant="default" glow={c.accent + " / 0.4"}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl">
            <img
              src={c.cover}
              alt={c.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
            <div className="absolute inset-x-4 bottom-3">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Capsule
              </div>
              <div className="font-display text-lg tracking-tight">{c.title}</div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground">{c.subtitle}</p>
            <Link
              to="/app/timeline"
              className="story-link mt-2 inline-block text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
            >
              Open capsule →
            </Link>
          </div>
        </PremiumGlass>
      ))}
    </div>
  );
}
