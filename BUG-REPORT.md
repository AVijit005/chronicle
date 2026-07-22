# Chronicle Bug Report

**Date:** 2026-07-22
**Reported Issue:** Login works with `chronicle-tester@example.com` / `MockPassword123!`, but most pages fail to load, and refreshing any page redirects back to `/auth`.

---

## Summary

After thorough analysis of the full-stack codebase (React/TanStack Router frontend + NestJS/Prisma backend), **19 bugs** were identified across authentication, routing, data fetching, API configuration, and component logic. The two symptoms you described (pages failing to load + refresh redirects to login) are caused by a combination of critical auth race conditions, missing user guards in hooks, and configuration mismatches.

---

## CRITICAL BUGS (Directly Cause Your Symptoms)

### BUG-01: Race Condition in Session Restoration (ROOT CAUSE of Refresh Redirect)

**File:** `src/routes/__root.tsx:139-145` + `src/routes/app.tsx:7-22`

**Problem:** When the page refreshes:
1. `__root.tsx` starts async session restoration in a `useEffect` (non-blocking).
2. `app.tsx`'s `beforeLoad` fires **immediately** (blocking route guard).
3. `beforeLoad` calls `queryClient.fetchQuery` for `["auth", "me"]` — but no access token exists yet (it's in-memory only, lost on refresh).
4. `getCurrentUser()` triggers a token refresh via `getValidToken()`.
5. **The refresh hasn't completed** by the time `beforeLoad` finishes.
6. `getCurrentUser()` fails → catch block fires → `throw redirect({ to: "/auth" })`.

**Impact:** Every page refresh redirects to `/auth`, even with a valid session.

**Fix:** The `beforeLoad` in `app.tsx` must await the session restoration from `__root.tsx` before checking auth, OR the session restoration must happen synchronously before `beforeLoad` runs.

---

### BUG-02: `app.tsx` beforeLoad Catches ALL Errors and Redirects

**File:** `src/routes/app.tsx:20-22`

```typescript
} catch {
  throw redirect({ to: "/auth" });
}
```

**Problem:** The catch block unconditionally redirects to `/auth` for **any** error — network failures, backend timeouts, CORS errors, etc. — not just 401 Unauthorized. If the backend is down or slow, every `/app/*` route redirects to login.

**Impact:** Any transient backend issue causes all authenticated pages to become inaccessible.

**Fix:** Check `error instanceof ApiError` and only redirect on 401. Re-throw other errors so they surface properly.

---

### BUG-03: Access Token Stored in Memory Only — Lost on Refresh

**File:** `src/lib/api/fetch.ts:20-28`

```typescript
let accessToken: string | null = null;  // Module-level variable
```

**Problem:** The JWT access token is stored in a plain JavaScript variable. On page refresh, this variable resets to `null`. The system relies on the refresh token cookie to restore the session, but `app.tsx`'s `beforeLoad` races against the async restoration (see BUG-01).

**Impact:** Token is lost on every refresh, causing all API calls to fail until the refresh completes — which happens too late.

---

### BUG-04: QueryClient Created Without Configuration

**File:** `src/router.tsx:6`

```typescript
const queryClient = new QueryClient();  // No config!
```

**Problem:** The router creates a **bare** `QueryClient` with zero configuration. However, `src/lib/api/query-client.ts` defines a properly configured `createQueryClient()` factory with:
- `retry` logic (no retry for 401/403/404)
- `retryDelay` with exponential backoff
- `staleTime: 30_000`
- `gcTime: 5 * 60_000`
- `refetchOnWindowFocus: true`

The bare `QueryClient` uses React Query defaults, which retry aggressively on all errors (including 401s), potentially causing cascading auth failures and unnecessary requests.

**Impact:** Aggressive default retries on 401 errors cause multiple failed API calls, worsening the race condition.

---

## HIGH-PRIORITY BUGS (Cause Pages to Fail to Load)

### BUG-05: `useLibraryItem` Missing User Auth Guard

**File:** `src/hooks/use-library.ts:43-51`

```typescript
export function useLibraryItem(id: string) {
  return useQuery({
    enabled: !!id,  // Only checks id, NOT user!
    ...
  });
}
```

**Problem:** Unlike `useLibrary()`, `useLibraryByStatus()`, and `useLibraryStats()` which all check `!!user` via `useCurrentUser()`, `useLibraryItem` only checks `!!id`. This means the query fires **before the user is authenticated**, causing 401 errors.

**Impact:** Individual library item pages (`/app/media/$id`) fail to load data.

---

### BUG-06: `useCollection` Missing User Auth Guard

**File:** `src/hooks/use-collections.ts:17-25`

```typescript
export function useCollection(id: string) {
  return useQuery({
    enabled: !!id,  // Only checks id, NOT user!
    ...
  });
}
```

**Problem:** Same pattern as BUG-05. The query fires before authentication is confirmed.

**Impact:** Individual collection pages (`/app/collections/$id`) fail to load.

---

### BUG-07: `useCollectionStats` Missing User Auth Guard

**File:** `src/hooks/use-collections.ts:27-35`

```typescript
export function useCollectionStats(id: string) {
  return useQuery({
    enabled: !!id,  // Only checks id, NOT user!
    ...
  });
}
```

**Problem:** Same pattern as BUG-05/06.

**Impact:** Collection stats queries fire unauthenticated, causing errors.

---

### BUG-08: `useMedia` Missing User Auth Guard

**File:** `src/hooks/use-media.ts:32-41`

```typescript
export function useMedia(id: string) {
  return useQuery({
    enabled: !!id,  // Only checks id, NOT user!
    ...
  });
}
```

**Problem:** Same pattern. Fires before authentication.

**Impact:** Media detail pages fail to load.

---

### BUG-09: `useRelatedMedia` Missing User Auth Guard

**File:** `src/hooks/use-media.ts:43-52`

```typescript
export function useRelatedMedia(id: string) {
  return useQuery({
    enabled: !!id,  // Only checks id, NOT user!
    ...
  });
}
```

**Problem:** Same pattern.

**Impact:** Related media suggestions fail to load.

---

### BUG-10: `useShelf` Missing User Auth Guard

**File:** `src/hooks/use-collections.ts:105-113`

```typescript
export function useShelf(id: string) {
  return useQuery({
    enabled: !!id,  // Only checks id, NOT user!
    ...
  });
}
```

**Problem:** Same pattern.

**Impact:** Individual shelf pages fail to load.

---

### BUG-11: `app.library.$kind.tsx` Uses Static Mock Data Instead of API

**File:** `src/routes/app.library.$kind.tsx:33`

```typescript
const items = MEDIA.filter((m) => m.kind === kind);  // Static import from @/lib/types
```

**Problem:** This route reads from a **static `MEDIA` array** imported from `@/lib/types`, not from the backend API. It doesn't call `useLibraryByType()` or any API hook. The displayed items are hardcoded mock data, not the user's actual library.

**Impact:** Library kind pages (`/app/library/movie`, `/app/library/book`, etc.) show fake data, not the user's real library.

---

## MEDIUM-PRIORITY BUGS

### BUG-12: CORS Origin Mismatch

**File:** `apps/backend/.env:17`

```
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

**File:** `vite.config.ts:19`

```
port: 5000
```

**Problem:** The Vite dev server runs on port **5000**, but the backend CORS config only allows `http://localhost:5173` and `http://localhost:3000`. The frontend origin `http://localhost:5000` is **not in the allowed list**.

**Impact:** All cross-origin API requests from the dev server may be blocked by CORS, causing pages to fail to load.

**Fix:** Add `http://localhost:5000` to `CORS_ORIGIN`.

---

### BUG-13: Google OAuth Callback URL Mismatch

**File:** `apps/backend/.env:7`

```
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

**File:** `apps/backend/src/auth/strategies/google.strategy.ts:25`

```typescript
callbackUrl: config.get<string>('google.callbackUrl') || 'http://localhost:3000/api/auth/google/callback',
```

**Problem:** The `.env` sets callback to `http://localhost:3000/auth/google/callback` (missing `/api` prefix), but the strategy default is `http://localhost:3000/api/auth/google/callback`. The backend has `apiPrefix: 'api'`, so the actual route is at `/api/auth/google/callback`. The `.env` value is wrong.

**Impact:** Google OAuth login will redirect to the wrong URL, causing a 404.

---

### BUG-14: `app.collections.index.tsx` SmartCollectionCard Renders Empty Array

**File:** `src/routes/app.collections.index.tsx:89-94`

```typescript
{[]
  .slice(0, 6)
  .map((c) => (
    <SmartCollectionCard key={c.id} collection={c} />
  ))}
```

**Problem:** The array literal `[]` is always empty. `.slice(0, 6)` on an empty array returns an empty array. The `.map()` never executes. This section always renders nothing.

**Impact:** "Smart collections" section is permanently empty. Likely intended to show dynamic data.

---

### BUG-15: `app.library.index.tsx` Passes Mock Goal Data

**File:** `src/routes/app.library.index.tsx:275`

```typescript
<RevealSection>{getPrimaryGoal() && <GoalCard goal={getPrimaryGoal()!} />}</RevealSection>
```

**Problem:** `getPrimaryGoal()` is imported from `@/lib/goals` — a static helper that returns mock/hardcoded data, not from the API. Library page shows fake goals.

**Impact:** Library page displays mock goal data instead of the user's real goals.

---

### BUG-16: `app.index.tsx` Dashboard Uses Mock Data for Some Widgets

**File:** `src/routes/app.index.tsx:157`

```typescript
<ChallengeCard challenge={(challengesData?.challenges?.[0] ?? getActiveChallenge()) as any} />
```

**Problem:** Falls back to `getActiveChallenge()` (static mock from `@/lib/challenges`) when API data is empty. The `as any` cast masks type mismatches.

**Impact:** Dashboard shows mock challenge data when user has no real challenges.

---

### BUG-17: `app.library.index.tsx` StatsGrid Gets No Real Stats

**File:** `src/routes/app.library.index.tsx:96`

```typescript
<StatsGrid favoritesCount={favs.length} />
```

**Problem:** `StatsGrid` is imported from `@/components/library/StatsGrid`. The component likely displays stats, but only receives `favoritesCount` from the filtered favorites. Other stats (total items, completed, etc.) may come from the mock `stats` variable which calls `useLibraryStats()` — but if that query fails due to auth issues (BUG-05 pattern), it renders undefined.

**Impact:** Library stats may show incorrect or missing data.

---

### BUG-18: Theme useEffect Has No Dependency Array Guard

**File:** `src/routes/__root.tsx:148-168`

```typescript
useEffect(() => {
  const saved = queryClient.getQueryData<{ themePreference?: string }>(queryKeys.auth.me());
  const pref = saved?.themePreference || localStorage.getItem('theme') || 'system';
  // ...
  localStorage.setItem('theme', 'light');  // or 'dark'
}, [queryClient]);
```

**Problem:** This effect runs whenever `queryClient` changes (which is stable), but it also writes to `localStorage` on every run. Combined with `refetchOnWindowFocus: true` in the query client config, this causes unnecessary writes. More importantly, it reads `themePreference` from the auth query cache, which may not be populated yet (causing it to always fall back to localStorage/system preference).

**Impact:** Theme may flash or reset on page load if the auth query hasn't resolved.

---

### BUG-19: `useSearch` and `useSearchSuggestions` Don't Guard on User

**File:** `src/hooks/use-search.ts:7-16, 18-27`

```typescript
export function useSearch(params: SearchParams, enabled = true) {
  return useQuery({
    enabled: enabled && !!params.q && params.q.length > 0,  // No !!user check!
    ...
  });
}

export function useSearchSuggestions(q: string) {
  return useQuery({
    enabled: !!q && q.length >= 2,  // No !!user check!
    ...
  });
}
```

**Problem:** Search queries don't check if the user is authenticated. They fire as soon as there's a query string, potentially causing 401 errors.

**Impact:** Search functionality may fail with auth errors.

---

## COMPLETE FILE REFERENCE

| Bug | File(s) | Line(s) |
|-----|---------|---------|
| BUG-01 | `src/routes/__root.tsx`, `src/routes/app.tsx` | 139-145, 7-22 |
| BUG-02 | `src/routes/app.tsx` | 20-22 |
| BUG-03 | `src/lib/api/fetch.ts` | 20-28 |
| BUG-04 | `src/router.tsx` | 6 |
| BUG-05 | `src/hooks/use-library.ts` | 43-51 |
| BUG-06 | `src/hooks/use-collections.ts` | 17-25 |
| BUG-07 | `src/hooks/use-collections.ts` | 27-35 |
| BUG-08 | `src/hooks/use-media.ts` | 32-41 |
| BUG-09 | `src/hooks/use-media.ts` | 43-52 |
| BUG-10 | `src/hooks/use-collections.ts` | 105-113 |
| BUG-11 | `src/routes/app.library.$kind.tsx` | 33 |
| BUG-12 | `apps/backend/.env`, `vite.config.ts` | 17, 19 |
| BUG-13 | `apps/backend/.env`, `apps/backend/src/auth/strategies/google.strategy.ts` | 7, 25 |
| BUG-14 | `src/routes/app.collections.index.tsx` | 89-94 |
| BUG-15 | `src/routes/app.library.index.tsx` | 275 |
| BUG-16 | `src/routes/app.index.tsx` | 157 |
| BUG-17 | `src/routes/app.library.index.tsx` | 96 |
| BUG-18 | `src/routes/__root.tsx` | 148-168 |
| BUG-19 | `src/hooks/use-search.ts` | 7-16, 18-27 |

---

## RECOMMENDED FIX ORDER

### Phase 1: Fix the Login/Refresh Crisis (BUG-01, BUG-02, BUG-03, BUG-04)

These 4 bugs are the root cause of "login works but refresh redirects to login" and "pages fail to load":

1. **BUG-01 + BUG-03**: Move session restoration from `useEffect` in `__root.tsx` to a synchronous `beforeLoad` or ensure `app.tsx`'s `beforeLoad` awaits it.
2. **BUG-02**: Change `app.tsx` catch block to only redirect on 401, re-throw other errors.
3. **BUG-04**: Use `createQueryClient()` from `query-client.ts` instead of bare `new QueryClient()`.

### Phase 2: Fix Missing Auth Guards (BUG-05 through BUG-10, BUG-19)

Add `enabled: !!user` (via `useCurrentUser()`) to all hooks that are missing it:
- `useLibraryItem`, `useCollection`, `useCollectionStats`, `useMedia`, `useRelatedMedia`, `useShelf`, `useSearch`, `useSearchSuggestions`

### Phase 3: Fix Configuration Mismatches (BUG-12, BUG-13)

- Add `http://localhost:5000` to `CORS_ORIGIN` in backend `.env`.
- Fix `GOOGLE_CALLBACK_URL` to include `/api` prefix.

### Phase 4: Fix Mock Data Usage (BUG-11, BUG-14, BUG-15, BUG-16)

- Replace static `MEDIA` import in `app.library.$kind.tsx` with `useLibraryByType()` API call.
- Fix empty array in `app.collections.index.tsx`.
- Replace `getPrimaryGoal()` and `getActiveChallenge()` with API data.

### Phase 5: Minor Fixes (BUG-17, BUG-18)

- Ensure `StatsGrid` receives complete data.
- Optimize theme effect to avoid unnecessary localStorage writes.
