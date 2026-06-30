// Global context + provider that owns the AddSheet modal.
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { AddSheet } from "@/components/capture/AddSheet";
import { ProgressLogger } from "@/components/media/ProgressLogger";
import { ReflectionDrawer } from "@/components/media/ReflectionDrawer";

interface ActionsCtx {
  openAdd: () => void;
  openProgress: (id: string) => void;
  openReflection: (id: string) => void;
}

const Ctx = createContext<ActionsCtx | null>(null);

export function useMediaActions() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useMediaActions must be used inside MediaActionsProvider");
  return v;
}

export function MediaActionsProvider({ children }: { children: ReactNode }) {
  const [add, setAdd] = useState(false);
  const [progressId, setProgressId] = useState<string | null>(null);
  const [reflectionId, setReflectionId] = useState<string | null>(null);

  const openAdd = useCallback(() => setAdd(true), []);
  const openProgress = useCallback((id: string) => setProgressId(id), []);
  const openReflection = useCallback((id: string) => setReflectionId(id), []);

  // ⌘N / ctrl+N opens AddSheet from anywhere.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        const t = e.target as HTMLElement | null;
        const tag = t?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || t?.isContentEditable) return;
        e.preventDefault();
        setAdd(true);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <Ctx.Provider value={{ openAdd, openProgress, openReflection }}>
      {children}
      <AddSheet open={add} onOpenChange={setAdd} />
      <ProgressLogger id={progressId} onClose={() => setProgressId(null)} />
      <ReflectionDrawer id={reflectionId} onClose={() => setReflectionId(null)} />
    </Ctx.Provider>
  );
}
