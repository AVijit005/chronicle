export function GlassSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/5 ${className}`}
      style={{
        background:
          "linear-gradient(110deg, oklch(1 0 0 / 0.04), oklch(1 0 0 / 0.08), oklch(1 0 0 / 0.04))",
        backgroundSize: "200% 100%",
      }}
    >
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          background:
            "linear-gradient(110deg, transparent 30%, oklch(1 0 0 / 0.08) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}
