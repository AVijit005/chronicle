import type { ReactNode } from "react";

/** Luxury notebook page wrapper — narrow prose column, ivory tint,
 *  running header with date + mood, generous gutter. Pure visual primitive. */
export function JournalPage({
  date,
  mood,
  mode = "read",
  children,
}: {
  date?: string;
  mood?: string;
  mode?: "read" | "write" | "reflect";
  children: ReactNode;
}) {
  const tints: Record<typeof mode, string> = {
    read: "bg-[oklch(0.98_0.01_85/0.02)]",
    write: "bg-[oklch(0.95_0.005_240/0.015)]",
    reflect: "bg-[oklch(0.92_0.04_295/0.025)]",
  };
  return (
    <article
      className={`relative mx-auto max-w-2xl rounded-3xl px-8 py-12 ring-1 ring-white/5 md:px-14 md:py-16 ${tints[mode]}`}
      style={{ boxShadow: "0 24px 60px -32px oklch(0 0 0 / 0.5)" }}
    >
      {/* Subtle paper grain */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {(date || mood) && (
        <header className="mb-8 flex items-baseline justify-between border-b border-foreground/8 pb-4 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <span>{date}</span>
          {mood && <span className="italic">{mood}</span>}
        </header>
      )}

      <div className={`relative ${mode === "reflect" ? "text-center" : ""}`}>{children}</div>
    </article>
  );
}
