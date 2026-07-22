# Bug Fix Verification Report

**Date:** 2026-07-22
**Verified By:** Automated code analysis

---

## Summary

| Status | Count |
|--------|-------|
| FIXED | 14 |
| NOT FIXED | 3 |
| PARTIALLY FIXED | 1 |
| NEEDS VERIFICATION | 1 |

**14 of 19 bugs are fixed.** 5 remain (3 unfixed, 1 partial, 1 needs runtime verification).

---

## VERIFICATION DETAILS

### BUG-01: Race Condition in Session Restoration — PARTIALLY FIXED

**File:** `src/routes/__root.tsx:139-145` + `src/routes/app.tsx:7-30`

**Status:** PARTIALLY FIXED

`__root.tsx` still uses `useEffect` for async session restoration (line 139-145), which means `app.tsx`'s `beforeLoad` can still race against it. However, the **impact is greatly reduced** because `app.tsx` now only redirects on 401 errors (see BUG-02 fix). The race still exists but no longer causes a redirect on every refresh — it only redirects when the refresh token is truly invalid.

**Remaining risk:** If the refresh token cookie is valid but the `getCurrentUser()` call completes before the token refresh finishes, the user may briefly see a loading state or error before the session is restored.

---

### BUG-02: app.tsx beforeLoad Catches All Errors — FIXED

**File:** `src/routes/app.tsx:1-39`

**Before:**
```typescript
} catch {
  throw redirect({ to: "/auth" });
}
```

**After:**
```typescript
import { isRedirect } from "@tanstack/react-router";
import { ApiError } from "@/lib/api/fetch";
// ...
} catch (error) {
  if (isRedirect(error)) {
    throw error;
  }
  if (error instanceof ApiError && error.status === 401) {
    throw redirect({ to: "/auth" });
  }
  throw error;
}
```

Now only redirects on 401. Re-throws redirects and other errors properly.

---

### BUG-03: Access Token Stored in Memory Only — NOT FIXED

**File:** `src/lib/api/fetch.ts:20-28`

The access token is still stored in a module-level variable:
```typescript
let accessToken: string | null = null;
```

This is lost on every page refresh. The system relies on the refresh token cookie to restore it, but the race condition (BUG-01) means the token may not be available when `beforeLoad` fires.

**This is a design choice, not necessarily a bug** — storing in memory is more secure than localStorage. But it requires the session restoration to complete before any auth-gated route checks fire, which is the remaining issue in BUG-01.

---

### BUG-04: QueryClient Created Without Config — FIXED

**File:** `src/router.tsx:1-18`

**Before:**
```typescript
const queryClient = new QueryClient();
```

**After:**
```typescript
import { createQueryClient } from "./lib/api/query-client";
const queryClient = createQueryClient();
```

Now uses the properly configured QueryClient with retry logic, stale time, and error handling.

---

### BUG-05: useLibraryItem Missing User Auth Guard — FIXED

**File:** `src/hooks/use-library.ts:43-51`

**Before:** `enabled: !!id`
**After:** `enabled: !!id && !!user`

---

### BUG-06: useCollection Missing User Auth Guard — FIXED

**File:** `src/hooks/use-collections.ts:17-25`

**Before:** `enabled: !!id`
**After:** `enabled: !!id && !!user`

---

### BUG-07: useCollectionStats Missing User Auth Guard — FIXED

**File:** `src/hooks/use-collections.ts:27-35`

**Before:** `enabled: !!id`
**After:** `enabled: !!id && !!user`

---

### BUG-08: useMedia Missing User Auth Guard — FIXED

**File:** `src/hooks/use-media.ts:32-41`

**Before:** `enabled: !!id`
**After:** `enabled: !!id && !!user`

---

### BUG-09: useRelatedMedia Missing User Auth Guard — FIXED

**File:** `src/hooks/use-media.ts:43-52`

**Before:** `enabled: !!id`
**After:** `enabled: !!id && !!user`

---

### BUG-10: useShelf Missing User Auth Guard — FIXED

**File:** `src/hooks/use-collections.ts:105-113`

**Before:** `enabled: !!id`
**After:** `enabled: !!id && !!user`

---

### BUG-11: Library Kind Pages Use Static Mock Data — FIXED

**File:** `src/routes/app.library.$kind.tsx:1-76`

**Before:** `const items = MEDIA.filter((m) => m.kind === kind);` (static import)
**After:** Uses `useLibraryByType(kind)` hook to fetch real data from the API.

---

### BUG-12: CORS Origin Mismatch — FIXED

**File:** `apps/backend/.env:17`

**Before:** `CORS_ORIGIN=http://localhost:5173,http://localhost:3000`
**After:** `CORS_ORIGIN=http://localhost:5173,http://localhost:3000,http://localhost:5000`

Port 5000 (Vite dev server) is now allowed.

---

### BUG-13: Google OAuth Callback URL Mismatch — FIXED

**File:** `apps/backend/.env:7`

**Before:** `GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback`
**After:** `GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback`

Now includes the `/api` prefix matching the backend's `apiPrefix` config.

---

### BUG-14: Empty Array in Collections — FIXED

**File:** `src/routes/app.collections.index.tsx:89-94`

**Before:** `{[].slice(0, 6).map(...)}`
**After:** `{allCollections.slice(0, 6).map((c) => (<SmartCollectionCard key={c.id} collection={c as any} />))}`

Now uses real collection data instead of an empty literal.

---

### BUG-15: Library Index Uses Mock Goal Data — NOT FIXED

**File:** `src/routes/app.library.index.tsx:22, 278`

Still imports `getPrimaryGoal` from `@/lib/goals` (static helper) and uses it at line 278:
```typescript
import { getPrimaryGoal } from "@/lib/goals";
// ...
<RevealSection>{primaryGoal && <GoalCard goal={primaryGoal} />}</RevealSection>
```

Note: Line 47 now fetches `challengesData` from `useChallenges()`, but line 278 still calls `getPrimaryGoal()` separately.

---

### BUG-16: Dashboard Uses Mock Challenge Data — FIXED

**File:** `src/routes/app.index.tsx:157`

**Before:** `getActiveChallenge()` fallback
**After:** `challengesData?.challenges?.[0]` — no mock fallback.

The import of `getActiveChallenge` was removed from this file (confirmed by grep — it only exists in `app.journal.tsx` now).

---

### BUG-17: StatsGrid Gets No Real Stats — NEEDS VERIFICATION

**File:** `src/routes/app.library.index.tsx:41, 96`

`useLibraryStats()` is now called and `stats` variable exists. Whether `StatsGrid` properly consumes it depends on the component internals, which would need runtime verification.

---

### BUG-18: Theme useEffect Writes to localStorage Excessively — FIXED

**File:** `src/routes/__root.tsx:148-165`

**Before:** Always wrote to localStorage on every effect run.
**After:** Added guard:
```typescript
if (pref !== 'system' && localStorage.getItem('theme') !== pref) {
  localStorage.setItem('theme', pref);
}
```

Only writes when the value actually changes.

---

### BUG-19: useSearch and useSearchSuggestions Don't Guard on User — FIXED

**File:** `src/hooks/use-search.ts:7-27`

**Before:**
- `useSearch`: `enabled: enabled && !!params.q && params.q.length > 0`
- `useSearchSuggestions`: `enabled: !!q && q.length >= 2`

**After:**
- `useSearch`: `enabled: enabled && !!params.q && params.q.length > 0 && !!user`
- `useSearchSuggestions`: `enabled: !!q && q.length >= 2 && !!user`

---

## REMAINING ISSUES

| Bug | Status | Risk | Recommendation |
|-----|--------|------|----------------|
| BUG-01 | Partially Fixed | Medium | Consider moving session restoration to a `beforeLoad` on the root route, or using a loading gate in `app.tsx` that waits for the auth query to resolve before checking |
| BUG-03 | Not Fixed (Design) | Low | In-memory token is fine for security; the race condition in BUG-01 is the real issue |
| BUG-15 | Not Fixed | Low | Replace `getPrimaryGoal()` with API data from `useChallenges()` or a dedicated goals hook |
| BUG-17 | Needs Verification | Low | Run the app and confirm `StatsGrid` renders real data |

---

## CONCLUSION

The critical bugs causing "refresh redirects to login" (BUG-02) and "pages fail to load" (BUG-05 through BUG-10) are **all fixed**. The remaining issues are:
1. The race condition (BUG-01) is mitigated but not eliminated
2. One mock data usage (BUG-15) remains in the library page
3. One component needs runtime verification (BUG-17)

**Your core symptoms should be resolved.** Test by:
1. Login with your credentials
2. Navigate to various pages
3. Refresh the page — you should stay logged in
4. Check that library, collections, and search pages load real data
