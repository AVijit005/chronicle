import { useEffect, useState } from "react";
import { motion } from "motion/react";

export interface ChapterRef {
  id: string;
  label: string;
}

/** Sticky right-rail chapter nav + top reading-progress bar.
 *  Watches anchor sections via IntersectionObserver. */
export function ChapterNav({ chapters }: { chapters: ChapterRef[] }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => observer.observe(el));

    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [chapters]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Reading progress bar — under TopBar height */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[2px]">
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-primary via-secondary to-primary"
          style={{ scaleX: progress }}
          transition={{ duration: 0.15, ease: "linear" }}
        />
      </div>

      {/* Right-rail nav — desktop only */}
      <nav
        aria-label="Chapter navigation"
        className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
      >
        <ul className="pointer-events-auto space-y-2">
          {chapters.map((c) => {
            const active = c.id === activeId;
            return (
              <li key={c.id}>
                <button
                  onClick={() => go(c.id)}
                  className="group flex items-center gap-3"
                  aria-current={active ? "true" : undefined}
                >
                  <span
                    className={`h-px transition-all duration-500 ${
                      active
                        ? "w-10 bg-primary"
                        : "w-5 bg-foreground/25 group-hover:w-8 group-hover:bg-foreground/60"
                    }`}
                  />
                  <span
                    className={`text-[11px] uppercase tracking-[0.22em] transition-colors ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground/70 group-hover:text-foreground"
                    }`}
                  >
                    {c.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
