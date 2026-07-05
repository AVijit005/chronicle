import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { MemoryChip } from "./MemoryChip";
import { getOnThisDay, getAnniversaryMemories } from "@/lib/resurfacing";
import { TODAY } from "@/lib/memory";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  variant?: "default" | "compact";
}

export function OnThisDay({ className, variant = "default" }: Props) {
  const exact = getOnThisDay();
  const candidate = exact[0] ?? getAnniversaryMemories()[0];
  if (!candidate) return null;
  const { media, memory } = candidate;
  const fin = new Date(memory.finishedAt!);
  const yearsAgo = TODAY.getUTCFullYear() - fin.getUTCFullYear();

  return (
    <PremiumGlass variant="strong" className={className}>
      <section
        className={cn(
          "relative overflow-hidden",
          variant === "compact" ? "p-5 md:p-6" : "p-6 md:p-8",
        )}
        aria-label="On this day"
      >
        {media.backdrop && (
          <img
            src={media.backdrop ?? undefined}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="relative grid grid-cols-[80px_1fr_auto] items-center gap-5 md:grid-cols-[120px_1fr_auto]">
          <img
            src={media.poster}
            alt=""
            className="h-28 w-20 rounded-xl object-cover ring-1 ring-white/10 md:h-40 md:w-28"
          />
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.24em] text-primary/85">
              On this day
            </div>
            <h3 className="mt-1.5 font-display text-xl tracking-tight md:text-2xl">
              You finished {media.title} exactly {yearsAgo} {yearsAgo === 1 ? "year" : "years"} ago.
            </h3>
            <p className="mt-1.5 max-w-lg text-sm italic text-foreground/75 line-clamp-2">
              "{memory.memoryExcerpt}"
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <MemoryChip variant="mood" label={memory.mood} />
              <MemoryChip variant="companion" label={memory.companion} />
            </div>
          </div>
          <Link
            to="/app/media/$id"
            params={{ id: media.id }}
            className="glass inline-flex items-center gap-1.5 self-start rounded-2xl px-3 py-2 text-xs press-scale"
          >
            Relive <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </PremiumGlass>
  );
}
