# Chronicle — Full Audit Report (V3)

**Date:** 2026-07-23  
**Scope:** All bugs, mock data, hardcoded data, wrong logic, missing premiumness, security issues, glitches  
**Method:** Direct file reads across all frontend (React/TS) and backend (NestJS/Prisma) code

---

## Table of Contents

1. [Fix Verification (28 items)](#fix-verification)
2. [Remaining Critical Issues (2)](#remaining-critical-issues)
3. [Remaining High Priority Issues (2)](#remaining-high-priority-issues)
4. [New Issues Found (10)](#new-issues-found)
5. [Summary](#summary)
6. [Priority Action Plan](#priority-action-plan)

---

## Fix Verification

### ✅ Fixed — Frontend

| # | File | Line | What Was Wrong | Current State |
|---|------|------|----------------|---------------|
| 1 | `src/hooks/use-auth.ts` | 43 | Missing `setAccessToken(null)` on logout | ✅ Added `setAccessToken(null)` before `queryClient.clear()` |
| 2 | `src/lib/api/adapters.ts` | 28-29 | `DROPPED: "paused"`, `ARCHIVED: "completed"` | ✅ Now `DROPPED: "dropped"`, `ARCHIVED: "archived"` |
| 3 | `src/hooks/use-online.ts` | 7 | Missing window guard for SSR | ✅ Added `typeof window === "undefined"` guard |
| 4 | `src/components/search/CommandPalette.tsx` | 20-24 | Imported empty arrays `MEDIA=[]`, `COLLECTIONS=[]` etc. | ✅ Removed empty imports, only imports `SEARCHABLE_SETTINGS` + types |
| 5 | `src/components/search/CommandPalette.tsx` | 444 | Unsafe `(MEDIA_ICONS as any)[kind]` cast | ✅ Now `MEDIA_ICONS[row.item.kind as MediaKind] \|\| Sparkles` |
| 6 | `src/routes/app.library.completed.tsx` | 21 | "Most Rewatched" sort returned 0 (no-op) | ✅ Now sorts by `(b.stats?.rewatches ?? 0) - (a.stats?.rewatches ?? 0)` |
| 7 | `src/routes/app.library.all.tsx` | 47 | "Rating" and "Personal Rating" used identical sort | ✅ "Rating" now sorts by `b.avgRating ?? 0`, "Personal Rating" by `b.rating ?? 0` |
| 8 | `src/routes/app.library.paused.tsx` | 56 | Archive button had no onClick | ✅ Now calls `useLibraryStore.getState().setStatus(m.id, "archived")` |
| 9 | `src/lib/api/analytics.ts` | 229-234 | `getCalendarDay`/`getCalendarYear` returned mock data | ✅ Now calls real API endpoints |

### ✅ Fixed — Backend

| # | File | Line | What Was Wrong | Current State |
|---|------|------|----------------|---------------|
| 10 | `apps/backend/src/analytics/analytics.repository.ts` | 188 | Rating `/2` division without documentation | ✅ Now `totalSum / totalCount` (removed `/2`) |
| 11 | `apps/backend/src/config/configuration.ts` | 42 | Hardcoded fallback `'default_secret_key_32_bytes_long!'` | ✅ Throws in production if `OAUTH_ENCRYPTION_KEY` not set |
| 12 | `apps/backend/src/auth/repositories/oauth-account.repository.ts` | 29-33 | Same hardcoded secret + weak padding | ✅ Throws in production if key not set |
| 13 | `apps/backend/src/auth/repositories/oauth-account.repository.ts` | 55-57 | `decrypt` silently returned encrypted text on failure | ✅ Now throws `Error('Failed to decrypt OAuth token')` |
| 14 | `apps/backend/src/auth/auth.repository.ts` | 37,49 | `emailVerified` defaulted to `true` | ✅ Now defaults to `false` in both `create` and `createOAuthUser` |
| 15 | `apps/backend/src/interaction/interaction.service.ts` | 23 | Duplicate `rating === null` condition | ✅ Now `rating === null \|\| rating === undefined` |
| 16 | `apps/backend/src/journal/journal.repository.ts` | 36,98 | String cursor used as Date in queries | ✅ Now `new Date(cursor)` |
| 17 | `apps/backend/src/library/library.repository.ts` | 170 | Returned `limit + 1` items | ✅ Now slices to `params.limit` |
| 18 | `apps/backend/src/library/library.repository.ts` | 201 | `take: params.limit + 1` | ✅ Now `take: params.limit` |
| 19 | `apps/backend/src/library/library.repository.ts` | 352 | Fragile `!== null` check | ✅ Now `!!item && !item.deletedAt` |
| 20 | `apps/backend/src/analytics/analytics-aggregation.service.ts` | 36,40-43 | Hardcoded zeros for hours/episodes | ✅ Now uses `hoursData.episodes` and `hoursData.hours[type]` |
| 21 | `apps/backend/src/wrapped/wrapped-generator.service.ts` | 31 | `_totalHours = 0` with comment "Would need hours tracking" | ✅ Now `Object.values(genreData.genreTime).reduce((a, b) => a + b, 0)` |
| 22 | `apps/backend/src/wrapped/wrapped-generator.service.ts` | 80 | `avgRating` of 0 showed N/A | ✅ Now `avgRating !== null && avgRating !== undefined` |
| 23 | `apps/backend/src/wrapped/wrapped.service.ts` | 54 | `coverImage: null` overwrote on regenerate | ✅ Now `coverImage: existing.coverImage` |
| 24 | `apps/backend/src/wrapped/wrapped.service.ts` | 59 | Inconsistent `sortOrder` in regenerate | ✅ Now uses `s.sortOrder` (consistent with generate) |
| 25 | `apps/backend/src/auth/auth.service.ts` | 61 | Boolean config parsing bug (`'false'` is truthy) | ✅ Now `String(this.config.get('emailVerification.required')) !== 'false'` |
| 26 | `apps/backend/src/analytics/analytics.repository.ts` | 507 | `saveSnapshot` overwrote metadata with `{}` | ✅ Now `update: { ...data }` (no metadata override) |
| 27 | `apps/backend/src/analytics/insights.service.ts` | 56 | `totalHours` hardcoded to 0 | ✅ Now `Object.values(genreData.genreTime).reduce((a, b) => a + b, 0)` |
| 28 | `apps/backend/src/config/env.validation.ts` | 57-58 | Had hardcoded default for `OAUTH_ENCRYPTION_KEY` | ✅ Now `@IsOptional()` with no default |

---

## Remaining Critical Issues

### 1. `getSummary` still returns hardcoded zeros
- **File:** `apps/backend/src/wrapped/wrapped.service.ts:119-121`
- **Issue:** `getSummary` returns `totalCompleted: 0`, `totalHours: 0`, `totalJournalEntries: 0` hardcoded. `findAll` at line 74-76 correctly reads from metadata.
- **Current code:**
  ```typescript
  return {
    id: wrapped.id,
    year: wrapped.year,
    generatedAt: wrapped.generatedAt?.toISOString() ?? '',
    version: meta.version ?? 1,
    totalCompleted: 0,      // ← hardcoded
    totalHours: 0,          // ← hardcoded
    totalJournalEntries: 0, // ← hardcoded
  };
  ```
- **Fix:** Read from `wrapped.metadata` like `findAll` does:
  ```typescript
  totalCompleted: meta.totalCompleted ?? 0,
  totalHours: meta.totalHours ?? 0,
  totalJournalEntries: meta.totalJournalEntries ?? 0,
  ```

### 2. `useLogoutAll` missing token reset
- **File:** `src/hooks/use-auth.ts:53-54`
- **Issue:** `useLogoutAll` doesn't call `setAccessToken(null)` in `onSuccess`. The API's `finally` block handles it, but this is inconsistent with `useLogout`.
- **Current code:**
  ```typescript
  onSuccess: () => {
    queryClient.clear();
  },
  ```
- **Fix:** Add `setAccessToken(null)`:
  ```typescript
  onSuccess: () => {
    setAccessToken(null);
    queryClient.clear();
  },
  ```

---

## Remaining High Priority Issues

### 3. Wrapped metadata never includes totalCompleted/totalHours/totalJournalEntries
- **File:** `apps/backend/src/wrapped/wrapped.service.ts:24`
- **Issue:** The `metadata` object created in `generate` doesn't include `totalCompleted`, `totalHours`, or `totalJournalEntries`. Even though `findAll` reads them with `?? 0`, they're never set, so they always return 0.
- **Current code:**
  ```typescript
  const metadata = { cards, insights, summary, sharePayload, version: 1 };
  ```
- **Fix:** Add the missing fields:
  ```typescript
  const metadata = {
    cards,
    insights,
    summary,
    sharePayload,
    version: 1,
    totalCompleted: Object.values(completedByType).reduce((a, b) => a + b, 0),
    totalHours: Math.round(Object.values(genreData.genreTime).reduce((a, b) => a + b, 0)),
    totalJournalEntries: journalDates.length,
  };
  ```

### 4. Six insights still hardcoded to null
- **File:** `apps/backend/src/analytics/insights.service.ts:34-45`
- **Issue:** `favoriteDecade`, `longestBinge`, `mostRewatched`, `mostReread`, `mostReplayed`, `avgCompletionTime` still hardcoded to `null`.
- **Current code:**
  ```typescript
  const favoriteDecade = null;
  const longestBinge = null;
  const mostRewatched = null;
  const mostReread = null;
  const mostReplayed = null;
  const avgCompletionTime = null;
  ```
- **Fix:** Either compute from actual data or remove from the `InsightsDto` response type.

---

## New Issues Found

### 5. `_completedByType` fetched but unused
- **File:** `apps/backend/src/analytics/insights.service.ts:10,13`
- **Issue:** `_completedByType` is fetched from the database but never used (prefixed with `_`).
- **Fix:** Either use it for insights or remove the fetch to save a database query.

### 6. `SEARCHABLE_SETTINGS` still imported from empty types
- **File:** `src/components/search/CommandPalette.tsx:21`
- **Issue:** `SEARCHABLE_SETTINGS` is imported from `@/lib/types` where it's an empty array `[]`. Settings search will show no results.
- **Fix:** Populate from a config array or define settings locally.

### 7. `library.ts` still has mock data
- **File:** `src/lib/library.ts`
- **Issues:**
  - `smartInsights()` (line 154-162) returns hardcoded strings like "You completed 7 stories this month"
  - `SEED_ALL` (line 27) is empty `[]`
  - `ALL_LIBRARY` (line 46) is empty `[]`
  - `trendFor()` (line 158) returns hardcoded `12`
- **Fix:** Replace with real data from API hooks.

### 8. `activityFeed.ts` still returns mock data
- **File:** `src/lib/activityFeed.ts`
- **Issue:** `getActivityFeed()` returns hardcoded activity items.
- **Fix:** Replace with API call.

### 9. `types.ts` still has 20 empty stub exports
- **File:** `src/lib/types.ts:87-108`
- **Issue:** `MEDIA`, `COLLECTIONS`, `JOURNAL`, `THIS_WEEK`, `ACTIVITY_30D`, `STATS`, `CALENDAR_HERO`, `CALENDAR_INSIGHTS`, `YEAR_HEATMAP`, `CALENDAR_HIGHLIGHTS`, `MEMORY_STREAKS`, `UPCOMING_RELEASES`, `CALENDAR_YEAR`, `JOURNAL_PROMPTS`, `MEMORY_CLUSTERS`, `QUOTES`, `PINNED_MEDIA`, `RECENT_JOURNALS`, `SEARCHABLE_SETTINGS`, `ACHIEVEMENTS` — all empty arrays.
- **Fix:** Remove these exports or populate from API.

### 10. `app.wrapped.tsx` still uses `window.print()`
- **File:** `src/routes/app.wrapped.tsx:203,344`
- **Issue:** "Print Summary" and "Download" buttons call `window.print()` instead of generating an image.
- **Fix:** Use html2canvas or similar library to capture DOM as image.

### 11. `wrapped-generator.service.ts` avgRating insight may be skipped
- **File:** `apps/backend/src/wrapped/wrapped-generator.service.ts:107`
- **Issue:** `if (avgRating)` — if `avgRating` is `0`, the insight is skipped. Should use `avgRating !== null`.
- **Fix:** Change to `if (avgRating !== null && avgRating !== undefined)`.

### 12. `_totalHours` variable prefixed as unused but is used
- **File:** `apps/backend/src/wrapped/wrapped-generator.service.ts:31`
- **Issue:** Variable is named `_totalHours` (underscore prefix convention for unused) but it IS used in `sharePayload` at line 137. The prefix is misleading.
- **Fix:** Rename to `totalHours`.

### 13. `analytics-aggregation.service.ts` genre ratings division confusing
- **File:** `apps/backend/src/analytics/analytics-aggregation.service.ts:94`
- **Issue:** `genreRatings[genre] = Math.round((data.total / data.count / 2) * 10) / 10` — the `/2` is now documented with a comment, but the double division pattern is still confusing.
- **Fix:** Consider extracting to a helper function for clarity.

---

## Summary

| Category | Count |
|----------|-------|
| Fixed (confirmed) | 28 |
| Remaining Critical | 2 |
| Remaining High | 2 |
| New Issues | 9 |
| **Total Issues Found** | **41** |

---

## Priority Action Plan

### Immediate (4 items)

| Priority | File | Line | Fix |
|----------|------|------|-----|
| 1 | `apps/backend/src/wrapped/wrapped.service.ts` | 119-121 | `getSummary`: read from metadata instead of hardcoded zeros |
| 2 | `apps/backend/src/wrapped/wrapped.service.ts` | 24 | Add `totalCompleted`/`totalHours`/`totalJournalEntries` to metadata |
| 3 | `src/hooks/use-auth.ts` | 53-54 | `useLogoutAll`: add `setAccessToken(null)` |
| 4 | `apps/backend/src/analytics/insights.service.ts` | 34-45 | Implement or remove 6 null insights |

### Short Term (5 items)

| Priority | File | Line | Fix |
|----------|------|------|-----|
| 5 | `apps/backend/src/analytics/insights.service.ts` | 10,13 | Remove unused `_completedByType` fetch |
| 6 | `src/components/search/CommandPalette.tsx` | 21 | Populate `SEARCHABLE_SETTINGS` or remove import |
| 7 | `src/routes/app.wrapped.tsx` | 203,344 | Replace `window.print()` with html2canvas |
| 8 | `apps/backend/src/wrapped/wrapped-generator.service.ts` | 107 | Fix `avgRating` check to handle 0 |
| 9 | `apps/backend/src/wrapped/wrapped-generator.service.ts` | 31 | Rename `_totalHours` to `totalHours` |

### Medium Term (4 items)

| Priority | File | Fix |
|----------|------|-----|
| 10 | `src/lib/library.ts` | Replace `smartInsights()` with real data |
| 11 | `src/lib/activityFeed.ts` | Replace mock activity feed with API call |
| 12 | `src/lib/types.ts` | Remove or populate 20 empty stub exports |
| 13 | `apps/backend/src/analytics/analytics-aggregation.service.ts` | Extract rating conversion to helper |
