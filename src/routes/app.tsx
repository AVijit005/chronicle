import { createFileRoute, Outlet, redirect, isRedirect } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { authApi } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";

export const Route = createFileRoute("/app")({
  beforeLoad: async ({ context }) => {
    if (typeof window === "undefined") return;

    const { queryClient } = context;
    try {
      const user = await queryClient.fetchQuery({
        queryKey: ["auth", "me"],
        queryFn: () => authApi.getCurrentUser(),
        staleTime: 5 * 60_000,
      });
      if (!user) {
        throw redirect({ to: "/auth" });
      }
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
      throw redirect({ to: "/auth" });
    }
  },
  component: () => (
    <AppShell>
      <ErrorBoundary fallback={<div className="p-8 text-center text-muted-foreground">App content could not load.</div>}>
        <Outlet />
      </ErrorBoundary>
    </AppShell>
  ),
});
