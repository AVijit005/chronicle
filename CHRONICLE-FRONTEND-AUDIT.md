# Chronicle Frontend — Deep Audit Results

**Date:** 2026-07-21
**Score:** 8.2/10 (visually premium, defensively weak)
**Total Findings:** 69

---

## CRITICAL (Must fix before any release)

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 1 | `ContinueJourneyHero.tsx` | 56-70 | **`<Link>` wrapping `<PremiumButton>` = invalid HTML.** `<a>` inside `<button>` breaks accessibility and browser behavior. 3 instances. |
| 2 | `liveSelectors.ts` | 25-44, 74-129 | **`hydrated` missing from `useMemo` deps.** `useUserReflections` and `useLiveStats` will return empty/zeroed data if store hydrates without other deps changing. Reflections never appear. Stats stay at 0. |
| 3 | `lib/api/fetch.ts` | 239-242 | **Logout clears token BEFORE calling the API.** Server session is never invalidated. The refresh token flow fires, gets a new token, and logs out the wrong session. |
| 4 | `CinematicHero.tsx` | 54-58 | **"Continue" and "Add to journal" buttons do nothing.** No `onClick` handlers, no `<Link>` wrapping. Users click and nothing happens. |
| 5 | `PosterCard.tsx` | 126-138 | **Favorite button is dead.** Toggles local state only, never persists to store or API. Heart icon is a lie. |
| 6 | `lib/challenges.ts` + `lib/types.ts` | — | **`MEDIA` is an empty array.** Every `suggestions` array in challenges.ts returns `[]`. Challenge suggestions feature is completely broken. `AuthStage.tsx` poster titles show raw IDs like "succession" instead of "Succession". |

---

## HIGH (Serious bugs or accessibility failures)

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 7 | `MobileNav.tsx` | 16 | **`<nav>` has no `aria-label`.** Screen readers can't distinguish mobile nav from sidebar nav. WCAG Level A violation. |
| 8 | `Sidebar.tsx` | 37-52, 108-119 | **Search button and collapse button have no `aria-label`.** Icon-only buttons are invisible to screen readers. |
| 9 | `PremiumButton.tsx` | 82-102 | **Loading/success states have no `aria-live` announcement.** Screen readers don't know the button is loading or succeeded. `<Loader2>` spinner has no accessible name. |
| 10 | `MagneticButton.tsx` | — | **When `as="div"`, no `role="button"`, no `tabIndex`, no `onKeyDown`.** Keyboard users cannot activate it. |
| 11 | `CinematicHero.tsx` + `MediaCard.tsx` | 21, 87 | **Invalid CSS gradient syntax.** `${accent} / 0.35` places alpha separator OUTSIDE `oklch()`. Produces `oklch(0.72 0.18 255) / 0.35` which is invalid CSS. Colors break. |
| 12 | `DashboardGreeting.tsx` | 27 | **Wrong property name.** Accesses `streaks?.currentStreak` but `UIStreak` type has `current`, not `currentStreak`. Will always be `undefined`. |
| 13 | `app.tsx` | 7-22 | **Auth catch block catches redirect exceptions.** TanStack Router throws `redirect()` as a special error. The catch block re-throws it as a new redirect, potentially causing infinite redirect loops. |
| 14 | `adapters/analytics.ts` | 90-95 | **Off-by-one: `monthAccents` has 11 elements, months are 0-11.** December gets `undefined` accent color. |
| 15 | All hooks | — | **No `enabled` guard on queries.** All 15+ queries fire immediately, even for unauthenticated users. Cascade of 401 errors. |
| 16 | `ContinueJourneyHero.tsx` | 26 | **`img src={j.posterUrl ?? ""}` renders broken image.** When `posterUrl` is null, `<img src="">` loads the current page URL as an image. |

---

## MEDIUM (Code quality, performance, UX gaps)

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 17 | `PremiumGlass.tsx` + `EmptyState.tsx` + `ParticleField.tsx` | 45-50, 24-30, 14-19 | **Duplicate MutationObserver.** Every component creates its own `MutationObserver` on `document.documentElement` for theme detection. 20 glass cards = 20 observers watching the same attribute. |
| 18 | `app.analytics.tsx` | 7-18 | **12 separate `import("recharts")` calls.** All resolve to the same chunk. Browser deduplicates, but 12 network roundtrips for one package is wasteful. |
| 19 | `auth.tsx` | 90-128 | **No double-submit protection.** Button disables on state change, but there's a race window between click and `setStatus("loading")`. |
| 20 | `auth.tsx` | 103, 119 | **`setTimeout` for navigation after login.** Fixed 700ms delay is fragile and may cause navigation on unmounted component. |
| 21 | `app.index.tsx` | 1-35 | **26 direct imports in dashboard.** Large bundle. Components below the fold should be lazy-loaded. |
| 22 | `app.journal.tsx` | 55-59 | **Auto-save fires on every keystroke.** No debounce on `localStorage.setItem`. Hundreds of writes per minute. |
| 23 | `app.wrapped.tsx` | 203, 344 | **"Save as image" button opens print dialog.** Misleading label. |
| 24 | `app.wrapped.tsx` | 318 | **Hardcoded "Chronicle 2026".** Should use `new Date().getFullYear()`. |
| 25 | `lib/api/fetch.ts` | 130-132 | **Hard redirect via `window.location.href` bypasses React Router.** All in-memory state lost. |
| 26 | `lib/analytics.ts` | 24 | **`page()` ignores `path` parameter.** PostHog `$pageview` event has no page path. |
| 27 | `lib/analytics.ts` | 18-26 | **`page()` only calls PostHog, not Plausible.** Inconsistent with `track()` which calls both. |
| 28 | `app.index.tsx` | 130 | **`as any` cast on ChallengeCard prop.** Bypasses all type checking. |
| 29 | `app.analytics.tsx` | 308, 487 | **`as any` casts on `delta` and `accent` props.** Type system bypassed. |
| 30 | `auth.tsx` | 155, 156 | **`as never` casts on parallax motion values.** Type safety hole. |
| 31 | `MagneticButton.tsx` | 42-43 | **`as never` casts for ref and onMove.** |
| 32 | `app.analytics.tsx` | 419 | **O(n²) `reduce` inside `.map()`.** Total recalculated per item. |
| 33 | `app.journal.tsx` | 222-239 | **Nested `MemoryZone` inside `MemoryZone`.** Double-wrapped sections with redundant padding. |
| 34 | `lib/adapters/media.ts` | 128-129 | **`activityToContinueItem` hardcodes `progress: 100`.** Misleading for non-completed items. |
| 35 | `BottomBorderInput.tsx` | 92 | **Placeholder prop always overrides parent's placeholder.** |
| 36 | `ShimmerSkeleton.tsx` | — | **Hardcoded `bg-white/[0.04]`.** Invisible in light mode. |
| 37 | `__root.tsx` | 44 | **`console.error(error)` in production.** Should be gated behind `import.meta.env.DEV`. |
| 38 | `__root.tsx` | 66-77 | **Missing `og:image` and `twitter:image` meta tags.** Social previews have no image. |
| 39 | `AppShell.tsx` | 17, 25-27 | **Double analytics tracking.** Both `trackPageView` and `analytics.page()` fire on every navigation. |
| 40 | `app.wrapped.tsx` | 142-145 | **Fragile string hack for color opacity.** `.replace("/25", " / 0.25")` will corrupt colors that already contain `/`. |

---

## LOW (Polish, minor quality)

| # | File | Issue |
|---|------|-------|
| 41 | `index.tsx:37` | `navRef` created but never read. Dead code. |
| 42 | `app.index.tsx:98-103` | `QUOTES` array recreated on every render. |
| 43 | `auth.tsx:455-463` | Custom checkbox has no visible focus ring. |
| 44 | `auth.tsx:465-470` | `forgot-password` route may not exist. |
| 45 | `app.analytics.tsx:20-39` | 8 unused icon imports (`Flame`, `TrendingUp`, etc.). |
| 46 | `app.analytics.tsx:1` | `Link` imported but never used. |
| 47 | `app.analytics.tsx:183-543` | Zone numbering inconsistent (02, 03, 4, 05, 06, 10, 17). |
| 48 | `Sidebar.tsx:9` | Collapsed state not persisted to localStorage. |
| 49 | `PosterCard.tsx:95` | `item.accent ?? undefined` is a no-op. |
| 50 | `PosterCard.tsx:110` | `(item.progress ?? 0) !== undefined` is always true. |
| 51 | `MediaCard.tsx:104` | Box shadow with `/ 0.0` alpha renders nothing. Dead code. |
| 52 | `TestimonialSection.tsx:5-9` | Hardcoded fake testimonials with real-looking names. |
| 53 | `lib/adapters/media.ts:77-78` | `synopsis` and `creator` hardcoded to empty. |
| 54 | `lib/adapters/collection.ts:19` | `PLACEHOLDER_POSTER` not applied to collection items. |
| 55 | `lib/adapters/media.ts` + `collection.ts` | `PLACEHOLDER_POSTER` duplicated. |
| 56 | `LiquidGlassCard.tsx:72-73` | CSS custom properties set as numbers, not strings. |
| 57 | `LiquidGlassCard.tsx:53` | Pointer move listener not throttled. |
| 58 | `app.journal.tsx:74-76` | `setTimeout` for focus is fragile. |
| 59 | `app.journal.tsx:178` | `MemoryDNA` defaults to hardcoded "interstellar" when no entries. |
| 60 | `app.journal.tsx:174, 249` | `MemoryBookmarks` rendered twice on same page. |
| 61 | `AuthStage.tsx:232-244` | `MOCK_POSTERS` defined inside `.map()`, allocated every render. |
| 62 | `AuthStage.tsx:245-249` | `MEDIA.find()` always returns undefined (empty array). |
| 63 | `AuthStage.tsx:785-786` | Re-exporting `Ticket` icon from component file. |
| 64 | `PremiumGlass.tsx:56` | Unsafe cast on ref type. |
| 65 | `lib/api/fetch.ts:227-237` | `anySignal()` accumulates stale event listeners on retry. |
| 66 | `lib/api/fetch.ts:162-163` | Response cast to `ApiResponse<T>` without validation. |
| 67 | `lib/api/fetch.ts:130` | Redirect whitelist only checks `/auth` and `/`. |
| 68 | `app.tsx:13` | Hardcoded `queryKey: ["auth", "me"]` instead of `queryKeys.auth.me()`. |
| 69 | `lib/store/liveSelectors.ts:50` | Empty `[]` returned on every render when not hydrated. New reference each time = unnecessary re-renders. |

---

## TOP 10 EXECUTION ORDER

| Priority | What | Why |
|----------|------|-----|
| **1** | Fix `liveSelectors.ts` hydration deps | Stats/reflections permanently broken |
| **2** | Fix `ContinueJourneyHero.tsx` nested `<a><button>` | Invalid HTML, accessibility failure |
| **3** | Fix `lib/api/fetch.ts` logout flow | Sessions never invalidated |
| **4** | Fix `CinematicHero.tsx` button handlers | Main CTA does nothing |
| **5** | Fix `PosterCard.tsx` favorite persistence | Fake interaction |
| **6** | Fix `MediaCard.tsx` + `CinematicHero.tsx` CSS gradient syntax | Colors broken |
| **7** | Add `aria-label` to all icon-only buttons | WCAG Level A |
| **8** | Add `enabled` guards to all queries | 401 cascade on every page |
| **9** | Fix `DashboardGreeting.tsx` property name | Streak data always undefined |
| **10** | Consolidate MutationObserver into single hook | Performance (23 observers → 1) |

---

## CROSS-CUTTING PATTERNS

| Pattern | Severity | Files | Fix |
|---------|----------|-------|-----|
| Duplicate MutationObserver | High | PremiumGlass, EmptyState, ParticleField | Single `useThemeMode()` hook |
| Invalid CSS gradient syntax | High | CinematicHero, MediaCard | Alpha inside `oklch()` function |
| Nested interactive elements | Critical | ContinueJourneyHero | Use `asChild` or render Link as button |
| Missing `enabled` on queries | High | All hook files | Add `enabled: !!user` |
| `as any` / `as never` casts | Medium | auth, app.index, app.analytics, MagneticButton | Proper types or adapters |
| Adapter pattern defined but unused | High | use-analytics, use-library, adapters/ | Wire adapters into hooks |
| No error handling on mutations | Medium | All hook files | Add `onError` callbacks |
| `MEDIA` empty array | High | challenges, AuthStage, types | Populate or remove dependency |
| Dual analytics systems | Medium | AppShell, __root | Consolidate to one |
| Hardcoded 2026 | Low | app.wrapped | Use `getFullYear()` |
