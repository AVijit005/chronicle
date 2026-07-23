# Chronicle - Comprehensive Quality Audit Report

**Date:** July 22, 2026  
**Auditors:** 10 parallel agents covering routes, components, hooks/API, types/utils, mock data, dead code, premiumness, backend, data flow, config/build  
**Test Credentials:** `chronicle-tester@example.com` / `MockPassword123!`

---

## Executive Summary

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| Runtime Bugs | 4 | 8 | 12 | 5 | **29** |
| Mock/Hardcoded Data | 12 | 18 | 45 | 15 | **90** |
| Missing Implementations | 3 | 10 | 8 | 4 | **25** |
| Security Issues | 4 | 5 | 6 | 3 | **18** |
| Data Flow/State | 3 | 6 | 8 | 4 | **21** |
| Premiumness/UX | 8 | 15 | 25 | 12 | **60** |
| Dead/Unused Code | 0 | 2 | 5 | 38 | **45** |
| Backend Bugs | 3 | 4 | 8 | 5 | **20** |
| Config/Build | 1 | 3 | 6 | 8 | **18** |
| TypeScript Issues | 2 | 5 | 15 | 25 | **47** |
| **TOTAL** | **40** | **76** | **138** | **119** | **373** |

---

## CRITICAL BUGS (Runtime Crash / Data Loss)

### BUG-C01: `api.get` undefined in analytics.ts (3 features completely broken)
- **File:** `src/lib/api/analytics.ts` lines 283, 309, 320
- **Issue:** `getDiscovery()`, `getIntelligence()`, `getChallenges()` call `api.get()` which doesn't exist (only `apiGet` is imported). Throws `ReferenceError` at runtime.
- **Impact:** Dashboard discovery, intelligence, and challenges sections are completely non-functional.
- **Fix:** Change `api.get` to `apiGet` on all three lines.

### BUG-C02: `api` undefined in settings email-capture
- **File:** `src/routes/app.settings.email-capture.tsx` line 7, 23
- **Issue:** Imports `api` from `@/lib/api/fetch` but that module only exports `apiFetch`, `apiGet`, `apiPost`, `apiPatch` etc. `api.patch()` will throw `TypeError: Cannot read properties of undefined`.
- **Fix:** Change `import { api }` to `import { apiPatch }` and `api.patch(...)` to `apiPatch(...)`.

### BUG-C03: Division by zero in calendar fallback
- **File:** `src/routes/app.calendar.tsx` line 125
- **Issue:** `MEDIA[(monthIdx * 100 + selectedDay + i * 7) % MEDIA.length]` — `MEDIA` is `[]` (empty array), so `MEDIA.length` is 0, causing `NaN % 0 = NaN`.
- **Fix:** Guard against empty MEDIA array or remove the fallback entirely.

### BUG-C04: Cleanup function DELETES avatars that ARE in use
- **File:** `apps/backend/src/storage/media-cleanup.service.ts` lines 14-33
- **Issue:** `cleanupOrphanedAvatars()` fetches users WITH avatars (`avatar: { not: null }`) and DELETES those avatars. Logic is inverted.
- **Impact:** Running this function would wipe every user's avatar.
- **Fix:** Should find files on disk NOT referenced in DB, not delete files that ARE referenced.

---

## HIGH-SEVERITY BUGS

### BUG-H01: Missing auth guard on `useJournalEntry`
- **File:** `src/hooks/use-journal.ts` line 26
- **Issue:** `enabled: !!id` missing `&& !!user`. Every other single-item query has this guard.
- **Fix:** Add `&& !!user` to enabled.

### BUG-H02: Status mapping maps everything to "watching"
- **File:** `src/lib/api/adapters.ts` lines 22-25
- **Issue:** `READING`, `PLAYING`, `LISTENING`, `LEARNING` all map to `"watching"`. Books show as "watching" in the UI.
- **Fix:** Add proper status mappings or use generic terms.

### BUG-H03: Logout doesn't clear access token
- **File:** `src/hooks/use-auth.ts` lines 37-45 + `src/lib/api/fetch.ts` lines 241-245
- **Issue:** `useLogout.onSuccess` calls `queryClient.clear()` but never calls `setAccessToken(null)`. The old token persists in memory after logout.
- **Fix:** Call `setAccessToken(null)` in logout flow.

### BUG-H04: `softDelete` actually hard deletes
- **File:** `apps/backend/src/library/library.repository.ts` lines 299-311
- **Issue:** Method named `softDelete` calls `delegate.delete()` (hard delete) instead of updating `deletedAt`.
- **Fix:** Change to `update({ where: { id }, data: { deletedAt: new Date() } })`.

### BUG-H05: ConfigModule not properly registered
- **File:** `apps/backend/src/app.module.ts` line 34
- **Issue:** Imports bare `ConfigModule` from `@nestjs/config` instead of the custom `ConfigModule` with validation/loader. Environment validation is bypassed.
- **Fix:** Import from `./config/config.module`.

### BUG-H06: OAuth encryption uses wrong config key
- **File:** `apps/backend/src/auth/repositories/oauth-account.repository.ts` line 29
- **Issue:** Reads `config.get('jwt.secret')` which doesn't exist. Falls back to hardcoded `'default_secret_key_32_bytes_long!'`.
- **Fix:** Use `jwt.accessSecret` or create a proper `oauth.encryptionKey` config.

### BUG-H07: `quotes.tsx` accesses non-existent properties
- **File:** `src/routes/app.quotes.tsx` line 31
- **Issue:** `hero.source` and `hero.refTitle` are used but hero object only has `text`, `author`, `context`. Renders as "undefined · undefined".
- **Fix:** Change to `hero.author` and `hero.context`.

### BUG-H08: `wrapped.tsx` "Save as image" calls `window.print()`
- **File:** `src/routes/app.wrapped.tsx` lines 203, 344
- **Issue:** Button labeled "Save as image" and "Download" both open the browser print dialog.
- **Fix:** Use html2canvas or similar for actual image export.

---

## MOCK / HARDCODED DATA (90 instances)

### Seed/Lib Files (13 files, ~60 hardcoded data structures)

| File | Issue |
|------|-------|
| `src/lib/goals.ts` | `GOALS_FULL` (5 hardcoded goals), `getGoalInsights()`, `getJourneyStatistics()` |
| `src/lib/challenges.ts` | `CHALLENGES` (7 hardcoded), `getActiveChallenge()` |
| `src/lib/achievements.ts` | `ACHIEVEMENTS_FULL` (12 hardcoded) |
| `src/lib/characters.ts` | `CHARACTERS` (10 hardcoded) |
| `src/lib/creatorEngine.ts` | All creator data hardcoded |
| `src/lib/franchiseEngine.ts` | `FRANCHISES` (6 hardcoded) |
| `src/lib/memory.ts` | `MEMORIES_BY_MEDIA`, `SEASONS`, `WEATHERS`, `MOODS`, `COMPANIONS`, etc. |
| `src/lib/memoryJournal.ts` | `MEMORY_EXTENSIONS`, `ENTRIES`, `QUOTES`, `TRAVEL` |
| `src/lib/memoryInsights.ts` | `LIFE_CHAPTERS`, `CAPSULES`, `HIGHLIGHTS`, `TAGS`, `FIRSTS`, `MILESTONES` |
| `src/lib/types.ts` | 20 empty stub arrays (`MEDIA = []`, `COLLECTIONS = []`, etc.) |
| `src/lib/activityFeed.ts` | Hardcoded goal/discovery/memory activities |
| `src/lib/collectionWorkspace.ts` | Hardcoded notes, quotes, memories |
| `src/lib/collectionRelationships.ts` | Hardcoded relationship labels |

### Component-Level (18 components)

| File | Issue |
|------|-------|
| `src/components/dashboard/InsightCard.tsx` | 3 hardcoded insight strings |
| `src/components/dashboard/ThisWeek.tsx` | `THIS_WEEK` static data, random sparklines |
| `src/components/auth/MemoryStats.tsx` | Hardcoded stats (312, 47, 1284) |
| `src/components/auth/MemoryQuote.tsx` | 5 hardcoded quotes |
| `src/components/auth/AuthStage.tsx` | `MOCK_POSTERS` with TMDB/Spotify URLs |
| `src/components/challenges/JourneyTracker.tsx` | All 6 steps hardcoded |
| `src/components/calendar/DailyMemoryPanel.tsx` | Mood/weather hardcoded |
| `src/components/calendar/*.tsx` (6 files) | Fallback to empty `*_CONSTANTS` from types.ts |
| `src/components/intelligence/LifeSoundtrack.tsx` | Hardcoded waveform + album data |
| `src/components/intelligence/LibraryMap.tsx` | 8 genre tags with hardcoded counts |
| `src/components/intelligence/MediaEvolution.tsx` | 6-year hardcoded chart data |
| `src/components/intelligence/MemoryDNA.tsx` | Hardcoded radar chart data |
| `src/components/intelligence/JourneyContinuity.tsx` | Hardcoded LOTR franchise data |
| `src/components/discovery/RecommendationCard.tsx` | Fallback "Dune: Part Two" |
| `src/components/discovery/ComfortStories.tsx` | 4 hardcoded items with Unsplash URLs |
| `src/components/discovery/SeasonalRecommendations.tsx` | 3 hardcoded winter movies |
| `src/components/collections/CollectionAnalyticsPreview.tsx` | Hardcoded "1284" views |
| `src/components/collections/CollectionMoodboard.tsx` | 4 hardcoded Unsplash images |

### Landing Page (7 components)

| File | Issue |
|------|-------|
| `src/components/landing/CollectionsPreview.tsx` | `DEMO_COLLECTIONS` with Unsplash URLs |
| `src/components/landing/AnalyticsPreview.tsx` | `DEMO_STATS`, `DEMO_ACTIVITY` |
| `src/components/landing/MemoryCapsule.tsx` | 3 demo memories |
| `src/components/landing/TimelinePreview.tsx` | 3 timeline entries |
| `src/components/landing/TestimonialSection.tsx` | 3 fake testimonials |
| `src/components/landing/WrappedPreview.tsx` | 4 demo stats |
| `src/components/landing/LivingHero.tsx` | 5 hero cards with TMDB/IGDB URLs |

### Route-Level (6 routes)

| File | Issue |
|------|-------|
| `src/routes/app.index.tsx` | `QUOTES` (4 dashboard quotes), `STEPS` (3 onboarding steps) |
| `src/routes/app.quotes.tsx` | 4 hardcoded quotes as page data |
| `src/routes/app.timeline.tsx` | Empty `MEMORY_CLUSTERS`, `MEDIA`, `[].map()` for editorial highlights |
| `src/routes/app.calendar.tsx` | Fallback to empty `MEDIA` array |
| `src/routes/app.onboarding.tsx` | `MEDIA_TYPES` hardcoded |
| `src/routes/app.import.tsx` | `PENDING_SOURCES` hardcoded |

### Backend Mock Data (6 instances)

| File | Issue |
|------|-------|
| `apps/backend/src/users/users.controller.ts` | `getAdminMetrics()` returns `{ usersCount: 42, activeUsers: 10 }` |
| `apps/backend/src/library/library-statistics.service.ts` | `favoriteCount: 0` always |
| `apps/backend/src/wrapped/wrapped.service.ts` | `totalCompleted: 0, totalHours: 0, totalJournalEntries: 0` |
| `apps/backend/src/core/events/in-memory-event-publisher.service.ts` | Events never dispatched |
| `apps/backend/src/storage/media-cleanup.service.ts` | `findOrphanedFiles()` returns `[]` |

---

## SECURITY ISSUES (18 issues)

### Critical

| # | File | Issue |
|---|------|-------|
| SEC-01 | `apps/backend/.env` | JWT secrets hardcoded and committed to git |
| SEC-02 | `apps/backend/.env` | `OAUTH_ENCRYPTION_KEY` is `0123456789abcdef...` |
| SEC-03 | `apps/backend/src/auth/repositories/oauth-account.repository.ts` | Falls back to `'default_secret_key_32_bytes_long!'` |
| SEC-04 | `apps/backend/src/auth/services/resend-email-transport.service.ts` | XSS in email: `userDisplayName` interpolated into HTML without escaping |

### High

| # | File | Issue |
|---|------|-------|
| SEC-05 | `apps/backend/src/storage/storage.controller.ts` | Signed URL tokens never verified on upload/download |
| SEC-06 | `apps/backend/src/storage/local-storage.service.ts` | Path traversal potential (URL-encoded `..`) |
| SEC-07 | `apps/backend/src/storage/signed-url.service.ts` | Reuses JWT access secret for HMAC |
| SEC-08 | `apps/backend/src/auth/services/resend-email-transport.service.ts` | Falls back to `'dummy-key-for-tests'` silently |
| SEC-09 | `apps/backend/src/media/media.controller.ts` | No auth guard on any endpoint |

### Medium

| # | File | Issue |
|---|------|-------|
| SEC-10 | `apps/backend/src/auth/services/cookie.service.ts` | `sameSite: 'lax'` instead of `'strict'` |
| SEC-11 | `apps/backend/src/storage/storage.controller.ts` | No file validation (type/size) |
| SEC-12 | `.gitignore` | Only covers root `.env`, not `apps/backend/.env` |
| SEC-13 | `apps/backend/src/auth/services/resend-email-transport.service.ts` | Env var name mismatch: `EMAIL_API_KEY` vs `RESEND_API_KEY` |

---

## DATA FLOW / STATE ISSUES (21 issues)

### Critical

| # | File | Issue |
|---|------|-------|
| DF-01 | `libraryStore.ts` + `use-library.ts` | Dual state (Zustand + React Query) never synced. Different views show different data. |
| DF-02 | `src/routes/app.index.tsx` | Dashboard, library, media detail use fundamentally different data sources |
| DF-03 | `CommandPalette.tsx` + `types.ts` | Default palette shows empty arrays (`MEDIA`, `COLLECTIONS`, `PINNED_MEDIA` all `[]`) |

### High

| # | File | Issue |
|---|------|-------|
| DF-04 | `src/hooks/use-library.ts` | `useAddToLibrary` invalidates `analytics` but not `media` or `collections` |
| DF-05 | `src/hooks/use-library.ts` | `useRemoveFromLibrary` doesn't invalidate `collections` or `timeline` |
| DF-06 | `src/hooks/use-journal.ts` | `useUpdateJournalEntry`/`useDeleteJournalEntry` don't invalidate `timeline` |
| DF-07 | `src/lib/api/fetch.ts` | Race condition in token refresh (lines 49-63, 125-136) |
| DF-08 | `src/lib/api/fetch.ts` | `anySignal` AbortController leak (lines 229-238) |
| DF-09 | `src/lib/api/adapters.ts` | `libraryItemToMediaItem` uses library entry ID as primary `id`, `mediaResponseToMediaItem` uses media catalog ID — mismatch |

### Medium

| # | File | Issue |
|---|------|-------|
| DF-10 | `src/lib/store/libraryStore.ts` | Zustand localStorage-only data has no server sync |
| DF-11 | `src/lib/store/libraryStore.ts` | `snapshotMeta`/`snapshotAllItems` not reactive (stale data) |
| DF-12 | `src/lib/store/MediaActionsContext.tsx` | Context value not memoized (unnecessary re-renders) |
| DF-13 | Multiple hooks | 12+ hooks missing explicit `staleTime` |
| DF-14 | `src/hooks/use-media.ts` | `useMediaSearch` `staleTime: 0` causes excessive refetching |

---

## MISSING IMPLEMENTATIONS (25 items)

### Components (26 stub components returning null)

| Category | Components |
|----------|------------|
| **Media** (14) | WhyItWorked, StoryJourney, SimilarMemories, SessionHistory, RewatchIntelligence, MediaRelationships, LifeContext, FavoriteMoments, EmotionJourney, EditorialStats, DiscussionNotes, CompletionReflection, CompanionStories, CharactersYouLoved |
| **Intelligence** (4) | PersonalStatements, StoryDNA, StoryImpact, StoryUniverse |
| **Profile** (5) | RelationshipPanel, QuoteGallery, MemoryCapsules, MediaDNA, IdentityHero |
| **Memory** (3) | ThisWeekHistory, RememberAgain, OnThisDay |

### Routes (4 placeholder pages)

| Route | Status |
|-------|--------|
| `app.goals.tsx` | `<ComingSoon>` |
| `app.achievements.tsx` | `<ComingSoon>` |
| `app.tags.$tag.tsx` | "Coming soon" text |
| `app.settings.tsx` notifications | "Not supported" text |

### Hooks (missing 25+ hook wrappers)

| API Module | Functions without hooks |
|------------|------------------------|
| `progress.ts` | 5 functions (updateProgress, getProgress, completeProgress, resetProgress, getRecentProgress) |
| `interaction.ts` | 9 functions (updateRating, toggleFavorite, toggleBookmark, createReview, etc.) |
| `wrapped.ts` | 6 functions |
| `storage.ts` | 5 functions (uploadFile, deleteFile, generateSignedUrl, etc.) |
| `use-collections.ts` | Missing `useUpdateShelf`, `useReorderCollectionItems` |

### Backend (6 missing features)

| Feature | Status |
|---------|--------|
| Password reset flow | Schema exists but no endpoints |
| Idempotency service | Interface only, no implementation |
| Request context population | Service exists but never called |
| Redis connection | `lazyConnect: true` but `onModuleInit` never connects |
| Event dispatching | `InMemoryEventPublisher` pushes to array, never dispatches |
| Orphaned file detection | `findOrphanedFiles()` returns `[]` |

---

## PREMIUMNESS / UX (60 issues)

### Overall Score: 5.4/10

| Category | Score | Key Issues |
|----------|-------|------------|
| Loading States | 5/10 | 15+ routes have zero loading skeletons |
| Error States | 6/10 | Profile, settings, notifications, timeline have no error handling |
| Empty States | 5/10 | `EmptyState` component exists but only used in ~4 routes |
| Animations | 6/10 | 12+ pages have no page enter animation, library sub-pages lack stagger |
| UX Patterns | 5/10 | Dead buttons, broken search trigger, missing toasts |
| Accessibility | 6/10 | Many `alt=""` on content images, no `aria-pressed` on toggles |
| Responsive | 7/10 | Generally good, some negative margins break on mobile |
| Tooltips/Help | 4/10 | Most features lack tooltips |
| Styling Consistency | 5/10 | Raw styling mixed with established components |
| Missing Polish | 5/10 | Settings/notification changes have no toast feedback |

### Critical UX Issues

| # | File | Issue |
|---|------|-------|
| UX-01 | `app.settings.tsx` | No toast on theme/privacy/language change |
| UX-02 | `app.notifications.tsx` | No toast on mark read |
| UX-03 | `app.calendar.tsx` line 91 | Retry button has no onClick handler |
| UX-04 | `app.library.$kind.tsx` line 54 | "Search to add" button has no onClick |
| UX-05 | `app.collections.$id.tsx` lines 179-187 | Edit/Share/Favorite buttons have no onClick |
| UX-06 | `app.wrapped.tsx` line 203 | "Save as image" = print dialog |
| UX-07 | `app.timeline.tsx` line 289 | `[].map()` renders empty editorial section |
| UX-08 | `app.profile.tsx` | Zero loading/error states for 4 data hooks |
| UX-09 | `app.library.completed.tsx` | "Most Rewatched" sort is a no-op |
| UX-10 | `app.library.all.tsx` | "Rating" and "Personal Rating" are identical |

---

## DEAD / UNUSED CODE (45 items)

### Unused Files

| File | Reason |
|------|--------|
| `src/lib/crosslinks.ts` | Never imported |
| `src/lib/depth.ts` | Never imported |
| `src/lib/api/adapters.ts` | Legacy duplicate, never imported (new adapters in `src/lib/adapters/`) |
| `src/lib/adapters/index.ts` | Barrel file never imported (all consumers use direct submodule imports) |
| `src/components/profile/EditProfileDialog.tsx` | Never rendered |
| `src/components/ui/PremiumField.tsx` | Never imported |
| 17 Shadcn UI components | accordion, alert-dialog, aspect-ratio, carousel, collapsible, context-menu, hover-card, input-otp, menubar, navigation-menu, radio-group, resizable, slider, table, toggle, toggle-group |
| 2 InsightCard duplicates | `dashboard/InsightCard.tsx` and `intelligence/InsightCard.tsx` both never imported |

### Unused Exports

| File | Export |
|------|--------|
| `src/lib/api/constants.ts` | `LOGIN_ENDPOINT` |
| `src/lib/goals.ts` | `getCompletedGoals()`, `getUpcomingGoals()`, `getPrimaryGoal()`, `rankGoals()`, `_media` |
| `src/lib/adapters/analytics.ts` | `adaptCalendar`, `adaptMediaAnalytics`, `adaptGenreAnalytics` |
| `src/lib/adapters/dashboard.ts` | `adaptDashboardResponse` |
| `src/lib/adapters/media.ts` | `getLibraryId`, `getMediaId` (via barrel re-export) |
| `src/lib/adapters/users.ts` | `adaptProfile` |
| `src/lib/adapters/wrapped.ts` | `adaptWrappedResponse` |
| `src/lib/adapters/status.ts` | `adaptStatusToBackend` |
| `src/lib/adapters/mediatype.ts` | `adaptMediaTypeToBackend` |
| `src/lib/memory.ts` | `JOURNAL_REF`, `COLLECTIONS_REF` |

### Duplicate Type Definitions

| Type | Files |
|------|-------|
| `TimeOfDay` | `src/lib/dashboardGreeting.ts` + `src/lib/useTimeOfDay.ts` |
| `LifeChapter` | `src/lib/lifeChapters.ts` + `src/lib/memoryInsights.ts` (different shapes!) |
| `KIND_LABEL` | `src/lib/types.ts` + `src/lib/adapters/types.ts` + `src/lib/store/libraryStore.ts` (singular vs plural!) |

---

## BACKEND ISSUES (20 items)

### Critical

| # | File | Issue |
|---|------|-------|
| BE-01 | `media-cleanup.service.ts` | `cleanupOrphanedAvatars` deletes avatars that ARE in use |
| BE-02 | `app.module.ts` | ConfigModule not properly registered (validation bypassed) |
| BE-03 | `oauth-account.repository.ts` | OAuth encryption uses hardcoded fallback key |

### High

| # | File | Issue |
|---|------|-------|
| BE-04 | `library.repository.ts` | `softDelete` actually hard deletes |
| BE-05 | `search.service.ts` | Double-slicing makes `hasMore` always false for global search |
| BE-06 | `journal.service.ts` | `mediaIds` parameter silently ignored in `createMemory()` |
| BE-07 | `interaction.service.ts` | Redundant null check: `rating === null || rating === null` |

### Performance

| # | File | Issue |
|---|------|-------|
| BE-08 | `library.repository.ts` | 8 sequential queries when no type filter (should use Promise.all) |
| BE-09 | `media.repository.ts` | 16 sequential queries when no type filter |
| BE-10 | `cache.service.ts` | Uses `KEYS` command (O(N)) instead of `SCAN` |
| BE-11 | `search.repository.ts` | `getFilterOptions` loads 800+ rows for filter options |
| BE-12 | `library-statistics.service.ts` | Runs 16+ queries per statistics request |
| BE-13 | Multiple services | `RedisCacheService` exists but is never used (zero caching) |

---

## CONFIG / BUILD ISSUES (18 items)

| # | Severity | File | Issue |
|---|----------|------|-------|
| CFG-01 | HIGH | `.gitignore` | Only covers root `.env`, not `apps/backend/.env` |
| CFG-02 | HIGH | `app.module.ts` + `auth.module.ts` | Duplicate ConfigModule registrations |
| CFG-03 | MEDIUM | `apps/backend/package.json` | Test scripts use `bun` (not installed/declared) |
| CFG-04 | MEDIUM | `apps/backend/.env.example` | `RESEND_API_KEY` but code reads `EMAIL_API_KEY` |
| CFG-05 | MEDIUM | `apps/backend/package.json` | Missing `@types/passport-google-oauth20` |
| CFG-06 | MEDIUM | `package.json` | `vite-plugin-pwa@0.19.0` may be incompatible with Vite 8 |
| CFG-07 | MEDIUM | `apps/backend/tsconfig.json` | Missing `strict: true` |
| CFG-08 | LOW | `apps/backend/src/prisma/prisma.service.ts` | Never eagerly connects |

---

## TYPESCRIPT ISSUES (47 items)

### Common Patterns

| Pattern | Count | Example |
|---------|-------|---------|
| `props: any` in stub components | 26 | All stub components use `(props: any)` |
| `as any` type casts | 15+ | Routes casting items to `any` for component props |
| `[key: string]: any` index signatures | 4 | Search/filter param interfaces |
| Missing type parameters on `useQuery` | 5 | `use-collections.ts` queries |
| `MediaItem.kind: MediaKind \| string` | 1 | Union with `string` defeats type safety |
| `any` typed constants | 17 | `src/lib/types.ts` lines 89-108 |

---

## RECOMMENDED FIX PRIORITY

### Phase 1: Critical (Blocks core functionality)
1. Fix `api.get` → `apiGet` in analytics.ts (3 lines)
2. Fix `api` → `apiPatch` in settings email-capture
3. Fix division by zero in calendar
4. Fix avatar cleanup inverted logic
5. Fix logout token clearing
6. Fix softDelete → actually soft delete
7. Fix ConfigModule registration

### Phase 2: High (Breaks features)
8. Add `!!user` auth guard to `useJournalEntry`
9. Fix status mapping for non-video media
10. Fix quotes.tsx property access
11. Fix OAuth encryption config key
12. Add missing cache invalidations
13. Implement 25+ missing hooks
14. Fix dead buttons (calendar retry, library search, collection edit)

### Phase 3: Medium (Quality/polish)
15. Add loading states to 15+ routes
16. Add error states to profile, settings, notifications
17. Add toast feedback for settings changes
18. Add animations to library sub-pages
19. Replace hardcoded mock data with API calls
20. Fix accessibility (alt text, aria-pressed)
21. Clean up dead/unused code
22. Fix TypeScript `any` types

### Phase 4: Low (Polish)
23. Add tooltips/help text
24. Fix responsive edge cases
25. Add proper empty states
26. Performance optimizations (caching, query batching)

---

*Report generated by 10 parallel audit agents on July 22, 2026*
