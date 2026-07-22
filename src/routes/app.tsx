import { createFileRoute, Outlet, redirect, isRedirect } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { authApi } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";

export const Route = createFileRoute("/app")({
  beforeLoad: async ({ context }) => {
    // Check if user is authenticated by trying to fetch current user.
    // If the query fails (401), redirect to auth page.
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
      if (error instanceof ApiError && error.status === 401) {
        throw redirect({ to: "/auth" });
      }
      // Re-throw other errors so the UI doesn't crash to login for network blips
      throw error;
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
