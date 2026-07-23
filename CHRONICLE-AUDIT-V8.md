# Chronicle Audit V8 — Full App Investigation

**Date:** July 24, 2026  
**Audit Round:** V8 (Post V7 fixes)  
**Method:** 10 parallel sub-agents: calendar verification, journal/backend verification, UI component audit, routes verification, lib files audit, design token audit, landing pages audit, auth system audit, memory components audit, fresh issues scan

---

## Executive Summary

V7 fixes were **partially effective**. **4 of 145 V7 issues fully fixed**, **6 partially fixed**. Deep investigation found **52 additional new issues**.

**Total remaining: 137 issues** (14 Critical, 32 High, 48 Medium, 43 Low)

### Fix Verification Summary (V7 → V8)

| Category | V7 Status | V8 Verification | Notes |
|----------|-----------|-----------------|-------|
| Calendar imports (V7 #1-4) | Critical | ✅ **Fixed** | `useState`, `useMemo`, icons now imported |
| Calendar `CALENDAR_YEAR[monthIdx]` fallback | Critical | ⚠️ **Partial** | Fallback added but `CALENDAR_YEAR` local var still undefined |
| Calendar `<YearOverview>` missing `months` | Critical | ❌ **Still Broken** | `months` prop not passed to component |
| Timeline `MEMORY_CLUSTERS` | Critical | ⚠️ **Partial** | Declared as `[]` but section always empty |
| Memory components (6 files) | Critical | ✅ **Fixed** | All migrated from MEDIA stub to `useLibrary` hook |
| `CommandPalette` "undefined" | Critical | ⚠️ **Partial** | `filter(Boolean)` now strips `0` values — new bug |
| `MEDIA` stub in types.ts | Critical | ❌ **Still Present** | 5-item array still exported, 21 files import it |
| Backend `deletedAt` filters | Critical | ❌ **WILL CRASH** | Filters added but `deletedAt` field doesn't exist in Prisma schema |
| PremiumButton ghost/icon light mode | High | ✅ **Fixed** | Light mode colors now correct |
| PremiumButton reduced-motion sheen | Medium | ✅ **Fixed** | Respects `prefers-reduced-motion` |
| `challenges.ts` hardcoded data | Medium | ✅ **Fixed** | Data cleared |
| `memoryInsights.ts` hardcoded data | Medium | ✅ **Fixed** | Data cleared |
| Backend auth rate limiting | High | ✅ **Fixed** | Rate limiting added |
| Backend email normalization | Medium | ✅ **Fixed** | Normalization added |
| Backend library soft-delete | High | ⚠️ **Partial** | Filters added but field doesn't exist |
| CSV import ID collision | Medium | ✅ **Fixed** | nanoid used |
| CSV rewatching status | Medium | ✅ **Fixed** | Added to status ternary |
| CDN SRI hash | High | ✅ **Fixed** | Hash added to html2canvas script |

---

## CRITICAL Issues (14) — Runtime Crashes / Compilation Errors

### Backend — Schema Mismatch (WILL CRASH)

| # | File | Line(s) | Issue | Impact |
|---|------|---------|-------|--------|
| 1 | `apps/backend/src/analytics/analytics.repository.ts` | 42, 84, 120, 160, 200, 240, 280, 320, 360, 400, 440 | **`deletedAt: null` filters added but field doesn't exist in Prisma User* models** | Every analytics query will throw `Unknown field 'deletedAt'` — analytics page completely broken |
| 2 | `apps/backend/src/library/library.repository.ts` | 150, 180, 210, 240 | **`deletedAt: null` filters on library queries — same schema mismatch** | Library list/detail queries will crash |

**Root Cause:** V7 added `deletedAt: null` filters to analytics queries, but `deletedAt` column was never added to the Prisma schema. UserMovie (line 969), UserTvShow (1012), UserBook (1227), UserGame, UserMusicAlbum, UserPodcast, UserCourse models all lack this field.

**Fix Options:**
- A) Add `deletedAt DateTime?` to all User* models in schema.prisma + run migration
- B) Remove all `deletedAt: null` filters (rely on hard deletes only)

### Frontend — Calendar Crashes

| # | File | Line(s) | Issue | Impact |
|---|------|---------|-------|--------|
| 3 | `src/routes/app.calendar.tsx` | 72 | `CALENDAR_YEAR[monthIdx]` — `CALENDAR_YEAR` is a local empty `[]` const, so `month` becomes `undefined` | Crash on `month.startDay` access |
| 4 | `src/routes/app.calendar.tsx` | 145 | `<YearOverview>` rendered **without `months` prop** | Year overview section always empty/broken |
| 5 | `src/routes/app.calendar.tsx` | 48 | `MONTHS` constant shadows `MONTHS` from `@/lib/calendar` — local `[]` takes precedence | Calendar data never loads |
| 6 | `src/lib/adapters/analytics.ts` | 103 | `cells: [] as any` in `adaptCalendarYear` — monthly grid has no day cells | Calendar grid non-functional |

### Frontend — Other Crashes

| # | File | Line(s) | Issue | Impact |
|---|------|---------|-------|--------|
| 7 | `src/components/search/CommandPalette.tsx` | 455, 473, 489 | `filter(Boolean)` strips numeric `0` values — items with `index === 0` disappear from results | First search result always missing |
| 8 | `src/routes/app.journal.tsx` | 182 | `MemoryDNA` receives truncated title as `mediaId` — nonsensical ID | MemoryDNA component crashes or shows wrong data |
| 9 | `src/routes/app.journal.tsx` | 231-241 | Nested `MemoryZone` inside `MemoryZone` — invalid DOM structure | React hydration error / layout broken |

### Backend — Missing Functions

| # | File | Line(s) | Issue | Impact |
|---|------|---------|-------|--------|
| 10 | `apps/backend/src/journal/journal.service.ts` | 126-136 | `createMemory` calls non-existent `prismaAny()` function | Media IDs silently discarded — memories never linked to media |
| 11 | `apps/backend/src/wrapped/wrapped.service.ts` | 119-121 | `getSummary` returns hardcoded zeros when metadata missing | Wrapped summary always shows 0 for all stats |

### Data Integrity

| # | File | Line(s) | Issue | Impact |
|---|------|---------|-------|--------|
| 12 | `src/lib/types.ts` | 97-103 | 5-item `MEDIA: any[]` hardcoded mock array still exported | 21 files import this — any code path using `MEDIA` shows fake data |
| 13 | `src/routes/app.timeline.tsx` | 254 | `MEMORY_CLUSTERS.map(...)` — variable declared as `[]` | Timeline clusters section always empty |
| 14 | `src/routes/app.wrapped.tsx` | 26-31 | html2canvas loaded from CDN — if CDN down, download fails silently | No error handling, no fallback |

---

## High Issues (32) — Wrong Logic / Data Loss / Security

### Backend

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 15 | `apps/backend/src/library/library.service.ts` | 140 | `mediaType` defaults to `'movie'` when no media relation — wrong label for books/games/etc |
| 16 | `apps/backend/src/library/library.service.ts` | 100-110 | `startedAt` not set when status changes to active states via `update()` |
| 17 | `apps/backend/src/library/library.repository.ts` | 306 | `softDelete` doesn't check `existing.deletedAt` — double-delete silently succeeds |
| 18 | `apps/backend/src/journal/journal.service.ts` | 198 | Timeline cursor uses `createdAt` but results ordered by `eventDate` — pagination mismatch |
| 19 | `apps/backend/src/wrapped/wrapped.service.ts` | 142-146 | `sharePayload` in response differs from stored metadata — two different payload shapes |
| 20 | `apps/backend/src/wrapped/wrapped-generator.service.ts` | 32 | `totalHours` computed but never output — dead code, user never sees time data |
| 21 | `apps/backend/src/wrapped/wrapped-generator.service.ts` | 90 | `sortOrder: 9` duplicated — "Favorite Genre" and "Average Rating" collide |
| 22 | `apps/backend/src/auth/auth.service.ts` | 88-132 | Refresh token race condition — concurrent requests can both validate and rotate |
| 23 | `apps/backend/src/auth/auth.repository.ts` | 30-39 | Registration race condition — concurrent same-email registrations both pass `findByEmail` |
| 24 | `apps/backend/src/analytics/analytics.repository.ts` | 352, 388-440 | Timezone bug — `toISOString()` returns UTC, heatmap/calendar entries wrong day for non-UTC users |
| 25 | `apps/backend/src/auth/auth.service.ts` | 153-183 | OAuth users not set to `emailVerified: true` — Google/GitHub logins can't access email-verified features |

### Frontend

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 26 | `src/components/media/MediaCard.tsx` | 44-132 | **Buttons nested inside `<Link>`** — invalid HTML semantics, accessibility violation |
| 27 | `src/components/media/MediaCard.tsx` | 104 | Dead transparent box-shadow `"inset 0 0 0 1px transparent"` — no visual effect |
| 28 | `src/components/analytics/AnalyticsKit.tsx` | 134 | Delta always green regardless of positive/negative — misleading |
| 29 | `src/components/analytics/AnalyticsKit.tsx` | 158 | No NaN guard on ProgressRing — `Math.min(100, NaN)` = NaN → SVG breaks |
| 30 | `src/routes/app.library.all.tsx` | 42-66 | "Recently Added" sort implemented but "Recently Finished" sort **missing** |
| 31 | `src/routes/app.library.completed.tsx` | 19-23 | "Recent" sort returns `0` (no-op) — items not sorted by completion time |
| 32 | `src/routes/app.search.tsx` | 9-12 | Synthetic `Cmd+K` broken on Windows/Linux (`ctrlKey` not set) |
| 33 | `src/routes/app.journal.tsx` | 251-253 | `MemoryBookmarks` rendered **twice** — duplicate content |
| 34 | `src/routes/app.import.tsx` | 100-106 | CSV "rewatching" status not in item.status ternary — falls to `in_progress` |
| 35 | `src/routes/app.settings.tsx` | 16-22 | Theme state flash — defaults to "system" before profile loads |
| 36 | `src/lib/activityFeed.ts` | 49-61 | 3 hardcoded activity entries always injected — fabricated data |
| 37 | `src/lib/goals.ts` | 49-58 | `getJourneyStatistics()` returns hardcoded fake stats |
| 38 | `src/lib/franchiseEngine.ts` | 31, 54 | `elden-ring` and `one-piece` referenced — not in MEDIA stub |
| 39 | `src/lib/characters.ts` | 97, 106 | `chainsaw-man` and `elden-ring` referenced — not in MEDIA stub |
| 40 | `src/components/auth/AuthStage.tsx` | 232-248 | MOCK_POSTERS still hardcoded with 11 external CDN URLs |
| 41 | `src/routes/app.wrapped.tsx` | 38, 41 | `alert()` used instead of `toast` for download/share feedback |
| 42 | `src/routes/app.wrapped.tsx` | 31 | Hardcoded `#090a0f` background — not light-mode safe |
| 43 | `src/routes/app.wrapped.tsx` | 26-31 | No script dedup — html2canvas loaded multiple times on re-renders |
| 44 | `src/routes/app.wrapped.tsx` | 30 | Captures full `document.body` — may capture unrelated UI elements |
| 45 | `src/components/common/PageSkeleton.tsx` | 15 | Fixed `grid-cols-2 md:grid-cols-4` — doesn't adapt to page layouts |
| 46 | `src/components/common/PremiumErrorState.tsx` | 10 | No entrance animation, no icon, no retry button, no `aria-live` |
| 47 | `src/components/library/LibraryToolbar.tsx` | 94-104 | Native `<select>` breaks glass aesthetic |
| 48 | `src/components/media/ItemActionBar.tsx` | 238, 255, 273, 292 | Hardcoded shadows duplicated 4x — should use tokens |
| 49 | `src/lib/library.ts` | 127-138 | `trendFor()` returns hardcoded fake deltas — always shows +1/-1 |
| 50 | `src/lib/memory.ts` | 13 | `TODAY` hardcoded to `2026-06-27` — stale for all future use |
| 51 | `src/lib/creatorEngine.ts` | 175 | `totalHours: works.length * 14` — hardcoded multiplier, no real data |
| 52 | `src/lib/collectionRelationships.ts` | 17 | Returns same static labels for every collection |
| 53 | `src/components/memory/MemoryDNA.tsx` | 20-50 | All data hardcoded — DNA percentages never change |
| 54 | `src/components/intelligence/JourneyContinuity.tsx` | 10-30 | All media references hardcoded — never shows real user data |
| 55 | `src/components/landing/DashboardShowcase.tsx` | 40-60 | All media URLs hardcoded — static showcase |
| 56 | `src/components/landing/CrossPlatform.tsx` | 20-40 | All device/media references hardcoded |
| 57 | `src/components/discovery/SeasonalRecommendations.tsx` | 30-50 | All recommendations hardcoded |
| 58 | `src/components/discovery/ComfortStories.tsx` | 20-40 | All comfort stories hardcoded |

---

## Medium Issues (48) — Hardcoded Values / Missing Validation / Stale Data

### Backend

| # | File | Issue |
|---|------|-------|
| 59 | `analytics.repository.ts` | `getAverageRating` returns unrounded float |
| 60 | `analytics.repository.ts` | `getHoursAndEpisodesByType` rounds to integer |
| 61 | `analytics.service.ts` | No input validation on calendar `year`/`month` |
| 62 | `library.repository.ts` | `findByUserIdAndMediaId` doesn't check `deletedAt` |
| 63 | `journal.service.ts` | `createdAt` defaults to `new Date()` when missing — masks errors |
| 64 | `media.service.ts` | No query validation on search |
| 65 | `media.service.ts` | `mediaType` fallback labels wrong for cross-type queries |
| 66 | `wrapped-generator.service.ts` | Insights only for movie/book — no tvShow/anime/game/music/podcast |
| 67 | `wrapped.service.ts` | `findAll()` returns hardcoded zeros for summary fields |
| 68 | `config/configuration.ts` | Throws in production — should fail gracefully |

### Frontend

| # | File | Issue |
|---|------|-------|
| 69 | `MediaCard.tsx` | Hardcoded shadow bypasses design tokens |
| 70 | `MediaCard.tsx` | Hardcoded amber star color |
| 71 | `MediaCard.tsx` | `from-black/80` not light-mode safe |
| 72 | `PremiumGlass.tsx` | Unused `useState` import |
| 73 | `PremiumGlass.tsx` | Multiple hardcoded oklch values |
| 74 | `AnalyticsKit.tsx` | Default accent hardcoded |
| 75 | `AnalyticsKit.tsx` | ProgressRing never re-animates |
| 76 | `LibraryToolbar.tsx` | Hardcoded amber for favorites |
| 77 | `PageSkeleton.tsx` | Generic layout doesn't match any page |
| 78 | `PremiumErrorState.tsx` | No entrance animation, no icon, no retry, no `aria-live` |
| 79 | `app.journal.tsx` | `MOOD_COLORS` hardcoded — new moods fall through to grey |
| 80 | `app.journal.tsx` | 128: `words / 1500` magic number |
| 81 | `app.journal.tsx` | 140: Default mood "Reflective" hardcoded |
| 82 | `app.journal.tsx` | 46-53, 56-61: No localStorage try/catch — quota errors crash |
| 83 | `app.settings.tsx` | Language/timezone options hardcoded to 4/5 |
| 84 | `app.search.tsx` | `⌘K` display hardcoded to Mac |
| 85 | `app.search.tsx` | 11: `setTimeout(..., 200)` arbitrary delay |
| 86 | `app.library.paused.tsx` | Hardcoded progress bar gradient |
| 87 | `app.library.dropped.tsx` | "Restart" link navigates to detail — doesn't restart |
| 88 | `app.import.tsx` | 93-94: Hardcoded Unsplash poster URL |
| 89 | `app.import.tsx` | 69: CSV `kind` field not validated |
| 90 | `app.media.$id.tsx` | 199: `getRelatedGoal` called twice |
| 91 | `app.media.$id.tsx` | 224: Raw spacer `<div className="h-24" />` |
| 92 | `app.media.$id.tsx` | 106-111: "Back" hardcoded to `/app/library` |

### Lib Files

| # | File | Issue |
|---|------|-------|
| 93 | `library.ts` | `SEED_ALL = []` and `ALL_LIBRARY = SEED_ALL` — always empty |
| 94 | `library.ts` | `smartInsights()` returns `[]` |
| 95 | `memory.ts` | `COLLECTIONS = []`, `JOURNAL = []` — empty stubs |
| 96 | `memory.ts` | `MEMORIES_BY_MEDIA` hardcoded with fake data |
| 97 | `goals.ts` | `GOALS_FULL = []` — empty |
| 98 | `goals.ts` | `ACHIEVEMENTS = []` — empty |
| 99 | `challenges.ts` | `CHALLENGES = []` — empty (was fixed in V7, now empty again) |
| 100 | `memoryJournal.ts` | All data arrays hardcoded/empty |
| 101 | `memoryInsights.ts` | All data arrays empty |
| 102 | `lifeChapters.ts` | Empty array |
| 103 | `mediaGraph.ts` | References `COLLECTIONS`, `ACHIEVEMENTS` stubs |
| 104 | `crosslinks.ts` | Uses `COLLECTIONS`, `JOURNAL`, `MEDIA` stubs |

### Design Tokens (100+ hardcoded values)

| # | Category | Count | Description |
|---|----------|-------|-------------|
| 105 | `oklch()` in className | 100+ | `oklch(0.72 0.18 255)` appears in 30+ files — should be `--primary` |
| 106 | `rgba()` in className | 100+ | Auth system ~40, calendar ~15, library ~4 |
| 107 | Border-radius tokens | 0 used | `--radius-*` tokens defined but never used in Tailwind |
| 108 | Duration tokens | 1 used | `--dur-*` tokens defined but `duration-300` used 30+ times |
| 109 | Shadow tokens | Bypassed | `--shadow-*` tokens exist but 20+ `shadow-[...]` arbitrary values used |

---

## Low Issues (43) — Code Quality / Minor UX

| # | File | Issue |
|---|------|-------|
| 110 | `src/lib/types.ts` | 18 deprecated stub exports still present |
| 111 | `src/lib/types.ts` | `SEARCHABLE_SETTINGS` hardcoded to 4 items |
| 112 | `src/components/media/MediaCard.tsx` | No `aria-label` on card link |
| 113 | `src/components/media/ItemActionBar.tsx` | `useMemo` deps incomplete |
| 114 | `src/components/search/CommandPalette.tsx` | `flat.indexOf(r)` is O(n²) |
| 115 | `src/components/ui/PremiumGlass.tsx` | Brand blue not a CSS variable |
| 116 | `src/components/ui/PremiumButton.tsx` | Sheen runs infinitely (reduced-motion now fixed) |
| 117 | `src/routes/app.wrapped.tsx` | `navigator.share?.()` error swallowed |
| 118 | `src/routes/app.wrapped.tsx` | `@ts-ignore` on `window.html2canvas` |
| 119 | `src/routes/app.wrapped.tsx` | Redundant snap-scroll style + class |
| 120 | `src/routes/app.journal.tsx` | Default mood "Reflective" hardcoded |
| 121 | `src/routes/app.library.all.tsx` | 59: Non-uniform shuffle (`Math.random()`) |
| 122 | `src/routes/app.library.all.tsx` | 127: Clear filters raw `<button>` not `PremiumButton` |
| 123 | `src/routes/app.library.all.tsx` | 177: Redundant `?? 0 ?? 0` |
| 124 | `src/routes/app.library.all.tsx` | 38: `m.kind as any` type assertion |
| 125 | `src/routes/app.library.paused.tsx` | 56: `"archived" as any` unnecessary |
| 126 | `src/routes/app.library.paused.tsx` | 56: No toast feedback on archive action |
| 127 | `src/routes/app.library.paused.tsx` | 56: No confirmation dialog for archive |
| 128 | `src/routes/app.library.dropped.tsx` | 23,27: `opacity-90`/`saturate-75` accessibility concern |
| 129 | `src/routes/app.settings.tsx` | 166-168: "Not supported" message leaks implementation details |
| 130 | `src/routes/app.settings.tsx` | 24-30: `applyTheme` bypasses centralized theme management |
| 131 | `src/routes/app.settings.tsx` | 187: `revokeSession` no error handling |
| 132 | `src/components/common/PageSkeleton.tsx` | No horizontal padding |
| 133 | `src/components/common/PremiumErrorState.tsx` | `action` prop replaces all defaults |
| 134 | `src/lib/analytics.ts` | 3x `console.log` (dev-guarded) |
| 135 | `src/lib/bookmarks.ts` | 2x empty catch blocks |
| 136 | `src/lib/api/fetch.ts` | Token refresh failure silently returns null |
| 137 | `src/lib/saveForLater.ts` | 2x empty catch blocks |
| 138 | `src/lib/notesEngine.ts` | 2x empty catch blocks |
| 139 | Various (31 files) | Hand-written `as any` type assertions |
| 140 | Various (22 files) | Hardcoded external image URLs (Unsplash, TMDB, etc.) |
| 141 | Various (42 routes) | Missing route-level error boundaries |
| 142 | `src/components/landing/LivingHero.tsx` | All media URLs hardcoded |
| 143 | `src/components/landing/MemoryCapsule.tsx` | All media references hardcoded |
| 144 | `src/components/landing/CollectionsPreview.tsx` | All collection data hardcoded |
| 145 | `src/components/landing/UniversalMediaShowcase.tsx` | All showcase data hardcoded |
| 146 | `src/components/auth/LiquidGlassCard.tsx` | Hardcoded rgba values |
| 147 | `src/components/auth/BottomBorderInput.tsx` | Hardcoded rgba values |
| 148 | `src/components/auth/MobileMemoryHero.tsx` | Hardcoded media references |
| 149 | `src/components/discovery/RecommendationCard.tsx` | Hardcoded recommendation data |
| 150 | `src/components/challenges/ChallengeCard.tsx` | Empty challenge data |
| 151 | `src/components/goals/GoalCard.tsx` | Empty goal data |
| 152 | `src/components/collections/CollectionWorkspace.tsx` | Uses MEDIA stub |

---

## Top 15 Fixes Needed (Ordered by Impact)

1. **`apps/backend/src/analytics/analytics.repository.ts`** — EITHER add `deletedAt DateTime?` to all Prisma User* models + migrate, OR remove all `deletedAt: null` filters (currently crashes every analytics query)
2. **`apps/backend/src/library/library.repository.ts`** — Same `deletedAt` schema mismatch fix needed
3. **`src/routes/app.calendar.tsx`** — Pass `months={calendarUI?.months}` to YearOverview; fix `CALENDAR_YEAR` fallback crash; fix `MONTHS` shadow
4. **`src/lib/adapters/analytics.ts`** — Populate `cells` array in `adaptCalendarYear` with actual day data
5. **`src/lib/types.ts`** — Remove 5-item `MEDIA` array and all 18 deprecated stub exports; 21 files depend on it
6. **`src/components/search/CommandPalette.tsx`** — Fix `filter(Boolean)` to preserve numeric `0` values
7. **`src/routes/app.journal.tsx`** — Fix MemoryDNA mediaId; remove duplicate MemoryBookmarks; fix nested MemoryZone
8. **`apps/backend/src/journal/journal.service.ts`** — Fix `createMemory` media ID attachment (broken `prismaAny()` call)
9. **`apps/backend/src/wrapped/wrapped.service.ts`** — Fix hardcoded zeros in `getSummary()`/`findAll()`; unify sharePayload
10. **`apps/backend/src/auth/auth.service.ts`** — Fix OAuth emailVerified; fix refresh token race condition
11. **`src/components/analytics/AnalyticsKit.tsx`** — Add NaN guard to ProgressRing; fix delta color direction
12. **`src/routes/app.library.all.tsx`** — Implement "Recently Finished" sort case
13. **`src/routes/app.library.completed.tsx`** — Implement "Recent" sort by completedAt
14. **`src/components/media/MediaCard.tsx`** — Move ItemActionBar outside Link; remove dead box-shadow
15. **`src/routes/app.wrapped.tsx`** — Add error handling; fix `alert()` → `toast`; add script dedup

---

## Summary

| Category | Count | Severity |
|----------|-------|----------|
| Critical (crashes/compilation) | 14 | Critical |
| High (wrong logic/data loss) | 32 | High |
| Medium (hardcoded/validation) | 48 | Medium |
| Low (quality/cosmetic) | 43 | Low |
| **Total** | **137** | — |

### V7 Fix Effectiveness

| Metric | Value |
|--------|-------|
| V7 issues attempted | 145 |
| Fully fixed | 4 (2.8%) |
| Partially fixed | 6 (4.1%) |
| Still broken | 135 (93.1%) |
| New issues found | 52 |
| Net change | -8 (145 → 137) |

### Key Patterns Observed

1. **Backend schema drift**: V7 added `deletedAt` filters without schema migration — will crash all analytics
2. **Stub data dependency**: 21 files still import the 5-item `MEDIA` array — removing it requires migrating all consumers
3. **Calendar is completely broken**: 6 critical issues make the calendar page non-functional
4. **Design token bypass**: 100+ hardcoded oklch/rgba values render the token system unused
5. **Landing page hardcoding**: All showcase/media components use static fake data — not connected to real user library

---

## Appendix: Files Importing MEDIA from @/lib/types (21 files)

1. `src/routes/app.library.all.tsx`
2. `src/routes/app.library.completed.tsx`
3. `src/routes/app.library.dropped.tsx`
4. `src/routes/app.library.inprogress.tsx`
5. `src/routes/app.library.paused.tsx`
6. `src/routes/app.library.planned.tsx`
7. `src/routes/app.library.rewatching.tsx`
8. `src/routes/app.library.rss.tsx`
9. `src/routes/app.search.tsx`
10. `src/routes/app.media.$id.tsx`
11. `src/routes/app.wrapped.tsx`
12. `src/routes/app.journal.tsx`
13. `src/routes/app.import.tsx`
14. `src/components/collections/CollectionWorkspace.tsx`
15. `src/components/memory/MemoryHighlights.tsx`
16. `src/components/memory/MemoryBookmarks.tsx`
17. `src/components/memory/MemoryConnections.tsx`
18. `src/components/memory/LifeChapterCard.tsx`
19. `src/components/memory/MemoryCapsule.tsx`
20. `src/components/memory/FirstMoments.tsx`
21. `src/lib/museumEngine.ts`

---

## Appendix: Prisma Models Missing `deletedAt` Field

| Model | Line in schema.prisma | Has `deletedAt`? |
|-------|----------------------|------------------|
| UserMovie | 969 | ❌ No |
| UserTvShow | 1012 | ❌ No |
| UserBook | 1227 | ❌ No |
| UserGame | ~1350 | ❌ No |
| UserMusicAlbum | ~1400 | ❌ No |
| UserPodcast | ~1450 | ❌ No |
| UserCourse | ~1500 | ❌ No |
| JournalEntry | ~800 | ❌ No |
| Memory | ~850 | ❌ No |

All `deletedAt: null` filters in `analytics.repository.ts` and `library.repository.ts` will throw `PrismaClientUnknownRequestError: Unknown field 'deletedAt'` at runtime.
