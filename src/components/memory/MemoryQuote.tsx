import type { MemoryQuoteData } from "@/lib/memoryJournal";
import { cn } from "@/lib/utils";

interface Props {
  quote: MemoryQuoteData | null;
  className?: string;
}

export function MemoryQuote({ quote, className }: Props) {
  if (!quote) return null;
  return (
    <figure className={cn("relative mx-auto max-w-2xl px-2 py-8 text-center", className)}>
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-40 -translate-x-1/2"
        style={{
          background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.18), transparent)",
          filter: "blur(0.5px)",
        }}
      />
      <span
        aria-hidden
        className="absolute -top-2 left-1/2 -translate-x-1/2 font-display text-7xl leading-none text-foreground/15 select-none"
      >
        “
      </span>
      <blockquote className="relative font-display text-xl italic leading-snug text-foreground/90 md:text-2xl">
        {quote.text}
      </blockquote>
      {quote.attribution && (
        <figcaption className="mt-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground/70">
          — {quote.attribution}
        </figcaption>
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
        style={{ background: "linear-gradient(180deg, transparent, var(--background))" }}
      />
    </figure>
  );
}
