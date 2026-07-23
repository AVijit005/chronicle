# Chronicle V3 Audit — Fix Verification + New Issues

**Date:** 2026-07-23

---

## FIXED (26 items confirmed)

| # | File | Line | Fix |
|---|------|------|-----|
| 1 | `src/hooks/use-auth.ts` | 43 | ✅ `setAccessToken(null)` added before `queryClient.clear()` |
| 2 | `src/lib/api/adapters.ts` | 28-29 | ✅ `DROPPED: "dropped"`, `ARCHIVED: "archived"` corrected |
| 3 | `apps/backend/src/analytics/analytics.repository.ts` | 188 | ✅ Rating division `/2` removed — now `totalSum / totalCount` |
| 4 | `apps/backend/src/config/configuration.ts` | 42 | ✅ Throws in production if `OAUTH_ENCRYPTION_KEY` not set |
| 5 | `apps/backend/src/auth/repositories/oauth-account.repository.ts` | 29-33 | ✅ Throws in production if key not set |
| 6 | `apps/backend/src/auth/repositories/oauth-account.repository.ts` | 55-57 | ✅ `decrypt` now throws instead of returning encrypted text |
| 7 | `apps/backend/src/auth/auth.repository.ts` | 37,49 | ✅ `emailVerified` now defaults to `false` |
| 8 | `apps/backend/src/interaction/interaction.service.ts` | 23 | ✅ Now checks `rating === null \|\| rating === undefined` |
| 9 | `apps/backend/src/journal/journal.repository.ts` | 36,98 | ✅ Now uses `new Date(cursor)` instead of raw string |
| 10 | `apps/backend/src/library/library.repository.ts` | 170 | ✅ Now slices to `params.limit` before returning |
| 11 | `apps/backend/src/library/library.repository.ts` | 352 | ✅ Now uses `!!item && !item.deletedAt` |
| 12 | `apps/backend/src/library/library.repository.ts` | 201 | ✅ `take: params.limit` (removed `+1`) |
| 13 | `apps/backend/src/analytics/analytics-aggregation.service.ts` | 36,40-43 | ✅ Now uses `hoursData.episodes` and `hoursData.hours[...]` |
| 14 | `apps/backend/src/wrapped/wrapped-generator.service.ts` | 31 | ✅ Now computes `_totalHours` from `genreData.genreTime` |
| 15 | `apps/backend/src/wrapped/wrapped-generator.service.ts` | 80 | ✅ Now checks `avgRating !== null && avgRating !== undefined` |
| 16 | `apps/backend/src/wrapped/wrapped.service.ts` | 54 | ✅ Preserves `existing.coverImage` on regenerate |
| 17 | `apps/backend/src/wrapped/wrapped.service.ts` | 59 | ✅ `regenerate` now uses `s.sortOrder` (consistent) |
| 18 | `apps/backend/src/auth/auth.service.ts` | 61 | ✅ Uses `String(...)` comparison for boolean config |
| 19 | `apps/backend/src/analytics/analytics.repository.ts` | 507 | ✅ `saveSnapshot` no longer overwrites with `metadata: {}` |
| 20 | `src/hooks/use-online.ts` | 7 | ✅ Added `typeof window === "undefined"` guard |
| 21 | `src/components/search/CommandPalette.tsx` | 20-24 | ✅ Removed empty imports (MEDIA, COLLECTIONS, etc.) |
| 22 | `src/components/search/CommandPalette.tsx` | 444 | ✅ Safe icon lookup with `\|\| Sparkles` fallback |
| 23 | `src/routes/app.library.completed.tsx` | 21 | ✅ "Most Rewatched" now sorts by `b.stats?.rewatches ?? 0` |
| 24 | `src/routes/app.library.all.tsx` | 47 | ✅ "Rating" now sorts by `b.avgRating ?? 0` |
| 25 | `src/routes/app.library.paused.tsx` | 56 | ✅ Archive button now has `onClick` handler |
| 26 | `src/lib/api/analytics.ts` | 229-234 | ✅ `getCalendarDay`/`getCalendarYear` now call real API |
| 27 | `apps/backend/src/config/env.validation.ts` | 57-58 | ✅ `OAUTH_ENCRYPTION_KEY` now optional (no default) |
| 28 | `apps/backend/src/analytics/insights.service.ts` | 56 | ✅ `totalHours` now computed from `genreData.genreTime` |

---

## REMAINING ISSUES (NOT FIXED)

### Critical

| # | File | Line | Issue |
|---|------|------|-------|
| 1 | `apps/backend/src/wrapped/wrapped.service.ts` | 119-121 | `getSummary` still returns hardcoded zeros for `totalCompleted`, `totalHours`, `totalJournalEntries` |
| 2 | `src/hooks/use-auth.ts` | 53-54 | `useLogoutAll` still missing `setAccessToken(null)` in `onSuccess` |

### High

| # | File | Line | Issue |
|---|------|------|-------|
| 3 | `apps/backend/src/analytics/insights.service.ts` | 34-45 | Six insights still hardcoded to `null`: `favoriteDecade`, `longestBinge`, `mostRewatched`, `mostReread`, `mostReplayed`, `avgCompletionTime` |
| 4 | `src/routes/app.wrapped.tsx` | 203,344 | `window.print()` still used for "Print Summary" / "Download" buttons |

---

## NEW ISSUES FOUND

### 5. `useLogoutAll` missing token reset
- **File:** `src/hooks/use-auth.ts:53-54`
- **Issue:** `useLogoutAll` calls `authApi.logoutAll()` but doesn't call `setAccessToken(null)` in `onSuccess`. The API's `finally` block handles it, but this is inconsistent with `useLogout`.
- **Fix:** Add `setAccessToken(null)` before `queryClient.clear()`.

### 6. `wrapped.service.ts` getSummary hardcoded zeros
- **File:** `apps/backend/src/wrapped/wrapped.service.ts:119-121`
- **Issue:** `getSummary` still returns hardcoded zeros. `findAll` at line 74-76 correctly reads from metadata, but `getSummary` doesn't.
- **Fix:** Read from `wrapped.metadata` like `findAll` does.

### 7. `wrapped-generator.service.ts` doesn't set totalCompleted/totalHours/totalJournalEntries in metadata
- **File:** `apps/backend/src/wrapped/wrapped-generator.service.ts:24`
- **Issue:** The `metadata` object created in `wrapped.service.ts:24` doesn't include `totalCompleted`, `totalHours`, or `totalJournalEntries`. Even though `findAll` reads them with `?? 0`, they're never set.
- **Fix:** Add these fields to the metadata in `wrapped.service.ts:24`.

### 8. `insights.service.ts` still has 6 null insights
- **File:** `apps/backend/src/analytics/insights.service.ts:34-45`
- **Issue:** `favoriteDecade`, `longestBinge`, `mostRewatched`, `mostReread`, `mostReplayed`, `avgCompletionTime` still hardcoded to `null`.
- **Fix:** Compute from actual data or remove from response.

### 9. `_completedByType` fetched but unused
- **File:** `apps/backend/src/analytics/insights.service.ts:10,13`
- **Issue:** `_completedByType` is fetched from the database but never used (prefixed with `_`).
- **Fix:** Either use it or remove the fetch.

### 10. `CommandPalette` still uses `SEARCHABLE_SETTINGS` from types
- **File:** `src/components/search/CommandPalette.tsx:21`
- **Issue:** `SEARCHABLE_SETTINGS` is still imported from `@/lib/types` where it's an empty array.
- **Fix:** Populate from a config or remove.

### 11. `library.ts` still has mock data
- **File:** `src/lib/library.ts`
- **Issue:** `smartInsights()` returns hardcoded strings, `SEED_ALL` is empty, `ALL_LIBRARY` is empty.
- **Fix:** Replace with real data from hooks.

### 12. `activityFeed.ts` still returns mock data
- **File:** `src/lib/activityFeed.ts`
- **Issue:** `getActivityFeed()` returns hardcoded activity items.
- **Fix:** Replace with API call.

### 13. `types.ts` still has 20 empty stub exports
- **File:** `src/lib/types.ts:87-108`
- **Issue:** `MEDIA`, `COLLECTIONS`, `JOURNAL`, etc. still empty.
- **Fix:** Remove or populate from API.

---

## SUMMARY

| Category | Fixed | Remaining | New |
|----------|-------|-----------|-----|
| Critical | 26 | 2 | 1 |
| High | — | 2 | 2 |
| Medium | — | 0 | 7 |
| **Total** | **26** | **4** | **10** |

---

## PRIORITY FIXES (4 remaining critical/high)

1. **`wrapped.service.ts:119-121`** — `getSummary` hardcoded zeros (read from metadata)
2. **`use-auth.ts:53-54`** — `useLogoutAll` missing `setAccessToken(null)`
3. **`wrapped.service.ts:24`** — Add `totalCompleted`/`totalHours`/`totalJournalEntries` to metadata
4. **`insights.service.ts:34-45`** — Implement or remove 6 null insights
