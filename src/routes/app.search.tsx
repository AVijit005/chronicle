import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/app/search")({ component: Page });

function Page() {
  // hint: open palette via ⌘K
  useEffect(() => {
    const ev = new KeyboardEvent("keydown", { key: "k", metaKey: true });
    setTimeout(() => window.dispatchEvent(ev), 200);
  }, []);
  return (
    <div className="pt-2">
      <div className="glass grid place-items-center rounded-[40px] p-16 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.06]">
          <Search className="h-6 w-6 text-primary" />
        </div>
        <h2 className="mt-5 font-display text-3xl">
          Press{" "}
          <kbd className="rounded-md border border-border/70 bg-background/60 px-2 py-1 text-base">
            ⌘K
          </kbd>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Spotlight searches every corner of your Chronicle.
        </p>
      </div>
    </div>
  );
}
