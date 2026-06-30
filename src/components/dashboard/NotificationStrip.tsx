import { Bell } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { cn } from "@/lib/utils";

const NOTES = [
  { kind: "Release", text: "New episode releases tomorrow." },
  { kind: "Goal", text: "Reading goal nearly complete." },
  { kind: "Journal", text: "Journal missing today." },
  { kind: "Memory", text: "A memory resurfaced." },
  { kind: "Collection", text: "Collection milestone reached." },
];

export function NotificationStrip({ className }: { className?: string }) {
  return (
    <section aria-label="Notifications" className={cn(className)}>
      <PremiumGlass variant="subtle">
        <div className="flex items-center gap-3 p-4">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.06]">
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <ul className="flex min-w-0 flex-1 flex-wrap gap-x-6 gap-y-1">
            {NOTES.map((n) => (
              <li key={n.text} className="text-xs text-muted-foreground">
                <span className="text-[9px] uppercase tracking-[0.22em] text-primary/80">
                  {n.kind}
                </span>
                <span className="ml-2 text-foreground/85">{n.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </PremiumGlass>
    </section>
  );
}
