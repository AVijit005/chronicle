import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { allQuotes } from "@/lib/quoteEngine";

export function QuoteGallery({ limit = 9 }: { limit?: number }) {
  const quotes = allQuotes().slice(0, limit);
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {quotes.map((q) => (
        <PremiumGlass key={q.id} variant="subtle" glow={q.accent + " / 0.3"}>
          <div className="p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {q.source}
            </div>
            <blockquote className="mt-2 font-display text-lg leading-snug">"{q.text}"</blockquote>
            <div className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {q.refTitle}
            </div>
          </div>
        </PremiumGlass>
      ))}
    </div>
  );
}
