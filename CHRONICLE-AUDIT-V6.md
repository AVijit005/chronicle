# Chronicle Audit V6 — Post-Fix Deep Audit

**Date:** July 23, 2026  
**Audit Round:** V6 (Post V5 stub removal and fixes)  
**Method:** 8 parallel sub-agents across calendar, MEDIA usage, lib files, backend, UI components, routes, hooks/adapters, and auth/landing pages  

---

## Executive Summary

The V5 stub removal and fixes resolved calendar component stubs and partially migrated MEDIA usage. However, **deep audit reveals 89 remaining issues** across the codebase:

- **15 Critical** (runtime crashes, compilation errors, 100% broken components)
- **28 High** (wrong logic, data loss, security gaps)
- **31 Medium** (hardcoded values, missing validation, stale data)
- **15 Low** (code quality, minor UX, cosmetic)

### Root Causes
1. **`app.calendar.tsx`** has missing React imports and missing lucide icon imports — **won't compile**
2. **`MEMORY_CLUSTERS`** is undefined in `app.timeline.tsx` — **runtime crash**
3. **Memory components** (`MemoryHighlights`, `MemoryBookmarks`, `MemoryConnections`, `LifeChapterCard`, `MemoryCapsule`, `FirstMoments`) still use the static 5-item `MEDIA` stub — components are **mostly non-functional**
4. **Lib files** (`goals.ts`, `challenges.ts`, `memoryInsights.ts`, `lifeChapters.ts`) contain massive hardcoded mock data with nonexistent media IDs
5. **Backend** has race conditions, missing soft-delete filters, broken pagination, and data inconsistencies

---

## CRITICAL Issues (15) — Will Crash or Won't Compile

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 1 | `src/routes/app.calendar.tsx` | imports | **Missing `import { useState, useMemo } from "react"`** — won't compile |
| 2 | `src/routes/app.calendar.tsx` | imports | **Missing lucide icon imports** (`Film`, `BookOpen`, `ChevronLeft`, `ChevronRight`, `Gamepad2`, `Music`, `NotebookPen`) — won't compile |
| 3 | `src/routes/app.calendar.tsx` | 66 | `CALENDAR_YEAR[monthIdx]` used as fallback — `CALENDAR_YEAR` is `{}`, returns undefined, crashes on `month.startDay` etc. |
| 4 | `src/routes/app.calendar.tsx` | adapter | `cells: [] as any` — monthly grid has no day cells, entire calendar grid non-functional |
| 5 | `src/routes/app.calendar.tsx` | 136 | `<YearOverview>` rendered **without `months` prop** — year overview always empty |
| 6 | `src/routes/app.timeline.tsx` | 257 | **`MEMORY_CLUSTERS` is undefined** — not imported, not declared — `ReferenceError` at runtime |
| 7 | `src/components/memory/MemoryHighlights.tsx` | 6 | **`const MEDIA: any[] = []`** — local empty array shadows everything, component 100% non-functional, zero highlights render |
| 8 | `src/components/memory/LifeChapterCard.tsx` | 15, 17 | `MEDIA.find()` on 5-item stub — most chapter IDs don't exist, covers/favorites silently empty |
| 9 | `src/components/memory/MemoryBookmarks.tsx` | 24 | `MEDIA.find()` — 2/3 bookmarks reference IDs not in stub, silently dropped |
| 10 | `src/components/memory/MemoryConnections.tsx` | 14, 19 | `MEDIA.find()` + `for...of MEDIA` — only 5 items, component returns null for most mediaIds |
| 11 | `src/components/memory/MemoryCapsule.tsx` | 13 | `MEDIA.find()` — **all capsule cover IDs not in stub**, every capsule shows grey placeholders |
| 12 | `src/components/memory/FirstMoments.tsx` | 22 | `MEDIA.find()` — 5/7 items show generic kind labels instead of titles |
| 13 | `src/components/auth/AuthStage.tsx` | 246 | `MEDIA.find()` always undefined → hardcoded mock posters with 11 external CDN URLs (TMDB, Spotify, IGDB) — fragile |
| 14 | `src/components/search/CommandPalette.tsx` | 455, 473, 489 | **Renders literal "undefined"** when `creator`, `year`, `category`, `date`, `media` fields are missing |
| 15 | `src/lib/types.ts` | 97-103 | `MEDIA` is a 5-item hardcoded mock array — root source of all mock data propagation |

---

## High Issues (28) — Wrong Logic / Data Loss / Security

### Backend

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 16 | `apps/backend/src/library/library.service.ts` | 64 | `mediaType` always defaults to `'movie'` when listing all types — wrong labels returned to client |
| 17 | `apps/backend/src/library/library.service.ts` | 103-104 | Progress stays at 100 when changing FROM completed status — never reset |
| 18 | `apps/backend/src/library/library.repository.ts` | 162-170 | Cross-type `findAll` fetches `limit+1` from EACH of 8 types (up to 168 rows for limit=20) |
| 19 | `apps/backend/src/library/library.repository.ts` | 188-226 | No soft-delete filter on `findMany` — soft-deleted items appear in results |
| 20 | `apps/backend/src/journal/journal.service.ts` | 121-122 | **`createMemory` silently discards `dto.mediaIds`** — user data lost |
| 21 | `apps/backend/src/journal/journal.service.ts` | 198 | Timeline cursor uses `createdAt` but results ordered by `eventDate` — broken pagination |
| 22 | `apps/backend/src/wrapped/wrapped.service.ts` | 140-144 | `sharePayload` rebuilt in response differs from what's stored in metadata — data inconsistency |
| 23 | `apps/backend/src/wrapped/wrapped-generator.service.ts` | 34 | `totalHours` double-counts — each hour counted once per genre the item has |
| 24 | `apps/backend/src/wrapped/wrapped-generator.service.ts` | 41-50, 66-85 | `musicAlbum` and `podcast` missing from typeLabels and stats — silently excluded |
| 25 | `apps/backend/src/auth/auth.service.ts` | 50-86 | **No rate limiting or account lockout** — brute-force password attacks possible |
| 26 | `apps/backend/src/auth/auth.service.ts` | 88-132 | Refresh token race condition — concurrent requests can both validate and rotate |
| 27 | `apps/backend/src/auth/auth.repository.ts` | 30-39 | Registration race condition — concurrent same-email registrations can both pass `findByEmail` |
| 28 | `apps/backend/src/auth/auth.repository.ts` | 21-23 | No email normalization — `User@Example.com` ≠ `user@example.com` |
| 29 | `apps/backend/src/analytics/analytics.repository.ts` | 347-437 | Timezone bug — `toISOString()` returns UTC, activity heatmap entries land on wrong day for non-UTC users |

### Frontend

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 30 | `src/components/ui/PremiumButton.tsx` | 41-42 | **Ghost/icon variants invisible in light mode** — `bg-white/[0.04]` on white background |
| 31 | `src/components/ui/PremiumButton.tsx` | 63 | Sheen animation runs infinitely — **not disabled by `prefers-reduced-motion: reduce`** |
| 32 | `src/components/media/MediaCard.tsx` | 44-132 | **Buttons nested inside `<Link>`** — invalid HTML semantics, screen readers broken |
| 33 | `src/components/analytics/AnalyticsKit.tsx` | 134 | Delta always green (`text-emerald-300/90`) regardless of positive/negative — misleading |
| 34 | `src/components/analytics/AnalyticsKit.tsx` | 158 | No NaN guard on ProgressRing — `Math.max(0, Math.min(100, NaN))` returns NaN, breaks SVG |
| 35 | `src/routes/app.library.all.tsx` | 42-63 | **"Recently Added" sort has no implementation** — default sort shows arbitrary order |
| 36 | `src/routes/app.library.completed.tsx` | 19-23 | "Recent" sort returns `0` (no-op) — items not sorted by completion time |
| 37 | `src/routes/app.search.tsx` | 9-12 | Synthetic `Cmd+K` event broken on Windows/Linux (`ctrlKey` not set) |
| 38 | `src/routes/app.journal.tsx` | 180 | `MemoryDNA` receives truncated title string as `mediaId` — nonsensical |
| 39 | `src/routes/app.journal.tsx` | 251-253 | `MemoryBookmarks` rendered **twice** — duplicate content |
| 40 | `src/routes/app.wrapped.tsx` | 25 | External CDN script loaded with **no SRI hash** — security risk |
| 41 | `src/routes/app.import.tsx` | 72-82 | CSV "rewatching" status silently downgraded to "in_progress" |
| 42 | `src/routes/app.library.paused.tsx` | 34 | `droppedAtLabel` field used for paused items — semantically wrong field name |

---

## Medium Issues (31) — Hardcoded Values / Missing Validation / Stale Data

### Backend

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 43 | `apps/backend/src/analytics/analytics.repository.ts` | 188 | `getAverageRating` returns unrounded float — consumers see long decimals |
| 44 | `apps/backend/src/analytics/analytics.repository.ts` | 97 | `getHoursAndEpisodesByType` rounds to integer — loses sub-hour precision |
| 45 | `apps/backend/src/analytics/analytics.service.ts` | 52 | No input validation on calendar `year`/`month` params |
| 46 | `apps/backend/src/library/library.repository.ts` | 87-99 | `findByUserIdAndMediaId` doesn't check `deletedAt` |
| 47 | `apps/backend/src/library/library.repository.ts` | 314, 337 | `countByStatus`/`countByType` don't filter soft-deleted items |
| 48 | `apps/backend/src/journal/journal.service.ts` | 381, 398, 409, 425, 442 | `createdAt` defaults to `new Date()` when missing — masks data errors |
| 49 | `apps/backend/src/media/media.service.ts` | 54 | No query length/format validation on search |
| 50 | `apps/backend/src/media/media.service.ts` | 34, 48 | `mediaType` fallback labels wrong for cross-type queries |
| 51 | `apps/backend/src/auth/auth.service.ts` | 153-183 | OAuth users not set to `emailVerified: true` despite Google verification |
| 52 | `apps/backend/src/wrapped/wrapped.service.ts` | 22-35 | Stats upserted to DB then `toWrappedDto` rebuilds different `sharePayload` |
| 53 | `apps/backend/src/wrapped/wrapped-generator.service.ts` | 30 | Journal dates capped at 10000 — prolific journalers get wrong counts |

### Frontend

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 54 | `src/components/media/MediaCard.tsx` | 61 | Hardcoded shadow `oklch(0 0 0 / 0.7)` bypasses design tokens |
| 55 | `src/components/media/MediaCard.tsx` | 94 | Hardcoded amber `fill-amber-400 text-amber-400` for star rating |
| 56 | `src/components/media/MediaCard.tsx` | 104 | Dead transparent box-shadow — `"inset 0 0 0 1px transparent"` has no effect |
| 57 | `src/components/media/ItemActionBar.tsx` | 238, 255, 273, 292, 311 | Hardcoded shadow values duplicated 4x instead of using CSS tokens |
| 58 | `src/components/ui/PremiumGlass.tsx` | 3 | Unused `useState` import |
| 59 | `src/components/ui/PremiumGlass.tsx` | 97, 103, 119, 131, 154 | Multiple hardcoded oklch values — brand blue not a CSS variable |
| 60 | `src/components/analytics/AnalyticsKit.tsx` | 109 | Default accent `oklch(0.72 0.18 255 / 0.4)` hardcoded |
| 61 | `src/components/analytics/AnalyticsKit.tsx` | 188-189 | ProgressRing `whileInView` fires only once — never re-animates |
| 62 | `src/components/library/LibraryToolbar.tsx` | 94-104 | **Native `<select>` breaks glass aesthetic** — OS-native dropdown |
| 63 | `src/components/library/LibraryToolbar.tsx` | 79 | Hardcoded amber `bg-amber-300/15 text-amber-200` for favorites |
| 64 | `src/components/common/PageSkeleton.tsx` | all | Generic layout doesn't match any actual page structure |
| 65 | `src/components/common/PremiumErrorState.tsx` | all | No entrance animation, no icon, no retry action, no `aria-live` |
| 66 | `src/routes/app.wrapped.tsx` | 42-48 | Race condition — `isInitialLoading` check causes flash to skeleton on refetch |
| 67 | `src/routes/app.journal.tsx` | 231-241 | Nested `MemoryZone` inside `MemoryZone` — double padding/margins |
| 68 | `src/routes/app.journal.tsx` | 114-118 | `MOOD_COLORS` hardcoded — new backend moods fall through to grey |
| 69 | `src/routes/app.settings.tsx` | 99-119 | Language/timezone options hardcoded to 4/5 options |
| 70 | `src/routes/app.settings.tsx` | 16-17 | Theme state flash — defaults to "system" before profile loads |
| 71 | `src/routes/app.import.tsx` | 83-86 | CSV import ID collisions on rapid re-import |
| 72 | `src/routes/app.import.tsx` | 69 | CSV `kind` field not validated |
| 73 | `src/routes/app.search.tsx` | 21-23 | `⌘K` display hardcoded to Mac — wrong on Windows/Linux |
| 74 | `src/routes/app.library.paused.tsx` | 41 | Hardcoded progress bar gradient colors |
| 75 | `src/routes/app.library.dropped.tsx` | 44-50 | "Restart" link navigates to detail page — doesn't actually restart |

### Lib Files

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 76 | `src/lib/library.ts` | 127-137 | `trendFor()` returns hardcoded fake trend deltas |
| 77 | `src/lib/characters.ts` | 97, 105 | Characters reference `chainsaw-man`/`elden-ring` — not in MEDIA stub |
| 78 | `src/lib/lifeChapters.ts` | 13-72 | 5/7 chapters reference nonexistent media IDs |
| 79 | `src/lib/franchiseEngine.ts` | 49 | "Soulslike" franchise references `elden-ring` — not in MEDIA |
| 80 | `src/lib/memory.ts` | 13 | `TODAY` hardcoded to `2026-06-27` — not real today |
| 81 | `src/lib/memoryJournal.ts` | 6, 110 | Duplicate `QUOTES` declaration (empty at line 6, real at line 110) |

---

## Low Issues (15) — Code Quality / Minor UX

| # | File | Issue |
|---|------|-------|
| 82 | `src/lib/types.ts` | 18 deprecated stub exports still present (lines 87-132) |
| 83 | `src/lib/creatorEngine.ts` | `totalHours: works.length * 14` — hardcoded multiplier |
| 84 | `src/lib/collectionRelationships.ts` | Returns same static labels for every collection |
| 85 | `src/components/media/MediaCard.tsx` | No `aria-label` on card link |
| 86 | `src/components/media/ItemActionBar.tsx` | `useMemo` deps incomplete (Zustand selectors) |
| 87 | `src/components/search/CommandPalette.tsx` | `flat.indexOf(r)` is O(n²) per render |
| 88 | `src/routes/app.wrapped.tsx` | `downloadAsImage()` has no error handling for CDN failure |
| 89 | `src/routes/app.library.completed.tsx` | No empty state when items array is empty |

---

## Top 10 Fixes Needed (Ordered by Impact)

1. **`src/routes/app.calendar.tsx`** — Add missing React and lucide imports; fix adapter `cells` generation; pass `months` to `YearOverview`
2. **`src/routes/app.timeline.tsx`** — Fix or remove undefined `MEMORY_CLUSTERS` reference
3. **`src/components/memory/MemoryHighlights.tsx`** — Remove local empty `MEDIA` array, connect to library store or props
4. **`src/components/memory/MemoryBookmarks.tsx`, `MemoryConnections.tsx`, `LifeChapterCard.tsx`, `MemoryCapsule.tsx`, `FirstMoments.tsx`** — Replace static `MEDIA` stub with library API hooks or prop-based data
5. **`src/lib/goals.ts`, `challenges.ts`, `memoryInsights.ts`, `lifeChapters.ts`** — Remove hardcoded mock data or connect to backend APIs
6. **`apps/backend/src/library/library.service.ts`** — Fix `mediaType` default, reset progress on status change, add soft-delete filters
7. **`apps/backend/src/journal/journal.service.ts`** — Fix `createMemory` media ID discard; fix timeline cursor mismatch
8. **`apps/backend/src/auth/auth.service.ts`** — Add rate limiting, fix OAuth email verification, fix refresh race condition
9. **`src/components/ui/PremiumButton.tsx`** — Fix light mode visibility, add reduced-motion support
10. **`src/components/search/CommandPalette.tsx`** — Fix "undefined" rendering for missing data fields

---

## Summary

| Category | Count | Severity |
|----------|-------|----------|
| Critical (crashes/compilation) | 15 | Critical |
| High (wrong logic/data loss) | 28 | High |
| Medium (hardcoded/validation) | 31 | Medium |
| Low (quality/cosmetic) | 15 | Low |
| **Total** | **89** | — |

The V5 stub removal was a good first step, but the memory components and lib files still depend on the static 5-item MEDIA stub, and `app.calendar.tsx` has compilation-blocking missing imports. The backend has significant security and data integrity issues that should be addressed.
