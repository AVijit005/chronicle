import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";

interface Node {
  id: string;
  label: string;
  to: string;
  accent: string;
}
const NODES: Node[] = [
  { id: "movies", label: "Movies", to: "/app/library/movie", accent: "var(--primary)" },
  { id: "anime", label: "Anime", to: "/app/library/anime", accent: "oklch(0.78 0.18 50)" },
  { id: "books", label: "Books", to: "/app/library/book", accent: "oklch(0.62 0.2 295)" },
  { id: "games", label: "Games", to: "/app/library/game", accent: "oklch(0.72 0.16 80)" },
  { id: "music", label: "Music", to: "/app/library/music", accent: "oklch(0.7 0.18 25)" },
  { id: "courses", label: "Courses", to: "/app/library/course", accent: "oklch(0.7 0.2 145)" },
  { id: "podcasts", label: "Podcasts", to: "/app/library/podcast", accent: "oklch(0.65 0.15 220)" },
  {
    id: "collections",
    label: "Collections",
    to: "/app/collections",
    accent: "oklch(0.65 0.22 295)",
  },
  { id: "journal", label: "Journal", to: "/app/journal", accent: "oklch(0.72 0.16 160)" },
  { id: "timeline", label: "Timeline", to: "/app/timeline", accent: "var(--primary)" },
  {
    id: "achievements",
    label: "Achievements",
    to: "/app/achievements",
    accent: "oklch(0.82 0.16 80)",
  },
  { id: "goals", label: "Goals", to: "/app/goals", accent: "oklch(0.72 0.16 160)" },
];

export function MemoryMap() {
  const W = 720,
    H = 420,
    cx = W / 2,
    cy = H / 2;
  const R = 165;
  const positioned = NODES.map((n, i) => {
    const a = (i / NODES.length) * Math.PI * 2 - Math.PI / 2;
    return { ...n, x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * (R * 0.7) };
  });
  return (
    <PremiumGlass variant="default">
      <div className="p-6 md:p-8">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Memory Map
        </div>
        <h3 className="mt-1 font-display text-2xl tracking-tight">Your universe at a glance</h3>
        <div className="mt-4 overflow-hidden rounded-2xl">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Memory map">
            {positioned.map((n) => (
              <line
                key={`l-${n.id}`}
                x1={cx}
                y1={cy}
                x2={n.x}
                y2={n.y}
                stroke="oklch(1 0 0 / 0.08)"
                strokeWidth={1}
              />
            ))}
            <circle
              cx={cx}
              cy={cy}
              r={42}
              fill="oklch(0.72 0.18 255 / 0.18)"
              stroke="oklch(1 0 0 / 0.15)"
            />
            <text x={cx} y={cy + 4} textAnchor="middle" fontSize="13" fill="white" fontWeight={600}>
              You
            </text>
            {positioned.map((n) => (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={6} fill={n.accent} />
                <foreignObject x={n.x - 60} y={n.y + 10} width={120} height={28}>
                  <div className="text-center">
                    <Link
                      to={n.to}
                      className="story-link inline-block text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
                    >
                      {n.label}
                    </Link>
                  </div>
                </foreignObject>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </PremiumGlass>
  );
}
