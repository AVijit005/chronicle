import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { authApi } from "@/lib/api";

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
    } catch {
      throw redirect({ to: "/auth" });
    }
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
