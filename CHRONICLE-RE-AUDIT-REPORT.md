# Chronicle - Re-Audit Report (Post-Fix Verification + New Issues)

**Date:** July 23, 2026  
**Test Credentials:** `chronicle-tester@example.com` / `MockPassword123!`  
**Previous Report:** `CHRONICLE-QUALITY-AUDIT-REPORT.md`

---

## PART 1: FIX VERIFICATION (Previous Audit Items)

| # | Issue | File | Status | Details |
|---|-------|------|--------|---------|
| 1 | `api.get` → `apiGet` | `analytics.ts:283,309,320` | ✅ **FIXED** | All 3 functions now use `apiGet` |
| 2 | `api` → `apiPatch` import | `settings.email-capture.tsx:7,23` | ✅ **FIXED** | Uses `import { apiPatch }` and `apiPatch(...)` |
| 3 | Division by zero | `calendar.tsx:125` | ✅ **FIXED** | Fallback logic rewritten, no division by MEDIA.length |
| 4 | Avatar cleanup inverted | `media-cleanup.service.ts:14-33` | ⚠️ **PARTIAL** | Code commented out with TODO, returns 0 - not actually implemented |
| 5 | `useJournalEntry` auth guard | `use-journal.ts:26` | ✅ **FIXED** | `enabled: !!id && !!user` |
| 6 | Status mapping READING/PLAYING/LISTENING/LEARNING | `adapters.ts:22-25` | ✅ **FIXED** | Now maps to proper status strings |
| 7 | Logout clears access token | `use-auth.ts:37-45` | ❌ **NOT FIXED** | `queryClient.clear()` but no `setAccessToken(null)` |
| 8 | `softDelete` actually soft deletes | `library.repository.ts:299-312` | ✅ **FIXED** | Uses `deletedAt: new Date()` |
| 9 | ConfigModule registration | `app.module.ts:35` | ❌ **NOT FIXED** | Still imports bare `ConfigModule` from `@nestjs/config` |
| 10 | OAuth encryption key | `oauth-account.repository.ts:29` | ✅ **FIXED** | Uses `jwt.accessSecret` now |
| 11 | Quotes hero properties | `quotes.tsx:31` | ✅ **FIXED** | Uses `hero.author` and `hero.context` |
| 12 | `window.print()` for save image | `wrapped.tsx:203,344` | ❌ **NOT FIXED** | Both buttons still call `window.print()` |
| 13 | "Most Rewatched" sort no-op | `library.completed.tsx:19-22` | ❌ **NOT FIXED** | Still returns 0 for non-"Highest Rated" |
| 14 | "Rating" = "Personal Rating" | `library.all.tsx:46-53` | ❌ **NOT FIXED** | Both use `(b.rating ?? 0) - (a.rating ?? 0)` |
| 15 | Archive button no onClick | `library.paused.tsx:53-55` | ❌ **NOT FIXED** | Button has no handler |

**Summary:** 9/15 fixed (60%), 1 partial, 5 remaining critical/high

---

## PART 2: NEW CRITICAL BUGS (Runtime Crash / Data Corruption)

### Route Files (from route audit agent)

| # | File | Line | Issue | Severity |
|---|------|------|-------|----------|
| RC-01 | `app.wrapped.tsx` | 93, 105, 110, 323 | **Completely broken**: undefined `slides`, `o`, `i`, missing imports (`ShareSection`, `LiveStatsStrip`, `YourReflectionsRail`, `YourQuotesRail`) | **CRITICAL** |
| RC-02 | `auth.tsx` | 112-116 | **Race condition**: signup→auto-login without waiting for session establishment | **HIGH** |
| RC-03 | `app.import.tsx` | 71-82, 118 | **CSV import bugs**: status mapping loses "rewatching"/"dropped"/"archived"; `addedAt` string "Imported" instead of Date | **HIGH** |
| RC-04 | `app.media.$id.tsx` | 142-143 | **O(n²) in render**: `find()` inside `.map()` for timeline events | **MEDIUM** |
| RC-05 | `app.timeline.tsx` | 142-143 | **O(n²) in render**: same pattern | **MEDIUM** |
| RC-06 | `app.journal.tsx` | 46-52, 55-61 | **SSR crash**: `localStorage` access without guard; auto-save timeout no cleanup | **MEDIUM** |
| RC-07 | `app.onboarding.tsx` | 33-34 | **SSR crash**: `localStorage.setItem` called directly | **MEDIUM** |
| RC-08 | `app.search.tsx` | 9-12 | **Broken keyboard trigger**: synthetic `keydown` event unreliable | **MEDIUM** |

### Component Files (from component audit agent)

| # | File | Line | Issue | Severity |
|---|------|------|-------|----------|
| CC-01 | `CommandPalette.tsx` | 333 | **Mutable `let flatIndex = 0` outside render** - accumulates across renders, breaks keyboard nav | **CRITICAL** |
| CC-02 | `CommandPalette.tsx` | 272 | **Hardcoded `year: 2024`** in search results | **CRITICAL** |
| CC-03 | `CommandPalette.tsx` | 244-260 | **Hardcoded fake collection/journal data** in search results | **CRITICAL** |
| CC-04 | `RecommendationCard.tsx` | 15-21 | **Entire component uses hardcoded fallback** - ignores real props | **CRITICAL** |
| CC-05 | `ItemActionBar.tsx` | 150, 169 | **setTimeout without cleanup** - fires on unmounted component | **HIGH** |
| CC-06 | `ItemActionBar.tsx` | 357-360 | **Missing null check** `c.itemIds?.includes(id)` | **HIGH** |
| CC-07 | `ItemActionBar.tsx` | 409, 420 | **Direct store mutations** bypassing React reactivity | **HIGH** |
| CC-08 | `PremiumButton.tsx` | 63, 70 | **CSS `sheen` keyframes undefined** - animation doesn't work | **CRITICAL** |
| CC-09 | `AppShell.tsx` | 50-53 | **Animating `paddingLeft`** causes layout thrashing | **HIGH** |

### Backend Files (from backend audit agent)

| # | File | Line | Issue | Severity |
|---|------|------|-------|----------|
| BC-01 | `auth.service.ts` | 45 | **Runtime ReferenceError**: `metadata` variable undefined | **CRITICAL** |
| BC-02 | `oauth-account.repository.ts` | 29 | **Hardcoded weak encryption key**: uses `jwt.accessSecret` with fallback `'default_secret_key_32_bytes_long!'` | **CRITICAL** |
| BC-03 | `restore.service.ts` | 21, 35 | **Command injection**: `execSync` with interpolated env vars | **CRITICAL** |
| BC-04 | `analytics.repository.ts` | 35-463 | **Massive N+1 queries**: 10+ methods each doing 8+ sequential queries | **CRITICAL** |
| BC-05 | `configuration.ts` + `env.validation.ts` | — | **JWT secrets can be empty strings** - no `@MinLength` validation | **HIGH** |

---

## PART 3: NEW HIGH/MEDIUM BUGS

### Logic Errors

| # | File | Line | Issue |
|---|------|------|-------|
| LM-01 | `library.completed.tsx` | 19-22 | "Most Rewatched" sort returns 0 (no-op) |
| LM-02 | `library.all.tsx` | 46-53 | "Rating" and "Personal Rating" identical sort |
| LM-03 | `library.paused.tsx` | 53-55 | Archive button has no onClick |
| LM-04 | `library.index.tsx` | 83 | `as any` type cast on `challengesData?.goals?.[0]` |
| LM-05 | `app.index.tsx` | 86 | `collections?.map()` should be `collections?.data?.map()` |
| LM-06 | `app.media.$id.tsx` | 184-190, 195-199 | Direct DOM manipulation in onError handlers (React anti-pattern) |
| LM-07 | `app.timeline.tsx` | 184-190, 195-199 | Same DOM manipulation anti-pattern |
| LM-08 | `app.collections.$id.tsx` | 126-133, 268 | Same DOM manipulation anti-pattern |
| LM-09 | `app.import.tsx` | 71-82 | Status mapping doesn't handle "rewatching"/"dropped"/"archived" |
| LM-10 | `auth.tsx` | 97-100 | Auto-login after signup assumes `user.user.id` structure |

### Type Safety Issues

| # | File | Line | Issue |
|---|------|------|-------|
| TS-01 | Multiple routes | — | 15+ `as any` type casts across route files |
| TS-02 | `CommandPalette.tsx` | 69 | `useSearch({ q })` creates new object every render |
| TS-03 | `RecommendationCard.tsx` | 8 | `item: any` prop type |
| TS-04 | Backend repos | — | Multiple `as any` casts on Prisma queries |
| TS-05 | `library.repository.ts` | 94 | `as any` on composite unique index |

### Performance Issues

| # | File | Line | Issue |
|---|------|------|-------|
| PF-01 | `analytics.repository.ts` | 35-463 | 10+ N+1 query methods (8 types × multiple queries each) |
| PF-02 | `search.repository.ts` | 33-89, 93-162 | N+1 in searchMedia/searchLibrary (8 types × queries) |
| PF-03 | `library.repository.ts` | 155-171 | N+1 in findAll when no type filter |
| PF-04 | `media.repository.ts` | 130-146 | N+1 in findMany when no type filter |
| PF-05 | `CommandPalette.tsx` | 69 | New query key object every keystroke |
| PF-06 | `search.service.ts` | 81-92 | `total: sliced.length` returns page size not total count |

---

## PART 4: MOCK/HARDCODED DATA (NEW INSTANCES)

### Critical Hardcoded Data in Components

| File | Line | Data |
|------|------|------|
| `CommandPalette.tsx` | 272 | `year: 2024`, `status: "completed"` hardcoded |
| `CommandPalette.tsx` | 244-248 | Collection: `accent: "var(--primary)"`, `count: 0`, `category: "Mixed"` |
| `CommandPalette.tsx` | 259-260 | Journal: `mood: "Neutral"`, `media: "Memory"`, `accent: "var(--primary)"` |
| `RecommendationCard.tsx` | 15-21 | Full fallback: "Dune: Part Two", Unsplash URL, 98% match |
| `RecommendationCard.tsx` | 27, 42 | URL slug from title (fragile) |

### Backend Hardcoded Values

| File | Line | Data |
|------|------|------|
| `wrapped.service.ts` | 74-77, 119-122 | `totalCompleted: 0, totalHours: 0, totalJournalEntries: 0` |
| `analytics.repository.ts` | 168 | Rating scale bug: divides by 2 twice |
| `media.repository.ts` | 192-193 | `'PUBLISHED' as ContentStatus` string literal cast |

### Remaining Lib Mock Data (from previous audit, still present)

- `src/lib/goals.ts` - `GOALS_FULL`, `getGoalInsights()`, `getJourneyStatistics()`
- `src/lib/challenges.ts` - `CHALLENGES`, `getActiveChallenge()`
- `src/lib/achievements.ts` - `ACHIEVEMENTS_FULL`
- `src/lib/characters.ts` - `CHARACTERS` array
- `src/lib/creatorEngine.ts` - hardcoded creators
- `src/lib/franchiseEngine.ts` - `FRANCHISES` array
- `src/lib/memoryInsights.ts` - `LIFE_CHAPTERS`, `CAPSULES`, `HIGHLIGHTS`, etc.
- `src/lib/types.ts` - 20 empty stub exports (`MEDIA = []`, `COLLECTIONS = []`, etc.)

---

## PART 5: PREMIUMNESS/UX REGRESSIONS

| # | File | Line | Issue |
|---|------|------|-------|
| UX-01 | `app.wrapped.tsx` | 203, 344 | "Save as image" and "Download" both call `window.print()` |
| UX-02 | `app.settings.tsx` | 97, 111, 187 | Mutations without error handling or toast feedback |
| UX-03 | `app.library.$kind.tsx` | 54 | "Search to add" button no onClick |
| UX-04 | `app.collections.$id.tsx` | 179-187 | Edit/Share/Favorite buttons no onClick |
| UX-05 | `app.calendar.tsx` | 91 | Retry button no onClick |
| UX-06 | `CommandPalette.tsx` | 303-305 | Resets keyboard selection on every keystroke |
| UX-07 | `AddMemoryModal.tsx` | 74-88 | Only clicked button disabled during save |
| UX-08 | `EditProfileDialog.tsx` | 30-40 | No validation, no error handling on submit |
| UX-09 | `PremiumButton.tsx` | 63, 70 | Sheen animation CSS keyframes missing |
| UX-10 | `AppShell.tsx` | 50-53 | Layout-thrashing `paddingLeft` animation |

---

## PART 6: DEAD/UNUSED CODE (CONFIRMED STILL EXISTS)

| File | Issue |
|------|-------|
| `src/lib/crosslinks.ts` | Never imported |
| `src/lib/depth.ts` | Never imported |
| `src/lib/api/adapters.ts` | Legacy, never imported |
| `src/lib/adapters/index.ts` | Barrel never imported |
| `src/components/ui/accordion.tsx` | Unused Shadcn component |
| `src/components/ui/alert-dialog.tsx` | Unused Shadcn component |
| `src/components/ui/aspect-ratio.tsx` | Unused Shadcn component |
| `src/components/ui/carousel.tsx` | Unused Shadcn component |
| `src/components/ui/collapsible.tsx` | Unused Shadcn component |
| `src/components/ui/context-menu.tsx` | Unused Shadcn component |
| `src/components/ui/hover-card.tsx` | Unused Shadcn component |
| `src/components/ui/input-otp.tsx` | Unused Shadcn component |
| `src/components/ui/menubar.tsx` | Unused Shadcn component |
| `src/components/ui/navigation-menu.tsx` | Unused Shadcn component |
| `src/components/ui/PremiumField.tsx` | Unused custom component |
| `src/components/ui/radio-group.tsx` | Unused Shadcn component |
| `src/components/ui/resizable.tsx` | Unused Shadcn component |
| `src/components/ui/slider.tsx` | Unused Shadcn component |
| `src/components/ui/table.tsx` | Unused Shadcn component |
| `src/components/ui/toggle.tsx` | Unused Shadcn component |
| `src/components/ui/toggle-group.tsx` | Unused Shadcn component |
| `src/components/profile/EditProfileDialog.tsx` | Defined but never rendered |
| 2x `InsightCard.tsx` duplicates | Both unused |

---

## PART 7: CONFIG/BUILD ISSUES (STILL PRESENT)

| # | File | Issue |
|---|------|-------|
| CF-01 | `.gitignore` | Only ignores root `.env`, not `apps/backend/.env` |
| CF-02 | `app.module.ts` + `auth.module.ts` | Duplicate ConfigModule registrations |
| CF-03 | `apps/backend/package.json` | Test scripts use `bun` (not installed/declared) |
| CF-04 | `.env.example` vs code | `RESEND_API_KEY` in example, code reads `EMAIL_API_KEY` |
| CF-05 | `package.json` | `vite-plugin-pwa@0.19.0` may be incompatible with Vite 8 |
| CF-06 | `apps/backend/.env` | Committed with real JWT secrets |
| CF-07 | `apps/backend/tsconfig.json` | Missing `strict: true` |

---

## PART 8: PRIORITIZED ACTION PLAN

### 🔴 IMMEDIATE (This Week - Blocks Production)

| Priority | Task | Files |
|----------|------|-------|
| 1 | Fix `app.wrapped.tsx` undefined variables | `app.wrapped.tsx` |
| 2 | Fix `auth.service.ts:45` ReferenceError | `auth.service.ts` |
| 3 | Fix OAuth encryption key derivation | `oauth-account.repository.ts` |
| 4 | Fix command injection in restore | `restore.service.ts` |
| 5 | Fix `CommandPalette.tsx` mutable `flatIndex` | `CommandPalette.tsx` |
| 6 | Add `setAccessToken(null)` to logout | `use-auth.ts`, `fetch.ts` |
| 7 | Fix ConfigModule registration | `app.module.ts` |

### 🟠 HIGH (Next Sprint)

| Priority | Task | Files |
|----------|------|-------|
| 8 | Fix N+1 queries in analytics repository | `analytics.repository.ts` |
| 9 | Fix N+1 queries in search repository | `search.repository.ts` |
| 10 | Fix N+1 queries in library/media repos | `library.repository.ts`, `media.repository.ts` |
| 11 | Remove hardcoded data from CommandPalette | `CommandPalette.tsx` |
| 12 | Fix RecommendationCard hardcoded fallback | `RecommendationCard.tsx` |
| 13 | Add `setTimeout` cleanup in ItemActionBar | `ItemActionBar.tsx` |
| 14 | Fix direct store mutations | `ItemActionBar.tsx` |
| 15 | Define CSS `sheen` keyframes | `PremiumButton.tsx` / global CSS |
| 16 | Replace `paddingLeft` animation | `AppShell.tsx` |
| 17 | Fix "Most Rewatched" sort | `library.completed.tsx` |
| 18 | Fix "Rating" vs "Personal Rating" | `library.all.tsx` |
| 19 | Add Archive button handler | `library.paused.tsx` |
| 20 | Fix `window.print()` buttons | `wrapped.tsx` |

### 🟡 MEDIUM (Following Sprint)

| Priority | Task | Files |
|----------|------|-------|
| 21 | Fix DOM manipulation in onError handlers | Multiple route files |
| 22 | Add SSR guards for localStorage | `journal.tsx`, `onboarding.tsx` |
| 23 | Fix CSV import status mapping | `import.tsx` |
| 24 | Add error handling to settings mutations | `settings.tsx` |
| 25 | Fix dead buttons (onClick handlers) | Multiple files |
| 26 | Remove unused Shadcn components | `components/ui/` |
| 27 | Add `@MinLength(32)` to JWT env validation | `env.validation.ts` |
| 28 | Move `.env` out of git / rotate secrets | `.gitignore`, `.env` |

### 🟢 LOW (Ongoing)

| Priority | Task | Files |
|----------|------|-------|
| 29 | Replace `as any` casts with proper types | Multiple files |
| 30 | Extract inline components | `AppShell.tsx`, others |
| 31 | Add proper TypeScript types | `RecommendationCard.tsx`, etc. |
| 32 | Add tooltips/help text | Settings, analytics filters |
| 33 | Improve empty/loading/error states | 15+ routes |
| 34 | Fix responsive edge cases | Negative margins, grid layouts |

---

## SUMMARY METRICS

| Category | Previous | Current | Delta |
|----------|----------|---------|-------|
| Critical Runtime Bugs | 4 | 7 | +3 |
| High Bugs | 8 | 12 | +4 |
| Mock Data Instances | 90 | 95+ | +5 |
| Dead Code Items | 45 | 45 | 0 |
| Premiumness Issues | 60 | 65 | +5 |
| Config/Build Issues | 18 | 18 | 0 |
| **Total Issues** | **373** | **~415** | **+42** |

**Key Insight:** While 9 of 15 previously reported critical/high bugs were fixed, **new critical bugs were introduced** (especially in `app.wrapped.tsx`, `CommandPalette.tsx`, `auth.service.ts`) and **systemic issues remain** (N+1 queries, mock data, dead code, premiumness gaps).

**Overall Health:** Still **not production-ready** - critical runtime crashes exist in wrapped page, auth flow, and command palette.

---

*Re-audit completed July 23, 2026 by multi-agent verification*