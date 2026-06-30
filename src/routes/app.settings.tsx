import { createFileRoute, Link } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";
import {
  User,
  Moon,
  BookOpen,
  Sparkles,
  Lock,
  SlidersHorizontal,
  ArrowUpRight,
  Download,
} from "lucide-react";

export const Route = createFileRoute("/app/settings")({ component: Page });

function Page() {
  const groups = [
    {
      icon: User,
      title: "You",
      desc: "Name, avatar, the small things that make Chronicle feel yours.",
    },
    {
      icon: Moon,
      title: "Appearance",
      desc: "Theme, accent, atmosphere, motion — how Chronicle feels to look at.",
    },
    {
      icon: BookOpen,
      title: "Reading experience",
      desc: "Typography, density, what surfaces first when you open the app.",
    },
    {
      icon: Sparkles,
      title: "Memories",
      desc: "How often Chronicle resurfaces old favourites and journal pages.",
    },
    {
      icon: Lock,
      title: "Privacy",
      desc: "What's shared, what stays yours, and how to take it all with you.",
    },
    {
      icon: SlidersHorizontal,
      title: "Advanced",
      desc: "Integrations, exports, and the dials most people never need.",
    },
  ];
  return (
    <div>
      <Link
        to="/app/import"
        className="press-scale mb-6 flex items-center gap-4 rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/15 to-secondary/10 p-5 transition hover:border-primary/50"
      >
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/[0.08]">
          <Download className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-base tracking-tight">Import & Export</div>
          <div className="mt-1 text-[13px] leading-relaxed text-foreground/65">
            Bring your library in from JSON or CSV — or back it all up to a file you control.
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 text-primary" />
      </Link>
      <ComingSoon
        eyebrow="Personalize"
        title="Make Chronicle yours."
        description="Six small rooms for the choices that shape how Chronicle feels. Nothing here is loud."
        preview={
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {groups.map((g) => (
              <button
                key={g.title}
                className="glass flex items-start gap-4 rounded-2xl p-5 text-left transition hover-lift"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/[0.06]">
                  <g.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-base tracking-tight">{g.title}</div>
                  <div className="mt-1 text-[13px] leading-relaxed text-foreground/65">
                    {g.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        }
      />
    </div>
  );
}
