import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getProfileIdentity } from "@/lib/profileEngine";
import { useMediaAnalytics, useGenreAnalytics, useInsights } from "@/hooks/use-analytics";

export function MediaDNA() {
  const { data: mediaAnalytics } = useMediaAnalytics();
  const { data: genreAnalytics } = useGenreAnalytics();
  const { data: insights } = useInsights();
  
  const id = getProfileIdentity(); // Fallback for some hardcoded bits like moods
  
  const universe = Object.entries(mediaAnalytics?.totalByType || {}).map(([kind, count]) => ({
    kind,
    count,
    accent: "oklch(0.65 0.22 295)", // fallback accent if not mapped
  }));
  
  const total = universe.reduce((s, u) => s + u.count, 0) || 1;
  const size = 320,
    c = size / 2,
    R = 130;
  let angle = -Math.PI / 2;

  const topGenres = genreAnalytics?.topGenres?.map(g => g.genre) || id.favoriteGenres;
  const favoriteGenre = insights?.favoriteGenre || topGenres[0] || "Mixed";

  return (
    <PremiumGlass variant="default">
      <div className="p-6 md:p-8">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Media DNA
        </div>
        <h3 className="mt-1 font-display text-2xl tracking-tight">Your fingerprint</h3>
        <div className="mt-4 grid items-center gap-6 md:grid-cols-[auto_1fr]">
          <svg width={size} height={size} role="img" aria-label="Media DNA fingerprint">
            <defs>
              <radialGradient id="dna-core" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="oklch(0.72 0.18 255 / 0.55)" />
                <stop offset="1" stopColor="oklch(0.72 0.18 255 / 0)" />
              </radialGradient>
            </defs>
            <circle cx={c} cy={c} r={R + 40} fill="url(#dna-core)" />
            <circle cx={c} cy={c} r={R} fill="none" stroke="oklch(1 0 0 / 0.06)" />
            {universe.map((u) => {
              const frac = u.count / total;
              const start = angle,
                end = angle + frac * Math.PI * 2;
              angle = end;
              const x1 = c + Math.cos(start) * R,
                y1 = c + Math.sin(start) * R;
              const x2 = c + Math.cos(end) * R,
                y2 = c + Math.sin(end) * R;
              const large = end - start > Math.PI ? 1 : 0;
              return (
                <path
                  key={u.kind}
                  d={`M ${c} ${c} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`}
                  fill={u.accent}
                  fillOpacity={0.55}
                  stroke="oklch(0 0 0 / 0.25)"
                  strokeWidth={0.5}
                />
              );
            })}
            <circle cx={c} cy={c} r={42} fill="oklch(0 0 0 / 0.55)" />
            <text
              x={c}
              y={c - 2}
              textAnchor="middle"
              fontSize="11"
              fill="oklch(0.7 0 0)"
              letterSpacing="3"
            >
              DNA
            </text>
            <text x={c} y={c + 16} textAnchor="middle" fontSize="14" fill="white" fontWeight={600}>
              {favoriteGenre}
            </text>
          </svg>
          <div className="grid gap-3 text-sm">
            <DnaRow label="Top genres" value={topGenres.slice(0, 4).join(" · ")} />
            <DnaRow label="Top creators" value={id.favoriteCreators.slice(0, 3).join(" · ")} />
            <DnaRow label="Languages" value={id.favoriteLanguages.join(" · ")} />
            <DnaRow
              label="Decades"
              value={insights?.favoriteDecade || id.favoriteYears
                .map((y) => `${Math.floor(y / 10) * 10}s`)
                .filter((v, i, a) => a.indexOf(v) === i)
                .join(" · ")}
            />
            <DnaRow label="Mood" value="Reflective · Curious · Tender" />
            <DnaRow label="Formats" value={universe.slice(0, 4).map(u => u.kind).join(" · ") || "Movies · Anime · Books · Games"} />
            <DnaRow label="Discovery" value="Editorial, slow, deliberate" />
          </div>
        </div>
      </div>
    </PremiumGlass>
  );
}
function DnaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] items-baseline gap-3">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
      <div className="truncate">{value}</div>
    </div>
  );
}
