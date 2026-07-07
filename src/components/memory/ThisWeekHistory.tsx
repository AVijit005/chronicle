import { Link } from "@tanstack/react-router";
import { getThisWeekYearsAgo } from "@/lib/resurfacing";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface Props {
  className?: string;
}

export function ThisWeekHistory({ className }: Props) {
  const buckets = getThisWeekYearsAgo();
  
  if (!buckets.length) {
    return (
      <div className={cn("relative z-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-10 text-center pointer-events-auto", className)}>
        {/* Ambient Glow effect */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-32 w-48 bg-primary/20 blur-[40px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center pointer-events-auto">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.05] ring-1 ring-white/10 shadow-lg shadow-black/20">
            <Sparkles className="h-5 w-5 text-primary/80" />
          </div>
          <h3 className="font-display text-2xl tracking-tight text-foreground/90">The archive is quiet this week.</h3>
          <p className="mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
            There is no media logged from this exact week in previous years. Plant a seed now—leave a snapshot of your current state for Future You to discover next year.
          </p>
          
          <div className="mt-8 w-full max-w-md">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-rose-300/30 rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition duration-700 ease-out pointer-events-none"></div>
              <textarea 
                placeholder="What is captivating your mind right now?"
                className="relative w-full rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-foreground/90 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none h-28 shadow-inner transition-all cursor-text pointer-events-auto"
              />
              <button className="absolute bottom-4 right-4 rounded-xl bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/20 transition-colors cursor-pointer pointer-events-auto">
                Seal Capsule
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ol className={cn("relative space-y-6 border-l border-white/10 pl-6", className)}>
      {buckets.map((b) => (
        <li key={b.years}>
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">
            {b.years} {b.years === 1 ? "year" : "years"} ago
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {b.items.slice(0, 4).map(({ media, memory }) => (
              <li key={media.id}>
                <Link
                  to="/app/media/$id"
                  params={{ id: media.id }}
                  className="glass-subtle group flex items-center gap-3 rounded-2xl p-2.5 ring-1 ring-white/5 transition hover:ring-white/15"
                >
                  <img
                    src={media.poster}
                    alt=""
                    className="h-12 w-9 flex-none rounded-md object-cover"
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm tracking-tight">{media.title}</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                      {memory.mood}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
