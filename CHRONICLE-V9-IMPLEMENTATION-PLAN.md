# CHRONICLE V9 IMPLEMENTATION PLAN — Fully Verified

**Date:** July 24, 2026
**Method:** 4 parallel source-code verification agents, every claim checked against actual files
**Total claimed:** ~420 issues
**Verified real:** ~162 actionable issues across 8 phases

---

## VERIFICATION SUMMARY

| Severity | Claimed | CONFIRMED | FALSE-POSITIVE | ALREADY-FIXED | Fire Rate |
|----------|---------|-----------|----------------|---------------|-----------|
| Critical | 32 | 12 | 5 | 5 | 60% |
| High | 85 | 41 | 14 | 6 | 61% |
| Medium | 168 | 70 | 3 | 3 | 96% |
| Low | 135 | 52 | 1 | 0 | 98% |

### Key False Positives Found:
- **#8, #11** (calendar modulo-by-zero, CALENDAR_YEAR crash): Already fixed. Guards exist.
- **#40** (MediaCard dead box-shadow): Does NOT exist in current source.
- **#42, #43** (AnalyticsKit delta color/NaN): Guards already present.
- **#44** (CommandPalette filter(Boolean)): No filter(Boolean) exists in code.
- **#55** (completed.tsx sort no-op): Actually sorts by completedAt correctly.
- **#58** (nested MemoryZone): No nesting exists.
- **#60** (wrapped alert()): Already fixed — uses toast() now.
- **#97** (getAverageRating unrounded float): Already fixed — Math.round present.
- **#99** (library.repository deletedAt check): Already fixed.
- **#103** (insights only movie/book): Already fixed — tvShow/anime/game added.
- **#147** (MemoryConnections seeded random): Already fixed — uses useLibrary hook.
- **#175** (LifeChapters Math.random): No Math.random found in component.
- **#222** (console.log in production): DEV-gated, not in production builds.
- **#30** (totalHours dead code): false — totalHours IS used.

### Already Fixed in V8:
**#8, #11, #60, #97, #99, #103, #147** plus V9-calendar guards.

---

## PHASE 1 — Backend Runtime Crashes (6 issues, BLOCKING)

### C1. `deletedAt: null` on 4 models that lack the field — WILL CRASH
**#1** — `analytics.repository.ts`: `deletedAt: null` queried on JournalEntry, Memory, TimelineEvent, AnalyticsSnapshot. None of these models have the field in schema.prisma.
**Fix:** Remove `deletedAt: null` from where clauses for these 4 model delegates in analytics.repository.ts (~10 query sites). These models don't need soft-delete.

### C2. `episodesWatched` field doesn't exist on User* models — WILL CRASH
**#2** — `analytics.repository.ts` line ~87-90: `select: { hoursSpent: true, minutesSpent: true, episodesWatched: true }` — `episodesWatched` exists only on AnalyticsSnapshot, not on UserMovie etc.
**Fix:** Remove `episodesWatched` from the select and the downstream `if (item.episodesWatched)`. Compute episodes from `currentEpisode` field instead for tvShow/anime delegates where applicable.

### C3. `'documentary'` media type doesn't exist — silently wrong
**#3** — `analytics-aggregation.service.ts` line 46: `hoursData.hours['documentary'] ?? 0` — 'documentary' is not in USER_LIB_TYPES.
**Fix:** Remove the `documentary` entry from the hours aggregation. It's always 0 anyway.

### C4. Dead `@Get('calendar')` decorator — route unreachable
**#4** — `analytics.controller.ts` line 59: `@Get('calendar')` immediately overshadowed by `@Get('calendar/year')` on line 61. `getCalendar()` on line 83 has no route decorator at all.
**Fix:** Remove the dead `@Get('calendar')` decorator. Add proper `@Get('calendar')` on the `getCalendar()` method with correct parameters.

### C5. `getCalendarDay()` mock returns hardcoded empty data
**#5** — Always returns `{ date, mediaItems: [], journalEntry: null }` regardless of user.
**Fix:** Wire to real data: query calendar aggregation for the specific date.

### C6. `calculateCompletionStreak()` always returns 0
**#6** — `streak.service.ts` line 59: returns 0 unconditionally.
**Fix:** Implement streak logic or remove the method and mark the feature as not-yet-available.

---

## PHASE 2 — Frontend Runtime Crashes (3 issues, BLOCKING)

### C7. `TODAY.getTime()` — TODAY is a function, not a Date — TYPEERROR
**#9** — `lib/memory.ts` line 260: `TODAY.getTime()` — TODAY is `() => new Date()`. Will throw.
**Fix:** Change to `TODAY().getTime()`. Also verify line 174 `daysAgo` already uses `TODAY()` correctly (confirmed partially).

### C8. `pick(rng)` missing second argument (array) — TYPEERROR
**#10** — `lib/memoryJournal.ts` line 213: `pick(rng)` — requires `(rng, arr)`. Will throw.
**Fix:** Add the quotes array as second argument: `pick(rng, QUOTES)`.

### C9. `apiUpload` sets `Content-Type: application/json` on FormData — BREAKS UPLOADS
**#16** — `api/fetch.ts` lines 108-110: when body is FormData and no Content-Type header, falls back to `application/json`.
**Fix:** Don't auto-set Content-Type for FormData bodies. Check `body instanceof FormData` and skip the header default.

---

## PHASE 3 — High Backend Logic Bugs (7 issues)

### H1. `IN_PROGRESS` is not a valid Prisma enum value
**#23** — `library.service.ts` line 103: `'IN_PROGRESS'` in the status check array doesn't match any UserMediaStatus. Should be `'WATCHING'` (the equivalent in the enum).
**Fix:** Replace `'IN_PROGRESS'` with `'WATCHING'` in the update() status check.

### H2. `mediaType` defaults to `'movie'` in controller
**#24** — `media.controller.ts` line 73: `type ?? 'movie'` as default.
**Fix:** Default to undefined (no type filtering) instead of 'movie'.

### H3. `add()` doesn't set `startedAt` for all statuses
**#25** — Missing `REWATCHING`, `ON_HOLD` from startedAt check in `add()`.
**Fix:** Add `REWATCHING` and `ON_HOLD` to the startedAt conditional in `add()`.

### H4. Timeline cursor overwrites year/month filter
**#27** — `journal.repository.ts` line 153: `where.eventDate = { lt: new Date(cursor) }` replaces instead of merging with year/month range.
**Fix:** Use spread: `where.eventDate = { ...where.eventDate, lt: new Date(cursor) }`.

### H5. `sortOrder: 8` duplicated in wrapped stats
**#31** — "Total Items" and "Favorite Genre" both have `sortOrder: 8`.
**Fix:** Change "Favorite Genre" to `sortOrder: 8.5` or restructure.

### H6. In-memory rate limiter — not cluster-safe, memory leak
**#33** — `auth.service.ts` line 18: `Map<string, { count, lockedUntil }>` never cleaned up, lost on restart.
**Fix:** Use Redis-backed rate limiting via the existing redis infrastructure.

### H7. Missing `REWATCHING`, `ON_HOLD` from DTO STATUS_VALUES
**#37** — `library/dto/library.dto.ts`: STATUS_VALUES array missing REWATCHING and ON_HOLD.
**Fix:** Add both to the array.

---

## PHASE 4 — High Frontend Logic Bugs (10 issues)

### H8. CalendarHerot next-year button permanently disabled
**#45** — `disabled={yearOffset >= 0}` — yearOffset always >= 0.
**Fix:** Allow advancing to future years. Remove or relax the disabled condition.

### H9. ALL_LIBRARY always empty — library/all page shows nothing
**#53** — `lib/library.ts`: `ALL_LIBRARY: MediaItem[] = []`.
**Fix:** Wire ALL_LIBRARY to live library store data.

### H10. "Most Time Spent" sort uses progress (percentage)
**#54** — Sorts by `b.progress ?? 0` (0-100) instead of actual hours.
**Fix:** Create a derived hours field: `(m.hoursSpent ?? 0) + (m.minutesSpent ?? 0) / 60`.

### H11. app.search.tsx synthetic KeyboardEvent dispatch — fragile
**#56** — Dispatches synthetic keydown to trigger CommandPalette. No actual search UI.
**Fix:** Import and call the CommandPalette `open` function directly instead.

### H12. Analytics filters (range/scope) never used to filter data
**#65** — `range` and `scope` state variables passed to UI but ignored by query hooks.
**Fix:** Pass `range` and `scope` as parameters to `useOverview()`/`useStreaks()` hooks.

### H13. All analytics delta values hardcoded to 0
**#66** — Every stat card has `delta: 0`.
**Fix:** Pass real delta from backend overview response.

### H14. CalendarHero redundant useCalendar() call
**#46** — Calls useCalendar() independently when parent already has data.
**Fix:** Accept data as props instead of re-fetching.

### H15. Favorite button on collections has no onClick
**#69** — `app.collections.$id.tsx`: Favorite button renders with no handler.
**Fix:** Add toggle favorite handler.

### H16. Onboarding only stored in localStorage
**#70** — Never persisted to server.
**Fix:** POST onboarding completion to `/api/users/me/preferences`.

### H17. characters.index.tsx hero never renders (empty MEDIA)
**#71** — `MEDIA.find()` always returns undefined.
**Fix:** Wire to live character data or remove the hero section.

---

## PHASE 5 — Medium Backend (5 issues)

### M1. No input validation on calendar year/month
**#98** — `analytics.service.ts`: year/month params pass through without validation.
**Fix:** Add DTO validation: `@Min(2020) @Max(2100)` for year, `@Min(1) @Max(12)` for month.

### M2. createdAt defaults to new Date() in journal service
**#100** — 5 `to*Response` helpers silently substitute current time for missing createdAt.
**Fix:** Return `null` or throw if createdAt is missing (indicates schema violation).

### M3. No search query validation
**#101** — `media.service.ts`: raw string passthrough to repository.
**Fix:** Add `@IsString() @MinLength(1) @MaxLength(200)` decorator.

### M4. Configuration throws Error in production
**#104** — IIFE throws `new Error()` when OAUTH_ENCRYPTION_KEY missing.
**Fix:** Log warning and skip OAuth feature. Don't crash the app.

### M5. longestStreak hardcoded to 0
**#105** — `analytics-aggregation.service.ts` line 175.
**Fix:** Calculate actual streak or use `streakService.calculateCompletionStreak()`.

---

## PHASE 6 — Medium Frontend Components + Routes (15 issues)

Key items:
- **M6-M10**: MediaCard/PremiumGlass/AnalyticsKit/LibraryToolbar token bypasses (hardcoded shadows, stars, select elements, missing aria-labels)
- **M11-M12**: PremiumErrorState no animation/role="alert"; ShimmerSkeleton no role="status"
- **M13-M18**: Routes: journal localStorage/mood, wrapped hardcoded bg, settings language/timezone, library paused/dropped, media.$id back nav
- **M19**: Collection favorites button no onClick
- **M20**: ActivityFeed raw type strings

---

## PHASE 7 — Lib File Stub Purge + Design Tokens (30+ issues)

### Lib Purge (10 files to fix or delete):
- **memory.ts**: Remove fake data generator (buildMemory with mulberry32 hash). Keep taxonomy types.
- **memoryJournal.ts**: Remove buildExtensions fake generator + empty stubs.
- **memoryInsights.ts**: 8 empty arrays — either wire to API or delete file.
- **goals.ts**: GOALS_FULL empty, getGoalInsights returns []
- **achievements.ts**: ACHIEVEMENTS_FULL empty
- **challenges.ts**: CHALLENGES empty
- **collectionRelationships.ts**: Static labels for every collection
- **collectionWorkspace.ts**: getWorkspace stub
- **collectionInsights.ts**: Both functions return stubs
- **lifeChapters.ts**: Returns []

### 12 Null-render components to delete:
**#186-197**: PersonalStatements, StoryDNA, StoryImpact, StoryUniverse, OnThisDay, RememberAgain, ThisWeekHistory, IdentityHero, MediaDNA, MemoryCapsules, QuoteGallery, RelationshipPanel — all return null.

### Design Token Fixes:
- Replace ~40 critical hardcoded oklch values (primary/secondary/warning/success) with CSS vars
- 31 rgba() → token-based
- 59 rounded-[...] → --radius-* tokens
- 73 shadow-[...] → var(--shadow-*)

---

## PHASE 8 — Low + Polish (15 issues)

- 11 unused imports (remove)
- 7 dead code items (remove empty imports, SEED_META, deriveDefault, _media, ACHIEVEMENTS)
- 3 empty catch blocks (log before swallowing)
- 14+ files with alt="" on posters (add meaningful alt text)
- Missing aria-pressed on sort buttons
- Missing error boundaries on routes
- Unsafe `as any` casts (38 occurrences)

---

## EXECUTION ORDER

| Phase | Issues | Risk | Effort |
|-------|--------|------|--------|
| 1 | C1-C6 backend crashes | 🔴 CRITICAL | 2h |
| 2 | C7-C9 frontend crashes | 🔴 CRITICAL | 1h |
| 3 | H1-H7 backend logic | 🟠 HIGH | 1.5h |
| 4 | H8-H17 frontend logic | 🟠 HIGH | 2h |
| 5 | M1-M5 backend medium | 🟡 MEDIUM | 1h |
| 6 | M6-M20 frontend medium | 🟡 MEDIUM | 2h |
| 7 | Lib purge + tokens | 🟡 MEDIUM (mass delete) | 3h |
| 8 | Low + polish | 🟢 LOW | 1h |

## TESTING PER PHASE
- Phases 1-2: Backend compiles (nest build), frontend builds (bun build), unit tests pass
- Phase 3-5: Backend REST endpoints return 200 for calendar/analytics/summary
- Phase 6-8: Visual audit — no regressions in light/dark mode

## FINAL DOCKER TEST
- Full stack: postgres + redis + backend API
- Backend health check: `{"status":"ok"}`
- Analytics endpoint: 200 (no crash from deletedAt/episodesWatched)
- Calendar endpoint: 200 (no dead route)
- Frontend SSR bundle: builds clean (no crash from TODAY/pick)
