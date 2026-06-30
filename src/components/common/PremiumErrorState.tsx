import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { PremiumButton } from "@/components/ui/PremiumButton";
import type { ReactNode } from "react";

export function PremiumErrorState({
  eyebrow = "Something quiet went wrong",
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <PremiumGlass variant="strong" className="mx-auto max-w-2xl">
      <div className="p-10 text-center md:p-12">
        <div className="text-[10px] uppercase tracking-[0.24em] text-primary/85">{eyebrow}</div>
        <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">{title}</h2>
        {description && (
          <p className="mx-auto mt-3 max-w-prose text-sm text-muted-foreground">{description}</p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {action ?? (
            <>
              <Link to="/app">
                <PremiumButton>Go home</PremiumButton>
              </Link>
              <Link to="/app/library">
                <PremiumButton variant="secondary">Open library</PremiumButton>
              </Link>
              <Link to="/app/timeline">
                <PremiumButton variant="ghost">Timeline</PremiumButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </PremiumGlass>
  );
}
