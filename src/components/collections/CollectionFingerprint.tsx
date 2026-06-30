import { mulberry } from "@/lib/seed";
import type { Collection } from "@/lib/mock";

function hash(id: string) {
  let h = 0xfeedbeef >>> 0;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const AXES = [
  "Hope",
  "Adventure",
  "Comfort",
  "Mystery",
  "Sadness",
  "Inspiration",
  "Wonder",
  "Curiosity",
  "Growth",
];

export function CollectionFingerprint({ collection }: { collection: Collection }) {
  const rng = mulberry(hash(collection.id));
  const cx = 160,
    cy = 160;
  const petals = AXES.map((label, i) => {
    const angle = (i / AXES.length) * Math.PI * 2 - Math.PI / 2;
    const value = 0.35 + rng() * 0.6;
    const r = value * 110;
    return { label, angle, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, value };
  });
  const points = petals.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <div className="glass-subtle rounded-3xl p-6 ring-1 ring-white/5">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Emotional fingerprint
      </div>
      <svg viewBox="0 0 320 320" className="mx-auto mt-4 w-full max-w-md">
        {[0.25, 0.5, 0.75, 1].map((s) => (
          <circle key={s} cx={cx} cy={cy} r={s * 110} fill="none" stroke="oklch(1 0 0 / 0.06)" />
        ))}
        <polygon
          points={points}
          fill="oklch(0.72 0.18 255 / 0.18)"
          stroke="oklch(0.72 0.18 255 / 0.5)"
        />
        {petals.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="3" fill="oklch(0.78 0.18 255)" />
            <text
              x={cx + Math.cos(p.angle) * 135}
              y={cy + Math.sin(p.angle) * 135}
              textAnchor="middle"
              fontSize="9"
              fill="currentColor"
              className="fill-muted-foreground"
              style={{ letterSpacing: "0.15em", textTransform: "uppercase" }}
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
