import { Outlet, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { AtmosphereBackground } from "@/components/atmosphere/AtmosphereBackground";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { TopBar } from "@/components/layout/TopBar";
import { CommandPalette } from "@/components/search/CommandPalette";
import { GlobalShortcuts } from "@/components/common/GlobalShortcuts";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { ActivityFeed } from "@/components/common/ActivityFeed";
import { pagePresence, pagePresenceReduced } from "@/lib/motion";
import { MediaActionsProvider, useMediaActions } from "@/lib/store/MediaActionsContext";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({ children }: { children?: ReactNode }) {
  const [search, setSearch] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduced = useReducedMotion();

  return (
    <MediaActionsProvider>
      <div className="relative min-h-dvh">
        <AtmosphereBackground />
        <Sidebar onOpenSearch={() => setSearch(true)} />
        <div className="lg:pl-[296px]">
          <TopBar onOpenSearch={() => setSearch(true)} />
          <main
            className="px-6 lg:px-10 lg:pb-16"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8rem)" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                variants={reduced ? pagePresenceReduced : pagePresence}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="will-change-[opacity,filter,transform]"
              >
                {children ?? <Outlet />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <MobileNav onOpenSearch={() => setSearch(true)} />
        <CommandPalette open={search} onOpenChange={setSearch} />
        <GlobalShortcuts />
        <RightSidebar sections={[{ title: "Lately", content: <ActivityFeed limit={6} /> }]} />
        <CaptureFab />
        <Toaster />
      </div>
    </MediaActionsProvider>
  );
}

function CaptureFab() {
  const { openAdd } = useMediaActions();
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .fab-glass-pill {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
        }
        .fab-border-gradient {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px;
          background: linear-gradient(135deg, oklch(0.72 0.18 255 / 0.6) 0%, oklch(0.65 0.22 295 / 0.2) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          transition: background 0.4s ease-out;
        }
        .fab-container:hover .fab-border-gradient {
          background: linear-gradient(135deg, oklch(0.72 0.18 255 / 1) 0%, oklch(0.65 0.22 295 / 0.8) 100%);
        }
        .fab-container {
          box-shadow: 0 8px 32px -8px rgba(0,0,0,0.5);
          transform: translateY(0);
        }
        .fab-container:hover {
          box-shadow: 0 16px 40px -12px oklch(0.72 0.18 255 / 0.65);
          transform: translateY(-3px);
        }
        .fab-container:active {
          transform: translateY(-1px) scale(0.97);
        }
        .fab-text {
          background: linear-gradient(to right, oklch(0.85 0.15 255), oklch(0.80 0.18 295));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          transition: filter 0.3s ease;
        }
        .fab-container:hover .fab-text {
          filter: brightness(1.2) drop-shadow(0 0 8px oklch(0.72 0.18 255 / 0.4));
        }
        .fab-icon {
          color: oklch(0.85 0.15 255);
          transition: color 0.3s ease, filter 0.3s ease;
        }
        .fab-container:hover .fab-icon {
          color: oklch(0.95 0.10 255);
          filter: drop-shadow(0 0 10px oklch(0.72 0.18 255 / 0.7));
        }
      `}} />
      <button
        onClick={openAdd}
        aria-label="Add to Chronicle"
        title="Add to Chronicle (⌘N)"
        className="fab-container group relative fixed bottom-24 right-5 z-40 flex items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-3 text-sm font-medium transition-[transform,box-shadow] duration-[400ms] ease-out lg:bottom-10 lg:right-10"
      >
        <div className="absolute inset-0 fab-glass-pill transition-colors duration-400 group-hover:bg-black/40" />
        <div className="fab-border-gradient" />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_oklch(0.72_0.18_255/0.1)] transition-shadow duration-400 group-hover:shadow-[inset_0_0_30px_oklch(0.72_0.18_255/0.25)] pointer-events-none" />
        
        <span className="relative flex items-center gap-2">
          <Plus className="h-[18px] w-[18px] fab-icon" />
          <span className="hidden sm:inline fab-text font-semibold tracking-wide text-[15px]">Add</span>
        </span>
      </button>
    </>
  );
}
