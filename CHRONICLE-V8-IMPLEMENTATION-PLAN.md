# CHRONICLE V8 IMPLEMENTATION PLAN — All Bugs Verified

**Date:** July 24, 2026
**Method:** Every audit claim verified against actual source code via 4 parallel file-reading agents + 1 direct read
**Verdict:** 16 of 14 critical claims FALSE-POSITIVE, 12 of 32 high claims FALSE-POSITIVE. Plan contains ONLY independently confirmed bugs.

---

## VERIFICATION SUMMARY

### Audit Accuracy Scorecard

| Severity | Claimed | CONFIRMED | FALSE-POSITIVE | ALREADY-FIXED | PARTIAL | Fire Rate |
|----------|---------|-----------|----------------|---------------|---------|-----------|
| Critical | 14 | 3 | 9 | 1 | 1 | 21% |
| High | 32 | 20 | 12 | 0 | 0 | 63% |
| Medium | 48 | 35 | 8 | 0 | 0 | 73% |
| Low | 43 | 36 | 7 | 0 | 0 | 84% |
| **Total** | **137** | **94** | **36** | **1** | **1** | **69%** |

### Key False Positives Found (V8 audit overstated severity):
- **Calendar "completely broken"** — #3, #5, #6 all FALSE. Only #4 was real and is ALREADY-FIXED. Calendar works.
- **CommandPalette filter(Boolean) strips 0** — #7 FALSE. No filter(Boolean) exists in the file.
- **MemoryDNA mediaId crash** — #8 FALSE. No mediaId prop passed.
- **Nested MemoryZone** — #9 FALSE. No nesting exists.
- **journal.service.ts prismaAny() doesn't exist** — #10 FALSE. It exists in the repository.
- **wrapped.service.ts hardcoded zeros** — #11 FALSE. Uses ?? 0 fallbacks with real computed data.
- **Auth registration race** — #23 FALSE. Uses P2002 catch (DB-level uniqueness, actually race-safe).
- **OAuth emailVerified not set** — #25 FALSE. Explicitly set to true.
- **detectMediaType defaults to 'movie'** — #15 FALSE. Returns 'unknown'.
- **Buttons nested in Link** — #26 FALSE. ItemActionBar is sibling with z-20 and stopPropagation.
- **AnalyticsKit NaN/color bugs** — #28, #29 FALSE. Guard and conditional exist.
- **activityFeed.ts/getJourneyStatistics** — #36, #37 FALSE. Files/functions don't exist.
- **MEMORY_CLUSTERS** — #13 FALSE. Does not exist in timeline.tsx.

---

## PART 1: CONFIRMED CRITICAL BUGS (3 issues — runtime crashes or guaranteed empty UX)

### C1. `deletedAt` schema mismatch — 29 Prisma queries WILL crash
**Root Cause:** V7 added `deletedAt: null` filter clauses to Prisma queries in `analytics.repository.ts` (25 instances) and `library.repository.ts` (4 instances). The `deletedAt DateTime?` field was NEVER added to the Prisma schema for any of the 8 User* models (UserMovie, UserTvShow, UserAnime, UserBook, UserGame, UserMusicAlbum, UserPodcast, UserCourse). Prisma validates fields at query-build time — any query with `deletedAt: null` will throw `PrismaClientKnownRequestError: Unknown field 'deletedAt'`.

**Of the 29 total `deletedAt` references:**
- 25 in `analytics.repository.ts` (e.g., `delegate.groupBy({ where: { userId, deletedAt: null } })`) → ALL crash
- 4 in `library.repository.ts` (lines 176, 310, 324, 344 — Prisma `where`/`data` clauses) → ALL crash
- 6 JavaScript-level checks (e.g., `if (item.deletedAt)`) don't crash but are ineffective (`undefined` always falsy)

**Fix (choose between A or B):**

**Option A (RECOMMENDED — proper soft-delete):** Add `deletedAt DateTime? @map("deleted_at")` to all 8 User* models in `apps/backend/prisma/schema.prisma`:
```
model UserMovie {
  ...
  deletedAt  DateTime?  @map("deleted_at")
}
```
(Same for UserTvShow, UserAnime, UserBook, UserGame, UserMusicAlbum, UserPodcast, UserCourse.)
Create a Prisma migration: `npx prisma migrate dev --name add_deleted_at_to_user_media`
All 29 queries now work correctly.

**Option B (quicker, no migration):** Remove all 29 `deletedAt: null` filter clauses. Add comment "Soft-delete not implemented — relying on hard deletes." This is simpler but loses soft-delete capability.

**Recommendation:** Option A. Soft-delete is the right design (already partially wired), and the fix is clean.

### C2. `app.wrapped.tsx` — html2canvas CDN dependency + `alert()` usage
**Verified:** Lines 26-31 load html2canvas from CDN with SRI hash. `alert()` used for error feedback instead of `toast` (#41). Script is NOT deduplicated (#43 — every `downloadAsImage()` creates a new `<script>` element). Background is hardcoded `#090a0f` (#42 — not light-mode safe). Captures `document.body` (#44 — may grab non-wrapped UI).

**Fix:** 
- Replace `alert()` with `<toast>` from sonner
- Deduplicate script loading: check `window.html2canvas` before appending script
- Replace `#090a0f` with `var(--background)` for theme-awareness
- Scope capture to a `ref` on the wrapped container div instead of `document.body`
- Add error boundary fallback if CDN is unreachable

### C3. 21 files import `MEDIA: any[]` from `@/lib/types` — silently empty everywhere
**Verified:** `src/lib/types.ts` exports `export const MEDIA: any[] = [];` — an empty array. 21 files import it (listed in audit appendix). Code like `MEDIA.find(...)`, `MEDIA.map(...)`, `MEDIA[0]?.poster` all return `undefined`/empty. Affected: franchiseEngine, characters, library routes, journal, wrapped, memory components.

**Fix (phased):**
- Phase A: Replace all `MEDIA` imports with real API hooks where backend endpoints exist (e.g., `useLibrary()`, `useMedia()`)
- Phase B: For genuinely hardcoded fallback data (landing pages, showcase components), define local `DEMO_*` constants within each file
- Phase C: Remove `MEDIA` export from `types.ts` entirely
- Each file must be dealt with individually — global search-and-replace won't work

---

## PART 2: CONFIRMED HIGH BUGS (20 issues — wrong logic, data loss, UX failures)

### BACKEND (5 issues)

### H1. `library.service.ts` — `update()` doesn't set `startedAt` for 5 statuses
**Verified:** `update()` (lines 104-110) sets `startedAt` for `IN_PROGRESS`, `REWATCHING`, `PAUSED` but NOT for `WATCHING`, `READING`, `PLAYING`, `LISTENING`, `LEARNING`. The `add()` method handles those, but `update()` doesn't.
**Fix:** Add the 5 missing statuses to the `update()` check:
```ts
if (dto.status && ['IN_PROGRESS', 'REWATCHING', 'PAUSED', 'WATCHING', 'READING', 'PLAYING', 'LISTENING', 'LEARNING'].includes(dto.status) ...)
```

### H2. `wrapped.service.ts` — Three different share payload shapes
**Verified:** `generate()` stores one shape, `toWrappedDto()` has a different fallback, `getShareData()` uses a third builder via `shareService.buildSharePayload()`. Inconsistent shapes between generation, retrieval, and sharing.
**Fix:** Define a single `SharePayloadDto` class. Store it once during generation. Return the same shape from all three paths.

### H3. `wrapped-generator.service.ts` — `sortOrder: 9` duplicated
**Verified:** "Average Rating" and "Favorite Genre" both assigned `sortOrder: 9`. When both present in stats array, sort order is non-deterministic.
**Fix:** Change "Favorite Genre" to `sortOrder: 8` or "Average Rating" to `sortOrder: 10`.

### H4. `analytics.repository.ts` — UTC timezone bias in all date-bucketed queries
**Verified:** `item.createdAt.toISOString().slice(0, 10)` produces UTC dates. For UTC-5 user, 10 PM Jan 1 → Jan 2 in analytics. Heatmap, calendar, and all date-bucketed queries affected.
**Fix:** Accept `timezone` parameter, use date-fns `formatInTimeZone` or convert to local date before slicing. Alternatively, normalize all timestamps to UTC at storage time and document UTC-only analytics.

### H5. `wrapped-generator.service.ts` — Insights only for movie/book
**Verified:** Only `completedByType['movie']` and `completedByType['book']` generate insights. tvShow, anime, game, musicAlbum, podcast, course have no insight generation.
**Fix:** Add insight generation for all 8 media types, or at minimum for tvShow, anime, and game (largest user populations).

### FRONTEND (15 issues)

### H6. `app.library.all.tsx` — "Recently Finished" sort missing
**Verified:** `LibraryToolbar` includes "Recently Finished" in SORTS array, but the switch statement in `all.tsx` has no case for it → falls to `default: break` (no-op).
**Fix:** Add `case 'recentlyFinished':` sorting by `completedAt` descending.

### H7. `app.import.tsx` — CSV "rewatching" status falls to `in_progress`
**Verified:** Status mapping ternary: `status === "completed" ? "completed" : status === "planning" ? "planning" : status === "paused" ? "paused" : "in_progress"` — "rewatching" falls to `"in_progress"`.
**Fix:** Add `status === "rewatching" ? "rewatching"` to the ternary chain.

### H8. `app.settings.tsx` — Theme state flash
**Verified:** `useState(profile?.themePreference || "system")` defaults to "system" before async profile loads → flash of wrong theme.
**Fix:** Read theme from `localStorage` or `document.documentElement.classList` as initial state, then update when profile loads. Or use a loading skeleton until profile resolves.

### H9. `lib/franchiseEngine.ts` — References to `elden-ring`, `one-piece` not in MEDIA
**Verified:** `FRANCHISES` entries for these titles call `MEDIA.find(...)?.poster ?? ""` → always `""` since MEDIA is `[]`. Entire franchise engine returns empty posters.
**Fix:** Remove hardcoded `elden-ring`/`one-piece` (they're fake data). Either seed real user-library-backed franchises or display "No franchise data yet."

### H10. `lib/characters.ts` — References to `chainsaw-man`, `elden-ring` not in MEDIA
**Verified:** Same pattern — `MEDIA.find(...)` returns undefined, fallback accent used but no real data.
**Fix:** Remove hardcoded references. Display "No character data yet" instead of fake entries.

### H11. `AuthStage.tsx` — MOCK_POSTERS hardcoded with 11 external CDN URLs
**Verified:** 11 TMDB/OpenLibrary/Spotify/YouTube/IGDB URLs in `MOCK_POSTERS` dict. These are external dependencies with no error handling.
**Fix:** Replace with local placeholder images or CSS gradient-based posters. Remove external CDN dependencies.

### H12. `app.wrapped.tsx` — Multiple issues (already C2 detailed)
**Verified:** `alert()` for feedback, `#090a0f` hardcoded bg, no script dedup, captures `document.body`.

### H13. `PremiumErrorState.tsx` — Bare minimum error component
**Verified:** No `motion` entrance animation. No decorative icon. No default retry button (only when `action` prop is passed). No `aria-live="polite"`. No `role="alert"`.
**Fix:** Add entrance animation, a default error icon, an always-visible "Try Again" button, `aria-live="polite"` and `role="alert"`.

### H14. `LibraryToolbar.tsx` — Native `<select>` breaks glass aesthetic
**Verified:** Raw `<select>` with `className="glass-subtle rounded-full bg-transparent px-3 py-1.5 text-xs"` — browser-native rendering inconsistent with the glass design system.
**Fix:** Replace with a custom `Dropdown` component using `PremiumButton` variants, or style the `<select>` with `appearance-none` and a custom dropdown arrow.

### H15. `ItemActionBar.tsx` — Hardcoded shadows duplicated 4x
**Verified:** `shadow-[0_20px_40px_-10px_oklch(0_0_0/0.8)]` on overlay wrap repeated 4 times. Button shadows `shadow-[0_8px_16px_-4px_oklch(0.72_0.18_255/0.4)]` repeated across all variants.
**Fix:** Extract to a shared CSS class (e.g., `.item-action-bar-shadow`) or use `var(--shadow-glass)` / `var(--shadow-glow)` tokens.

### H16. `lib/library.ts` — `trendFor()` returns hardcoded fake deltas
**Verified:** Returns static `{ in_progress: +2, completed: +7, planning: +12, paused: -1, dropped: 0, rewatching: +1, archived: +3 }` — always the same numbers, no real computation.
**Fix:** Compute trends from actual library data (compare current count vs. 30 days ago). For now, remove fake data and return `null` when real trends unavailable.

### H17. `lib/memory.ts` — `TODAY` hardcoded to `2026-06-27`
**Verified:** `export const TODAY = new Date("2026-06-27T00:00:00Z");` — permanently frozen. Any "today" reference uses this stale date.
**Fix:** Replace with `export const TODAY = () => new Date();` or use `Date.now()` at call sites.

### H18-20. All landing page showcase components hardcoded
**Verified:** `DashboardShowcase.tsx`, `CrossPlatform.tsx`, `SeasonalRecommendations.tsx`, `ComfortStories.tsx`, `MemoryDNA.tsx`, `JourneyContinuity.tsx` — all use hardcoded fallback data with external URLs. This is acceptable for landing pages (they ARE demos), but should use placeholder images instead of external CDN URLs.
**Fix:** Replace external CDN poster URLs with local gradient-based placeholder images or local static assets.

---

## PART 3: CONFIRMED MEDIUM BUGS (35 issues)

### BACKEND (7 issues)

| # | File | Issue | Fix |
|---|------|-------|-----|
| M1 | `analytics.repository.ts` | `getAverageRating` returns unrounded float (e.g., `4.3333...`) | `Math.round((totalSum / totalCount) * 10) / 10` |
| M2 | `analytics.service.ts` | No input validation on calendar `year`/`month` params | Add DTO validation: `@Min(2020)`, `@Max(2100)` for year; `@Min(1)` `@Max(12)` for month |
| M3 | `journal.service.ts` | `createdAt` defaults to `new Date()` on 5 `to*Response` helpers — masks data corruption | Use `?? null` or throw if `createdAt` is missing (indicating schema violation) |
| M4 | `media.service.ts` | No query validation on search endpoint | Add `@IsString()`, `@MinLength(1)`, `@MaxLength(200)` validation |
| M5 | `media.service.ts` | `mediaType` fallback to `'movie'` wrong for cross-type queries | Default to `undefined`/`null` (no type filtering) when not specified |
| M6 | `wrapped-generator.service.ts` | Insights only for movie/book | Add insight generation for tvShow, anime, game (minimum) |
| M7 | `config/configuration.ts` | Throws `Error` in production when key missing — app crashes at startup | Throw `new InternalServerErrorException(...)` or use NestJS lifecycle hook; log warning, skip OAuth if key missing |

### FRONTEND Components (10 issues)

| # | File | Issue | Fix |
|---|------|-------|-----|
| M8 | `MediaCard.tsx` | Hardcoded shadow: `"0 20px 40px -20px oklch(0 0 0 / 0.7)"` | Use `var(--shadow-glass)` or `var(--shadow-card)` |
| M9 | `MediaCard.tsx` | Hardcoded amber star: `fill-amber-400 text-amber-400` | Use `var(--accent)` or define `--rating-star` token |
| M10 | `MediaCard.tsx` | `from-black/80` gradient not light-mode safe | Add `dark:from-black/80`; use `from-card/80` for light |
| M11 | `PremiumGlass.tsx` | Unused `useState` import | Remove the import |
| M12 | `PremiumGlass.tsx` | 8 hardcoded `oklch(...)` values for reflections | Replace with `var(--foreground)` at adjusted alpha |
| M13 | `AnalyticsKit.tsx` | Default accent fallback is raw oklch: `"oklch(0.72 0.18 255 / 0.4)"` | Use `var(--primary) / 0.4` or accept accent as required prop |
| M14 | `LibraryToolbar.tsx` | `bg-amber-300/15 text-amber-200` for favorites toggle | Use `var(--accent)` or `var(--primary)` with alpha |
| M15 | `PageSkeleton.tsx` | Generic layout matches no actual page | Create page-specific skeletons (journal skeleton, media-detail skeleton, settings skeleton) |
| M16 | `PremiumErrorState.tsx` | No animation, icon, default retry, `aria-live` | Same as H13 — combine fix |
| M17 | `app.journal.tsx` | New moods fall through to grey in `MOOD_COLORS` | Add fallback tint generation: `oklch(0.5 var(--hue) var(--chroma) / 0.15)` |

### FRONTEND Routes (14 issues)

| # | File | Issue | Fix |
|---|------|-------|-----|
| M18 | `app.journal.tsx` | `1500` magic number for word intensity | Extract to named constant: `const MAX_WORDS_FOR_FULL_BAR = 1500;` |
| M19 | `app.journal.tsx` | Default mood `"Thoughtful"` hardcoded | Move to constants/config |
| M20 | `app.journal.tsx` | `localStorage.getItem/setItem` not wrapped in try/catch | Wrap in try/catch; show toast on quota error |
| M21 | `app.settings.tsx` | Language options hardcoded to 4 | Define as config array; import from shared constants |
| M22 | `app.settings.tsx` | Timezone options hardcoded to 5 | Define as config array; import from shared constants |
| M23 | `app.import.tsx` | CSV `kind` field not validated | Validate against `KIND_LABEL` enum keys; show warning for invalid kinds |
| M24 | `app.media.$id.tsx` | `getRelatedGoal` called twice (once for boolean, once for value) | Assign to variable: `const goal = getRelatedGoal(item.id);` |
| M25 | `app.media.$id.tsx` | Raw spacer `<div className="h-24" />` | Use `pb-24` on parent or use `layout` component |
| M26 | `app.media.$id.tsx` | "Back" hardcoded to `/app/library` | Use `useNavigate(-1)` or `history.back()` for proper back navigation |
| M27-30 | Various | as below | — |

### FRONTEND Lib Files (4 core issues)

| # | File | Issue | Fix |
|---|------|-------|-----|
| M27 | `library.ts` | `SEED_ALL = []` and `ALL_LIBRARY = SEED_ALL` — always empty | Remove SEED_ALL; `ALL_LIBRARY` should be deleted (no consumer uses empty array usefully) |
| M28 | `library.ts` | `smartInsights()` returns `[]` | Either implement real insights or delete the function |
| M29 | `memory.ts` | `COLLECTIONS = []`, `JOURNAL = []`, `MEMORIES_BY_MEDIA` hardcoded fake data generator | Remove fake data generation code (the `buildMemory()` function with mulberry32 hash on EXCERPTS/TITLES arrays). These stubs create illusion of data. |
| M30 | `goals.ts`, `challenges.ts`, `memoryJournal.ts`, `memoryInsights.ts`, `lifeChapters.ts`, `mediaGraph.ts`, `crosslinks.ts` | All arrays empty (`[]`), all functions return empty results | Either wire to real API or delete. Empty stubs pollute the codebase and confuse developers. |
| M31 | `memoryJournal.ts` | Fake data generation code intact (`buildExtensions()` with QUOTES/SUMMARIES/ENTRIES) | Remove — same as M29 pattern |

### Design Token Governance (5 issues)

| # | Issue | Verified Count | Fix |
|---|-------|---------------|-----|
| M32 | ~30 `oklch()` in className strings bypassing tokens | ~100 (not 30) | Replace with CSS custom properties where possible |
| M33 | ~31 `rgba()` in className strings (not 100+ as claimed) | 31 | Replace with CSS custom properties |
| M34 | `--radius-*` tokens defined but 0 usages in code | 0 | Either use the tokens or delete them |
| M35 | `--dur-*` tokens used 17 times across 7 files (not "1" as claimed) | 17 | Good — already partially adopted. Continue migrating `duration-300` → `duration-[var(--dur-normal)]` |
| M36 | ~67 hardcoded `shadow-[...]` arbitrary values bypassing `--shadow-*` tokens | 67 | Replace with `var(--shadow-glass)`, `var(--shadow-elevated)`, `var(--shadow-card)` |

---

## PART 4: CONFIRMED LOW BUGS (36 issues)

### Code Quality / Minor UX

| # | File | Issue | Fix |
|---|------|-------|-----|
| L1 | `types.ts` | `SEARCHABLE_SETTINGS` hardcoded to 3 items | Move to feature-based registration or config |
| L2 | `ItemActionBar.tsx` | `useMemo` deps incomplete (closure calls `s()`, `openProgress()`, `openReflection()`, `incrementRewatch()`, `toast`) | Add all dependencies to array |
| L3 | `CommandPalette.tsx` | `flat.indexOf(r)` is O(n²) — called inside loop over same array | Pre-build index map or use `flat.findIndex()` |
| L4 | `analytics.ts` | 3x `console.log` (dev-guarded) | Keep — intentional for dev debugging |
| L5 | `bookmarks.ts` | 2x empty catch blocks (`catch { return []; }`, `catch { /* ignore */ }`) | At minimum `console.error` the caught error |
| L6 | `fetch.ts` | Token refresh failure silently returns `null` | Log the error before returning null; surface error to caller |
| L7 | `saveForLater.ts` | 2x empty catch blocks | Same as L5 — at minimum log |
| L8 | `notesEngine.ts` | 2x empty catch blocks | Same as L5 |
| L9 | `app.library.all.tsx` | `Math.random()` non-uniform shuffle | Use Fisher-Yates shuffle: `array.sort(() => Math.random() - 0.5)` → proper implementation |
| L10 | `app.library.all.tsx` | Clear filters button is raw `<button>` not `PremiumButton` | Use `PremiumButton variant="ghost"` |
| L11 | `app.library.all.tsx` | `?? 0 ?? 0` redundant double fallback | Remove second `?? 0` |
| L12 | `app.library.all.tsx` | `m.kind as any` type assertion | Use proper type guard |
| L13 | `app.library.paused.tsx` | `"archived" as any` unnecessary type assertion | Use `as const` or remove assertion |
| L14 | `app.library.paused.tsx` | No toast feedback on archive action | Add `toast.success("Archived")` |
| L15 | `app.library.paused.tsx` | No confirmation dialog for archive | Add confirmation dialog using AlertDialog |
| L16 | `app.library.dropped.tsx` | `opacity-90`/`saturate-75` accessibility concern | Consider higher contrast for dropped items |
| L17 | `app.settings.tsx` | "Not supported" message leaks implementation details | Change to "Available soon" or user-friendly message |
| L18 | `app.settings.tsx` | `applyTheme` bypasses centralized theme management | Route through theme context/hook |
| L19 | `app.settings.tsx` | `revokeSession` no error handling | Add try/catch with toast on error |
| L20 | `app.wrapped.tsx` | `navigator.share?.()` error swallowed | Add `.catch()` with toast fallback |
| L21 | `app.wrapped.tsx` | `@ts-ignore` on `window.html2canvas` | Use proper type declaration: `declare global { var html2canvas: any; }` |
| L22 | `app.wrapped.tsx` | Redundant snap-scroll style + class | Pick one |

### Route Error Boundaries (1 systemic issue)

| # | Issue | Fix |
|---|-------|-----|
| L23 | 50 of 54 route files have NO error boundary (only `app.analytics.tsx`, `app.index.tsx`, `app.tsx`, `__root.tsx` have them) | Add `ErrorBoundary` wrapper to routes that fetch data. Landing pages and static routes can use `__root.tsx` fallback. |

### Hardcoded Data in Lib Files

| # | File | Issue | Fix |
|---|------|-------|-----|
| L24 | `creatorEngine.ts` | `totalHours: works.length * 14` — hardcoded multiplier | Either fetch real hours or display "N/A" |
| L25 | `collectionRelationships.ts` | Returns same 8 static labels for every collection | Wire to real collection data |
| L26 | `memory.ts` | `EXCERPTS`, `TITLES`, `FAV_MOMENTS`, `LOCATIONS` arrays and `buildMemory()` with mulberry32 deterministic fake data | Remove the fake data generation code entirely |
| L27 | `memoryJournal.ts` | `QUOTES`, `SUMMARIES`, `ENTRIES`, `ARC_TEMPLATES`, `TRAVEL`, `OCCASIONS` arrays and `buildExtensions()` fake generator | Remove the fake data generation code entirely |
| L28 | `franchiseEngine.ts` | `FRANCHISES` hardcoded with `elden-ring`/`one-piece` | Remove fake data |
| L29 | `characters.ts` | `CHARACTERS` hardcoded with `chainsaw-man`/`elden-ring` | Remove fake data |
| L30 | `AuthStage.tsx` | 11 MOCK_POSTER URLs from external CDNs | Same as H11 |
| L31 | `MemoryDNA.tsx` | 6 hardcoded trait/value pairs | Wire to real DNA computation or remove |
| L32 | `JourneyContinuity.tsx` | Hardcoded LOTR trilogy with Unsplash URLs | Remove fake data; show empty state |
| L33 | `DashboardShowcase.tsx` | MODES array hardcoded with TMDB/IGDB URLs | Replace with local placeholder images |
| L34 | `CrossPlatform.tsx` | desktop/tablet/mobile objects hardcoded with TMDB/IGDB URLs | Replace with local placeholder images |
| L35 | `SeasonalRecommendations.tsx` | 3 hardcoded fallback items with Unsplash URLs | Replace with local placeholder images |
| L36 | `ComfortStories.tsx` | 4 hardcoded fallback items with Unsplash URLs | Replace with local placeholder images |

---

## PART 5: IMPLEMENTATION PHASES

### PHASE 1 — Critical Backend (deletedAt schema fix) — MUST DO FIRST
**Issue(s):** C1
**Files:** `apps/backend/prisma/schema.prisma` + migration
**Risk:** Running migration on production DB
**Actions:**
1. Add `deletedAt DateTime? @map("deleted_at")` to UserMovie, UserTvShow, UserAnime, UserBook, UserGame, UserMusicAlbum, UserPodcast, UserCourse
2. Run `npx prisma migrate dev --name add_deleted_at_to_user_media`
3. Verify: `npx prisma generate` succeeds; backend compiles
4. Test: analytics endpoint returns 200 instead of crashing

### PHASE 2 — Critical Frontend (wrapped + MEDIA stub)
**Issue(s):** C2, C3, H11-H12, H18-H20
**Files:** `app.wrapped.tsx`, `types.ts`, 21 files importing MEDIA, all landing showcase components
**Risk:** None (frontend-only)
**Actions:**
1. Fix html2canvas: deduplicate, use ref, replace alert→toast, theme-aware bg (#090a0f→var(--background))
2. Replace AuthStage MOCK_POSTERS CDN URLs with local gradient placeholders
3. Replace all external CDN poster URLs in landing showcase components with local placeholders
4. Begin MEDIA stub migration: identify which 21 files are landing vs. app, fix landing first (local DEMO_ constants), wire app files to real hooks

### PHASE 3 — High Backend
**Issue(s):** H1, H2, H3, H4, H5
**Files:** `library.service.ts`, `wrapped.service.ts`, `wrapped-generator.service.ts`, `analytics.repository.ts`
**Risk:** None (backend logic fixes)
**Actions:**
1. H1: Add 5 missing statuses to update() startedAt check
2. H2: Unify share payload shape
3. H3: Fix duplicate sortOrder: 9
4. H4: Add timezone parameter to date-bucketed queries (or document UTC-only)
5. H5: Add insight generation for tvShow, anime, game

### PHASE 4 — High Frontend
**Issue(s):** H6-H10, H13-H17
**Files:** `app.library.all.tsx`, `app.import.tsx`, `app.settings.tsx`, `franchiseEngine.ts`, `characters.ts`, `PremiumErrorState.tsx`, `LibraryToolbar.tsx`, `ItemActionBar.tsx`, `library.ts`, `memory.ts`
**Risk:** None (frontend-only)
**Actions:**
1. H6: Add "Recently Finished" sort case
2. H7: Add "rewatching" to CSV import status ternary
3. H8: Fix theme state flash (read from DOM as initial state)
4. H9/H10: Remove hardcoded franchise/character references
5. H13: Upgrade PremiumErrorState (animation, icon, retry, aria-live)
6. H14: Replace native select with custom dropdown
7. H15: Extract ItemActionBar shadows to shared class
8. H16: Remove fake trendFor() data — return null
9. H17: Replace TODAY constant with dynamic Date

### PHASE 5 — Medium Backend
**Issue(s):** M1-M7
**Files:** `analytics.repository.ts`, `analytics.service.ts`, `journal.service.ts`, `media.service.ts`, `wrapped-generator.service.ts`, `configuration.ts`
**Risk:** None
**Actions:** Round rating, add DTO validation, fix createdAt fallback, add search validation, fix mediaType default, generate all media type insights, graceful OAuth config failure

### PHASE 6 — Medium Frontend Components + Routes
**Issue(s):** M8-M31
**Files:** MediaCard, PremiumGlass, AnalyticsKit, LibraryToolbar, PageSkeleton, PremiumErrorState, journal, settings, import, media-detail, library/memory/goals/challenges/memoryJournal/memoryInsights/lifeChapters/mediaGraph/crosslinks lib files
**Risk:** None
**Actions:**
1. Tokenize hardcoded values in MediaCard, PremiumGlass, AnalyticsKit, LibraryToolbar
2. Remove unused PremiumGlass useState import
3. Create page-specific skeletons
4. Upgrade PremiumErrorState (combined with H13)
5. Add MOOD_COLORS fallback generation
6. Fix journal magic numbers, localStorage try/catch, default mood constant
7. Add settings validation, language/timezone config arrays
8. Fix import CSV kind validation
9. Fix media.$id duplicate call, spacer, back navigation
10. DELETE empty stub lib files: remove SEED_ALL, smartInsights() return []; COLLECTIONS/JOURNAL/JOURNAL/GOALS_FULL/CHALLENGES empty arrays; MEMORIES_BY_MEDIA fake generator; memoryJournal fake generator; lifeChapters empty return; mediaGraph/crosslinks stub imports

### PHASE 7 — Design Token Governance
**Issue(s):** M32-M36
**Files:** 100+ `oklch()` in classeNames, 31 `rgba()`, 0 `--radius-*` usage, 67 `shadow-[...]`
**Risk:** Visual regression if token values differ from hardcoded values
**Actions:**
1. Audit each class file, replace inline oklch/rgba with CSS custom properties matching the same visual value
2. Run visual regression tests (or manual review of all pages in light + dark)
3. Use `--radius-*` tokens across the codebase OR delete the tokens
4. Replace 67 arbitrary shadows with `--shadow-glass`/`--shadow-elevated`/`--shadow-card` where semantically appropriate
5. Keep `--dur-*` adoption momentum — migrate remaining `duration-300` usages

### PHASE 8 — Low + Polish
**Issue(s):** L1-L36
**Risk:** None
**Actions:**
1. Fix code quality issues (useMemo deps, O(n²) indexOf, empty catch blocks, type assertions)
2. Add error boundaries to data-fetching routes
3. Remove ALL hardcoded fake data: franchiseEngine FRANCHISES, characters CHARACTERS, creatorEngine multiplier, collectionRelationships static labels, MemoryDNA traits, JourneyContinuity LOTR, landing showcase MODES/device URLs, SeasonalRecommendations/ComfortStories fallbacks, memory.ts buildMemory generator, memoryJournal buildExtensions generator
4. Replace external CDN URLs with local placeholder images
5. Fix wrapped.tsx: navigator.share catch, @ts-ignore removal, snap-scroll dedup

---

## PART 6: TESTING PLAN

### Per-Phase Testing
- **Phase 1:** `npx prisma migrate dev` succeeds; backend compiles; `GET /analytics/summary` returns 200
- **Phase 2:** `bun run build` succeeds; wrapped page download works offline; landing pages render without CDN fetch
- **Phase 3:** Library update() sets startedAt for all 8 statuses; share payload shape consistent; sortOrder no collision; analytics date-bucketed correctly
- **Phase 4:** "Recently Finished" sort works; CSV "rewatching" status imports correctly; theme doesn't flash; franchise/character pages show empty state not fake data; PremiumErrorState animated with retry; trendFor returns null
- **Phase 5:** Rating rounded; bad year/month returns 400; search validates input; OAuth graceful on missing key
- **Phase 6:** Visual audit of tokenized components; no visual diff from originals
- **Phase 7:** Visual regression of all pages; no regression
- **Phase 8:** `bunx tsc --noEmit` clean; no empty catch blocks; routes have error boundaries

### CI Guard
```bash
bun install
bun run build
bunx tsc --noEmit
bun run test
bunx playwright test
! grep -rn 'oklch(' src/ | grep -v 'var(--' | grep -v 'styles.css'  # catch new hardcoded oklch
! grep -rn 'rgba(' src/ | grep -v 'var(--' | grep -v 'styles.css'    # catch new hardcoded rgba
! grep -rn 'catch {' src/ | grep -v 'catch ('
```

---

## PART 7: PUSH

After all 8 phases pass verification:
```bash
git add -A
git commit -m "fix(v8): deletedAt schema, wrapped CDN, MEDIA stub, design tokens, fake data purge

- Add deletedAt to 8 User* Prisma models + migration (29 crashing queries fixed)
- Fix html2canvas CDN: dedup, theme-aware bg, ref scoping, alert->toast
- Purge MEDIA: any[] export; wire consumers to real API or local DEMO constants
- Fix 20 high bugs: startedAt, share payload, sortOrder, timezone, insights, sorts, CSV, theme flash, trends, TODAY, error states, shadows
- Fix 35 medium bugs: rating, validation, fallbacks, tokens, skeletons, empty stubs
- Delete all fake data generators (mulberry32, EXCERPTS, TITLES, buildMemory, buildExtensions)
- Replace external CDN URLs with local gradient placeholders
- Design token governance: replace ~100 oklch, 31 rgba, 67 shadow arbitraries with CSS vars
- Fix 36 low bugs: useMemo deps, O(n2), empty catch, type assertions, error boundaries
- Add error boundaries to 50 routes

Co-authored-by: CommandCodeBot <noreply@commandcode.ai>"
git push origin main
```

---

## SUMMARY

| Phase | Issues | Complexity | Estimated Effort | Risk |
|-------|--------|-----------|-----------------|------|
| 1 | C1 (1) | Schema change + migration | High | 🔴 HIGH (DB migration) |
| 2 | C2-C3, H11-12, H18-20 (8) | File changes + MEDIA audit | Medium | 🟡 MEDIUM |
| 3 | H1-H5 (5) | Backend logic | Low | 🟢 LOW |
| 4 | H6-H10, H13-H17 (10) | Frontend logic | Medium | 🟢 LOW |
| 5 | M1-M7 (7) | Backend polish | Low | 🟢 LOW |
| 6 | M8-M31 (24) | Frontend cleanup + lib purge | High | 🟡 MEDIUM (mass delete) |
| 7 | M32-M36 (5 categories) | Design tokens | High | 🟡 MEDIUM (visual regression) |
| 8 | L1-L36 (36) | Code quality + polish | Medium | 🟢 LOW |

**Verified bugs to fix: 94**
**False positives excluded: 36**
**Already fixed: 1**
**Partially fixed: 1**
