# CHRONICLE FRONTEND — BILLION-DOLLAR IMPROVEMENT PLAN

**Date:** 2026-07-21
**Auditor:** Full codebase analysis — 48 routes, 30+ components, 11 hooks, 25+ lib files, 12 engine files
**Verdict:** The UI is beautiful but the data layer is hollow. ~20 routes use static/mock data. The engine files return hardcoded values disguised as computed intelligence. The hooks lack error handling. The accessibility is incomplete.

---

## EXECUTIVE SUMMARY

After analyzing every frontend file line by line, here is the truth: Chronicle's visual design is premium — the OKLCH color system, glassmorphism, aurora animations, and motion language are genuinely stunning. But beauty without function is a demo, not a product.

**The 3 critical problems:**
1. **~20 routes use static/mock data** instead of API calls — users will see fake data
2. **No error handling on mutations** — failures are silently swallowed
3. **Significant accessibility gaps** — no skip-to-content, no aria-current, charts opaque to screen readers

This plan transforms Chronicle from "looks like a product" to "works like a product."

---

## CURRENT STATE SCORES

| Dimension | Score | Key Issue |
|-----------|-------|-----------|
| Architecture | 5/10 | Split-brain between Zustand local store and API |
| Frontend Engineering | 5/10 | 20 routes with static data, 14+ `as any` casts |
| UI/UX | 6/10 | Beautiful but broken buttons, dead links, fake data |
| Accessibility | 4/10 | No skip-to-content, no aria-current, no focus traps |
| Performance | 4/10 | Memory leak in fetch, no debouncing, no code splitting |
| Type Safety | 5/10 | 14+ `as any` casts, 3+ `as never` casts |

**Overall: 44/100**

---

## TIER 1: CRITICAL (Before Beta)

### 1.1 — Kill the Mock Data Crisis
**Impact: HIGH | Difficulty: HARD | Priority: P0**

20 routes use static arrays instead of API calls. Users will see fake data and lose trust immediately.

| Route | Current State | Fix |
|-------|--------------|-----|
| `app.library.$kind.tsx` | Filters static `MEDIA` array | Wire to `useLibrary({ type: kind })` |
| `app.library.all.tsx` | Filters static `ALL_LIBRARY` | Wire to `useLibrary()` with filters |
| `app.library.completed.tsx` | Calls `completed()` from static lib | Wire to `useLibraryByStatus('COMPLETED')` |
| `app.library.in-progress.tsx` | Static `inProgress()` | Wire to `useLibraryByStatus('IN_PROGRESS')` |
| `app.library.planning.tsx` | Static `planning()` | Wire to `useLibraryByStatus('PLANNING')` |
| `app.library.favorites.tsx` | Static `favorites()` | Wire to `useLibraryFavorites()` |
| `app.library.continue.tsx` | Static `continueJourney()` | Wire to `useLibraryByStatus('CONTINUE')` |
| `app.library.dropped.tsx` | Static `dropped()` | Wire to `useLibraryByStatus('DROPPED')` |
| `app.library.paused.tsx` | Static `paused()` | Wire to `useLibraryByStatus('PAUSED')` |
| `app.library.rewatching.tsx` | Static `rewatching()` | Wire to `useLibraryByStatus('REWATCHING')` |
| `app.library.recently-finished.tsx` | Static `recentlyFinished()` | Wire to API with `finishedAt` sort |
| `app.library.archived.tsx` | Static `archived()` | Wire to `useLibraryByStatus('ARCHIVED')` |
| `app.characters.*` | Static `CHARACTERS` array | Wire to API or remove |
| `app.creators.*` | Static `allCreators()` | Wire to API or remove |
| `app.franchises.*` | Static `FRANCHISES` array | Wire to API or remove |
| `app.quotes.tsx` | Static `allQuotes()` | Wire to `useJournalQuotes()` |
| `app.timeline.tsx` | Hardcoded editorial highlights | Wire to `useTimelineEvents()` |
| `app.calendar.tsx` | Falls back to static `MEDIA` | Remove static fallback |

**Strategy:** For each route, import the appropriate hook from `src/hooks/`, replace the static data source with the hook's data, and add loading/error/empty states.

### 1.2 — Fix the Memory Leak in api/fetch.ts
**Impact: HIGH | Difficulty: EASY | Priority: P0**

`anySignal()` at lines 225-235 adds abort event listeners that are never removed.

**Current (leaky):**
```typescript
const anySignal = (signals: AbortSignal[]): AbortSignal => {
  const controller = new AbortController();
  for (const signal of signals) {
    if (signal.aborted) { controller.abort(signal.reason); return controller.signal; }
    signal.addEventListener('abort', () => controller.abort(signal.reason), { once: true });
  }
  return controller.signal;
};
```

**Fixed:**
```typescript
const anySignal = (signals: AbortSignal[]): AbortSignal => {
  const controller = new AbortController();
  const cleanups = signals.map(signal => {
    if (signal.aborted) { controller.abort(signal.reason); return () => {}; }
    const handler = () => controller.abort(signal.reason);
    signal.addEventListener('abort', handler, { once: true });
    return () => signal.removeEventListener('abort', handler);
  });
  (controller as any).__cleanup = () => cleanups.forEach(fn => fn());
  return controller.signal;
};
```

Then call cleanup in the fetch wrapper after the request completes.

### 1.3 — Add Error Handling to All Mutation Hooks
**Impact: HIGH | Difficulty: MEDIUM | Priority: P0**

Only `use-library` has `onError` rollback. All other hooks swallow mutation errors silently.

**Fix each hook:**
```typescript
// Add to every useMutation:
onError: (error, variables, context) => {
  toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
  // Rollback optimistic updates if applicable
},
```

Affected hooks: `use-collections`, `use-journal`, `use-notifications`, `use-users`, `use-auth`.

### 1.4 — Add `aria-current="page"` to Navigation
**Impact: MEDIUM | Difficulty: EASY | Priority: P0**

No navigation element indicates the current page to screen readers.

**Files to fix:**
- `src/components/layout/Sidebar.tsx` — Add `aria-current="page"` to active `<Link>`
- `src/components/layout/MobileNav.tsx` — Add `aria-current="page"` to active `<Link>`
- `src/components/layout/TopBar.tsx` — Nav links need it

### 1.5 — Add Skip-to-Content Link
**Impact: MEDIUM | Difficulty: EASY | Priority: P0**

`AppShell.tsx` already has one at line 37-42. Verify it works and is properly styled.

---

## TIER 2: HIGH (Before Public Launch)

### 2.1 — Extract Shared `buildQueryString` Utility
**Impact: MEDIUM | Difficulty: EASY | Priority: P1**

Duplicated across 4+ API files: `media.ts`, `library.ts`, `journal.ts`, `search.ts`.

**Fix:** Create `src/lib/api/utils.ts`:
```typescript
export function buildQueryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(([, v]) => v != null && v !== '');
  return entries.length
    ? `?${new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()}`
    : '';
}
```

### 2.2 — Debounce Search Hooks
**Impact: MEDIUM | Difficulty: EASY | Priority: P1**

`use-search.ts` and `use-media.ts` have `staleTime: 0` — every keystroke triggers an API call.

**Fix:** Add debouncing with a 300ms delay:
```typescript
import { useDebouncedValue } from '@/hooks/use-debounced-value'; // new hook

export function useSearch(params: SearchParams) {
  const [debouncedQuery] = useDebouncedValue(params.q, 300);
  return useQuery({
    queryKey: [...queryKeys.search.all, debouncedQuery],
    queryFn: () => searchApi.globalSearch({ ...params, q: debouncedQuery }),
    enabled: debouncedQuery.length >= 2,
  });
}
```

### 2.3 — Fix Polling in use-notifications
**Impact: LOW | Difficulty: EASY | Priority: P1**

Currently polls every 60s even when tab is hidden.

**Fix:**
```typescript
refetchInterval: 60_000,
refetchIntervalInBackground: false,
```

### 2.4 — Remove Dead Links
**Impact: MEDIUM | Difficulty: EASY | Priority: P1**

| File | Dead Link | Fix |
|------|-----------|-----|
| `src/routes/index.tsx` | Footer `href="#"` (Privacy, Terms, Press) | Create placeholder pages or remove links |
| `src/routes/auth.tsx` | "Forgot password?" `href="#"` | Create `/auth/forgot-password` or hide |
| `src/routes/auth.tsx` | "12,400 chroniclers" hardcoded | Remove or make dynamic |

### 2.5 — Fix CinematicHero Non-Functional Buttons
**Impact: MEDIUM | Difficulty: EASY | Priority: P1**

`src/components/media/CinematicHero.tsx` — buttons have `cursor-pointer` but no `onClick`.

**Fix:** Wire buttons to `ItemActionBar` verbs or remove them.

### 2.6 — Remove "API Limitation" Placeholder Zones in Analytics
**Impact: MEDIUM | Difficulty: MEDIUM | Priority: P1**

`app.analytics.tsx` has 12+ zones showing "unavailable (API limitation)" — dead UI wasting space.

**Fix:** Either implement the data source or remove the zones entirely. A page with 50% empty placeholders looks broken.

### 2.7 — Fix Settings Duplicate Theme Application
**Impact: LOW | Difficulty: EASY | Priority: P1**

`app.settings.tsx` applies theme in `handleThemeChange` AND in `useEffect` on mount — redundant DOM manipulation.

**Fix:** Remove the `useEffect` theme application; let `handleThemeChange` be the single source.

### 2.8 — Add Loading States to Missing Routes
**Impact: MEDIUM | Difficulty: EASY | Priority: P1**

| Route | Missing Loading State |
|-------|----------------------|
| `app.settings.tsx` | Profile may be undefined |
| `app.profile.tsx` | No skeleton while data loads |
| `app.notifications.tsx` | Empty state shows before data loads |
| `app.library.paused.tsx` | Archive button does nothing |

**Fix:** Add `ShimmerSkeleton` or `isLoading` checks.

---

## TIER 3: MEDIUM (Post-Launch Polish)

### 3.1 — Eliminate `as any` Type Casts
**Impact: MEDIUM | Difficulty: MEDIUM | Priority: P2**

14+ occurrences across routes. Each one is a potential runtime error.

**Files affected:**
- `app.index.tsx:134` — `(challengesData?.challenges?.[0] ?? getActiveChallenge()) as any`
- `app.library.all.tsx:38,143` — `m.kind as any`, `m as any`
- `app.library.completed.tsx:48` — `m as any`
- `app.library.in-progress.tsx` — `m as any`
- `app.library.planning.tsx` — `m as any`
- `app.library.continue.tsx` — `m as any`
- `app.library.archived.tsx` — `m as any`
- `app.library.index.tsx:150,174,229` — `m as any`
- `app.collections.$id.tsx:256,268` — `c as never`
- `app.analytics.tsx:302,474` — `as any`
- `app.timeline.tsx:139` — `(rawEvent?.metadata as any)`
- `app.notifications.tsx:50` — `n.actionUrl as any`
- `auth.tsx:155,177` — `(ax as never)`

**Strategy:** Define proper types for each data shape. Use type guards instead of assertions.

### 3.2 — Fix Engine Files Returning Hardcoded Data
**Impact: HIGH | Difficulty: HARD | Priority: P2**

These files return fake data disguised as computed intelligence:

| File | Hardcoded Values |
|------|-----------------|
| `intelligence.ts` | `buildTasteProfile` hardcodes languages, platforms. `buildLifeSoundtrack`, `buildImpactSummary`, `buildEditorialInsight`, `buildPersonalStatements`, `buildMediaEvolution` all return static data |
| `statsEngine.ts` | `favoriteWeekday`, `favoriteMonth`, `favoriteHour`, `moodTrend` all from RNG |
| `mediaStory.ts` | `getSessions`, `getCharacters`, `getEditorialStats` return fake data |
| `profileEngine.ts` | `totalStories: MEDIA.length * 27` hardcoded multiplier |
| `collectionEngine.ts` | `growthRate` from RNG |

**Strategy:** Either wire these to real API data or remove them. Users who discover the data is fake will churn.

### 3.3 — Add Error Boundaries Around Lazy Charts
**Impact: MEDIUM | Difficulty: EASY | Priority: P2**

`AnalyticsPreview.tsx` uses `React.lazy()` for recharts but has no `ErrorBoundary` wrapping the `Suspense`.

**Fix:** Wrap `<Suspense>` in `<ErrorBoundary>`.

### 3.4 — Persist Sidebar Collapse State
**Impact: LOW | Difficulty: EASY | Priority: P2**

`Sidebar.tsx` collapse state resets on remount.

**Fix:** Persist to `localStorage`:
```typescript
const [collapsed, setCollapsed] = useState(() =>
  localStorage.getItem('sidebar-collapsed') === 'true'
);
useEffect(() => localStorage.setItem('sidebar-collapsed', String(collapsed)), [collapsed]);
```

### 3.5 — Remove Unused Imports
**Impact: LOW | Difficulty: EASY | Priority: P2**

| File | Unused Import |
|------|--------------|
| `app.notifications.tsx` | `ComingSoon` (line 2) |
| `app.import.tsx` | `ArrowUpRight` (line 3) |
| `app.achievements.tsx` | Icon imports after ComingSoon refactor |
| `app.index.tsx` | `useNavigate` (line 1) |
| `intelligence.ts` | `_media`, `_MM` exports (lines 201-202) |

### 3.6 — Add Responsive Images
**Impact: MEDIUM | Difficulty: MEDIUM | Priority: P2**

No `<img>` tag has `srcSet` or `sizes`. All poster images load at full resolution.

**Fix:** Add responsive image handling for poster images from TMDB/IGDB CDN URLs.

### 3.7 — Add `width`/`height` to Images
**Impact: MEDIUM | Difficulty: EASY | Priority: P2**

Most `<img>` tags lack `width`/`height` attributes, causing CLS (Cumulative Layout Shift).

**Fix:** Add explicit dimensions to all poster/hero images.

---

## TIER 4: LOW (Enterprise Polish)

### 4.1 — Split Large Files
**Impact: LOW | Difficulty: MEDIUM | Priority: P3**

| File | Lines | Split Into |
|------|-------|-----------|
| `app.analytics.tsx` | 700 | Separate zone components |
| `app.media.$id.tsx` | 227 | Chapter components already exist — lazy load them |
| `auth.tsx` | 660 | LoginForm, RegisterForm, SocialAuth |
| `memoryInsights.ts` | 352 | Data constants + selectors |
| `api/analytics.ts` | 335 | analytics, discovery, intelligence, challenges |
| `api/journal.ts` | 272 | journal, memories, timeline, quotes, highlights |

### 4.2 — Add Focus Traps to Modals
**Impact: LOW | Difficulty: EASY | Priority: P3**

`GlobalShortcuts.tsx` help overlay has no focus trap — focus can Tab behind it.

**Fix:** Use Radix Dialog or `@focus-trap/react` for the overlay.

### 4.3 — Add `role="dialog"` to Overlays
**Impact: LOW | Difficulty: EASY | Priority: P3**

Help overlay in `GlobalShortcuts.tsx` lacks ARIA dialog semantics.

### 4.4 — Fix `notesEngine.ts` Typo
**Impact: LOW | Difficulty: EASY | Priority: P3**

`writem` function should be `write`.

### 4.5 — Remove `SEED_META` Unused Constant
**Impact: LOW | Difficulty: EASY | Priority: P3**

`libraryStore.ts:97` — `SEED_META` is defined but `initialMeta()` returns `{}`.

### 4.6 — Add `aria-busy` to PageSkeleton
**Impact: LOW | Difficulty: EASY | Priority: P3**

`PageSkeleton.tsx` — screen readers don't know the page is loading.

**Fix:** Add `aria-busy="true"` and `role="status"`.

---

## IMPLEMENTATION ROADMAP

### Week 1: Critical Data Layer
- **Day 1-2:** Wire library sub-pages to API (12 routes)
- **Day 3:** Fix memory leak in api/fetch.ts
- **Day 4:** Add error handling to all mutation hooks
- **Day 5:** Add aria-current to navigation

### Week 2: High Priority Polish
- **Day 1:** Extract buildQueryString, debounce search
- **Day 2:** Fix dead links, CinematicHero buttons
- **Day 3:** Remove analytics placeholder zones
- **Day 4:** Fix settings duplicate theme, add missing loading states
- **Day 5:** Add responsive images, width/height

### Week 3: Type Safety & Engine Cleanup
- **Day 1-2:** Eliminate all `as any` casts
- **Day 3-4:** Fix engine files returning hardcoded data
- **Day 5:** Add ErrorBoundary around lazy charts

### Week 4: Enterprise Polish
- **Day 1:** Split large files
- **Day 2:** Focus traps, ARIA improvements
- **Day 3:** Unused imports, typos
- **Day 4:** Performance optimization
- **Day 5:** Final QA pass

---

## SCORE PROJECTION

| Dimension | Current | After Plan | Change |
|-----------|---------|------------|--------|
| Architecture | 5/10 | 7/10 | +2 |
| Frontend Engineering | 5/10 | 8/10 | +3 |
| UI/UX | 6/10 | 8/10 | +2 |
| Accessibility | 4/10 | 7/10 | +3 |
| Performance | 4/10 | 7/10 | +3 |
| Type Safety | 5/10 | 8/10 | +3 |
| **Overall** | **44/100** | **68/100** | **+24** |

---

## THE CEO'S BOTTOM LINE

The frontend is beautiful. The animations are premium. The glassmorphism is stunning. But **beauty without function is a demo, not a product.**

The #1 priority is wiring the 20 static routes to real API data. Until that happens, users will see fake data and churn. The #2 priority is error handling — users need to know when something goes wrong, not silently fail.

Execute Tier 1 this week. Ship the beta next week. Iterate from there.
