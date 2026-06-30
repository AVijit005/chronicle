import type { Collection } from "@/lib/mock";

const EVENTS = (c: Collection) => [
  { kind: "Created", label: "Collection created", when: c.createdAt ?? "—" },
  { kind: "Added", label: "First story added", when: c.createdAt ?? "—" },
  { kind: "Milestone", label: "Reached 10 items", when: "Later that year" },
  { kind: "Journal", label: "First journal entry", when: "Same season" },
  { kind: "Achievement", label: "Curator earned", when: "Recently" },
  { kind: "Favorite", label: "Marked a favorite", when: "—" },
  { kind: "Reorganized", label: "Reorganized", when: "Last month" },
  { kind: "Shared", label: "Shared with a friend", when: "—" },
  { kind: "Memory", label: "Memory resurfaced", when: "This week" },
  { kind: "Updated", label: `Last updated ${c.updatedAt}`, when: c.updatedAt ?? "—" },
];

export function CollectionTimeline({ collection }: { collection: Collection }) {
  const events = EVENTS(collection);
  return (
    <ol className="relative space-y-4 border-l border-white/10 pl-6">
      {events.map((e, i) => (
        <li key={i}>
          <span className="absolute -left-[7px] mt-2 h-3 w-3 rounded-full bg-white/10 ring-1 ring-white/20" />
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">{e.kind}</div>
          <div className="text-sm">{e.label}</div>
          <div className="text-[11px] text-muted-foreground">{e.when}</div>
        </li>
      ))}
    </ol>
  );
}
