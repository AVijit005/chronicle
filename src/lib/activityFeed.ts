// Activity Feed — deterministic mock of recent user activity.
import { MEDIA, JOURNAL, ACHIEVEMENTS } from "@/lib/types";

export interface Activity {
  id: string;
  kind:
    | "Journal"
    | "Complete"
    | "Achievement"
    | "Collection"
    | "Timeline"
    | "Goal"
    | "Discovery"
    | "Memory"
    | "Favorite";
  label: string;
  when: string;
  mediaId?: string;
}

export function getActivityFeed(): Activity[] {
  const feed: Activity[] = [];
  for (const j of JOURNAL)
    feed.push({
      id: `a-${j.id}`,
      kind: "Journal",
      label: `Wrote "${j.title}" about ${j.media}`,
      when: j.date,
    });
  for (const m of MEDIA.filter((x) => x.status === "completed").slice(0, 3))
    feed.push({
      id: `a-c-${m.id}`,
      kind: "Complete",
      label: `Completed ${m.title}`,
      when: "Recently",
      mediaId: m.id,
    });
  for (const a of ACHIEVEMENTS.slice(0, 2))
    feed.push({
      id: `a-ach-${a.id}`,
      kind: "Achievement",
      label: `Earned ${a.name}`,
      when: a.earned,
    });
  feed.push({
    id: "a-goal-1",
    kind: "Goal",
    label: "Reached 70% of Read 20 books",
    when: "Last week",
  });
  feed.push({
    id: "a-disc-1",
    kind: "Discovery",
    label: "Added 3 stories to Weekend Comfort",
    when: "Last week",
  });
  feed.push({ id: "a-mem-1", kind: "Memory", label: "A memory resurfaced", when: "This week" });
  return feed.slice(0, 14);
}
