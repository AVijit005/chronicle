import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { getRelated, type EntityKind } from "@/lib/relationshipEngine";

export function RelationshipPanel({
  kind,
  id,
  title = "Connections",
}: {
  kind: EntityKind;
  id: string;
  title?: string;
}) {
  const r = getRelated(kind, id);
  const groups: {
    label: string;
    items: { id: string; title: string; to: string; params?: Record<string, string> }[];
  }[] = [];

  if (r.media.length)
    groups.push({
      label: "Related stories",
      items: r.media.map((m) => ({
        id: m.id,
        title: m.title,
        to: "/app/media/$id",
        params: { id: m.id },
      })),
    });
  if (r.collections.length)
    groups.push({
      label: "Collections",
      items: r.collections.map((c) => ({
        id: c.id,
        title: c.name,
        to: "/app/collections/$id",
        params: { id: c.id },
      })),
    });
  if (r.creators.length)
    groups.push({
      label: "Creators",
      items: r.creators.map((c) => ({
        id: c.id,
        title: c.name,
        to: "/app/creators/$id",
        params: { id: c.id },
      })),
    });
  if (r.characters.length)
    groups.push({
      label: "Characters",
      items: r.characters.map((c) => ({
        id: c.id,
        title: c.name,
        to: "/app/characters/$id",
        params: { id: c.id },
      })),
    });
  if (r.franchises.length)
    groups.push({
      label: "Franchises",
      items: r.franchises.map((f) => ({
        id: f.id,
        title: f.name,
        to: "/app/franchises/$id",
        params: { id: f.id },
      })),
    });
  if (r.journal.length)
    groups.push({
      label: "Journal",
      items: r.journal.map((j) => ({ id: j.id, title: j.title, to: "/app/journal" })),
    });
  if (r.goals.length)
    groups.push({
      label: "Goals",
      items: r.goals.map((g) => ({ id: g.id, title: g.title, to: "/app/goals" })),
    });
  if (r.quotes.length)
    groups.push({
      label: "Quotes",
      items: r.quotes.map((q) => ({
        id: q.id,
        title: q.text.slice(0, 60) + (q.text.length > 60 ? "…" : ""),
        to: "/app/quotes",
      })),
    });

  if (!groups.length) return null;

  return (
    <PremiumGlass variant="subtle">
      <div className="p-5 md:p-6">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{title}</div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {groups.map((g) => (
            <div key={g.label} className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                {g.label}
              </div>
              <ul className="mt-2 flex flex-wrap gap-2">
                {g.items.slice(0, 6).map((it) => (
                  <li key={it.id}>
                    {it.params ? (
                      <Link
                        to={it.to as never}
                        params={it.params as never}
                        className="glass-subtle inline-flex rounded-full px-3 py-1.5 text-xs hover:text-foreground"
                      >
                        {it.title}
                      </Link>
                    ) : (
                      <Link
                        to={it.to as never}
                        className="glass-subtle inline-flex rounded-full px-3 py-1.5 text-xs hover:text-foreground"
                      >
                        {it.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </PremiumGlass>
  );
}
