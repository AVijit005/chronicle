// Premium empty-state presets — warm copy + soft inline illustrations.
// Illustrations are inline SVG (no deps). They float gently if reduced-motion
// is off, sit still otherwise.
import { motion, useReducedMotion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { PremiumButton } from "@/components/ui/PremiumButton";
import type { ReactNode } from "react";

/* ─── Illustration primitives ──────────────────────────────────────── */

function Float({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      initial={{ y: 0 }}
      animate={reduced ? undefined : { y: [0, -6, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      className="mx-auto"
    >
      {children}
    </motion.div>
  );
}

function BookSvg() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <defs>
        <linearGradient id="bk" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="oklch(0.72 0.18 255 / 0.55)" />
          <stop offset="1" stopColor="oklch(0.65 0.22 295 / 0.35)" />
        </linearGradient>
      </defs>
      <rect x="22" y="20" width="52" height="60" rx="6" fill="url(#bk)" />
      <rect x="22" y="20" width="52" height="60" rx="6" stroke="oklch(1 0 0 / 0.15)" />
      <path d="M48 24v52" stroke="oklch(1 0 0 / 0.25)" />
      <path
        d="M30 36h12M30 44h10M54 36h12M54 44h8"
        stroke="oklch(1 0 0 / 0.35)"
        strokeLinecap="round"
      />
    </svg>
  );
}
function StackSvg() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <rect x="14" y="38" width="68" height="36" rx="6" fill="oklch(0.72 0.18 255 / 0.4)" />
      <rect x="20" y="28" width="56" height="34" rx="6" fill="oklch(0.7 0.12 240 / 0.5)" />
      <rect x="26" y="18" width="44" height="32" rx="6" fill="oklch(0.78 0.06 230 / 0.6)" />
      <rect x="14" y="38" width="68" height="36" rx="6" stroke="oklch(1 0 0 / 0.1)" />
    </svg>
  );
}
function HeartSvg() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <path
        d="M48 78s-26-15-26-34a14 14 0 0 1 26-7 14 14 0 0 1 26 7c0 19-26 34-26 34z"
        fill="oklch(0.72 0.18 12 / 0.45)"
        stroke="oklch(1 0 0 / 0.2)"
      />
    </svg>
  );
}
function CompassSvg() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <circle cx="48" cy="48" r="32" stroke="oklch(1 0 0 / 0.25)" />
      <circle cx="48" cy="48" r="22" stroke="oklch(1 0 0 / 0.12)" />
      <path
        d="M48 22v6M48 68v6M22 48h6M68 48h6"
        stroke="oklch(1 0 0 / 0.4)"
        strokeLinecap="round"
      />
      <path d="M48 48l14-20-20 14z" fill="oklch(0.72 0.18 255 / 0.6)" />
    </svg>
  );
}
function CalendarSvg() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <rect
        x="18"
        y="24"
        width="60"
        height="54"
        rx="6"
        fill="oklch(0.7 0.1 240 / 0.35)"
        stroke="oklch(1 0 0 / 0.15)"
      />
      <path d="M18 38h60" stroke="oklch(1 0 0 / 0.25)" />
      <circle cx="34" cy="20" r="3" fill="oklch(1 0 0 / 0.5)" />
      <circle cx="62" cy="20" r="3" fill="oklch(1 0 0 / 0.5)" />
      <rect x="30" y="48" width="10" height="6" rx="1.5" fill="oklch(0.72 0.18 255 / 0.6)" />
      <rect x="44" y="48" width="10" height="6" rx="1.5" fill="oklch(1 0 0 / 0.15)" />
      <rect x="58" y="48" width="10" height="6" rx="1.5" fill="oklch(1 0 0 / 0.15)" />
    </svg>
  );
}
function SearchSvg() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <circle cx="42" cy="42" r="20" stroke="oklch(1 0 0 / 0.3)" />
      <circle cx="42" cy="42" r="14" stroke="oklch(1 0 0 / 0.12)" />
      <path
        d="M58 58l16 16"
        stroke="oklch(0.72 0.18 255 / 0.7)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function BellSvg() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <path
        d="M30 60V44a18 18 0 1 1 36 0v16l5 8H25l5-8z"
        fill="oklch(0.7 0.1 240 / 0.4)"
        stroke="oklch(1 0 0 / 0.18)"
      />
      <path d="M42 72a6 6 0 0 0 12 0" stroke="oklch(1 0 0 / 0.3)" />
    </svg>
  );
}
function ChartSvg() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <rect x="16" y="56" width="12" height="22" rx="2" fill="oklch(0.72 0.18 255 / 0.5)" />
      <rect x="34" y="42" width="12" height="36" rx="2" fill="oklch(0.7 0.16 260 / 0.55)" />
      <rect x="52" y="32" width="12" height="46" rx="2" fill="oklch(0.68 0.18 290 / 0.6)" />
      <rect x="70" y="48" width="12" height="30" rx="2" fill="oklch(0.72 0.14 230 / 0.5)" />
      <path d="M14 24l24 6 18-10 26 12" stroke="oklch(1 0 0 / 0.35)" strokeLinecap="round" />
    </svg>
  );
}
function SparklesSvg() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <path d="M48 14l4 14 14 4-14 4-4 14-4-14-14-4 14-4z" fill="oklch(0.72 0.18 255 / 0.6)" />
      <path d="M74 50l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" fill="oklch(0.65 0.22 295 / 0.55)" />
      <path d="M22 60l1.5 5 5 1.5-5 1.5-1.5 5-1.5-5-5-1.5 5-1.5z" fill="oklch(1 0 0 / 0.35)" />
    </svg>
  );
}

/* ─── State shell ──────────────────────────────────────────────────── */

function State({
  illustration,
  title,
  description,
  action,
  hint,
}: {
  illustration: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  hint?: string;
}) {
  return (
    <PremiumGlass variant="subtle" className="mx-auto max-w-xl">
      <div className="grid place-items-center px-8 py-14 text-center md:px-12 md:py-16">
        <Float>{illustration}</Float>
        <h3 className="mt-6 font-display text-2xl tracking-tight md:text-3xl">{title}</h3>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">{description}</p>
        {action && <div className="mt-6">{action}</div>}
        {hint && (
          <div className="mt-4 text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
            {hint}
          </div>
        )}
      </div>
    </PremiumGlass>
  );
}

/* ─── Variants — surface-specific copy, never templated ───────────── */

export const NoJournal = () => (
  <State
    illustration={<BookSvg />}
    title="The first page is the hardest"
    description="One sentence is enough. Tomorrow you'll be glad it exists."
    action={
      <Link to="/app/journal">
        <PremiumButton size="sm">Begin writing</PremiumButton>
      </Link>
    }
    hint="Shift + J"
  />
);
export const NoCollections = () => (
  <State
    illustration={<StackSvg />}
    title="No shelves yet"
    description="A collection is a room you can return to. Group three stories that feel like one weather."
    action={
      <Link to="/app/collections">
        <PremiumButton size="sm">Open the workshop</PremiumButton>
      </Link>
    }
    hint="Shift + C"
  />
);
export const NoFavorites = () => (
  <State
    illustration={<HeartSvg />}
    title="The permanent ones live here"
    description="Mark a story that stayed with you. It belongs in the room you keep visiting."
  />
);
export const NoContinue = () => (
  <State
    illustration={<SparklesSvg />}
    title="Nothing in motion right now"
    description="When you open a book, start an episode, press play — it'll wait for you here."
  />
);
export const NoPlanning = () => (
  <State
    illustration={<StackSvg />}
    title="Nothing saved for later"
    description="Future adventures live here. Add the title, and Chronicle remembers why you wanted it."
  />
);
export const NoCalendar = () => (
  <State
    illustration={<CalendarSvg />}
    title="A quiet day in the archive"
    description="No memories are tied to this date yet. The calendar fills itself as you live."
  />
);
export const NoTimeline = () => (
  <State
    illustration={<CompassSvg />}
    title="Your timeline begins on the next page"
    description="The first chapter is whatever you log next. Even a re-watch counts."
  />
);
export const NoSearch = ({ term }: { term?: string }) => (
  <State
    illustration={<SearchSvg />}
    title={term ? `Nothing matches “${term}”` : "Search remembers everything"}
    description="Try a creator, a feeling, a half-remembered line. Chronicle is patient."
    hint="⌘ K"
  />
);
export const NoNotifications = () => (
  <State
    illustration={<BellSvg />}
    title="Nothing wants your attention"
    description="When Chronicle has something gentle to say, it'll surface here. Not before."
  />
);
export const NoAnalytics = () => (
  <State
    illustration={<ChartSvg />}
    title="Patterns need a few stories first"
    description="Log a handful of finishes and the shape of your year will begin to emerge."
  />
);
export const NoDashboard = () => (
  <State
    illustration={<SparklesSvg />}
    title="A blank Sunday morning"
    description="Start one thing — a chapter, an episode, a quiet note — and the dashboard begins to write itself."
  />
);
export const NoProfile = () => (
  <State
    illustration={<CompassSvg />}
    title="Your fingerprint is still forming"
    description="The more stories you live alongside, the more clearly the pattern shows."
  />
);
export const NoWrapped = () => (
  <State
    illustration={<SparklesSvg />}
    title="Wrapped opens in late November"
    description="Your year-in-review needs the year first. We're saving the best slides for then."
  />
);
export const NoMuseum = () => (
  <State
    illustration={<StackSvg />}
    title="The museum is still being curated"
    description="Pin a few favorites and Chronicle will hang them here — your private wing."
  />
);
export const NoBookmarks = () => (
  <State
    illustration={<HeartSvg />}
    title="No moments saved yet"
    description="Bookmark a line, a scene, a chapter. Saved fragments become the version of you you keep rereading."
  />
);
export const NoQuotes = () => (
  <State
    illustration={<BookSvg />}
    title="No quotes kept yet"
    description="Save a line that stops you. The shelf of kept sentences becomes a self-portrait."
  />
);
export const NoCharacters = () => (
  <State
    illustration={<HeartSvg />}
    title="No characters captured yet"
    description="When someone in a story changes you, save them. They live here as company."
  />
);
