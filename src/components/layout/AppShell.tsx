import { Outlet, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
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
import { useOnline } from "@/hooks/use-online";
import { trackPageView } from "@/lib/analytics-tracker";

export function AppShell({ children }: { children?: ReactNode }) {
  const [search, setSearch] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduced = useReducedMotion();
  const online = useOnline();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return (
    <MediaActionsProvider>
      <div className="relative min-h-dvh">
        {!online && (
          <div className="sticky top-0 z-[150] bg-amber-500/90 text-black text-center py-2 text-sm font-medium">
            You're offline. Changes will sync when you reconnect.
          </div>
        )}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
        >
          Skip to main content
        </a>
        <AtmosphereBackground />
        <Sidebar onOpenSearch={() => setSearch(true)} />
        <div className="lg:pl-[296px]">
          <TopBar onOpenSearch={() => setSearch(true)} />
          <main
            id="main-content"
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
    <button
      onClick={openAdd}
      aria-label="Add to Chronicle"
      title="Add to Chronicle (⌘N)"
      className="group press-scale fixed bottom-24 right-5 z-40 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ease-out lg:bottom-10 lg:right-10
      bg-black/40 backdrop-blur-xl 
      ring-1 ring-white/15 
      shadow-[inset_0_0_20px_oklch(0.72_0.18_255/0.15),0_8px_24px_-8px_rgba(0,0,0,0.5)]
      hover:-translate-y-1 hover:bg-black/30 hover:ring-white/25
      hover:shadow-[inset_0_0_30px_oklch(0.72_0.18_255/0.3),0_12px_32px_-10px_oklch(0.72_0.18_255/0.6)]"
    >
      <Plus className="h-[18px] w-[18px] text-cyan-300 transition-colors duration-300 group-hover:text-cyan-200" />
      <span className="hidden sm:inline bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent transition-all duration-300 group-hover:from-cyan-200 group-hover:to-violet-200">
        Add
      </span>
    </button>
  );
}
