import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { shareCardDataUrl, type ShareCardInput } from "@/lib/shareCard";

export function ShareCardPreview(input: ShareCardInput) {
  const url = shareCardDataUrl(input);
  return (
    <PremiumGlass variant="subtle">
      <div className="p-5">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Share card
        </div>
        <div className="mt-3 overflow-hidden rounded-2xl">
          <img src={url} alt={`Share card: ${input.title}`} className="block w-full" />
        </div>
        <a
          href={url}
          download={`${input.title.replace(/\s+/g, "-").toLowerCase()}.svg`}
          className="story-link mt-3 inline-block text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          Download SVG →
        </a>
      </div>
    </PremiumGlass>
  );
}
