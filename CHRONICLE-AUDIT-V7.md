# Chronicle Audit V7 — Post-Fix Deep Audit

**Date:** July 23, 2026  
**Audit Round:** V7 (Post V6 fixes)  
**Method:** 8 parallel sub-agents: calendar verification, memory component verification, backend verification, UI component verification, route verification, lib file verification, fresh issues scan, design token audit  

---

## Executive Summary

V6 fixes were partially effective. **4 of 89 V6 issues fully fixed**, **3 partially fixed**, **82 still present**. Deep audit found **63 additional new issues**.

**Total remaining: 145 issues** (18 Critical, 35 High, 52 Medium, 40 Low)

### Fix Verification Summary

| Category | Fixed | Partial | Still Broken |
|----------|-------|---------|--------------|
| Calendar imports (V6 #1-2) | 2 | 0 | 0 |
| Calendar fallbacks (V6 #3-5) | 0 | 0 | 3 |
| Timeline MEMORY_CLUSTERS (V6 #6) | 1 | 0 | 0 |
| Memory components (V6 #7-12) | 6 | 0 | 0 |
| AuthStage mock posters (V6 #13) | 0 | 1 | 0 |
| CommandPalette "undefined" (V6 #14) | 1 | 0 | 0 |
| MEDIA stub in types.ts (V6 #15) | 0 | 0 | 1 |
| Backend library (V6 #16-17) | 0 | 1 | 1 |
| Backend journal (V6 #20-21) | 0 | 0 | 2 |
| Backend auth (V6 #25-28) | 3 | 0 | 1 |
| Backend analytics (V6 #29) | 0 | 0 | 1 |
| UI PremiumButton (V6 #30-31) | 2 | 0 | 0 |
| UI MediaCard (V6 #32,56) | 0 | 0 | 2 |
| UI AnalyticsKit (V6 #33-34) | 0 | 0 | 2 |
| Routes sorts (V6 #35-36) | 0 | 0 | 2 |
| Routes search (V6 #37) | 0 | 0 | 1 |
| Routes journal (V6 #38-39) | 0 | 0 | 2 |
| Routes wrapped (V6 #40) | 0 | 0 | 1 |
| Routes import (V6 #41) | 1 | 1 | 0 |
| Routes paused (V6 #42) | 0 | 0 | 1 |
| Lib goals/challenges (V6 #76-81) | 3 | 1 | 2 |

---

## CRITICAL Issues (18) — Runtime Crashes / Compilation Errors / 100% Broken

### Still Present from V6

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 1 | `src/routes/app.calendar.tsx` | 72 | `CALENDAR_YEAR[monthIdx]` fallback → `undefined` → crash on `month.startDay` |
| 2 | `src/routes/app.calendar.tsx` | 145 | `<YearOverview>` rendered **without `months` prop** — year overview always empty |
| 3 | `src/lib/adapters/analytics.ts` | 103 | `cells: [] as any` — monthly grid has no day cells, calendar grid non-functional |
| 4 | `src/lib/types.ts` | 97-103 | 5-item `MEDIA: any[]` hardcoded mock array still exported — root of all mock data |

### Newly Discovered

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 5 | `src/routes/app.calendar.tsx` | 72 | When `apiMonth` is null (API not loaded), `month` becomes `undefined` → crash |
| 6 | `src/routes/app.timeline.tsx` | 254 | `MEMORY_CLUSTERS.map(...)` — variable declared as `[]` but section always empty (data missing) |
| 7 | `src/components/memory/MemoryHighlights.tsx` (calendar) | 12 | `CALENDAR_HIGHLIGHTS` fallback still referenced (was in V5 audit) |
| 8 | `src/components/memory/MemoryStreaks.tsx` | 79 | `MEMORY_STREAKS` fallback still referenced |
| 9 | `src/components/calendar/CalendarInsights.tsx` | 12 | `CALENDAR_INSIGHTS` fallback still referenced |
| 10 | `src/components/calendar/UpcomingReleases.tsx` | 54 | `UPCOMING_RELEASES` fallback still referenced |
| 11 | `src/components/calendar/MediaHeatmap.tsx` | 10 | `YEAR_HEATMAP` fallback still referenced |
| 12 | `src/routes/app.journal.tsx` | 180 | `MemoryDNA` receives truncated title as `mediaId` — nonsensical |
| 13 | `src/routes/app.journal.tsx` | 231-241 | Nested `MemoryZone` inside `MemoryZone` — invalid DOM structure |
| 14 | `src/components/search/CommandPalette.tsx` | 455, 473, 489 | **Still renders "undefined"** — `filter(Boolean)` strips `0` values too |
| 15 | `src/components/analytics/AnalyticsKit.tsx` | 158 | No NaN guard on ProgressRing — `Math.min(100, NaN)` = NaN → SVG breaks |
| 16 | `src/routes/app.wrapped.tsx` | 25 | External CDN script loaded with **no SRI hash** — security risk |
| 17 | `apps/backend/src/journal/journal.service.ts` | 126-136 | `createMemory` calls non-existent `prismaAny()` — media IDs still silently discarded |
| 18 | `apps/backend/src/analytics/analytics.repository.ts` | all | **No `deletedAt: null` filters** — soft-deleted items pollute all analytics |

---

## High Issues (35) — Wrong Logic / Data Loss / Security

### Backend (Still Present + Newly Found)

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 19 | `apps/backend/src/library/library.service.ts` | 140 | `mediaType` defaults to `'movie'` when no media relation — wrong label |
| 20 | `apps/backend/src/library/library.service.ts` | 100-110 | `startedAt` not set when status changes to active states via `update()` |
| 21 | `apps/backend/src/library/library.repository.ts` | 306 | `softDelete` doesn't check `existing.deletedAt` — double-delete silently succeeds |
| 22 | `apps/backend/src/journal/journal.service.ts` | 198 | Timeline cursor uses `createdAt` but results ordered by `eventDate` — pagination mismatch |
| 23 | `apps/backend/src/wrapped/wrapped.service.ts` | 114-123 | `getSummary()` returns hardcoded zeros for `totalCompleted`, `totalHours`, `totalJournalEntries` |
| 24 | `apps/backend/src/wrapped/wrapped.service.ts` | 142-146 | `sharePayload` in response differs from stored metadata — two different payload shapes |
| 25 | `apps/backend/src/wrapped/wrapped-generator.service.ts` | 32 | `totalHours` computed but never output — dead code, user never sees time data |
| 26 | `apps/backend/src/wrapped/wrapped-generator.service.ts` | 90 | `sortOrder: 9` duplicated — "Favorite Genre" and "Average Rating" collide |
| 27 | `apps/backend/src/auth/auth.service.ts` | 88-132 | Refresh token race condition — concurrent requests can both validate and rotate |
| 28 | `apps/backend/src/auth/auth.repository.ts` | 30-39 | Registration race condition — concurrent same-email registrations both pass `findByEmail` |
| 29 | `apps/backend/src/analytics/analytics.repository.ts` | 352, 388-440 | Timezone bug — `toISOString()` returns UTC, heatmap/calendar entries wrong day for non-UTC users |
| 30 | `apps/backend/src/analytics/analytics.repository.ts` | 42-262 | Soft-deleted items counted in `countByStatus`, `countCompletedByType`, `getHoursAndEpisodesByType`, `getGenreData` |

### Frontend (Still Present + Newly Found)

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 31 | `src/components/media/MediaCard.tsx` | 44-132 | **Buttons nested inside `<Link>`** — invalid HTML semantics |
| 32 | `src/components/media/MediaCard.tsx` | 104 | Dead transparent box-shadow `"inset 0 0 0 1px transparent"` — no effect |
| 33 | `src/components/analytics/AnalyticsKit.tsx` | 134 | Delta always green regardless of positive/negative — misleading |
| 34 | `src/routes/app.library.all.tsx` | 42-63 | **"Recently Added" sort has no implementation** — default sort arbitrary |
| 35 | `src/routes/app.library.completed.tsx` | 19-23 | "Recent" sort returns `0` (no-op) — items not sorted by completion time |
| 36 | `src/routes/app.search.tsx` | 9-12 | Synthetic `Cmd+K` broken on Windows/Linux (`ctrlKey` not set) |
| 37 | `src/routes/app.journal.tsx` | 251-253 | `MemoryBookmarks` rendered **twice** — duplicate content |
| 38 | `src/routes/app.import.tsx` | 100-106 | CSV "rewatching" status not in item.status ternary — falls to `in_progress` |
| 39 | `src/routes/app.library.paused.tsx` | 34 | `droppedAtLabel` field used for paused items — semantically wrong |
| 40 | `src/routes/app.settings.tsx` | 16-22 | Theme state flash — defaults to "system" before profile loads |
| 41 | `src/lib/activityFeed.ts` | 49-61 | 3 hardcoded activity entries always injected — fabricated data |
| 42 | `src/lib/goals.ts` | 49-58 | `getJourneyStatistics()` returns hardcoded fake stats |
| 43 | `src/lib/franchiseEngine.ts` | 31, 54 | `elden-ring` and `one-piece` referenced — not in MEDIA stub |
| 44 | `src/lib/characters.ts` | 97, 106 | `chainsaw-man` and `elden-ring` referenced — not in MEDIA stub |
| 45 | `src/components/auth/AuthStage.tsx` | 232-248 | MOCK_POSTERS still hardcoded with 11 external CDN URLs |

---

## Medium Issues (52) — Hardcoded Values / Missing Validation / Stale Data

### Backend

| # | File | Issue |
|---|------|-------|
| 46 | `analytics.repository.ts` | `getAverageRating` returns unrounded float |
| 47 | `analytics.repository.ts` | `getHoursAndEpisodesByType` rounds to integer |
| 48 | `analytics.service.ts` | No input validation on calendar `year`/`month` |
| 49 | `library.repository.ts` | `findByUserIdAndMediaId` doesn't check `deletedAt` |
| 50 | `journal.service.ts` | `createdAt` defaults to `new Date()` when missing — masks errors |
| 51 | `media.service.ts` | No query validation on search |
| 52 | `media.service.ts` | `mediaType` fallback labels wrong for cross-type queries |
| 53 | `wrapped-generator.service.ts` | Insights only for movie/book — no tvShow/anime/game/music/podcast |
| 54 | `wrapped.service.ts` | `findAll()` returns hardcoded zeros for summary fields |

### Frontend

| # | File | Issue |
|---|------|-------|
| 55 | `MediaCard.tsx` | Hardcoded shadow bypasses design tokens |
| 56 | `MediaCard.tsx` | Hardcoded amber star color |
| 57 | `ItemActionBar.tsx` | Hardcoded shadow values duplicated 4x |
| 58 | `PremiumGlass.tsx` | Unused `useState` import |
| 59 | `PremiumGlass.tsx` | Multiple hardcoded oklch values |
| 60 | `AnalyticsKit.tsx` | Default accent hardcoded |
| 61 | `AnalyticsKit.tsx` | ProgressRing never re-animates |
| 62 | `LibraryToolbar.tsx` | Native `<select>` breaks glass aesthetic |
| 63 | `LibraryToolbar.tsx` | Hardcoded amber for favorites |
| 64 | `PageSkeleton.tsx` | Generic layout doesn't match any page |
| 65 | `PremiumErrorState.tsx` | No entrance animation, no icon, no retry, no `aria-live` |
| 66 | `app.journal.tsx` | `MOOD_COLORS` hardcoded — new moods fall through to grey |
| 67 | `app.settings.tsx` | Language/timezone options hardcoded to 4/5 |
| 68 | `app.search.tsx` | `⌘K` display hardcoded to Mac |
| 69 | `app.library.paused.tsx` | Hardcoded progress bar gradient |
| 70 | `app.library.dropped.tsx` | "Restart" link navigates to detail — doesn't restart |
| 71 | `app.wrapped.tsx` | `downloadAsImage()` no error handling for CDN failure |
| 72 | `app.library.completed.tsx` | No empty state when items empty |
| 73 | `app.wrapped.tsx` | `backgroundColor: '#090a0f'` hardcoded |
| 74 | `app.wrapped.tsx` | Slide definitions hardcoded locally |

### Lib Files

| # | File | Issue |
|---|------|-------|
| 75 | `library.ts` | `trendFor()` returns hardcoded fake deltas |
| 76 | `memory.ts` | `TODAY` hardcoded to `2026-06-27` |
| 77 | `creatorEngine.ts` | `totalHours: works.length * 14` — hardcoded multiplier |
| 78 | `collectionRelationships.ts` | Returns same static labels for every collection |

### Design Tokens (100+ hardcoded values)

| # | Category | Count | Description |
|---|----------|-------|-------------|
| 79 | `oklch()` in className | 100+ | `oklch(0.72 0.18 255)` appears in 30+ files — should be `--primary` |
| 80 | `rgba()` in className | 100+ | Auth system ~40, calendar ~15, library ~4 |
| 81 | Border-radius tokens | 0 used | `--radius-*` tokens defined but never used in Tailwind |
| 82 | Duration tokens | 1 used | `--dur-*` tokens defined but `duration-300` used 30+ times |
| 83 | Shadow tokens | Bypassed | `--shadow-*` tokens exist but 20+ `shadow-[...]` arbitrary values used |

---

## Low Issues (40) — Code Quality / Minor UX

| # | File | Issue |
|---|------|-------|
| 84 | `src/lib/types.ts` | 18 deprecated stub exports still present |
| 85 | `src/lib/mediaGraph.ts` | Empty `COLLECTIONS`/`ACHIEVEMENTS` stubs |
| 86 | `src/lib/crosslinks.ts` | Uses `COLLECTIONS`, `JOURNAL`, `MEDIA` stubs |
| 87 | `src/components/media/MediaCard.tsx` | No `aria-label` on card link |
| 88 | `src/components/media/ItemActionBar.tsx` | `useMemo` deps incomplete |
| 89 | `src/components/search/CommandPalette.tsx` | `flat.indexOf(r)` is O(n²) |
| 90 | `src/components/ui/PremiumGlass.tsx` | Brand blue not a CSS variable |
| 91 | `src/components/ui/PremiumButton.tsx` | Sheen runs infinitely (reduced-motion now fixed) |
| 92 | `src/routes/app.wrapped.tsx` | `navigator.share?.()` error swallowed |
| 93 | `src/routes/app.wrapped.tsx` | `@ts-ignore` on `window.html2canvas` |
| 94 | `src/routes/app.wrapped.tsx` | Redundant snap-scroll style + class |
| 95 | `src/routes/app.journal.tsx` | 128: `words / 1500` magic number |
| 96 | `src/routes/app.journal.tsx` | 140: Default mood "Reflective" hardcoded |
| 97 | `src/routes/app.import.tsx` | 93-94: Hardcoded Unsplash poster URL |
| 98 | `src/routes/app.import.tsx` | 69: CSV `kind` field not validated |
| 99 | `src/routes/app.media.$id.tsx` | 199: `getRelatedGoal` called twice |
| 100 | `src/routes/app.media.$id.tsx` | 224: Raw spacer `<div className="h-24" />` |
| 101 | `src/routes/app.media.$id.tsx` | 106-111: "Back" hardcoded to `/app/library` |
| 102 | `src/routes/app.library.all.tsx` | 59: Non-uniform shuffle (`Math.random()`) |
| 103 | `src/routes/app.library.all.tsx` | 127: Clear filters raw `<button>` not `PremiumButton` |
| 104 | `src/routes/app.library.all.tsx` | 177: Redundant `?? 0 ?? 0` |
| 105 | `src/routes/app.library.all.tsx` | 38: `m.kind as any` type assertion |
| 106 | `src/routes/app.library.paused.tsx` | 56: `"archived" as any` unnecessary |
| 107 | `src/routes/app.library.paused.tsx` | 56: No toast feedback on archive action |
| 108 | `src/routes/app.library.paused.tsx` | 56: No confirmation dialog for archive |
| 109 | `src/routes/app.library.dropped.tsx` | 23,27: `opacity-90`/`saturate-75` accessibility concern |
| 110 | `src/routes/app.settings.tsx` | 166-168: "Not supported" message leaks implementation details |
| 111 | `src/routes/app.settings.tsx` | 24-30: `applyTheme` bypasses centralized theme management |
| 112 | `src/routes/app.settings.tsx` | 187: `revokeSession` no error handling |
| 113 | `src/routes/app.search.tsx` | 11: `setTimeout(..., 200)` arbitrary delay |
| 114 | `src/routes/app.search.tsx` | 9-12: Full page just to show `⌘K` hint |
| 115 | `src/components/common/PageSkeleton.tsx` | No horizontal padding |
| 116 | `src/components/common/PageSkeleton.tsx` | Fixed `grid-cols-2 md:grid-cols-4` |
| 117 | `src/components/common/PremiumErrorState.tsx` | `action` prop replaces all defaults |
| 118 | `src/lib/analytics.ts` | 3x `console.log` (dev-guarded) |
| 119 | `src/lib/bookmarks.ts` | 2x empty catch blocks |
| 120 | `src/lib/api/fetch.ts` | Token refresh failure silently returns null |
| 121 | `src/lib/saveForLater.ts` | 2x empty catch blocks |
| 122 | `src/lib/notesEngine.ts` | 2x empty catch blocks |
| 123 | Various (31 files) | Hand-written `as any` type assertions |
| 124 | Various (22 files) | Hardcoded external image URLs (Unsplash, TMDB, etc.) |
| 125 | Various (42 routes) | Missing route-level error boundaries |
| 126 | `src/lib/types.ts` | `SEARCHABLE_SETTINGS` hardcoded to 4 items |

---

## Top 15 Fixes Needed (Ordered by Impact)

1. **`src/routes/app.calendar.tsx`** — Add `months={calendarUI?.months}` to YearOverview; fix `CALENDAR_YEAR` fallback crash; populate `cells` in adapter
2. **`src/lib/types.ts`** — Remove 5-item `MEDIA` array and all 18 deprecated stub exports
3. **`src/routes/app.journal.tsx`** — Fix MemoryDNA mediaId; remove duplicate MemoryBookmarks; fix nested MemoryZone
4. **`apps/backend/src/analytics/analytics.repository.ts`** — Add `deletedAt: null` filters to ALL queries; fix timezone handling
5. **`apps/backend/src/journal/journal.service.ts`** — Fix `createMemory` media ID attachment (broken `prismaAny()` call)
6. **`apps/backend/src/library/library.service.ts`** — Fix `mediaType` default; add `startedAt` for active status transitions
7. **`apps/backend/src/wrapped/wrapped.service.ts`** — Fix hardcoded zeros in `getSummary()`/`findAll()`; unify sharePayload
8. **`src/components/analytics/AnalyticsKit.tsx`** — Add NaN guard to ProgressRing; fix delta color direction
9. **`src/routes/app.library.all.tsx`** — Implement "Recently Added" sort case
10. **`src/routes/app.library.completed.tsx`** — Implement "Recent" sort by completedAt
11. **`src/components/media/MediaCard.tsx`** — Move ItemActionBar outside Link; remove dead box-shadow
12. **`src/routes/app.wrapped.tsx`** — Add SRI hash to CDN script; add error handling
13. **`src/lib/activityFeed.ts`** — Remove 3 hardcoded activity entries
14. **`src/lib/goals.ts`** — Remove hardcoded `getJourneyStatistics()` values
15. **Design tokens** — Replace `oklch(0.72 0.18 255)` with `--primary` across 30+ files

---

## Summary

| Category | Count | Severity |
|----------|-------|----------|
| Critical (crashes/compilation) | 18 | Critical |
| High (wrong logic/data loss) | 35 | High |
| Medium (hardcoded/validation) | 52 | Medium |
| Low (quality/cosmetic) | 40 | Low |
| **Total** | **145** | — |

V6 fixes were effective for memory components (6/6 fixed), auth rate limiting, email normalization, and PremiumButton light mode. The most impactful remaining issues are: `app.calendar.tsx` crashes, `MEDIA` stub still in types.ts, backend analytics missing soft-delete filters, and 100+ hardcoded color values bypassing the design token system.
