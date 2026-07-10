# Production Readiness — Calendar, Journal & Dashboard

## Current State After 8 Phases of Fixes

All critical bugs fixed, decomposition done (Calendar), loading/error/empty states added, mock data partially replaced, visual polish applied, accessibility improved. Zero TypeScript errors.

## Remaining Gaps

| Gap | Severity | Effort |
|---|---|---|
| Calendar reads 100% mock data, ignores API | Critical | High |
| Journal is 766-line monolith | High | Medium |
| Dashboard DailyRitual/WeeklyReflection/QuietRecommendations show static text | High | Low |
| No ErrorBoundary wrapping the app | High | Low |
| No Suspense boundaries | Medium | Low |
| MemoryDNA hardcoded mediaId fallback | Low | Low |
| Zero tests | Medium | High |

---

## Implementation Plan

### Step 1: Wire Dashboard Insights into Placeholder Components

**Files:** `src/routes/app.index.tsx`

Pass `insights` and `overview` data into the three placeholder components that currently show hardcoded text.

**Changes:**
- `DailyRitual` — if `insights.mostActiveWeekday`, show "Your most active day is {weekday}. Today's a good day to pick up where you left off with {insights.favoriteGenre}."
- `WeeklyReflection` — if `overview.totalJournalEntries > 0`, show "{count} entries this week. {hours}h spent across {count} stories." Otherwise keep the empty placeholder.
- `QuietRecommendations` — if `insights.favoriteDecade`, show "You seem drawn to {decade} stories. Here's something from that era."

**Effort:** ~15 minutes, 1 file

---

### Step 2: Journal Decomposition

**Files:** `src/routes/app.journal.tsx` → split into component files

Extract from the 766-line route into:

```
src/components/journal/
  JournalHero.tsx           — hero section with animated stats + loading skeleton
  JournalPrompt.tsx          — today's prompt card with writing buttons
  MoodChart.tsx              — SVG mood bar chart with tooltips
  JournalEntryCard.tsx       — reusable card with drop cap variant
  WriteOverlay.tsx           — focus-mode portal overlay
  index.ts                   — barrel export
```

**Route becomes:** ~60-line orchestrator — imports components, manages `isWriting`/`journalText`/`promptIndex` state, renders sections in order.

**Effort:** ~30 minutes, 6 new files + 1 rewrite

---

### Step 3: Add Production Infrastructure

**3a. Error Boundary**
**File:** `src/routes/__root.tsx`

Wrap `<Outlet />` in a React error boundary that catches unhandled errors and shows `PremiumErrorState` with a "Reload page" button.

**3b. Route-Level Suspense**
**File:** `src/routes/__root.tsx`

Wrap `<Outlet />` in `<Suspense fallback={<PageSkeleton />}>` for route-level code splitting. Create a minimal `PageSkeleton.tsx` that renders a centered shimmer.

**3c. Offline Detection**
**File:** `src/hooks/use-online.ts` (new)

```ts
export function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const go = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", go);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", go); window.removeEventListener("offline", off); };
  }, []);
  return online;
}
```

**File:** `src/components/layout/AppShell.tsx`

When `!online`, show a persistent banner at the top: "You're offline. Changes will sync when you reconnect."

**Effort:** ~20 minutes, 3 files

---

### Step 4: Calendar Data Integration Prep

**Files:** `src/lib/adapters/analytics.ts`, `src/routes/app.calendar.tsx`

The calendar currently reads `CALENDAR_YEAR[monthIdx]` from mock. Create an adapter that maps the real API response (`UICalendarEntry[]`) into the mock-compatible shape so the page works with real data as soon as the backend endpoint is ready.

**What to do now (without backend):**
- Add `adaptCalendarResponse` in `src/lib/adapters/analytics.ts` that maps `UICalendarEntry[]` → mock-compatible month data
- Switch `const month = CALENDAR_YEAR[monthIdx]` to `const month = calendarData ?? CALENDAR_YEAR[monthIdx]`
- All existing `dailyMemoryItems` derivation stays — it already reads from `month.cells`

**Effort:** ~15 minutes, 2 files

---

### Step 5: Tests

**5a. Component Smoke Tests**

```
tests/components/
  calendar/
    CalendarHero.test.tsx
    MonthlyGrid.test.tsx
    DailyMemoryPanel.test.tsx
    AddMemoryModal.test.tsx
  journal/
    WriteOverlay.test.tsx
    JournalEntryCard.test.tsx
  dashboard/
    InteractiveWidgets.test.tsx
```

Each test: renders component with minimal props, asserts key elements are in the DOM.

**5b. Integration Test**

```
tests/integration/
  journal-flow.test.tsx  — type text → seal → entry appears in list
  calendar-flow.test.tsx — navigate months → select day → daily panel updates
```

**Effort:** ~45 minutes, 10 test files

---

## Execution Order

| Step | What | Impact |
|---|---|---|
| 1 | Wire dashboard insights | Eliminates hardcoded text, shows real user data |
| 2 | Journal decomposition | Reduces monolith, enables independent testing |
| 3 | Error boundary + Suspense + offline | Production infrastructure |
| 4 | Calendar adapter prep | Bridges mock → API transition |
| 5 | Tests | Confidence for real users |

---

## Verification

1. **Dashboard** — `DailyRitual`/`WeeklyReflection`/`QuietRecommendations` show personalized text when user has data
2. **Journal** — route file < 80 lines, all components in `src/components/journal/`
3. **App** — throw an error in a child component → `PremiumErrorState` shows instead of white screen
4. **Offline** — disconnect network → banner appears, mutations disabled
5. **Calendar** — data flows through `adaptCalendarResponse` path when API returns data
6. **Tests** — `npm test` passes all 10 new tests
7. **TypeScript** — `npx tsc --noEmit` zero errors
