# Chronicle

> A Personal Memory Operating System for the stories you live through.

Chronicle is a frontend-first application for tracking, reflecting on, and
re-experiencing every kind of story you consume — movies, series, anime,
books, manga, games, music, podcasts, courses, and articles. It treats
your media history as a living archive of memory rather than a checklist.

> **Status:** Frontend complete (v1.0). Local-first, no backend required.
> All data persists to `localStorage` via a Zustand store. Backend
> integration is the next phase.

---

## Vision

Most trackers ask *"what did you watch?"*. Chronicle asks *"what stayed
with you, and why?"* — and then surfaces those answers back to you
across every page.

The product is built around five loops:

1. **Capture** — universal `⌘N` Add Sheet for any media type.
2. **Lifecycle** — Start, Pause, Complete, Rewatch, Archive, Favorite.
3. **Reflect** — moods, ratings, journal entries, quotes captured at completion.
4. **Resurface** — those reflections re-appear on Dashboard, Journal,
   Quotes, Wrapped, Analytics, and individual media pages.
5. **Own** — full JSON/CSV import + export, no account required.

---

## Features

- **Universal Library** with status taxonomy (in progress, completed,
  planning, paused, dropped, rewatching, archived, favorites).
- **Living Dashboard** with deterministic greetings, focus items,
  resurfacing memories, and live stats from your real activity.
- **Cinematic Media Detail** pages with chaptered reading, related
  journeys, quotes, and personal reflections per item.
- **Collections, Franchises, Creators, Characters** as first-class entities.
- **Memory OS** — Journal, Quotes, Wrapped, Timeline, Museum, On This Day.
- **Discovery Engine** — Because You Loved, Continue Universe, Comfort
  Stories, Seasonal/Weekend recommendations.
- **Intelligence Layer** — Taste Profile, Story DNA, Memory DNA,
  Life Soundtrack, Personal Statements.
- **Goals, Achievements, Challenges, Smart Collections.**
- **Command Palette** (`⌘K`) and global keyboard shortcuts.
- **Import / Export** of the full library as JSON or CSV.

---

## Tech stack

- **Framework:** [TanStack Start](https://tanstack.com/start) v1 (React 19, Vite 7, file-based routing)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 + design tokens in `src/styles.css`
- **UI primitives:** shadcn/ui + Radix
- **Animation:** Motion (Framer Motion successor)
- **State:** Zustand with `localStorage` persistence (`src/lib/store/libraryStore.ts`)
- **Charts:** Recharts + custom editorial visualizations
- **Routing:** TanStack Router (typed, file-based)
- **Deployment target:** Cloudflare Workers / Edge (via Nitro)

---

## Folder structure

```
src/
  components/
    ui/                 shadcn primitives (Button, Dialog, etc.)
    layout/             AppShell, Sidebar, TopBar, MobileNav, RightSidebar
    common/             Shared widgets (QuickActionsMenu, ActivityFeed, EmptyStates)
    capture/            AddSheet — universal capture
    media/              MediaCard, ItemActionBar, ProgressLogger, ReflectionDrawer
    media-detail/       CinematicHero, Chapter, MediaInformation, PersonalMemory
    memory/             LiveStatsStrip, YourReflectionsRail, YourQuotesRail
    dashboard/          Living homepage widgets
    library/            Library hero, toolbar, stats, status pages
    collections/        Collections workspace
    discovery/          Discovery Engine surfaces
    intelligence/       Taste / DNA / Soundtrack visualisations
    goals/, achievements/, challenges/
    profile/            Museum, Memory Map, Life Chapters, Quote Gallery
    journal/, timeline/, editorial/, share/
    search/             CommandPalette
    landing/            Marketing landing page
  lib/
    store/              Zustand store + live selectors + MediaActions context
    mock.ts             Seed library (MEDIA, COLLECTIONS, JOURNAL…)
    library.ts          Status taxonomy + selectors (merges seed + live store)
    memory*.ts          Memory OS engines
    discovery.ts        Discovery selectors
    recommendationEngine.ts
    intelligence.ts, statsEngine.ts, profileEngine.ts
    collectionEngine.ts, franchiseEngine.ts, creatorEngine.ts
    goals.ts, achievements.ts, challenges.ts, smartCollections.ts
    searchIndex.ts, shortcuts.ts, preferences.ts
  routes/               File-based routes (see TanStack Start docs)
  styles.css            Tailwind v4 entry + design tokens
```

---

## Getting started

Requirements: [Bun](https://bun.sh) ≥ 1.1.

```bash
bun install
bun run dev          # http://localhost:8080
bun run build        # production build
bunx tsgo --noEmit   # typecheck
bunx eslint .        # lint
```

---

## Design philosophy

- **Editorial, not dashboard.** Type, whitespace, and pacing matter as
  much as data density.
- **One identity per primitive.** A single `PremiumGlass`, one
  `PremiumButton`, one card grammar — never two visual systems for the
  same purpose.
- **Semantic tokens only.** No hardcoded hex colors in components.
  Every accent comes from `styles.css` or an existing oklch value.
- **Deterministic.** Mock data is seeded with mulberry32; `TODAY` is
  fixed so SSR and client match.
- **Reduced motion respected** globally via Motion's `motion-reduce`.
- **Keyboard first.** `⌘K` palette, `⌘N` capture, `?` shortcut guide.

---

## Current limitations

- No real backend — all writes persist to `localStorage`. Clearing
  storage clears your library.
- No authentication. The `/auth` route is presentational only.
- Seed data is shipped in `src/lib/mock.ts` to make the app feel
  populated on first load. Imports merge into the live store on top.
- External import adapters (Letterboxd, Goodreads, MyAnimeList,
  Trakt) are not yet implemented — generic JSON/CSV only.
- No sync across devices.

---

## Backend roadmap

The frontend is structured so a backend can slot in without rewriting
selectors. Every page already reads from one of:

- `useLibraryStore()` — the Zustand store (mutations, persistence)
- Pure selectors under `src/lib/` — derive from store + seed
- `liveSelectors.ts` — reactive hooks for live stats / reflections / quotes

To wire a backend later, replace `libraryStore`'s persistence layer
with a TanStack Query + server-function pair. Selector signatures stay
identical.

Planned phases:

1. Auth + per-user storage (Lovable Cloud / Supabase).
2. Cloud sync of `libraryStore` state.
3. External tracker importers (Letterboxd, Goodreads, MAL, Trakt, Spotify).
4. Metadata enrichment (TMDB, OpenLibrary, IGDB, MAL).
5. Social layer (shared collections, friend activity).

---

## Documentation

- [`docs/README.md`](docs/README.md) — deeper architectural notes
- [`docs/design-system.md`](docs/design-system.md) — design tokens + primitives
- [`AGENTS.md`](AGENTS.md) — conventions for AI-assisted contributions

---

## License

Private project. All rights reserved.
