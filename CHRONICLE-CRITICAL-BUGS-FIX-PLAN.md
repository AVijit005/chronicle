# Chronicle — Critical Bugs Status Report

**Date:** 2026-07-21
**Last Verified:** 2026-07-21 7:15 PM
**Status:** 4 of 5 bugs STILL BROKEN, 1 FIXED

---

## SUMMARY

| Bug | Description | Status | Evidence |
|-----|-------------|--------|----------|
| 1 | "Mock Masterpiece 20" in CinematicHero | **NOT FIXED** | `seed-mock-user.js` still exists |
| 2 | "Dashboard sections could not load." | **NOT FIXED** | Single ErrorBoundary, no null checks |
| 3 | Auth redirect on page refresh | **NOT FIXED** | Token in memory only, empty refresh body |
| 4 | Pre-filled mock credentials | **NOT FIXED** | Hardcoded in `auth.tsx:83` |
| 5 | Visual glitching | **FIXED** | All 4 components use shared `useTheme()` |

---

## BUG 1: "Mock Masterpiece 20" — NOT FIXED

### Current State
`apps/backend/seed-mock-user.js` still exists and creates 20 mock movies:
```js
// Line 64
title: `Mock Masterpiece ${i}`,
```

The seed script creates user `chronicle-tester@example.com` with 20 fake movies assigned to their library. The CinematicHero displays the first `continueWatching` item from this seeded data.

### What Needs to Happen
1. Delete the seed script: `rm apps/backend/seed-mock-user.js`
2. Delete mock data from database (if seed was run):
   ```sql
   DELETE FROM "UserMovie" WHERE "userId" IN (SELECT id FROM "User" WHERE email = 'chronicle-tester@example.com');
   DELETE FROM "Movie" WHERE slug LIKE 'mock-tester-movie-%';
   ```
3. Verify: `grep -r "Mock Masterpiece" src/ apps/` returns 0 results

---

## BUG 2: "Dashboard sections could not load." — NOT FIXED

### Current State
`app.index.tsx:117` has ONE `ErrorBoundary` wrapping ALL dashboard sections:
```tsx
<ErrorBoundary fallback={<div>Dashboard sections could not load.</div>}>
  <InteractiveWidgets />
  <DashboardGreeting />
  <NotificationStrip />
  <DailyRitual />
  <ContinueJourneyHero />
  {/* ... 10+ more components */}
</ErrorBoundary>
```

If ANY component throws during render, the ENTIRE dashboard shows the error message.

### What Needs to Happen
1. Wrap each section in its own `ErrorBoundary`:
   ```tsx
   <ErrorBoundary fallback={<div>Greeting failed to load</div>}>
     <DashboardGreeting />
   </ErrorBoundary>
   <ErrorBoundary fallback={<div>Ritual failed to load</div>}>
     <DailyRitual />
   </ErrorBoundary>
   ```
2. Add null checks in components that receive hook data
3. Add loading states for each section

---

## BUG 3: Auth redirect on page refresh — NOT FIXED

### Current State
`fetch.ts:20` stores token in memory only:
```ts
let accessToken: string | null = null;  // LOST ON REFRESH
```

`fetch.ts:36` sends empty body on refresh:
```ts
body: JSON.stringify({})  // SERVER EXPECTS refreshToken
```

### What Needs to Happen
1. Store refresh token in localStorage on login:
   ```ts
   export function setRefreshToken(token: string | null) {
     if (token) localStorage.setItem('chronicle_refresh_token', token);
     else localStorage.removeItem('chronicle_refresh_token');
   }
   ```
2. Send refresh token in body:
   ```ts
   body: JSON.stringify({ refreshToken: localStorage.getItem('chronicle_refresh_token') })
   ```
3. Restore access token from localStorage on boot

---

## BUG 4: Pre-filled mock credentials — NOT FIXED

### Current State
`auth.tsx:83` has hardcoded test credentials:
```ts
defaultValues: { email: "chronicle-tester@example.com", password: "MockPassword123!", remember: true },
```

### What Needs to Happen
Change to empty defaults:
```ts
defaultValues: { email: "", password: "", remember: false },
```

---

## BUG 5: Visual glitching — FIXED

### Current State
All 4 components now use the shared `useTheme()` hook instead of per-instance MutationObserver:

| Component | File | Line | Status |
|-----------|------|------|--------|
| PremiumGlass | `src/components/ui/PremiumGlass.tsx` | 1, 45 | FIXED |
| EmptyState | `src/components/ui/EmptyState.tsx` | 1, 25 | FIXED |
| ParticleField | `src/components/atmosphere/ParticleField.tsx` | 1, 14 | FIXED |
| AtmosphereBackground | `src/components/atmosphere/AtmosphereBackground.tsx` | 4, 19 | FIXED |

The shared hook (`src/hooks/use-theme.ts`) uses a single MutationObserver with reference counting — 1 observer instead of 23+.

---

## EXECUTION ORDER

| Step | Bug | Action | Time |
|------|-----|--------|------|
| 1 | Bug 4 | Clear `defaultValues` in `auth.tsx:83` | 1 min |
| 2 | Bug 3 | Add localStorage token persistence in `fetch.ts` | 15 min |
| 3 | Bug 1 | Delete `seed-mock-user.js` + clear DB | 5 min |
| 4 | Bug 2 | Add per-section ErrorBoundary + null checks | 30 min |
| 5 | — | Verify all fixes | 10 min |

---

## VERIFICATION CHECKLIST

After all fixes:
- [ ] `grep -r "chronicle-tester@example.com" src/` returns 0 results
- [ ] `grep -r "MockPassword" src/` returns 0 results
- [ ] `grep -r "Mock Masterpiece" src/ apps/` returns 0 results
- [ ] Refresh page — stays logged in
- [ ] Dashboard loads without error message
- [ ] CinematicHero shows real media or empty state
- [ ] No visual glitches on load
