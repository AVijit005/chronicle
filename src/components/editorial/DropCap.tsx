import type { ReactNode } from "react";

/** First-letter editorial treatment. Wraps prose. */
export function DropCap({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "warm";
}) {
  // children is expected to be a string; we render first letter large.
  const text = typeof children === "string" ? children : "";
  if (!text) return <p className="text-base leading-relaxed text-foreground/85">{children}</p>;
  const first = text.charAt(0);
  const rest = text.slice(1);
  const accent = tone === "warm" ? "text-amber-100/95" : "text-foreground";
  return (
    <p className="text-base leading-relaxed text-foreground/85">
      <span
        className={`float-left mr-3 mt-1 font-display text-[3.6rem] leading-[0.82] tracking-tight ${accent}`}
        style={{ textShadow: "0 1px 0 oklch(1 0 0 / 0.05)" }}
      >
        {first}
      </span>
      {rest}
    </p>
  );
}
