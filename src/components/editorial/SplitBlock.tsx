import type { ReactNode } from "react";

/** Asymmetric 60/40 two-column block with a thin editorial divider. */
export function SplitBlock({
  primary,
  secondary,
  ratio = "60/40",
  reverse = false,
}: {
  primary: ReactNode;
  secondary: ReactNode;
  ratio?: "60/40" | "70/30";
  reverse?: boolean;
}) {
  const cols = ratio === "70/30" ? "md:grid-cols-[2.3fr_1fr]" : "md:grid-cols-[1.6fr_1fr]";
  return (
    <section className={`grid gap-8 ${cols} md:gap-12`}>
      <div className={reverse ? "md:order-2" : ""}>{primary}</div>
      <div className={`relative ${reverse ? "md:order-1" : ""}`}>
        <span
          aria-hidden
          className="absolute -top-2 left-0 hidden h-px w-12 bg-foreground/20 md:block"
        />
        {secondary}
      </div>
    </section>
  );
}
