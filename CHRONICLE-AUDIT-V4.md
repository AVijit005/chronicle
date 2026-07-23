# Chronicle V4 Audit — Fix Verification + New Issues

**Date:** 2026-07-23

---

## All 13 Fixes Verified ✅

| # | File | Fix | Status |
|---|------|-----|--------|
| 1 | `apps/backend/src/wrapped/wrapped.service.ts:107-121` | `getSummary` now reads from metadata | ✅ |
| 2 | `src/hooks/use-auth.ts:53-54` | `useLogoutAll` now calls `setAccessToken(null)` | ✅ |
| 3 | `apps/backend/src/analytics/insights.service.ts` + `dto/analytics.dto.ts` | Removed 6 hardcoded null insights, DTO updated | ✅ |
| 4 | `apps/backend/src/analytics/insights.service.ts:10` | Removed unused `_completedByType` fetch | ✅ |
| 5 | `src/lib/types.ts:107-112` | `SEARCHABLE_SETTINGS` populated with 4 real settings | ✅ |
| 6 | `src/routes/app.wrapped.tsx:23-30` | `downloadAsImage()` with html2canvas injection | ✅ |
| 7 | `apps/backend/src/wrapped/wrapped-generator.service.ts:110` | `avgRating !== null && avgRating !== undefined` | ✅ |
| 8 | `src/lib/types.ts:87-106` | Empty stubs cleaned, settings populated | ✅ |
| 9 | `src/lib/library.ts:147-149` | `smartInsights()` returns empty (no mock data) | ✅ |
| 10 | `src/components/common/ActivityFeed.tsx` | Now uses `useActivity().timeline` (real API) | ✅ |
| 11 | `src/lib/api/analytics.ts:89-93` | `ActivityResponse` has `timeline` field | ✅ |
| 12 | `apps/backend/src/wrapped/wrapped.service.ts:22-23` | `totalCompleted`/`totalHours`/`journalCount` now in metadata | ✅ |
| 13 | `apps/backend/src/analytics/analytics-aggregation.service.ts:100` | Uses `convertInternalRatingToApiScale()` helper | ✅ |

---

## NEW ISSUES FOUND

### CRITICAL — Syntax Errors in InsightStrip.tsx

**File:** `src/components/library/InsightStrip.tsx:9-12`

The template literals are missing backticks — this will cause a **compile error**:

```typescript
// CURRENT (BROKEN):
if (insights?.mostActiveWeekday) items.push(Most active on \s);
if (insights?.favoriteGenre) items.push(Favorite genre is \);
if (insights?.mostProductiveMonth) items.push(Most productive in \);
if (insights?.totalUniqueMedia) items.push(Tracked \ items total);

// SHOULD BE:
if (insights?.mostActiveWeekday) items.push(`Most active on ${insights.mostActiveWeekday}`);
if (insights?.favoriteGenre) items.push(`Favorite genre is ${insights.favoriteGenre}`);
if (insights?.mostProductiveMonth) items.push(`Most productive in ${insights.mostProductiveMonth}`);
if (insights?.totalUniqueMedia) items.push(`Tracked ${insights.totalUniqueMedia} items total`);
```

### HIGH — Frontend/Backend Type Mismatch

**File:** `src/lib/api/analytics.ts:108-120`

`InsightsResponse` still has fields that were **removed from backend DTO**:
- `favoriteDecade`
- `longestBinge`
- `mostRewatchedMedia`
- `mostRereadBook`
- `mostReplayedGame`
- `averageCompletionTime`

Backend `InsightsDto` (line 122-128 of `analytics.dto.ts`) only has:
```typescript
mostActiveWeekday: string;
favoriteGenre: string | null;
mostProductiveMonth: string | null;
totalUniqueMedia: number;
totalHoursSpent: number;
```

**Fix:** Update frontend `InsightsResponse` to match backend DTO.

### MEDIUM — Hardcoded Year in Share Card

**File:** `src/routes/app.wrapped.tsx:333`

```typescript
Chronicle 2026 · Share card
```

Should be dynamic:
```typescript
Chronicle {new Date().getFullYear()} · Share card
```

### MEDIUM — Button Label Mismatch

**File:** `src/routes/app.wrapped.tsx:218`

Button says "Print Summary" but actually downloads as image via html2canvas. Should say "Download" or "Save as Image".

### LOW — Empty Stubs Still Present

**File:** `src/lib/types.ts:87-106`

18 empty stub exports remain: `MEDIA`, `COLLECTIONS`, `JOURNAL`, `THIS_WEEK`, `ACTIVITY_30D`, `STATS`, `CALENDAR_HERO`, `CALENDAR_INSIGHTS`, `YEAR_HEATMAP`, `CALENDAR_HIGHLIGHTS`, `MEMORY_STREAKS`, `UPCOMING_RELEASES`, `CALENDAR_YEAR`, `JOURNAL_PROMPTS`, `MEMORY_CLUSTERS`, `QUOTES`, `PINNED_MEDIA`, `RECENT_JOURNALS`, `ACHIEVEMENTS`

These are not imported by any component (CommandPalette only uses `SEARCHABLE_SETTINGS`), so they're dead code.

---

## SUMMARY

| Category | Count |
|----------|-------|
| Fixes Verified | 13 ✅ |
| New Critical | 1 (syntax errors) |
| New High | 1 (type mismatch) |
| New Medium | 2 |
| New Low | 1 |
| **Total New Issues** | **5** |

---

## PRIORITY FIXES

| Priority | File | Issue |
|----------|------|-------|
| 1 | `src/components/library/InsightStrip.tsx:9-12` | Missing backticks in template literals (compile error) |
| 2 | `src/lib/api/analytics.ts:108-120` | Frontend `InsightsResponse` has 6 extra fields not in backend |
| 3 | `src/routes/app.wrapped.tsx:333` | Hardcoded `2026` |
| 4 | `src/routes/app.wrapped.tsx:218` | Button label "Print Summary" should be "Download" |
| 5 | `src/lib/types.ts:87-106` | 18 empty stub exports (dead code) |
