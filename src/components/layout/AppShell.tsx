import { Outlet, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { AtmosphereBackground } from "@/components/atmosphere/AtmosphereBackground";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { TopBar } from "@/components/layout/TopBar";
import { CommandPalette } from "@/components/search/CommandPalette";
import { GlobalShortcuts } from "@/components/common/GlobalShortcuts";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { ActivityFeed } from "@/components/common/ActivityFeed";
import { pagePresence } from "@/lib/motion";
import { MediaActionsProvider, useMediaActions } from "@/lib/store/MediaActionsContext";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({ children }: { children?: ReactNode }) {
  const [search, setSearch] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

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
                variants={pagePresence}
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
      className="press-scale fixed bottom-24 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-medium text-primary-foreground shadow-[0_18px_44px_-18px_oklch(0_0_0_/0.7),0_0_28px_-6px_oklch(0.72_0.18_255_/0.5)] ring-1 ring-white/10 lg:bottom-10 lg:right-10"
    >
      <Plus className="h-4 w-4" />
      <span className="hidden sm:inline">Add</span>
    </button>
  );
}
