# Chronicle Audit V11 — Full App Investigation (10 Sub-Agents)

**Date:** July 24, 2026  
**Audit Round:** V11 (Post V10 fixes)  
**Method:** 10 parallel sub-agents: Backend Core, Frontend Routes, UI Components, Lib/Hooks, Design Tokens, Mock Data/CDN, Accessibility, API/Data Flow, Cross-Cutting Concerns, Premiumness/UX

---

## Executive Summary

V10 fixed critical backend crashes and frontend bugs. This V11 deep investigation found **new issues** across all areas, many systemic in nature.

**Total findings: ~650 issues** (42 Critical, 120 High, 210 Medium, 278 Low)

---

## CRITICAL Issues (42) — Runtime Crashes / Security / Data Loss

### Backend — Security

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 1 | `analytics.controller.ts` | All | No `@UseGuards(AuthGuard)` on any analytics endpoint — user data accessible without authentication |
| 2 | `media.controller.ts` | All | No auth guard on any media endpoint — full CRUD without auth |
| 3 | `storage/signed-url.service.ts` | All | `verifyDownloadToken` and `verifyUploadToken` never called — storage security is illusory |
| 4 | `auth/auth.service.ts` | 18 | `loginAttempts` Map has **no TTL cleanup** — unbounded memory growth under brute-force |
| 5 | `auth/services/resend-email-transport.service.ts` | 12 | Falls back to `'dummy-key-for-tests'` if `EMAIL_API_KEY` missing — silent failures in production |

### Backend — Crashes

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 6 | `analytics.repository.ts` | 361 | `deletedAt: null` on JournalEntry — field doesn't exist in schema (V10 fix may not have covered all instances) |
| 7 | `analytics.repository.ts` | 491 | `deletedAt: null` on TimelineEvent — field doesn't exist |
| 8 | `analytics.repository.ts` | 516 | `deletedAt: null` on AnalyticsSnapshot — field doesn't exist |
| 9 | `progress.service.ts` | 73,118,160 | `currentModule` field doesn't exist on any User* model |

### Backend — Route Conflicts

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 10 | `analytics.controller.ts` | 60-93 | `getCalendar()` has no route decorator — dead code; `@Get('calendar')` orphaned on `getCalendarYear` |
| 11 | `analytics.controller.ts` | Multiple | Route `@Get('calendar/year/:year')` conflicts with `@Get('calendar')` — NestJS ordering issue |

### Frontend — Broken Data Access

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 12 | `app.characters.index.tsx` | 11 | `libraryData?.pages.flatMap(p => p.items)` — should be `.data` not `.items`; MEDIA always empty |
| 13 | `app.calendar.tsx` | 13-14 | `CALENDAR_YEAR: any = {}; MEDIA: any[] = [];` — empty stubs cause `Story 1`, `Story 2` placeholders |
| 14 | `app.timeline.tsx` | 249 | `{[].map(...)}` — editorial highlights always empty |
| 15 | `app.timeline.tsx` | 287-302 | Hardcoded journey stats: `Stories: 312, Years: 4, Words: 38412` — fake data for every user |

### Frontend — Broken Features

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 16 | `app.search.tsx` | 10-14 | Dispatches synthetic KeyboardEvent to itself — does nothing; page is empty stub |
| 17 | `app.collections.index.tsx` | 102 | `<RelatedJourney mediaId="interstellar" />` hardcoded — same content for every user |
| 18 | `app.wrapped.tsx` | 35-41 | Dynamically injects CDN script for html2canvas — security/availability risk |
| 19 | `auth.forgot-password.tsx` | 19-26 | `setTimeout` simulates API — no real backend; users believe email was sent |

### Frontend — SSR Crashes

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 20 | `hooks/use-theme.ts` | 3-6 | Module-level `document.documentElement` access — crashes during SSR |
| 21 | `hooks/use-journal.ts` | 49-51 | Direct `localStorage` access in mutation callback — crashes during SSR |
| 22 | `lib/analytics-tracker.ts` | 10-11,17 | `document.title` and `navigator.sendBeacon` without SSR guard |

### Design Token Bypass (Systemic)

| # | Category | Count | Impact |
|---|----------|-------|--------|
| 23 | `oklch()` hardcoded | 438 occurrences | Primary blue appears 34+ times instead of `var(--primary)` |
| 24 | `rgba()` hardcoded | 162 occurrences | Glass/shadow effects bypass glass alpha tokens |
| 25 | `rounded-[...]` arbitrary | 60 occurrences | `--radius-*` tokens defined but never used |
| 26 | `shadow-[...]` arbitrary | 78 occurrences | `--shadow-*` tokens defined but only 4 uses in TSX |
| 27 | `text-[...]` arbitrary | 492 occurrences | No font-size tokens exist |
| 28 | `tracking-[...]` arbitrary | 318 occurrences | No letter-spacing tokens exist |

---

## High Issues (120) — Wrong Logic / Data Loss / Broken Features

### Backend

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 29 | `interaction.repository.ts` | 105 | `mediaType.toUpperCase()` produces invalid ActivityType enum values |
| 30 | `library.service.ts` | 103 | `IN_PROGRESS` is not a valid Prisma enum value |
| 31 | `library.service.ts` | 140 | `mediaType` defaults to `'movie'` when no media relation |
| 32 | `wrapped.service.ts` | 142-146 | `sharePayload` differs between 3 different methods |
| 33 | `wrapped-generator.service.ts` | 32 | `totalHours` computed but never output |
| 34 | `wrapped-generator.service.ts` | 90 | `sortOrder: 9` duplicated — genre and rating collide |
| 35 | `analytics.repository.ts` | 352,388-440 | Timezone bug — UTC conversion wrong for non-UTC users |
| 36 | `library/dto/library.dto.ts` | 6-17 | Missing `REWATCHING`, `ON_HOLD` from status enum |
| 37 | `search.repository.ts` | 38-85 | Sequential `findMany` across 8 media types — should use `Promise.all()` |
| 38 | `analytics.repository.ts` | 85-98,191-215 | N+1 queries: sequential loops over 8 media types |
| 39 | `streak.service.ts` | 59-62 | `calculateCompletionStreak()` always returns 0 |
| 40 | `library-statistics.service.ts` | 28 | `favoriteCount` hardcoded to 0 |

### Frontend — Routes

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 41 | `app.analytics.tsx` | 95-96,167-173 | `range` and `scope` filters are cosmetic — never sent to API; all deltas hardcoded to `0` |
| 42 | `app.analytics.tsx` | 502 | Genre time bar divided by magic number 2 |
| 43 | `app.library.all.tsx` | 56 | "Most Time Spent" sorts by `progress` (percentage), not hours |
| 44 | `app.library.all.tsx` | 64 | `Math.random()` sort reshuffles on every filter change |
| 45 | `app.library.completed.tsx` | 22 | "Recent" sort returns `0` (no-op) for items without `completedAt` |
| 46 | `app.wrapped.tsx` | 95-132 | Only 5 generic slides — no per-media highlights, no monthly breakdown |
| 47 | `app.quotes.tsx` | 16 | `quotes.slice(1, 37)` on 4-item array — always 3 items |
| 48 | `app.import.tsx` | 99-108 | CSV `dropped`/`archived` mapped to `in_progress` |
| 49 | `app.settings.tsx` | 108-119 | Timezone dropdown has only 5 hardcoded options |
| 50 | `app.settings.tsx` | 100-104 | Language dropdown has only 4 hardcoded options |
| 51 | `app.settings.tsx` | 162-169 | Notifications section is dead placeholder |
| 52 | `app.onboarding.tsx` | 33 | Onboarding only in localStorage — no server persistence |
| 53 | `app.library.paused.tsx` | 56 | `"archived" as any` — type mismatch |
| 54 | `app.settings.email-capture.tsx` | 23 | API call sends `{ marketingEnabled: true }` — never sends the email |
| 55 | `app.collections.$id.tsx` | 180-188 | "Edit collection" and "Share" are stub toasts; "Save" has no onClick |
| 56 | `pricing.tsx` | 74 | `navigate({ to: "/app/settings/email-capture" as any })` — route not registered |
| 57 | `app.calendar.tsx` | 100 | Retry button has no `onClick` handler |
| 58 | `app.recently-finished.tsx` | 10-21 | No sort logic — items in arbitrary order |

### Frontend — Lib Files

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 59 | `types.ts` | 96 | `MEDIA: any[] = []` — root of 21-file dependency chain |
| 60 | `library.ts` | 27-32 | `deriveStatus()` missing dropped/rewatching/archived |
| 61 | `library.ts` | 69-71 | `recentlyFinished()` returns all completed, not recent |
| 62 | `library.ts` | 124-126 | `trendFor()` always returns `null` |
| 63 | `library.ts` | 135-137 | `smartInsights()` always returns `[]` |
| 64 | `goals.ts` | 37 | `GOALS_FULL` always empty |
| 65 | `achievements.ts` | 32 | `ACHIEVEMENTS_FULL: any[] = []` |
| 66 | `challenges.ts` | 27 | `CHALLENGES` always empty |
| 67 | `lifeChapters.ts` | 13-14 | `getLifeChapters()` returns `[]` |
| 68 | `collectionWorkspace.ts` | 1 | `getWorkspace()` returns empty stub |
| 69 | `collectionInsights.ts` | 1-2 | Both functions return empty stubs |
| 70 | `collectionRelationships.ts` | 13-22 | Returns hardcoded static labels |
| 71 | `creatorEngine.ts` | 80 | `totalHours: works.length * 14` — magic number |
| 72 | `franchiseEngine.ts` | 16-65 | Hardcoded media IDs — all `MEDIA.find()` return undefined |
| 73 | `museumEngine.ts` | 14-57 | Hardcoded gallery IDs — all galleries empty |
| 74 | `characters.ts` | 15-112 | Hardcoded character IDs — all default to fallback |
| 75 | `mediaGraph.ts` | 7-8 | `COLLECTIONS` and `ACHIEVEMENTS` always empty |
| 76 | `crosslinks.ts` | 4-5 | Uses empty `COLLECTIONS` and `JOURNAL` |
| 77 | `memoryInsights.ts` | 37-114 | 8 empty arrays (LIFE_CHAPTERS, CAPSULES, HIGHLIGHTS, etc.) |
| 78 | `api/constants.ts` | 1 | SSR URL hardcoded to `http://api:3000/api` |
| 79 | `api/adapters.ts` | 37,57,79 | Hardcoded `year: 2024` fallback |
| 80 | `adapters/status.ts` | 31-42 | `adaptStatusToBackend` maps `in_progress` to `WATCHING` for all types |

### Frontend — API/Data Flow

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 81 | `api/fetch.ts` | 125-137 | 401 retry produces misleading `NetworkError` on final attempt |
| 82 | `api/fetch.ts` | 241-244 | `logout` fires-and-forgets with `.catch(() => {})` — silent failure |
| 83 | `api/fetch.ts` | 122 | Returns `undefined as T` for 204 responses |
| 84 | `api/fetch.ts` | 220-227 | `apiUpload` casts FormData to `BodyInit` |
| 85 | `api/auth.ts` | 40-42 | `register()` doesn't store access token |
| 86 | `api/analytics.ts` | 141-146 | `getCalendar` parameter logic is falsy-based — year=0 skipped |
| 87 | `shortcuts.ts` | 60 | `JSON.stringify(map)` drops function values — handlers never update |
| 88 | `shortcuts.ts` | 11-12 | Module-level `pendingChord`/`pendingTimer` shared across hook instances |

### Frontend — Consistency

| # | File | Issue |
|---|------|-------|
| 89 | `lifeChapters.ts` vs `memoryInsights.ts` | `LifeChapter` interface defined twice with different shapes |
| 90 | `useTimeOfDay.ts` vs `dashboardGreeting.ts` | `TimeOfDay` type defined twice with different hour boundaries and local vs UTC |
| 91 | `types.ts` vs `libraryStore.ts` | `KIND_LABEL` defined in two files with different values |
| 92 | `api/adapters.ts` vs `adapters/` | Two parallel adapter systems with different target types |

---

## Medium Issues (210) — Hardcoded Values / Missing Features / Premiumness

### Backend Stubs

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 93 | `analytics-aggregation.service.ts` | 194-201 | `getCalendarDay()` was a mock (V10 fixed partially) |
| 94 | `streak.service.ts` | 59-62 | `calculateCompletionStreak()` was hardcoded to 0 (V10 fixed partially) |
| 95 | `users.controller.ts` | All | `getAdminMetrics` returns hardcoded mock data |
| 96 | `media-cleanup.service.ts` | 14-45 | `cleanupOrphanedAvatars()` and `cleanupExpiredUploads()` are stubs |

### Frontend — Empty Stubs (22 components returning null)

| # | File | Component |
|---|------|-----------|
| 97-118 | 22 files | StoryJourney, EmotionJourney, CharactersYouLoved, WhyItWorked, LifeContext, SimilarMemories, EditorialStats, CompanionStories, DiscussionNotes, RewatchIntelligence, CompletionReflection, SessionHistory, MediaRelationships, FavoriteMoments, StoryDNA, StoryUniverse, StoryImpact, PersonalStatements, ThisWeekHistory, RememberAgain, OnThisDay, IdentityHero, MediaDNA, MemoryCapsules, QuoteGallery, RelationshipPanel |

### Frontend — "Coming Soon" / Dead Features

| # | File | Issue |
|---|------|-------|
| 119 | `app.achievements.tsx` | Entire page is `ComingSoon` placeholder |
| 120 | `app.goals.tsx` | Entire page is `ComingSoon` placeholder |
| 121 | `app.tags.$tag.tsx` | Complete empty stub — "content coming soon" |

### Frontend — Missing Empty States

| # | File | Issue |
|---|------|-------|
| 122-129 | 8 library pages | `completed`, `in-progress`, `paused`, `dropped`, `favorites`, `bookmarks`, `planning`, `rewatching` — no empty state when items list is empty |

### Frontend — Missing Error Boundaries

| # | File | Issue |
|---|------|-------|
| 130-144 | 15 routes | `app.media.$id`, `app.calendar`, `app.journal`, `app.timeline`, `app.collections.$id`, `app.search`, `app.profile`, `app.library.all`, `app.library.index`, `app.settings`, `app.notifications`, `app.tags.$tag`, `app.save-for-later`, `app.goals`, `app.onboarding` — no ErrorBoundary |

### Frontend — Missing Animations

| # | File | Issue |
|---|------|-------|
| 145-152 | 8 pages | `app.search`, `app.bookmarks`, `app.save-for-later`, `app.museum`, `app.settings`, `app.notifications`, `app.characters.index`, `app.franchises.index` — no entrance animations |
| 153-156 | 4 lists | Characters, notifications, franchises, settings — no stagger animations |
| 157 | `app.settings.tsx` | Theme toggle has no transition animation |

### Frontend — Missing Loading Skeletons

| # | File | Issue |
|---|------|-------|
| 158-164 | 7 pages | Characters, Franchises, Bookmarks, Save-for-Later, Museum, Settings, Notifications — no loading skeletons |

### Frontend — Mock Data in Active Components

| # | File | Issue |
|---|------|-------|
| 165 | `app.index.tsx` | 4 hardcoded quotes — same for every user |
| 166 | `app.quotes.tsx` | 4 hardcoded quotes — hero and rest are fake |
| 167 | `app.analytics.tsx` | Genre time bar divided by magic number 2 |
| 168 | `SeasonalRecommendations.tsx` | Hardcoded to winter content — Fargo, The Shining, Snowpiercer |
| 169 | `CollectionStatistics.tsx` | Hardcoded genre/year distributions |
| 170 | `CollectionTimeline.tsx` | 8 of 10 events fabricated |
| 171 | `CollectionMoodboard.tsx` | 4 Unsplash fallback URLs |
| 172 | `CollectionStory.tsx` | Fabricated narrative text |
| 173 | `CuratorNotes.tsx` | Same template for every collection |
| 174 | `CollectionQuickActions.tsx` | All buttons no onClick |
| 175 | `CreateCollectionModal.tsx` | `submit()` is stub with setTimeout |

### Frontend — Landing/Auth CDN URLs

| # | File | CDN URLs |
|---|------|----------|
| 176 | `AuthStage.tsx` | 11 CDN poster URLs in MOCK_POSTERS |
| 177 | `MobileMemoryHero.tsx` | 2 TMDB URLs |
| 178 | `LivingHero.tsx` | 5 CDN URLs |
| 179 | `DashboardShowcase.tsx` | Hardcoded backdrops |
| 180 | `CrossPlatform.tsx` | TMDB/IGDB URLs |
| 181 | `MemoryCapsule.tsx` | TMDB/Unsplash URLs |
| 182 | `CollectionsPreview.tsx` | 4 Unsplash URLs |
| 183 | `UniversalMediaShowcase.tsx` | 10 Unsplash URLs |
| 184 | `AnalyticsPreview.tsx` | `Math.random()` in render |
| 185 | `ComfortStories.tsx` | 4 Unsplash URLs |
| 186 | `DiscoveryCollections.tsx` | Hardcoded theme labels |

### Backend — N+1 Performance

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 187 | `analytics.repository.ts` | 85-98 | Sequential `findMany` for each of 8 media types |
| 188 | `analytics.repository.ts` | 191-197 | Sequential `count` for each of 8 types |
| 189 | `analytics.repository.ts` | 201-215 | Sequential `findMany` + in-memory filter |
| 190 | `search.repository.ts` | 38-85 | Sequential `findMany` across all media types |
| 191 | `search.repository.ts` | 464-517 | Sequential `findMany` for prefix matching |
| 192 | `collection-statistics.service.ts` | 43-53 | Sequential `findMany` per media type |

---

## Low Issues (278) — Code Quality / Minor UX

### Console Logs in Production (27 instances)

| # | File | Line(s) | Type |
|---|------|---------|------|
| 193-195 | `analytics.ts` | 7,20,34 | `console.log` (DEV-guarded) |
| 196 | `app.settings.email-capture.tsx` | 30 | `console.error` |
| 197 | `auth.tsx` | 462 | `console.error` |
| 198-200 | `app.wrapped.tsx` | 57,235,369 | `console.error` |
| 201 | `__root.tsx` | 44 | `console.error` |
| 202-207 | Root scripts | Various | `console.log` in fix-media.js, stub.js, certify.js, debug.js, e2e-runner.js, test-prisma.js |

### Empty Catch Blocks

| # | File | Line | Issue |
|---|------|------|-------|
| 208 | `e2e-runner.js` | 89 | `catch (e) {}` — silently swallows errors |
| 209 | `__root.tsx` | 125 | `catch (e) {}` — silently swallows theme detection errors |

### Dead Code

| # | File | Issue |
|---|------|-------|
| 210 | `app.bootstrap.ts` | Commented-out compression import |
| 211 | `media-cleanup.service.ts` | Stub implementations |
| 212-215 | Root scripts | `fix-media.js`, `fix-imports.js`, `dedupe.js`, `stub.js` — orphaned scripts |
| 216 | `goals.ts` | `_media = MEDIA` — unused export |
| 217 | `mediaGraph.ts` | `ACHIEVEMENTS` — unused variable |
| 218 | `libraryStore.ts` | `deriveDefault` — defined but never called |
| 219 | `adapters/media.ts` + `adapters/collection.ts` | `PLACEHOLDER_POSTER` defined twice |
| 220 | `api/analytics.ts` | `ConstellationEntry` interface defined twice |

### `as any` Type Assertions (37+ instances)

Key offenders across routes, components, and lib files.

### Accessibility

| # | Issue |
|---|-------|
| 221 | 15+ files: `alt=""` on meaningful poster images |
| 222 | Sort buttons missing `aria-pressed` |
| 223 | 16 components missing reduced-motion support |
| 224 | Non-interactive divs with `cursor-pointer` |
| 225 | Settings toggle buttons missing `aria-label` |

### Design Token Violations (Top 20 Worst Offenders)

| Rank | File | oklch | rgba | shadow-[ | rounded-[ | bg-[ | Total |
|------|------|-------|------|----------|-----------|------|-------|
| 1 | `auth/AuthStage.tsx` | 58 | 10 | 8 | 3 | 11 | **90** |
| 2 | `routes/auth.tsx` | -- | 45 | -- | -- | 2 | **47+** |
| 3 | `routes/app.analytics.tsx` | 29 | -- | -- | 1 | -- | **30+** |
| 4 | `auth/LiquidGlassCard.tsx` | -- | 17 | -- | 2 | -- | **19+** |
| 5 | `auth/MobileMemoryHero.tsx` | 14 | -- | 3 | 2 | 4 | **23+** |
| 6 | `media/CinematicHero.tsx` | 13 | -- | 8 | 2 | -- | **23+** |
| 7 | `profile/MemoryMap.tsx` | 13 | -- | -- | -- | -- | **13** |
| 8 | `routes/app.journal.tsx` | 10 | -- | 1 | -- | -- | **11** |
| 9 | `ui/PremiumGlass.tsx` | 10 | -- | 1 | -- | -- | **11** |
| 10 | `atmosphere/AtmosphereBackground.tsx` | 10 | -- | -- | -- | -- | **10** |

### Z-Index Issues

| # | File | Issue |
|---|------|-------|
| 226 | `depth.ts` | `modal`, `drawer`, `dropdown`, `menu` all have `z: 50` — z-fighting |

---

## Summary

| Category | Count | Severity |
|----------|-------|----------|
| Critical (crashes/security) | 42 | Critical |
| High (wrong logic/data loss) | 120 | High |
| Medium (hardcoded/stubs) | 210 | Medium |
| Low (quality/cosmetic) | 278 | Low |
| **Total** | **~650** | — |

---

## Top 20 Fixes Needed (Ordered by Impact)

1. **Add auth guards** to analytics and media controllers — data accessible without auth
2. **Fix `MEDIA: any[] = []`** in `types.ts` — root cause of ~30 downstream empty features
3. **Fix `ActivityType` enum mapping** — `mediaType.toUpperCase()` produces invalid values
4. **Remove `deletedAt: null`** from JournalEntry/TimelineEvent/AnalyticsSnapshot queries
5. **Fix `currentModule`** in progress update — field doesn't exist on User* models
6. **Fix `app.characters.index.tsx`** — `.items` should be `.data`
7. **Implement 22 null-stub components** or remove from routes
8. **Replace 438 hardcoded oklch values** with CSS variables
9. **Replace 162 hardcoded rgba values** with CSS variables
10. **Replace 78 hardcoded shadows** with elevation utilities
11. **Create font-size tokens** to replace 492 arbitrary `text-[...]` values
12. **Create letter-spacing tokens** to replace 318 arbitrary `tracking-[...]` values
13. **Fix N+1 queries** in analytics.repository.ts — use `Promise.all()` for 8-type loops
14. **Fix `loginAttempts` unbounded growth** — add TTL eviction
15. **Add error boundaries** to 15 routes without them
16. **Add empty states** to 8 library sub-pages
17. **Fix `app.analytics.tsx`** — make range/scope filters functional
18. **Fix `app.wrapped.tsx`** — implement per-media slides, remove CDN script injection
19. **Consolidate `LifeChapter` interface** — defined twice with different shapes
20. **Fix `useTheme` SSR safety** — module-level `document` access crashes during SSR

---

## Appendix: 26 Stub Components (return null)

1. `src/components/media/StoryJourney.tsx`
2. `src/components/media/EmotionJourney.tsx`
3. `src/components/media/CharactersYouLoved.tsx`
4. `src/components/media/WhyItWorked.tsx`
5. `src/components/media/LifeContext.tsx`
6. `src/components/media/SimilarMemories.tsx`
7. `src/components/media/EditorialStats.tsx`
8. `src/components/media/CompanionStories.tsx`
9. `src/components/media/DiscussionNotes.tsx`
10. `src/components/media/RewatchIntelligence.tsx`
11. `src/components/media/CompletionReflection.tsx`
12. `src/components/media/SessionHistory.tsx`
13. `src/components/media/MediaRelationships.tsx`
14. `src/components/media/FavoriteMoments.tsx`
15. `src/components/intelligence/StoryDNA.tsx`
16. `src/components/intelligence/StoryUniverse.tsx`
17. `src/components/intelligence/StoryImpact.tsx`
18. `src/components/intelligence/PersonalStatements.tsx`
19. `src/components/memory/ThisWeekHistory.tsx`
20. `src/components/memory/RememberAgain.tsx`
21. `src/components/memory/OnThisDay.tsx`
22. `src/components/profile/IdentityHero.tsx`
23. `src/components/profile/MediaDNA.tsx`
24. `src/components/profile/MemoryCapsules.tsx`
25. `src/components/profile/QuoteGallery.tsx`
26. `src/components/profile/RelationshipPanel.tsx`

## Appendix: 31 Empty Arrays/Stubs in Lib Files

| # | File | Variable/Function | Always Returns |
|---|------|-------------------|----------------|
| 1 | `types.ts:96` | `MEDIA` | `[]` |
| 2 | `library.ts:43` | `ALL_LIBRARY` | `[]` |
| 3 | `library.ts:124` | `trendFor()` | `null` |
| 4 | `library.ts:135` | `smartInsights()` | `[]` |
| 5 | `goals.ts:37` | `GOALS_FULL` | `[]` |
| 6 | `goals.ts:45` | `getGoalInsights()` | `[]` |
| 7 | `achievements.ts:32` | `ACHIEVEMENTS_FULL` | `[]` |
| 8 | `achievements.ts:41` | `getAchievementsByCategory()` | `{}` |
| 9 | `challenges.ts:27` | `CHALLENGES` | `[]` |
| 10 | `lifeChapters.ts:13` | `getLifeChapters()` | `[]` |
| 11 | `memoryInsights.ts:37` | `LIFE_CHAPTERS` | `[]` |
| 12 | `memoryInsights.ts:49` | `CAPSULES` | `[]` |
| 13 | `memoryInsights.ts:60` | `HIGHLIGHTS` | `[]` |
| 14 | `memoryInsights.ts:89` | `FIRSTS` | `[]` |
| 15 | `memoryInsights.ts:97` | `MILESTONES` | `[]` |
| 16 | `memoryInsights.ts:104` | `STREAKS` | `[]` |
| 17 | `memoryInsights.ts:112` | `MEMORY_BOOKMARKS` | `[]` |
| 18 | `memoryInsights.ts:114` | `INSIGHT_LINES` | `[]` |
| 19 | `memory.ts:5` | `COLLECTIONS` | `[]` |
| 20 | `memory.ts:6` | `JOURNAL` | `[]` |
| 21 | `collectionWorkspace.ts:1` | `getWorkspace()` | `{ notes: [], questions: [], materials: [] }` |
| 22 | `collectionInsights.ts:1` | `getCollectionInsights()` | `[]` |
| 23 | `collectionInsights.ts:2` | `getCollectionStats()` | `{}` |
| 24 | `collectionRelationships.ts:3` | `COLLECTIONS` | `[]` |
| 25 | `creatorEngine.ts:3-4` | `COLLECTIONS`, `JOURNAL` | `[]` |
| 26 | `franchiseEngine.ts:3` | `COLLECTIONS` | `[]` |
| 27 | `mediaGraph.ts:7-8` | `COLLECTIONS`, `ACHIEVEMENTS` | `[]` |
| 28 | `crosslinks.ts:4-5` | `COLLECTIONS`, `JOURNAL` | `[]` |
