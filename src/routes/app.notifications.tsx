import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/app/notifications")({ component: Page });

function Page() {
  const notifs = [
    { title: "New episode of One Piece", subtitle: "Episode 1092 dropped 2h ago", time: "2h" },
    { title: "Your streak is on fire", subtitle: "47 days of media journaling", time: "Today" },
    {
      title: "Collection updated",
      subtitle: "3 new titles in The Nolan Universe",
      time: "Yesterday",
    },
  ];
  return (
    <ComingSoon
      eyebrow="Quiet alerts"
      title="Notifications."
      description="Only what matters — new episodes, milestones, gentle reminders. Never pushy."
      preview={
        <div className="space-y-2">
          {notifs.map((n, i) => (
            <div key={i} className="glass flex items-start gap-4 rounded-2xl p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.06]">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm">{n.title}</div>
                <div className="text-xs text-muted-foreground">{n.subtitle}</div>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {n.time}
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}
