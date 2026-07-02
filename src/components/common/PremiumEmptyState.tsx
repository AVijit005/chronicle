import { Info } from "lucide-react";

export function PremiumEmptyState({ title, description, className = "" }: { title: string; description: string; className?: string }) {
  return (
    <div className={`glass-subtle relative flex flex-col items-center justify-center overflow-hidden rounded-3xl p-8 text-center border border-white/10 ${className}`}>
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.03] ring-1 ring-white/10 mb-4">
        <Info className="h-6 w-6 text-muted-foreground/70" />
      </div>
      <div className="font-display text-xl text-white">{title}</div>
      <div className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</div>
    </div>
  );
}
