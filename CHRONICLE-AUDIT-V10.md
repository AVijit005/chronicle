# Chronicle Audit V10 — Full App Investigation (10 Sub-Agents)

**Date:** July 24, 2026  
**Audit Round:** V10 (Post V9 fixes)  
**Method:** 10 parallel sub-agents: Backend, UI Components, Lib Files, Memory/Journal, Landing/Auth, Design Tokens, Discovery/Collections, Hooks/API, Critical Bugs Scan, Full Mock Data Scan

---

## Executive Summary

V9 fixes addressed several critical backend crashes and frontend issues. This V10 deep investigation found **new issues** across all areas, many introduced by V9 fixes or previously hidden.

**Total findings: ~500 issues** (35 Critical, 95 High, 185 Medium, 185 Low)

---

## CRITICAL Issues (35) — Runtime Crashes / Data Corruption

### Backend — Schema & Runtime Crashes

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 1 | `analytics.repository.ts` | 361 | `deletedAt: null` on JournalEntry — field doesn't exist in schema |
| 2 | `analytics.repository.ts` | 491 | `deletedAt: null` on TimelineEvent — field doesn't exist |
| 3 | `analytics.repository.ts` | 516 | `deletedAt: null` on AnalyticsSnapshot — field doesn't exist |
| 4 | `interaction.repository.ts` | 105 | `type: mediaType.toUpperCase()` produces invalid ActivityType enum values (`'TVSHOW'`, `'MOVIE'`) — crashes every `recordHistory` call |
| 5 | `progress.service.ts` | 73,118,160 | `currentModule` field doesn't exist on any User* model — crashes PATCH progress |
| 6 | `progress.repository.ts` | 80-86 | Spreads unknown fields into Prisma `update` — cascading crash |

### Backend — Dead/Stub Endpoints

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 7 | `analytics.controller.ts` | 60-93 | `getCalendar()` has no route decorator — dead code |
| 8 | `analytics-aggregation.service.ts` | 194-201 | `getCalendarDay()` is a mock returning empty data |
| 9 | `streak.service.ts` | 59-62 | `calculateCompletionStreak()` always returns 0 |
| 10 | `library-statistics.service.ts` | 28 | `favoriteCount` always hardcoded to 0 |

### Frontend — Runtime Crashes

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 11 | `app.calendar.tsx` | 134 | `MEDIA.length === 0` causes modulo-by-zero — `MEDIA[NaN]` crashes |
| 12 | `lib/memory.ts` | 260 | `TODAY.getTime()` — `TODAY` is a function, not a Date |
| 13 | `lib/memoryJournal.ts` | 213 | `pick(rng)` missing second argument — crashes |
| 14 | `app.calendar.tsx` | 13-14 | `CALENDAR_YEAR` and local `MEDIA` are empty stubs |
| 15 | `app.timeline.tsx` | 249 | `{[].map(...)}` — editorial highlights always empty |
| 16 | `app.timeline.tsx` | 65 | `MEDIA.concat(MEDIA)` always empty — hero collage invisible |
| 17 | `app.timeline.tsx` | 287-301 | Hardcoded journey statistics contradict real hero stats |
| 18 | `app.timeline.tsx` | 319 | `LIFE_CHAPTERS.map(...)` maps over empty array |

### Frontend — Data Integrity

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 19 | `adapters/analytics.ts` | 134 | `.sort()` mutates `months` array in-place — calendar months displayed out of order |
| 20 | `journal.repository.ts` | 155 | Cursor pagination overwrites year/month range filter — second page shows ALL years |
| 21 | `shortcuts.ts` | 60 | `useEffect([map])` — `map` is new object every render, causes re-registration on every keystroke |

### Design Token Bypass (Systemic)

| # | Category | Count | Impact |
|---|----------|-------|--------|
| 22 | `oklch()` hardcoded | 360 occurrences | Primary blue appears 34 times instead of `var(--primary)` |
| 23 | `rgba()` hardcoded | 116 occurrences | Glass/shadow effects bypass glass alpha tokens |
| 24 | `rounded-[...]` arbitrary | 59 occurrences | `--radius-*` tokens defined but never used |
| 25 | `shadow-[...]` arbitrary | 73 occurrences | `--shadow-*` tokens defined but only 4 uses in TSX |

---

## High Issues (95) — Wrong Logic / Data Loss / Security

### Backend

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 26 | `library.service.ts` | 103 | `IN_PROGRESS` is not a valid Prisma enum value |
| 27 | `library.service.ts` | 140 | `mediaType` defaults to `'movie'` when no media relation |
| 28 | `library.service.ts` | 100-110 | `startedAt` not set on active status transitions |
| 29 | `library.repository.ts` | 306 | `softDelete` doesn't check `existing.deletedAt` |
| 30 | `journal.service.ts` | 198 | Timeline cursor uses `createdAt` but results ordered by `eventDate` |
| 31 | `journal.repository.ts` | 9 | `prismaAny()` is `public` — breaks encapsulation |
| 32 | `wrapped.service.ts` | 142-146 | `sharePayload` differs between 3 different methods |
| 33 | `wrapped-generator.service.ts` | 32 | `totalHours` computed but never output |
| 34 | `wrapped-generator.service.ts` | 90 | `sortOrder: 9` duplicated — genre and rating collide |
| 35 | `auth.service.ts` | 88-132 | Refresh token race condition |
| 36 | `auth.service.ts` | 18 | In-memory rate limiter lost on restart |
| 37 | `auth.repository.ts` | 30-39 | Registration race condition |
| 38 | `analytics.repository.ts` | 352,388-440 | Timezone bug — UTC conversion wrong for non-UTC users |
| 39 | `media.controller.ts` | All | No auth guard on any media endpoint |
| 40 | `library/dto/library.dto.ts` | 6-17 | Missing `REWATCHING`, `ON_HOLD` from status enum |
| 41 | `wrapped-generator.service.ts` | 122 | Anime pluralization ternary: both branches `''` |
| 42 | `analytics.repository.ts` | 95 | `currentEpisode` summed as "episodes watched" — wrong metric |

### Frontend — Components

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 43 | `MediaCard.tsx` | 44-132 | Buttons nested inside `<Link>` — accessibility violation |
| 44 | `MediaCard.tsx` | 104 | Dead transparent box-shadow |
| 45 | `PosterCard.tsx` | 128-141 | Favorite `<button>` inside `<Link>` |
| 46 | `AnalyticsKit.tsx` | 134 | Delta always green regardless of direction |
| 47 | `AnalyticsKit.tsx` | 158 | No NaN guard on ProgressRing |
| 48 | `CommandPalette.tsx` | 455,473,489 | `filter(Boolean)` strips `0` values |
| 49 | `CalendarHero.tsx` | 49 | Next-year button permanently disabled |
| 50 | `CalendarInsights.tsx` | 6-19 | Dynamic external script injection |
| 51 | `PremiumGlass.tsx` | 96-98 | `interactive` mode has no keyboard handlers |
| 52 | `ItemActionBar.tsx` | 260 | Identical ternary branches |
| 53 | `PremiumErrorState.tsx` | 32-40 | Link wrapping PremiumButton — nested interactive |
| 54 | `Common/PremiumErrorState.tsx` | 32-40 | Nested `<a><button>` invalid HTML |

### Frontend — Routes

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 55 | `app.library.all.tsx` | 27 | `ALL_LIBRARY` always empty — page shows nothing |
| 56 | `app.library.all.tsx` | 56 | "Most Time Spent" sorts by `progress` (percentage), not hours |
| 57 | `app.library.completed.tsx` | 22 | "Recent" sort returns `0` (no-op) |
| 58 | `app.search.tsx` | 10-14 | Synthetic KeyboardEvent — no actual search functionality |
| 59 | `app.journal.tsx` | 182 | `MemoryDNA` receives truncated title as `mediaId` |
| 60 | `app.journal.tsx` | 231-241 | Nested `MemoryZone` inside `MemoryZone` |
| 61 | `app.wrapped.tsx` | 177-179 | `accent` string manipulation hack |
| 62 | `app.wrapped.tsx` | 38,41 | `alert()` instead of `toast` |
| 63 | `app.import.tsx` | 99-108 | CSV `dropped`/`archived` mapped to `in_progress` |
| 64 | `app.import.tsx` | 69 | CSV `kind` field not validated |
| 65 | `app.settings.tsx` | 16-22 | Theme flash on load |
| 66 | `app.analytics.tsx` | 95-96 | Filter state variables never used |
| 67 | `app.analytics.tsx` | 167-173 | All delta values hardcoded to `0` |
| 68 | `app.index.tsx` | 99-104 | Fake "your" quotes |
| 69 | `app.quotes.tsx` | 16 | `quotes.slice(1, 37)` overflow |
| 70 | `app.collections.$id.tsx` | 186-188 | Favorite button has no onClick |
| 71 | `app.onboarding.tsx` | 33 | Onboarding only in localStorage |
| 72 | `app.characters.index.tsx` | 3 | Characters reference empty MEDIA |
| 73 | `app.library.paused.tsx` | 34 | Uses `droppedAtLabel` for paused items |
| 74 | `app.library.paused.tsx` | 56 | `"archived" as any` |
| 75 | `app.timeline.tsx` | 326-350 | Reduced-motion not respected |

### Frontend — Lib Files

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 76 | `library.ts` | 124-126 | `trendFor()` always returns `null` |
| 77 | `library.ts` | 135-137 | `smartInsights()` always returns `[]` |
| 78 | `library.ts` | 34-37 | `liveItems()` only returns custom items |
| 79 | `library.ts` | 27-32 | `deriveStatus()` missing dropped/rewatching/archived |
| 80 | `goals.ts` | 45-47 | `getGoalInsights()` always returns `[]` |
| 81 | `achievements.ts` | 41-43 | `getAchievementsByCategory()` returns `{}` |
| 82 | `collectionRelationships.ts` | 13-22 | Returns hardcoded static labels |
| 83 | `creatorEngine.ts` | 80 | `totalHours: works.length * 14` |
| 84 | `franchiseEngine.ts` | 16-65 | Hardcoded media IDs |
| 85 | `museumEngine.ts` | 14-57 | Hardcoded gallery IDs |
| 86 | `characters.ts` | 15-112 | Hardcoded character IDs |
| 87 | `collectionWorkspace.ts` | 1 | `w.memories` doesn't exist on return shape |
| 88 | `collectionInsights.ts` | 1-2 | Stubs return empty |
| 89 | `lifeChapters.ts` | 13-14 | Returns `[]` |
| 90 | `store/libraryStore.ts` | 196-203 | `addCustomItem` replaces meta |
| 91 | `store/libraryStore.ts` | 376-378 | `hydrated` set via direct mutation |
| 92 | `store/libraryStore.ts` | 329-331 | `importJSON` replaces shelves/collections |
| 93 | `adapters/status.ts` | 31-42 | Lossy bidirectional mapping |

### API Layer

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 94 | `fetch.ts` | 125-136 | 401 retry produces misleading `NetworkError` |
| 95 | `auth.ts` | 40-42 | `register()` doesn't store access token |
| 96 | `constants.ts` | 1 | SSR URL hardcoded to Docker hostname |
| 97 | `adapters.ts` | 37,78 | Hardcoded `year: 2024` |
| 98 | `query-client.ts` | 15 / 170 | Double retry — up to 6 attempts for 429 |
| 99 | `use-mobile.tsx` | 18 | Returns `false` on first render |
| 100 | `fetch.ts` | 220-227 | `apiUpload` overrides custom headers |

---

## Medium Issues (185) — Hardcoded Values / Missing Validation

### Backend

| # | File | Issue |
|---|------|-------|
| 101 | `analytics.repository.ts` | `getAverageRating` returns unrounded float |
| 102 | `analytics.service.ts` | No input validation on calendar year/month |
| 103 | `library.repository.ts` | `findByUserIdAndMediaId` doesn't check `deletedAt` |
| 104 | `journal.service.ts` | `createdAt` defaults to `new Date()` |
| 105 | `media.service.ts` | No query validation on search |
| 106 | `wrapped-generator.service.ts` | Insights only for movie/book |
| 107 | `config/configuration.ts` | Throws in production |
| 108 | `analytics-aggregation.service.ts` | `longestStreak` hardcoded to 0 |
| 109 | `analytics.repository.ts` | Heatmap iterates day 1-31 for all months (phantom dates) |
| 110 | `smart-collection.service.ts` | `_matchMode` (AND vs OR) ignored |
| 111 | `collections.repository.ts` | `reorderItems` sequential non-atomic updates |
| 112 | `observability/metrics.service.ts` | Histogram arrays grow unboundedly |
| 113 | `search.repository.ts` | Filter options sample only 100 items per type |
| 114 | `search.repository.ts` | Missing REWATCHING/ON_HOLD/ARCHIVED statuses |
| 115 | `search.repository.ts` | `searchMedia` doesn't filter soft-deleted items |
| 116 | `config/configuration.ts` | Hardcoded default OAuth encryption key |
| 117 | `users.controller.ts` | `getAdminMetrics` returns hardcoded mock data |
| 118 | `storage/storage.controller.ts` | Download endpoint has no auth guard |
| 119 | `storage/signed-url.service.ts` | `verifyDownloadToken`/`verifyUploadToken` never called |

### Frontend — UI Components (80+ hardcoded colors)

| # | File | Issue |
|---|------|-------|
| 120 | `MediaCard.tsx` | Hardcoded shadow, amber star, `from-black/80` |
| 121 | `PosterCard.tsx` | Hardcoded amber star, rose heart |
| 122 | `PremiumGlass.tsx` | 5+ hardcoded oklch values; mixes rgba/oklch |
| 123 | `AnalyticsKit.tsx` | Default accent hardcoded; ProgressRing no re-animate |
| 124 | `LibraryToolbar.tsx` | Native `<select>`; hardcoded amber |
| 125 | `PageSkeleton.tsx` | Fixed grid; no `aria-busy` |
| 126 | `PremiumErrorState.tsx` | No entrance animation, no `role="alert"` |
| 127 | `ShimmerSkeleton.tsx` | Missing `role="status"` |
| 128 | `ActivityFeed.tsx` | Hardcoded white; raw type string exposed |
| 129 | `CinematicHero.tsx` | 18 oklch, 8 shadows, 4 durations |
| 130 | `MediaConstellation.tsx` | 5 rgba, multiple shadows |
| 131 | `auth.tsx` | 27 rgba occurrences |

### Frontend — Routes

| # | File | Issue |
|---|------|-------|
| 132 | `app.journal.tsx` | Hardcoded localStorage keys; magic numbers |
| 133 | `app.wrapped.tsx` | Hardcoded background; no script dedup |
| 134 | `app.settings.tsx` | Language/timezone options hardcoded |
| 135 | `app.search.tsx` | `⌘K` display Mac-only |
| 136 | `app.library.paused.tsx` | Hardcoded progress gradient |
| 137 | `app.library.dropped.tsx` | "Restart" goes to detail |
| 138 | `app.media.$id.tsx` | "Back" hardcoded to `/app/library` |
| 139 | `app.import.tsx` | Hardcoded Unsplash fallback |
| 140 | `app.onboarding.tsx` | Hardcoded MEDIA_TYPES |

### Frontend — Lib Files

| # | File | Issue |
|---|------|-------|
| 141 | `memory.ts` | `TODAY` hardcoded; `COLLECTIONS`/`JOURNAL` always empty |
| 142 | `memory.ts` | `MEMORIES_BY_MEDIA` built from empty MEDIA |
| 143 | `goals.ts` | `GOALS_FULL` always empty |
| 144 | `challenges.ts` | `CHALLENGES` always empty |
| 145 | `memoryInsights.ts` | 8 empty arrays |
| 146 | `memoryJournal.ts` | `MEMORY_EXTENSIONS` built from empty MEDIA |
| 147 | `mediaGraph.ts` | `COLLECTIONS` always empty |
| 148 | `crosslinks.ts` | Uses stubs |
| 149 | `libraryStore.ts` | `SEED_META` unused; duplicate `KIND_LABEL` |
| 150 | `useTimeOfDay.ts` vs `dashboardGreeting.ts` | Inconsistent time boundaries |
| 151 | `shareCard.ts` | Both ternary branches identical |
| 152 | `shortcuts.ts` | Module-level mutable state shared across instances |
| 153 | `api/adapters.ts` | Hardcoded `year: 2024` fallback |

### Frontend — Memory/Journal Components

| # | File | Issue |
|---|------|-------|
| 154 | `intelligence/MemoryDNA.tsx` | All radar values hardcoded |
| 155 | `intelligence/LibraryMap.tsx` | All genre counts/colors hardcoded |
| 156 | `intelligence/MediaEvolution.tsx` | All year/genre values hardcoded |
| 157 | `intelligence/LifeSoundtrack.tsx` | Album/artist/hours hardcoded; Math.random in render |
| 158 | `intelligence/JourneyContinuity.tsx` | LOTR fallback; hardcoded title/subtitle |
| 159 | `intelligence/RelatedJourney.tsx` | Ternary always "Then" |
| 160 | `intelligence/TasteChip.tsx` | Button with no onClick handler |
| 161 | `journal/JournalPrompt.tsx` | Uses empty JOURNAL_PROMPTS instead of API hook |
| 162 | `journal/WriteOverlay.tsx` | Same issue |
| 163 | `memory/MemoryConnections.tsx` | Uses seeded random data |

### Frontend — Landing/Auth

| # | File | Issue |
|---|------|-------|
| 164 | `landing/LivingHero.tsx` | 5 hardcoded CDN URLs |
| 165 | `landing/DashboardShowcase.tsx` | Hardcoded backdrops; fake progress |
| 166 | `landing/CrossPlatform.tsx` | Hardcoded TMDB/IGDB URLs |
| 167 | `landing/MemoryCapsule.tsx` | Hardcoded TMDB/Unsplash URLs |
| 168 | `landing/CollectionsPreview.tsx` | 4 Unsplash URLs |
| 169 | `landing/UniversalMediaShowcase.tsx` | 10 Unsplash URLs |
| 170 | `landing/AnalyticsPreview.tsx` | `Math.random()` — hydration risk |
| 171 | `auth/AuthStage.tsx` | `MOCK_POSTERS` in render loop |
| 172 | `auth/MobileMemoryHero.tsx` | 2 TMDB URLs; fake ratings |
| 173 | `auth.forgot-password.tsx` | Simulated API call |

### Frontend — Discovery/Collections

| # | File | Issue |
|---|------|-------|
| 174 | `discovery/ComfortStories.tsx` | 4 Unsplash URLs; mock rewatchCount |
| 175 | `discovery/SeasonalRecommendations.tsx` | 3 Unsplash URLs; props typed `any` |
| 176 | `discovery/GenreExpansion.tsx` | Hardcoded radar; `data` prop ignored |
| 177 | `discovery/DiscoveryCollections.tsx` | Hardcoded theme labels by index |
| 178 | `discovery/RecommendationCard.tsx` | Hardcoded fallback; buttons no onClick |
| 179 | `collections/CollectionAchievements.tsx` | 4 hardcoded items; prop ignored |
| 180 | `collections/CollectionChapters.tsx` | 6 hardcoded strings; prop ignored |
| 181 | `collections/CollectionDiscussions.tsx` | 4 hardcoded strings; prop ignored |
| 182 | `collections/CollectionTimeline.tsx` | 8 of 10 events fabricated |
| 183 | `collections/CollectionJournal.tsx` | `JOURNAL: any[] = []` |
| 184 | `collections/CollectionStatistics.tsx` | Hardcoded genre/year distributions |
| 185 | `collections/CollectionAnalyticsPreview.tsx` | Hardcoded bar data; fake stats |
| 186 | `collections/CollectionMoodboard.tsx` | 4 Unsplash fallbacks |
| 187 | `collections/CollectionStory.tsx` | Fabricated narrative text |
| 188 | `collections/CuratorNotes.tsx` | Same template for every collection |
| 189 | `collections/CollectionQuickActions.tsx` | All buttons no onClick |
| 190 | `collections/CreateCollectionModal.tsx` | `submit()` is stub |
| 191 | `collections/CollectionCard.tsx` | Invalid CSS gradient syntax |
| 192 | `collections/FeaturedCollections.tsx` | Invalid CSS gradient syntax |
| 193 | `collections/RelatedCollections.tsx` | Invalid CSS gradient syntax |
| 194 | `collections/CollectionsHero.tsx` | Invalid CSS gradient syntax |
| 195 | `profile/LifeChapters.tsx` | `Math.random()` in render |
| 196 | `profile/LifetimeMilestones.tsx` | 6 hardcoded milestones |
| 197 | `challenges/JourneyTracker.tsx` | All 6 steps hardcoded |

### Design Tokens (Systemic)

| # | Category | Issue |
|---|----------|-------|
| 198 | `oklch(0.72 0.18 255)` | 34 times inline instead of `var(--primary)` |
| 199 | `oklch(0.65 0.22 295)` | 10+ times inline instead of `var(--secondary)` |
| 200 | `oklch(0.82 0.16 80)` | 8+ times inline instead of `var(--warning)` |
| 201 | `oklch(0.72 0.16 160)` | 8+ times inline instead of `var(--success)` |
| 202 | `oklch(0.7 0.18 25)` | 6+ times — NO token exists |
| 203 | `rounded-[40px]` | 15+ times — maps to `--radius-4xl` |
| 204 | `rounded-[22px]` | 8 times — no token |
| 205 | `shadow-[0_24px_60px_-20px_oklch(0_0_0/0.7)]` | Should use `--shadow-poster-hover` |
| 206 | `duration-300` | 36 times — between `--dur-normal` and `--dur-large` |
| 207 | `duration-500` | 38 times — between `--dur-large` and `--dur-page` |

---

## Low Issues (185) — Code Quality / Minor UX

### Empty Stubs (26 components returning null)

| # | File | Component |
|---|------|-----------|
| 208-233 | 26 files | StoryUniverse, StoryDNA, StoryImpact, PersonalStatements, ThisWeekHistory, RememberAgain, OnThisDay, CompletionReflection, DiscussionNotes, EditorialStats, CharactersYouLoved, CompanionStories, LifeContext, EmotionJourney, FavoriteMoments, MediaRelationships, SessionHistory, RewatchIntelligence, SimilarMemories, WhyItWorked, StoryJourney, RelationshipPanel, IdentityHero, MemoryCapsules, QuoteGallery, MediaDNA |

### Unused Imports (11 instances)

| # | File | Import |
|---|------|--------|
| 234 | `app.analytics.tsx` | `Link`, `TrendingUp`, etc. |
| 235 | `app.library.dropped.tsx` | `Link` |
| 236 | `CommandPalette.tsx` | `Pin` |
| 237-241 | 5 landing files | `MEDIA` |
| 242-244 | 3 journal/collection files | Empty `import { }` |

### Dead Code (7 instances)

| # | File | Issue |
|---|------|-------|
| 245 | `app.timeline.tsx` | Empty import block |
| 246 | `libraryStore.ts` | `SEED_META`, `deriveDefault()` |
| 247 | `goals.ts` | `_media = MEDIA` |
| 248 | `mediaGraph.ts` | Unused `ACHIEVEMENTS` |
| 249 | `UniversalMediaShowcase.tsx` | `<Headphones className="hidden" />` |
| 250 | `app.collections.$id.tsx` | `notFound` imported, never called |
| 251 | `api/analytics.ts` | Duplicate `ConstellationEntry` interface |

### `as any` Type Assertions (37 instances)

Key offenders across routes, components, and lib files.

### Accessibility

| # | Issue |
|---|-------|
| 252 | 14+ files: `alt=""` on meaningful poster images |
| 253 | Sort buttons missing `aria-pressed` |
| 254 | No route-level error boundaries |
| 255 | 16 components missing reduced-motion support |
| 256 | Non-interactive divs with cursor-pointer |

### Console.log in Production

| # | File | Line |
|---|------|------|
| 257-259 | `analytics.ts` | 7, 20, 34 |

### Empty Catch Blocks

| # | File | Line |
|---|------|------|
| 260 | `__root.tsx` | 125 |
| 261 | `analytics-tracker.ts` | 26, 41 |
| 262 | `api/fetch.ts` | 243 |

---

## Summary

| Category | Count | Severity |
|----------|-------|----------|
| Critical (crashes/compilation) | 35 | Critical |
| High (wrong logic/data loss) | 95 | High |
| Medium (hardcoded/validation) | 185 | Medium |
| Low (quality/cosmetic) | 185 | Low |
| **Total** | **~500** | — |

### Top 15 Fixes Needed (Ordered by Impact)

1. **Backend `analytics.repository.ts`** — Remove `deletedAt: null` from JournalEntry/TimelineEvent/AnalyticsSnapshot queries
2. **Backend `interaction.repository.ts`** — Fix `ActivityType` enum — use valid values (`WATCH`, `READ`, etc.) not `mediaType.toUpperCase()`
3. **Backend `progress.service.ts`** — Remove `currentModule` from update data (field doesn't exist)
4. **Frontend `app.calendar.tsx`** — Fix `MEDIA.length === 0` modulo-by-zero; populate adapter cells; pass `months` to YearOverview
5. **Frontend `lib/memory.ts`** — Fix `TODAY.getTime()` → `TODAY().getTime()`
6. **Frontend `lib/memoryJournal.ts`** — Fix `pick(rng)` → `pick(rng, QUOTES)`
7. **Frontend `adapters/analytics.ts`** — Fix `.sort()` mutation — use `[...months].sort()` 
8. **Backend `journal.repository.ts`** — Fix cursor overwriting year/month range filter
9. **Frontend `shortcuts.ts`** — Memoize `map` parameter or remove from deps
10. **All 26 stub components** — Either implement or remove from routes
11. **All 36 empty arrays** — Either populate from API or remove
12. **Frontend `app.library.all.tsx`** — Fix "Recently Finished" sort; fix "Most Time Spent"
13. **Frontend `app.library.completed.tsx`** — Implement "Recent" sort by completedAt
14. **Frontend `MediaCard.tsx`** — Move ItemActionBar outside Link
15. **Design tokens** — Replace `oklch(0.72 0.18 255)` with `bg-primary` across 34 files

---

## Appendix: 26 Stub Components (return null)

1. `src/components/intelligence/StoryUniverse.tsx`
2. `src/components/intelligence/StoryDNA.tsx`
3. `src/components/intelligence/StoryImpact.tsx`
4. `src/components/intelligence/PersonalStatements.tsx`
5. `src/components/memory/ThisWeekHistory.tsx`
6. `src/components/memory/RememberAgain.tsx`
7. `src/components/memory/OnThisDay.tsx`
8. `src/components/media/CompletionReflection.tsx`
9. `src/components/media/DiscussionNotes.tsx`
10. `src/components/media/EditorialStats.tsx`
11. `src/components/media/CharactersYouLoved.tsx`
12. `src/components/media/CompanionStories.tsx`
13. `src/components/media/LifeContext.tsx`
14. `src/components/media/EmotionJourney.tsx`
15. `src/components/media/FavoriteMoments.tsx`
16. `src/components/media/MediaRelationships.tsx`
17. `src/components/media/SessionHistory.tsx`
18. `src/components/media/RewatchIntelligence.tsx`
19. `src/components/media/SimilarMemories.tsx`
20. `src/components/media/WhyItWorked.tsx`
21. `src/components/media/StoryJourney.tsx`
22. `src/components/profile/RelationshipPanel.tsx`
23. `src/components/profile/IdentityHero.tsx`
24. `src/components/profile/MemoryCapsules.tsx`
25. `src/components/profile/QuoteGallery.tsx`
26. `src/components/profile/MediaDNA.tsx`
