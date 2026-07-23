# Chronicle — Full Audit Report (V2)

**Date:** 2026-07-23  
**Scope:** Bugs, mock data, hardcoded data, wrong logic, missing premiumness, security issues, glitches  
**Method:** Direct file reads + sub-agent analysis across all frontend (React/TS) and backend (NestJS/Prisma) code

---

## Table of Contents

1. [Critical Bugs (15)](#critical-bugs)
2. [High Priority Bugs (12)](#high-priority-bugs)
3. [Medium Priority Bugs (10)](#medium-priority-bugs)
4. [Low Priority / Style Issues (8)](#low-priority--style-issues)
5. [Mock Data Files (6)](#mock-data-files)
6. [Security Issues (7)](#security-issues)
7. [Summary Table](#summary-table)
8. [Top 10 Fixes to Prioritize](#top-10-fixes-to-prioritize)
9. [Detailed File-by-File Findings](#detailed-file-by-file-findings)

---

## Critical Bugs

### 1. Missing `setAccessToken(null)` on logout
- **File:** `src/hooks/use-auth.ts:42`
- **Issue:** `useLogout` calls `queryClient.clear()` but never resets the access token in memory. The token persists after logout, allowing continued API access with a cleared session.
- **Current code:**
  ```typescript
  onSuccess: () => {
    queryClient.clear();
  },
  ```
- **Fix:** Add `setAccessToken(null)` before `queryClient.clear()`. Import `setAccessToken` from `@/lib/api/fetch`.
- **Impact:** Security — users can make API calls after logout.

### 2. Wrong status mappings in adapters
- **File:** `src/lib/api/adapters.ts:28-29`
- **Issue:** `DROPPED: "paused"` and `ARCHIVED: "completed"` are incorrect mappings. Dropped items should map to `"dropped"`, archived to `"archived"`.
- **Current code:**
  ```typescript
  DROPPED: "paused",
  ARCHIVED: "completed",
  ```
- **Fix:** Change to `DROPPED: "dropped"` and `ARCHIVED: "archived"`.
- **Impact:** Data corruption — dropped items appear as paused, archived items appear as completed.

### 3. Rating division bug
- **File:** `apps/backend/src/analytics/analytics.repository.ts:168`
- **Issue:** `return totalCount > 0 ? totalSum / totalCount / 2 : null` divides by 2 without documentation. If ratings are stored 0-10, this converts to 0-5 (correct). If stored 0-5, this halves them (wrong).
- **Current code:**
  ```typescript
  return totalCount > 0 ? totalSum / totalCount / 2 : null; // Convert to 0.5-5.0 scale
  ```
- **Fix:** Verify rating scale in Prisma schema. If 0-10, add clear comment. If 0-5, remove `/2`.
- **Impact:** All average ratings displayed to users may be wrong.

### 4. Hardcoded zeros in wrapped service
- **File:** `apps/backend/src/wrapped/wrapped.service.ts:74-76,119-121`
- **Issue:** `totalCompleted: 0`, `totalHours: 0`, `totalJournalEntries: 0` hardcoded in both `findAll` and `getSummary` methods.
- **Current code:**
  ```typescript
  totalCompleted: 0,
  totalHours: 0,
  totalJournalEntries: 0,
  ```
- **Fix:** Compute from wrapped metadata or stats. The generator never sets these values in metadata.
- **Impact:** Users see 0 for all summary stats in wrapped list.

### 5. Hardcoded fallback secret key
- **File:** `apps/backend/src/config/configuration.ts:42`
- **Issue:** `process.env.OAUTH_ENCRYPTION_KEY || 'default_secret_key_32_bytes_long!'` — committed secret key visible in repository.
- **Current code:**
  ```typescript
  encryptionKey: process.env.OAUTH_ENCRYPTION_KEY || 'default_secret_key_32_bytes_long!',
  ```
- **Fix:** Remove fallback. Throw descriptive error if not set in production.
- **Impact:** Security — any OAuth tokens encrypted with this key can be decrypted by anyone with repository access.

### 6. Same hardcoded secret in OAuth repository
- **File:** `apps/backend/src/auth/repositories/oauth-account.repository.ts:29-30`
- **Issue:** Duplicates the hardcoded fallback. Line 30 also pads with `'0'` characters creating a weak key.
- **Current code:**
  ```typescript
  const secret = this.config.get<string>('oauth.encryptionKey') ?? 'default_secret_key_32_bytes_long!';
  this.encryptionKey = Buffer.from(secret.padEnd(32, '0').slice(0, 32));
  ```
- **Fix:** Remove fallback. Validate key length.
- **Impact:** Security — weak encryption key for OAuth tokens.

### 7. Hardcoded `_totalHours = 0` in generator
- **File:** `apps/backend/src/wrapped/wrapped-generator.service.ts:31`
- **Issue:** `_totalHours = 0` with comment "Would need hours tracking to compute". Hours are never computed.
- **Current code:**
  ```typescript
  const _totalHours = 0; // Would need hours tracking to compute
  ```
- **Fix:** Compute hours from analytics data.
- **Impact:** Total hours always shows 0 in wrapped.

### 8. Six hardcoded null insights
- **File:** `apps/backend/src/analytics/insights.service.ts:32-43,54`
- **Issue:** `favoriteDecade`, `longestBinge`, `mostRewatched`, `mostReread`, `mostReplayed`, `avgCompletionTime` all hardcoded to `null`. `totalHours` hardcoded to `0`.
- **Current code:**
  ```typescript
  const favoriteDecade = null;
  const longestBinge = null;
  const mostRewatched = null;
  const mostReread = null;
  const mostReplayed = null;
  const avgCompletionTime = null;
  let totalHours = 0;
  ```
- **Fix:** Compute from actual data.
- **Impact:** Insights page shows empty/null for most fields.

### 9. Hardcoded zeros in analytics aggregation
- **File:** `apps/backend/src/analytics/analytics-aggregation.service.ts:34-43`
- **Issue:** `episodesWatched: 0`, `hoursWatched: 0`, `hoursRead: 0`, `hoursPlayed: 0`, `hoursLearned: 0`, `favoriteGenre: null` all hardcoded.
- **Current code:**
  ```typescript
  episodesWatched: 0,
  hoursWatched: 0,
  hoursRead: 0,
  hoursPlayed: 0,
  hoursLearned: 0,
  favoriteGenre: null,
  ```
- **Fix:** Compute from actual data.
- **Impact:** Overview page shows 0 for all hour metrics.

### 10. Off-by-one pagination bug
- **File:** `apps/backend/src/library/library.repository.ts:166,170,201`
- **Issue:** `findAll` returns `limit + 1` items instead of `limit`. The `+1` for "has more" detection leaks to callers.
- **Current code:**
  ```typescript
  const rows = await this.executeFindAll(delegate, userId, t, { ...params, limit: params.limit + 1 });
  // ...
  return all.slice(0, params.limit + 1);
  ```
- **Fix:** Slice to `params.limit` before returning.
- **Impact:** API returns one extra item per page.

### 11. Duplicate condition in interaction service
- **File:** `apps/backend/src/interaction/interaction.service.ts:23`
- **Issue:** `if (rating === null || rating === null)` — both conditions check `null`. Should check `undefined` for second.
- **Current code:**
  ```typescript
  if (rating === null || rating === null) return null;
  ```
- **Fix:** Change to `if (rating === null || rating === undefined)`.
- **Impact:** `undefined` ratings pass through and cause `NaN` when divided by 2.

### 12. String used as Date in journal queries
- **File:** `apps/backend/src/journal/journal.repository.ts:36,98,155,215,282`
- **Issue:** `where: { createdAt: { lt: cursor } }` — `cursor` is a string but `createdAt` is a Date field in Prisma.
- **Current code:**
  ```typescript
  if (cursor) where.createdAt = { lt: cursor };
  ```
- **Fix:** Change to `{ lt: new Date(cursor) }`.
- **Impact:** Queries may return wrong results or crash.

### 13. Metadata overwritten with empty object
- **File:** `apps/backend/src/analytics/analytics.repository.ts:487`
- **Issue:** `update: { ...data, metadata: {} }` overwrites metadata with empty object on every snapshot update.
- **Current code:**
  ```typescript
  update: { ...data, metadata: {} },
  ```
- **Fix:** Remove `metadata: {}` or merge properly.
- **Impact:** Snapshot metadata is lost on every update.

### 14. emailVerified defaults to true
- **File:** `apps/backend/src/auth/auth.repository.ts:49`
- **Issue:** New users are considered email-verified by default.
- **Current code:**
  ```typescript
  emailVerified: data.emailVerified ?? true,
  ```
- **Fix:** Change to `emailVerified: data.emailVerified ?? false`.
- **Impact:** Security — unverified users can access protected features.

### 15. 20 empty stub exports in types
- **File:** `src/lib/types.ts:87-108`
- **Issue:** `MEDIA = []`, `COLLECTIONS = []`, `JOURNAL = []`, etc. are empty arrays. `CommandPalette.tsx` imports these for search results.
- **Current code:**
  ```typescript
  export const MEDIA: MediaItem[] = [];
  export const COLLECTIONS: Collection[] = [];
  export const JOURNAL: any[] = [];
  // ... 17 more empty exports
  ```
- **Fix:** Remove these exports, use API hooks instead.
- **Impact:** CommandPalette search shows no pinned media, collections, or recent journals.

---

## High Priority Bugs

### 16. Most Rewatched sort broken
- **File:** `src/routes/app.library.completed.tsx:19-22`
- **Issue:** "Most Rewatched" sort returns `0` (no-op). The `completed` function doesn't track rewatch counts.
- **Current code:**
  ```typescript
  .sort((a, b) => {
    if (sort === "Highest Rated") return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });
  ```
- **Fix:** Implement rewatch count tracking or remove sort option.
- **Impact:** Sort option does nothing.

### 17. Rating and Personal Rating identical sort
- **File:** `src/routes/app.library.all.tsx:46-53`
- **Issue:** Both "Rating" and "Personal Rating" use the same sort: `(b.rating ?? 0) - (a.rating ?? 0)`.
- **Current code:**
  ```typescript
  case "Rating":
    r.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    break;
  case "Personal Rating":
    r.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    break;
  ```
- **Fix:** "Rating" should sort by average/critic rating, "Personal Rating" by user's own rating.
- **Impact:** Two sort options produce identical results.

### 18. Archive button has no onClick
- **File:** `src/routes/app.library.paused.tsx:53`
- **Issue:** Archive button renders but does nothing when clicked.
- **Current code:**
  ```typescript
  <button className="press-scale glass-subtle inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground">
    <ArchiveIcon className="h-3 w-3" /> Archive
  </button>
  ```
- **Fix:** Add onClick handler to move item to archived status.
- **Impact:** Button is non-functional.

### 19. window.print() for "Save as image"
- **File:** `src/routes/app.wrapped.tsx:203,344`
- **Issue:** "Save as image" buttons call `window.print()` which opens browser print dialog.
- **Current code:**
  ```typescript
  <PremiumButton variant="secondary" icon={<Download className="h-4 w-4" />} onClick={() => window.print()}>
    Save as image
  </PremiumButton>
  ```
- **Fix:** Use html2canvas or similar library to capture DOM as image.
- **Impact:** Users can't save wrapped as image.

### 20. Mock getCalendarDay
- **File:** `src/lib/api/analytics.ts:229-235`
- **Issue:** Returns hardcoded empty response instead of calling API. Comment says "Backend doesn't support this yet".
- **Current code:**
  ```typescript
  export async function getCalendarDay(date: string): Promise<CalendarDayResponse> {
    // Backend doesn't support this yet, return mock
    return { date, mediaItems: [], journalEntry: null };
  }
  ```
- **Fix:** Implement backend endpoint or remove frontend call.
- **Impact:** Calendar day details always empty.

### 21. Mock getCalendarYear
- **File:** `src/lib/api/analytics.ts:238-263`
- **Issue:** Returns hardcoded empty response with 12 months of zeros.
- **Current code:**
  ```typescript
  export async function getCalendarYear(year: number): Promise<CalendarYearResponse> {
    // Backend doesn't support this yet, return mock
    return {
      year,
      stats: { totalStories: 0, totalJournals: 0, longestStreak: 0, totalHours: 0 },
      months: Array.from({ length: 12 }).map((_, i) => ({
        month: i + 1,
        name: new Date(year, i, 1).toLocaleString('default', { month: 'long' }),
        journalCount: 0, storyCount: 0, hoursTracked: 0, topMedia: [], dayHits: 0
      })),
      heatmap: [], highlights: [], streaks: [], upcoming: [], insights: []
    };
  }
  ```
- **Fix:** Implement backend endpoint or remove frontend call.
- **Impact:** Calendar year view always shows zeros.

### 22. Boolean config parsing bug
- **File:** `apps/backend/src/auth/auth.service.ts:61`
- **Issue:** `this.config.get<boolean>('emailVerification.required') ?? true` — string `'false'` is truthy, so verification stays enabled even when env var says `'false'`.
- **Current code:**
  ```typescript
  const verificationRequired = this.config.get<boolean>('emailVerification.required') ?? true;
  ```
- **Fix:** Use explicit string comparison.
- **Impact:** Can't disable email verification via env var.

### 23. coverImage set to null on regenerate
- **File:** `apps/backend/src/wrapped/wrapped.service.ts:55`
- **Issue:** `coverImage: null` overwrites existing cover image when regenerating.
- **Current code:**
  ```typescript
  const updated = await this.repository.updateWrappedYear(existing.id, {
    metadata,
    generatedAt: new Date(),
    coverImage: null,
  });
  ```
- **Fix:** Preserve existing cover image or check before overwriting.
- **Impact:** Cover image lost on regeneration.

### 24. Same hardcoded secret in env.validation
- **File:** `apps/backend/src/config/env.validation.ts:59`
- **Issue:** Third location with the same hardcoded `'default_secret_key_32_bytes_long!'`.
- **Current code:**
  ```typescript
  OAUTH_ENCRYPTION_KEY: string = 'default_secret_key_32_bytes_long!';
  ```
- **Fix:** Remove all hardcoded fallbacks.
- **Impact:** Security — secret is committed in three places.

### 25. Missing null check before .getTime()
- **File:** `apps/backend/src/analytics/analytics.repository.ts:249,266`
- **Issue:** `results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())` crashes if `createdAt` is null.
- **Current code:**
  ```typescript
  results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  ```
- **Fix:** Add null check before `.getTime()`.
- **Impact:** TypeError crash if any item has null createdAt.

### 26. Fragile null check
- **File:** `apps/backend/src/library/library.repository.ts:352`
- **Issue:** `return item !== null && item.deletedAt === null` — using `!item` is more robust for handling both null and undefined.
- **Current code:**
  ```typescript
  return item !== null && item.deletedAt === null;
  ```
- **Fix:** Change to `return item && !item.deletedAt`.
- **Impact:** Potential TypeError if Prisma returns undefined instead of null.

### 27. Inconsistent sortOrder handling
- **File:** `apps/backend/src/wrapped/wrapped.service.ts:33 vs 59`
- **Issue:** `generate` uses `s.sortOrder` while `regenerate` uses `i + 1`. Regenerated wrappeds may have different stat ordering.
- **Current code:**
  ```typescript
  // generate:
  stats.map((s) => ({ title: s.title, value: s.value, icon: s.icon ?? undefined, sortOrder: s.sortOrder })),
  // regenerate:
  stats.map((s, i) => ({ title: s.title, value: s.value, icon: s.icon ?? undefined, sortOrder: i + 1 })),
  ```
- **Fix:** Use consistent approach in both methods.
- **Impact:** Stats may appear in different order after regeneration.

---

## Medium Priority Bugs

### 28. Mock activity feed
- **File:** `src/lib/activityFeed.ts`
- **Issue:** `getActivityFeed()` returns hardcoded activity items instead of calling API.
- **Fix:** Implement API call.

### 29. Mock smart insights
- **File:** `src/lib/library.ts:154-162`
- **Issue:** `smartInsights()` returns hardcoded strings like "You completed 7 stories this month".
- **Fix:** Compute from real data.

### 30. Hardcoded date string
- **File:** `src/lib/library.ts:73`
- **Issue:** `const order = ["Today", "Yesterday", "Last week", "1 month ago", "6 weeks ago", "Mar 2024"]` — "Mar 2024" is hardcoded.
- **Fix:** Make date relative to current date.

### 31. Hardcoded fallback weekday
- **File:** `apps/backend/src/analytics/insights.service.ts:24`
- **Issue:** `mostActiveWeekday` defaults to `'Mon'` when no data exists.
- **Fix:** Return `null` instead of hardcoded value.

### 32. avgRating of 0 shows N/A
- **File:** `apps/backend/src/wrapped/wrapped-generator.service.ts:80`
- **Issue:** `avgRating ? avgRating.toFixed(1) : 'N/A'` — if avgRating is 0, displays N/A instead of 0.0.
- **Fix:** Change to `avgRating !== null ? avgRating.toFixed(1) : 'N/A'`.

### 33. Decrypt silently returns encrypted text
- **File:** `apps/backend/src/auth/repositories/oauth-account.repository.ts:51-53`
- **Issue:** On decryption failure, returns original encrypted text instead of throwing or returning null.
- **Fix:** Throw error or return null on failure.

### 34. All errors silently swallowed
- **File:** `apps/backend/src/journal/journal.repository.ts:131-133`
- **Issue:** `catch { // duplicate or invalid - ignore }` catches ALL errors, not just duplicate key errors.
- **Fix:** Only catch specific duplicate key errors.

### 35. Missing window guard
- **File:** `src/hooks/use-online.ts:9-10`
- **Issue:** `window.addEventListener` called without checking if `window` is defined. SSR would throw.
- **Fix:** Add `typeof window !== 'undefined'` guard.

### 36. Confusing division in genre ratings
- **File:** `apps/backend/src/analytics/analytics-aggregation.service.ts:92`
- **Issue:** `genreRatings[genre] = Math.round((data.total / data.count / 2) * 10) / 10` — `/2` should be documented.
- **Fix:** Add comment explaining scale conversion.

### 37. Query keys include object params by reference
- **File:** `src/lib/api/query-keys.ts`
- **Issue:** `media.list(params)` includes `params` object. If recreated on each render, queries invalidate unnecessarily.
- **Fix:** Serialize params objects in query keys.

---

## Low Priority / Style Issues

### 38. PremiumButton hardcoded colors
- **File:** `src/components/ui/PremiumButton.tsx:38`
- **Issue:** Primary variant uses `bg-foreground text-background` instead of `var(--primary)`.

### 39. LiquidGlassCard different styling
- **File:** `src/components/auth/LiquidGlassCard.tsx`
- **Issue:** Uses `rgba()` values instead of OKLCH tokens, doesn't reference any CSS variables from `styles.css`.

### 40. AuthStage 100+ hardcoded colors
- **File:** `src/components/auth/AuthStage.tsx`
- **Issue:** Extensive hardcoded `rgba()` and `oklch()` values instead of design system tokens.

### 41. BottomBorderInput hardcoded colors
- **File:** `src/components/auth/BottomBorderInput.tsx`
- **Issue:** 10+ hardcoded color values instead of CSS variables.

### 42. Capture FAB hardcoded colors
- **File:** `src/components/layout/AppShell.tsx:95-104`
- **Issue:** FAB uses hardcoded gradient and shadow values.

### 43. Nav items hardcoded colors
- **File:** `src/components/layout/Sidebar.tsx:87-98`
- **Issue:** Active/inactive nav items use hardcoded `bg-white/[0.06]`.

### 44. ShareCard hardcoded colors
- **File:** `src/lib/shareCard.ts`
- **Issue:** 6 hardcoded color values in SVG generator.

### 45. Error page hardcoded colors
- **File:** `src/lib/error-page.ts`
- **Issue:** 5 hardcoded color values (`#fafafa`, `#111`, etc.).

---

## Mock Data Files

### 46. Activity feed is mock
- **File:** `src/lib/activityFeed.ts`
- **Issue:** Entire file returns hardcoded activity items.

### 47. Smart insights are mock
- **File:** `src/lib/library.ts`
- **Issue:** `smartInsights()` returns hardcoded insight strings.

### 48. Types empty stubs
- **File:** `src/lib/types.ts`
- **Issue:** 20 empty array exports used as fallbacks.

### 49. Seed data is empty
- **File:** `src/lib/library.ts:27`
- **Issue:** `SEED_ALL: MediaItem[] = []` — empty seed array.

### 50. Trend data is mock
- **File:** `src/lib/library.ts:158`
- **Issue:** `trendFor("planning")` returns hardcoded `12`.

### 51. Analytics module is stub
- **File:** `src/lib/analytics.ts`
- **Issue:** `track()` and `page()` log to console in DEV, silently drop in production.

---

## Security Issues

| # | File | Line | Issue |
|---|------|------|-------|
| 5 | `apps/backend/src/config/configuration.ts` | 42 | Hardcoded fallback secret key |
| 6 | `apps/backend/src/auth/repositories/oauth-account.repository.ts` | 29-30 | Same hardcoded secret + weak padding |
| 24 | `apps/backend/src/config/env.validation.ts` | 59 | Third location of same secret |
| 14 | `apps/backend/src/auth/auth.repository.ts` | 49 | `emailVerified` defaults to `true` |
| 1 | `src/hooks/use-auth.ts` | 42 | Missing `setAccessToken(null)` on logout |
| 22 | `apps/backend/src/auth/auth.service.ts` | 61 | Boolean config parsing bug |
| 33 | `apps/backend/src/auth/repositories/oauth-account.repository.ts` | 51-53 | Decrypt silently returns encrypted text |

---

## Summary Table

| Category | Count |
|----------|-------|
| Critical Bugs | 15 |
| High Priority Bugs | 12 |
| Medium Priority Bugs | 10 |
| Low Priority / Style | 8 |
| Mock Data Files | 6 |
| Security Issues | 7 |
| **Total** | **51** |

---

## Top 10 Fixes to Prioritize

| Priority | File | Line | Issue | Impact |
|----------|------|------|-------|--------|
| 1 | `src/hooks/use-auth.ts` | 42 | Missing `setAccessToken(null)` on logout | Security |
| 2 | `src/lib/api/adapters.ts` | 28-29 | Wrong DROPPED/ARCHIVED mappings | Data corruption |
| 3 | `apps/backend/src/wrapped/wrapped.service.ts` | 74-76,119-121 | Hardcoded zeros | Users see 0 |
| 4 | `apps/backend/src/config/configuration.ts` | 42 | Hardcoded secret key | Security |
| 5 | `apps/backend/src/analytics/analytics.repository.ts` | 168 | Rating `/2` division | Wrong ratings |
| 6 | `apps/backend/src/library/library.repository.ts` | 166,170,201 | Returns `limit + 1` items | API bug |
| 7 | `apps/backend/src/analytics/insights.service.ts` | 32-43 | Six null insights, totalHours=0 | Empty insights |
| 8 | `apps/backend/src/auth/auth.repository.ts` | 49 | emailVerified defaults true | Security bypass |
| 9 | `apps/backend/src/interaction/interaction.service.ts` | 23 | Duplicate `rating === null` | Rating bug |
| 10 | `apps/backend/src/journal/journal.repository.ts` | 36,98,155,215,282 | String used as Date | Query bug |

---

## Detailed File-by-File Findings

### Frontend Files

#### `src/hooks/use-auth.ts`
- Line 42: Missing `setAccessToken(null)` in `useLogout.onSuccess`
- Lines 49-57: `useLogoutAll` also missing explicit token reset (relies on API `finally` block)

#### `src/lib/api/adapters.ts`
- Line 28: `DROPPED: "paused"` — should be `"dropped"`
- Line 29: `ARCHIVED: "completed"` — should be `"archived"`
- Line 37: `year: m.releaseYear ?? 2024` — hardcoded 2024
- Line 57: `year: media?.releaseYear ?? 2024` — hardcoded 2024
- Line 78: `year: 2024` — hardcoded year

#### `src/lib/types.ts`
- Lines 87-108: 20 empty stub exports (`MEDIA`, `COLLECTIONS`, `JOURNAL`, etc.)

#### `src/lib/activityFeed.ts`
- Lines 21-58: Entire file returns hardcoded mock activity items

#### `src/lib/library.ts`
- Line 27: `SEED_ALL: MediaItem[] = []` — empty seed
- Line 73: Hardcoded `"Mar 2024"` in date order
- Lines 154-162: `smartInsights()` returns hardcoded strings

#### `src/lib/api/analytics.ts`
- Lines 229-235: `getCalendarDay()` returns mock empty response
- Lines 238-263: `getCalendarYear()` returns mock with 12 zeroed months

#### `src/routes/app.library.completed.tsx`
- Lines 19-22: "Most Rewatched" sort returns 0 (no-op)

#### `src/routes/app.library.all.tsx`
- Lines 46-53: "Rating" and "Personal Rating" use identical sort

#### `src/routes/app.library.paused.tsx`
- Line 53: Archive button has no onClick handler

#### `src/routes/app.wrapped.tsx`
- Line 203: "Save as image" calls `window.print()`
- Line 344: "Download" calls `window.print()`

#### `src/hooks/use-online.ts`
- Lines 9-10: Missing `typeof window !== 'undefined'` guard

### Backend Files

#### `apps/backend/src/config/configuration.ts`
- Line 42: Hardcoded `'default_secret_key_32_bytes_long!'`
- Lines 37-38: Google OAuth credentials default to empty strings

#### `apps/backend/src/config/env.validation.ts`
- Line 59: Same hardcoded secret key

#### `apps/backend/src/auth/repositories/oauth-account.repository.ts`
- Line 29: Same hardcoded secret key
- Line 30: Weak key padding with `'0'` characters
- Lines 51-53: Decrypt silently returns encrypted text on failure

#### `apps/backend/src/auth/auth.repository.ts`
- Line 49: `emailVerified` defaults to `true`

#### `apps/backend/src/auth/auth.service.ts`
- Line 61: Boolean config parsing bug (`'false'` is truthy)

#### `apps/backend/src/analytics/analytics.repository.ts`
- Line 168: Rating `/2` division without documentation
- Line 487: `saveSnapshot` overwrites metadata with `{}`
- Lines 249, 266: Missing null check before `.getTime()`

#### `apps/backend/src/analytics/analytics-aggregation.service.ts`
- Lines 34-43: Hardcoded zeros for hours metrics
- Line 92: Confusing `/2` division in genre ratings

#### `apps/backend/src/analytics/insights.service.ts`
- Lines 32-43: Six insights hardcoded to null
- Line 54: `totalHours = 0` never computed

#### `apps/backend/src/wrapped/wrapped.service.ts`
- Lines 74-76: Hardcoded zeros in `findAll`
- Lines 119-121: Hardcoded zeros in `getSummary`
- Line 55: `coverImage: null` overwrites on regenerate
- Lines 33 vs 59: Inconsistent `sortOrder` handling

#### `apps/backend/src/wrapped/wrapped-generator.service.ts`
- Line 31: `_totalHours = 0` with comment "Would need hours tracking"
- Line 80: `avgRating` of 0 shows N/A

#### `apps/backend/src/library/library.repository.ts`
- Lines 166, 170, 201: Returns `limit + 1` items (pagination bug)
- Line 352: Fragile null check

#### `apps/backend/src/journal/journal.repository.ts`
- Lines 36, 98, 155, 215, 282: String cursor used as Date
- Lines 131-133: All errors silently swallowed

#### `apps/backend/src/interaction/interaction.service.ts`
- Line 23: Duplicate `rating === null` condition
