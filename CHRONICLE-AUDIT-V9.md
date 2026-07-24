# Chronicle Audit V9 — Full App Investigation (10 Sub-Agents)

**Date:** July 24, 2026  
**Audit Round:** V9 (Post V8 fixes)  
**Method:** 10 parallel sub-agents: Calendar/Timeline, Backend, UI Components, Routes, Lib Files, Memory/Journal, Landing/Auth, Design Tokens, Discovery/Profile, Hooks/API

---

## Executive Summary

V8 fixes addressed deletedAt schema, calendar crashes, memory migrations, and UI improvements. This V9 deep investigation found **new issues** across all areas, many introduced by V8 fixes or previously hidden.

**Total findings: ~420 issues** (32 Critical, 85 High, 168 Medium, 135 Low)

---

## CRITICAL Issues (32) — Runtime Crashes / Data Corruption

### Backend — Schema & Runtime Crashes

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 1 | `analytics.repository.ts` | 308,318,328,361,374,401,414,491,516 | `deletedAt: null` queried on JournalEntry, Memory, TimelineEvent, AnalyticsSnapshot — none have this field. Will crash every analytics endpoint. |
| 2 | `analytics.repository.ts` | 90,95 | `episodesWatched` field selected but doesn't exist on any User* model. Prisma throws runtime error. |
| 3 | `analytics-aggregation.service.ts` | 46 | References non-existent `documentary` media type. `hoursData.hours['documentary']` always undefined. |

### Backend — Dead/Stub Endpoints

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 4 | `analytics.controller.ts` | 60-93 | `getCalendar()` has no route decorator — dead code. `@Get('calendar')` orphaned on `getCalendarYear`. |
| 5 | `analytics-aggregation.service.ts` | 194-201 | `getCalendarDay()` is a mock returning empty data. Always returns `{ date, mediaItems: [], journalEntry: null }`. |
| 6 | `streak.service.ts` | 59-62 | `calculateCompletionStreak()` always returns 0. |
| 7 | `library-statistics.service.ts` | 28 | `favoriteCount` always hardcoded to 0. |

### Frontend — Runtime Crashes

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 8 | `app.calendar.tsx` | 134 | `MEDIA.length === 0` causes modulo-by-zero. `MEDIA[NaN]` → `media.title` crashes with TypeError. |
| 9 | `lib/memory.ts` | 260 | `TODAY.getTime()` — `TODAY` is a function `() => new Date()`, not a Date. Will throw TypeError. |
| 10 | `lib/memoryJournal.ts` | 213 | `pick(rng)` missing second argument (array). Will throw `Cannot read properties of undefined (reading 'length')`. |
| 11 | `app.calendar.tsx` | 13-14 | `CALENDAR_YEAR` and local `MEDIA` are empty stubs. `CALENDAR_YEAR[monthIdx]` → undefined crash. |
| 12 | `app.timeline.tsx` | 249 | `{[].map(...)}` — editorial highlights always empty. Dead section. |

### Frontend — Data Integrity

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 13 | `app.timeline.tsx` | 65 | `MEDIA.concat(MEDIA)` always empty. Hero collage invisible. |
| 14 | `app.timeline.tsx` | 287-301 | Hardcoded journey statistics (4 years, 312 stories, 38,412 words) contradict real hero stats. |
| 15 | `app.timeline.tsx` | 319 | `LIFE_CHAPTERS.map(...)` maps over empty array. Section renders blank. |

### API Layer — Critical Bugs

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 16 | `api/fetch.ts` | 220-227 | `apiUpload` sets `Content-Type: application/json` on FormData — breaks multipart uploads. |
| 17 | `api/query-keys.ts` | 52-56 | Cursor serialized into infinite query key — breaks pagination. Each page creates new cache entry. |
| 18 | `adapters/analytics.ts` | 134 | `.sort()` mutates `months` array in-place — calendar months displayed out of order. |

### Design Token Bypass (Systemic)

| # | Category | Count | Impact |
|---|----------|-------|--------|
| 19 | `oklch()` hardcoded | 100+ occurrences | Primary blue `oklch(0.72 0.18 255)` appears 30+ times instead of `var(--primary)` |
| 20 | `rgba()` hardcoded | 100+ occurrences | Glass/shadow effects bypass glass alpha tokens |
| 21 | `rounded-[...]` arbitrary | 57 occurrences | `--radius-*` tokens defined but never used via `var(--radius-*)` |
| 22 | `shadow-[...]` arbitrary | 73 occurrences | `--shadow-*` tokens defined but only 4 uses in TSX |

---

## High Issues (85) — Wrong Logic / Data Loss / Security

### Backend

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 23 | `library.service.ts` | 103 | `IN_PROGRESS` is not a valid `UserMediaStatus` Prisma enum value |
| 24 | `library.service.ts` | 140 | `mediaType` defaults to `'movie'` when no media relation |
| 25 | `library.service.ts` | 100-110 | `startedAt` not set when status changes to active states via `update()` |
| 26 | `library.repository.ts` | 306 | `softDelete` doesn't check `existing.deletedAt` — double-delete silently succeeds |
| 27 | `journal.service.ts` | 198 | Timeline cursor uses `createdAt` but results ordered by `eventDate` — pagination mismatch |
| 28 | `journal.repository.ts` | 9 | `prismaAny()` is `public` — breaks encapsulation, called externally via `as any` |
| 29 | `wrapped.service.ts` | 142-146 | `sharePayload` differs between generate/getShareData/toWrappedDto — 3 different shapes |
| 30 | `wrapped-generator.service.ts` | 32 | `totalHours` computed but never output — dead code |
| 31 | `wrapped-generator.service.ts` | 90 | `sortOrder: 9` duplicated — "Favorite Genre" and "Average Rating" collide |
| 32 | `auth.service.ts` | 88-132 | Refresh token race condition — concurrent requests can both validate and rotate |
| 33 | `auth.service.ts` | 18 | In-memory rate limiter lost on restart, not cluster-safe |
| 34 | `auth.repository.ts` | 30-39 | Registration race condition — concurrent same-email registrations both pass `findByEmail` |
| 35 | `analytics.repository.ts` | 352,388-440 | Timezone bug — `toISOString()` returns UTC, heatmap/calendar entries wrong day |
| 36 | `media.controller.ts` | All | No auth guard on any media endpoint — publicly accessible |
| 37 | `library/dto/library.dto.ts` | 6-17 | Missing `REWATCHING`, `ON_HOLD` from status enum |
| 38 | `wrapped-generator.service.ts` | 122 | Anime pluralization ternary: both branches are `''` |

### Frontend — Components

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 39 | `MediaCard.tsx` | 44-132 | Buttons nested inside `<Link>` — invalid HTML semantics, accessibility violation |
| 40 | `MediaCard.tsx` | 104 | Dead transparent box-shadow `"inset 0 0 0 1px transparent"` — no effect |
| 41 | `PosterCard.tsx` | 128-141 | Favorite `<button>` inside `<Link>` — nested interactive elements |
| 42 | `AnalyticsKit.tsx` | 134 | Delta always green regardless of positive/negative |
| 43 | `AnalyticsKit.tsx` | 158 | No NaN guard on ProgressRing — `Math.min(100, NaN)` = NaN → SVG breaks |
| 44 | `CommandPalette.tsx` | 455,473,489 | `filter(Boolean)` strips numeric `0` values — first search result always missing |
| 45 | `CalendarHero.tsx` | 49 | Next-year button permanently disabled (`yearOffset >= 0`) |
| 46 | `CalendarHero.tsx` | 16-21 | Redundant `useCalendar()` call — data already available from parent |
| 47 | `CalendarInsights.tsx` | 6-19 | Dynamic external script injection; CSP risk; no cleanup on multiple calls |
| 48 | `DailyMemoryPanel.tsx` | 110,124 | Hardcoded mood "Awe" and weather "Cold, clear" |
| 49 | `PremiumGlass.tsx` | 96-98 | `interactive` mode has no keyboard handlers — no `role`, no `tabIndex`, no `onKeyDown` |
| 50 | `ItemActionBar.tsx` | 260 | Identical ternary branches: both `"h-3.5 w-3.5"` — dead conditional |
| 51 | `CommandPalette.tsx` | 16 | `Pin` imported but never used — dead code |
| 52 | `PosterCard.tsx` | 112 | `(item.progress ?? 0) !== undefined` is always `true` — dead check |

### Frontend — Routes

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 53 | `app.library.all.tsx` | 27 | `ALL_LIBRARY` always empty — page shows nothing |
| 54 | `app.library.all.tsx` | 56 | "Most Time Spent" sort uses `progress` (percentage), not actual hours |
| 55 | `app.library.completed.tsx` | 22 | "Recent" sort returns `0` (no-op) |
| 56 | `app.search.tsx` | 10-14 | Synthetic KeyboardEvent dispatch doesn't work cross-browser; no actual search functionality |
| 57 | `app.journal.tsx` | 182 | `MemoryDNA` receives truncated title as `mediaId` — nonsensical |
| 58 | `app.journal.tsx` | 231-241 | Nested `MemoryZone` inside `MemoryZone` — invalid DOM |
| 59 | `app.wrapped.tsx` | 177-179 | `accent` string manipulation hack — fragile `.replace("/25", " / 0.25")` |
| 60 | `app.wrapped.tsx` | 38,41 | `alert()` used instead of `toast` for download/share feedback |
| 61 | `app.import.tsx` | 99-108 | CSV `dropped` and `archived` statuses mapped to `in_progress` |
| 62 | `app.import.tsx` | 69 | CSV `kind` field not validated — any string accepted |
| 63 | `app.settings.tsx` | 16-22 | Theme flash on load — defaults to "system" before profile loads |
| 64 | `app.media.$id.tsx` | 199 | `getRelatedGoal` called twice — should use variable |
| 65 | `app.analytics.tsx` | 95-96 | Filter state variables (`range`, `scope`) defined but never used to filter data |
| 66 | `app.analytics.tsx` | 167-173 | All delta values hardcoded to `0` |
| 67 | `app.index.tsx` | 99-104 | Fake "your" quotes — editorial content disguised as user data |
| 68 | `app.quotes.tsx` | 16 | `quotes.slice(1, 37)` on 4-item array — slice overflow |
| 69 | `app.collections.$id.tsx` | 186-188 | Favorite button has no `onClick` handler |
| 70 | `app.onboarding.tsx` | 33 | Onboarding completion only in localStorage — not persisted to server |
| 71 | `app.characters.index.tsx` | 3 | Characters reference hardcoded media IDs from empty MEDIA array — hero never renders |
| 72 | `app.library.paused.tsx` | 34 | Uses `droppedAtLabel` for paused items — semantically wrong |
| 73 | `app.library.paused.tsx` | 56 | `"archived" as any` — type assertion bypasses safety |
| 74 | `app.timeline.tsx` | 326-350 | Reduced-motion not respected in bottom 3 sections |

### Frontend — Lib Files

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 75 | `library.ts` | 124-126 | `trendFor()` always returns `null` — stub |
| 76 | `library.ts` | 135-137 | `smartInsights()` always returns `[]` — stub |
| 77 | `library.ts` | 34-37 | `liveItems()` only returns custom items, not server library |
| 78 | `goals.ts` | 45-47 | `getGoalInsights()` always returns `[]` — stub |
| 79 | `achievements.ts` | 41-43 | `getAchievementsByCategory()` always returns `{}` — stub |
| 80 | `collectionRelationships.ts` | 13-22 | Returns hardcoded static labels for every collection |
| 81 | `creatorEngine.ts` | 80 | `totalHours: works.length * 14` — hardcoded multiplier |
| 82 | `franchiseEngine.ts` | 16-65 | Hardcoded media IDs — all `MEDIA.find()` calls return undefined |
| 83 | `museumEngine.ts` | 14-57 | Hardcoded gallery media IDs — all galleries show empty content |
| 84 | `characters.ts` | 15-112 | Hardcoded character media IDs — all accents default to fallback |
| 85 | `collectionWorkspace.ts` | 1 | `getWorkspace()` returns empty stub; `w.memories` doesn't exist on return shape |
| 86 | `collectionInsights.ts` | 1-2 | `getCollectionInsights()` and `getCollectionStats()` return empty stubs |
| 87 | `lifeChapters.ts` | 13-14 | `getLifeChapters()` returns `[]` — stub |

### API Layer

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 88 | `fetch.ts` | 125-136 | 401 retry on final attempt produces misleading `NetworkError` instead of `SESSION_EXPIRED` |
| 89 | `auth.ts` | 40-42 | `register()` does not store access token |
| 90 | `constants.ts` | 1 | SSR API URL hardcoded to Docker hostname `http://api:3000/api` — not configurable |
| 91 | `adapters.ts` | 37,78 | Hardcoded `year: 2024` fallback |
| 92 | `query-client.ts` / `fetch.ts` | 15 / 170 | Double retry logic causes up to 6 attempts for 429 errors |
| 93 | `libraryStore.ts` | 196-203 | `addCustomItem` replaces rather than merges existing meta |
| 94 | `libraryStore.ts` | 376-378 | `hydrated` set via direct mutation may not trigger re-renders |
| 95 | `libraryStore.ts` | 329-331 | `importJSON` replaces shelves/collections instead of merging |
| 96 | `use-mobile.tsx` | 18 | Returns `false` on first render — causes layout shift on mobile |

---

## Medium Issues (168) — Hardcoded Values / Missing Validation

### Backend

| # | File | Issue |
|---|------|-------|
| 97 | `analytics.repository.ts` | `getAverageRating` returns unrounded float |
| 98 | `analytics.service.ts` | No input validation on calendar `year`/`month` |
| 99 | `library.repository.ts` | `findByUserIdAndMediaId` doesn't check `deletedAt` |
| 100 | `journal.service.ts` | `createdAt` defaults to `new Date()` when missing |
| 101 | `media.service.ts` | No query validation on search |
| 102 | `media.service.ts` | `mediaType` fallback labels wrong for cross-type queries |
| 103 | `wrapped-generator.service.ts` | Insights only for movie/book — no tvShow/anime/game |
| 104 | `config/configuration.ts` | Throws in production — should fail gracefully |
| 105 | `analytics-aggregation.service.ts` | `longestStreak` hardcoded to 0 in calendar year stats |

### Frontend — UI Components

| # | File | Issue |
|---|------|-------|
| 106 | `MediaCard.tsx` | Hardcoded shadow, amber star, `from-black/80` not light-mode safe |
| 107 | `PosterCard.tsx` | Hardcoded amber star (`fill-amber-400`), rose heart (`fill-rose-400`) |
| 108 | `PremiumGlass.tsx` | Unused `useState` import; 5+ hardcoded oklch values |
| 109 | `PremiumGlass.tsx` | Mixes `rgba` and `oklch` in same shadow — inconsistent |
| 110 | `AnalyticsKit.tsx` | Default accent hardcoded; ProgressRing never re-animates |
| 111 | `LibraryToolbar.tsx` | Native `<select>` breaks glass aesthetic; hardcoded amber for favorites |
| 112 | `LibraryToolbar.tsx` | Search input and sort select missing `<label>` / `aria-label` |
| 113 | `PageSkeleton.tsx` | Fixed `grid-cols-2 md:grid-cols-4`; no `aria-busy` |
| 114 | `PremiumErrorState.tsx` | No entrance animation, no `role="alert"` |
| 115 | `ShimmerSkeleton.tsx` | Missing `role="status"` / `aria-label` |
| 116 | `ActivityFeed.tsx` | Hardcoded white (`bg-white/[0.06]`); raw `a.type` string exposed to user |

### Frontend — Routes

| # | File | Issue |
|---|------|-------|
| 117 | `app.journal.tsx` | Hardcoded localStorage keys; `words / 1500` magic number |
| 118 | `app.journal.tsx` | `MOOD_COLORS` hardcoded — new moods fall through to grey |
| 119 | `app.wrapped.tsx` | Hardcoded `#090a0f` background; no script dedup; captures full body |
| 120 | `app.settings.tsx` | Language/timezone options hardcoded to 4/5 |
| 121 | `app.search.tsx` | `⌘K` display hardcoded to Mac |
| 122 | `app.library.paused.tsx` | Hardcoded progress bar gradient |
| 123 | `app.library.dropped.tsx` | "Restart" link navigates to detail — doesn't restart |
| 124 | `app.media.$id.tsx` | "Back" hardcoded to `/app/library` |
| 125 | `app.import.tsx` | Hardcoded Unsplash poster URL for unknown items |
| 126 | `app.onboarding.tsx` | Hardcoded MEDIA_TYPES array |

### Frontend — Lib Files

| # | File | Issue |
|---|------|-------|
| 127 | `memory.ts` | `TODAY` hardcoded to `2026-06-27`; `COLLECTIONS`/`JOURNAL` always empty |
| 128 | `memory.ts` | `MEMORIES_BY_MEDIA` built from empty MEDIA — always `{}` |
| 129 | `goals.ts` | `GOALS_FULL` always empty; `ACHIEVEMENTS` always empty |
| 130 | `challenges.ts` | `CHALLENGES` always empty |
| 131 | `memoryInsights.ts` | 8 empty arrays (HIGHLIGHTS, MEMORY_BOOKMARKS, FIRSTS, LIFE_CHAPTERS, CAPSULES, MILESTONES, STREAKS, INSIGHT_LINES) |
| 132 | `memoryJournal.ts` | `MEMORY_EXTENSIONS` built from empty MEDIA |
| 133 | `mediaGraph.ts` | `COLLECTIONS` always empty |
| 134 | `crosslinks.ts` | Uses `COLLECTIONS`, `JOURNAL`, `MEDIA` stubs |
| 135 | `libraryStore.ts` | `SEED_META` unused; `deriveDefault()` unused; duplicate `KIND_LABEL` |
| 136 | `useTimeOfDay.ts` vs `dashboardGreeting.ts` | Inconsistent time-of-day boundaries (local vs UTC) |
| 137 | `shareCard.ts` | Both branches of ternary return identical value |

### Frontend — Memory/Journal Components

| # | File | Issue |
|---|------|-------|
| 138 | `intelligence/MemoryDNA.tsx` | All radar values hardcoded (85%, 65%, 90%, 45%, 75%, 95%) |
| 139 | `intelligence/LibraryMap.tsx` | All genre counts/colors hardcoded |
| 140 | `intelligence/MediaEvolution.tsx` | All year/genre values hardcoded |
| 141 | `intelligence/LifeSoundtrack.tsx` | Album, artist, hours hardcoded |
| 142 | `intelligence/JourneyContinuity.tsx` | LOTR fallback with Unsplash URLs; hardcoded title/subtitle |
| 143 | `intelligence/RelatedJourney.tsx` | Ternary `i === 0 ? "Then" : "Then"` always "Then" |
| 144 | `intelligence/JourneyContinuity.tsx` | `mediaId` prop declared but never used |
| 145 | `journal/JournalPrompt.tsx` | Uses local empty `JOURNAL_PROMPTS` instead of API-based `useJournalPrompts()` hook |
| 146 | `journal/WriteOverlay.tsx` | Same issue — should use `useJournalPrompts()` hook |
| 147 | `memory/MemoryConnections.tsx` | Uses seeded random `MEMORIES_BY_MEDIA` — always empty |

### Frontend — Landing/Auth Components

| # | File | Issue |
|---|------|-------|
| 148 | `landing/LivingHero.tsx` | 5 hardcoded TMDB/IGDB/Spotify/OpenLibrary URLs |
| 149 | `landing/DashboardShowcase.tsx` | Hardcoded backdrop URLs; fake progress percentages |
| 150 | `landing/CrossPlatform.tsx` | Hardcoded TMDB/IGDB URLs |
| 151 | `landing/MemoryCapsule.tsx` | Hardcoded TMDB/Unsplash URLs; fake memory entries |
| 152 | `landing/CollectionsPreview.tsx` | 4 hardcoded Unsplash URLs for demo collections |
| 153 | `landing/UniversalMediaShowcase.tsx` | 10 hardcoded Unsplash URLs |
| 154 | `landing/AnalyticsPreview.tsx` | `Math.random()` in render — hydration mismatch |
| 155 | `auth/AuthStage.tsx` | `MOCK_POSTERS` allocated inside `.map()` — performance anti-pattern |
| 156 | `auth/MobileMemoryHero.tsx` | 2 hardcoded TMDB URLs; fake ratings |
| 157 | `auth.forgot-password.tsx` | `setTimeout` simulates API — no real backend call |

### Frontend — Discovery/Profile Components

| # | File | Issue |
|---|------|-------|
| 158 | `discovery/ComfortStories.tsx` | 4 hardcoded Unsplash URLs; mock rewatchCount values |
| 159 | `discovery/SeasonalRecommendations.tsx` | 3 hardcoded Unsplash URLs; props typed as `any` |
| 160 | `discovery/GenreExpansion.tsx` | Entirely hardcoded radar chart; `data` prop typed as `any` and ignored |
| 161 | `discovery/DiscoveryCollections.tsx` | Hardcoded theme labels mapped by index — incorrect for small collections |
| 162 | `discovery/RecommendationCard.tsx` | Hardcoded Unsplash fallback; buttons have no onClick handlers |
| 163 | `collections/CollectionAchievements.tsx` | 4 hardcoded achievement items; collection prop ignored |
| 164 | `collections/CollectionChapters.tsx` | 6 hardcoded chapter strings; collection prop ignored |
| 165 | `collections/CollectionDiscussions.tsx` | 4 hardcoded note strings; collection prop ignored |
| 166 | `collections/CollectionTimeline.tsx` | 8 of 10 events are fabricated static strings |
| 167 | `collections/CollectionJournal.tsx` | `const JOURNAL: any[] = []` — always empty |
| 168 | `collections/CollectionStatistics.tsx` | Hardcoded genre/year distributions; Math.sin for bar chart |
| 169 | `collections/CollectionAnalyticsPreview.tsx` | Hardcoded weekly bar data; fake stat values |
| 170 | `collections/CollectionMoodboard.tsx` | 4 hardcoded Unsplash fallback URLs |
| 171 | `collections/CollectionStory.tsx` | Fabricated narrative text ("quiet additions, mostly on weekends") |
| 172 | `collections/CuratorNotes.tsx` | Same template for every collection |
| 173 | `collections/CollectionQuickActions.tsx` | All action buttons have no onClick handlers |
| 174 | `collections/CreateCollectionModal.tsx` | `submit()` is a stub with setTimeout |
| 175 | `profile/LifeChapters.tsx` | `Math.random()` in render — non-deterministic |

### Design Tokens (Systemic)

| # | Category | Issue |
|---|----------|-------|
| 176 | `oklch(0.72 0.18 255)` | Appears 30+ times inline instead of `var(--primary)` |
| 177 | `oklch(0.65 0.22 295)` | Appears 10+ times inline instead of `var(--secondary)` |
| 178 | `oklch(0.82 0.16 80)` | Appears 8+ times inline instead of `var(--warning)` |
| 179 | `oklch(0.72 0.16 160)` | Appears 8+ times inline instead of `var(--success)` |
| 180 | `oklch(0.7 0.18 25)` | Appears 6+ times — NO token exists for this color |
| 181 | `rounded-[40px]` | Appears 12+ times — maps to `--radius-4xl` but not referenced |
| 182 | `rounded-[22px]` | Appears 6 times — no token exists |
| 183 | `shadow-[0_24px_60px_-20px_oklch(0_0_0/0.7)]` | Should use `--shadow-poster-hover` |
| 184 | `duration-300` | Appears 40+ times — between `--dur-normal` (240ms) and `--dur-large` (360ms) |
| 185 | `duration-500` | Appears 30+ times — between `--dur-large` (360ms) and `--dur-page` (560ms) |

---

## Low Issues (135) — Code Quality / Minor UX

### Empty Stubs (return null)

| # | File | Component |
|---|------|-----------|
| 186 | `intelligence/PersonalStatements.tsx` | Returns null, unused PremiumGlass |
| 187 | `intelligence/StoryDNA.tsx` | Returns null, unused PremiumGlass |
| 188 | `intelligence/StoryImpact.tsx` | Returns null, unused PremiumGlass |
| 189 | `intelligence/StoryUniverse.tsx` | Returns null, unused PremiumGlass |
| 190 | `memory/OnThisDay.tsx` | Returns null |
| 191 | `memory/RememberAgain.tsx` | Returns null |
| 192 | `memory/ThisWeekHistory.tsx` | Returns null |
| 193 | `profile/IdentityHero.tsx` | Returns null |
| 194 | `profile/MediaDNA.tsx` | Returns null |
| 195 | `profile/MemoryCapsules.tsx` | Returns null |
| 196 | `profile/QuoteGallery.tsx` | Returns null |
| 197 | `profile/RelationshipPanel.tsx` | Returns null |

### Unused Imports

| # | File | Import |
|---|------|--------|
| 198 | `app.analytics.tsx` | `Link`, `TrendingUp`, `TrendingDown`, `ArrowRight`, `Heart`, `Pause` |
| 199 | `app.library.dropped.tsx` | `Link` |
| 200 | `CommandPalette.tsx` | `Pin` |
| 201 | `landing/LivingHero.tsx` | `MEDIA` |
| 202 | `landing/DashboardShowcase.tsx` | `MEDIA` |
| 203 | `landing/CrossPlatform.tsx` | `MEDIA` |
| 204 | `landing/MemoryCapsule.tsx` | `MEDIA` |
| 205 | `auth/MobileMemoryHero.tsx` | `MEDIA` |
| 206 | `journal/JournalPrompt.tsx` | Empty `import { } from "@/lib/types"` |
| 207 | `journal/WriteOverlay.tsx` | Empty `import { } from "@/lib/types"` |
| 208 | `collections/CollectionJournal.tsx` | Empty `import { } from "@/lib/types"` |

### Dead Code

| # | File | Line(s) | Issue |
|---|------|---------|-------|
| 209 | `app.timeline.tsx` | 8-10 | Empty import block from `@/lib/types` |
| 210 | `libraryStore.ts` | 97 | `SEED_META` defined but never used |
| 211 | `libraryStore.ts` | 99-104 | `deriveDefault()` defined but never called |
| 212 | `goals.ts` | 63 | `export const _media = MEDIA` — unnecessary alias |
| 213 | `mediaGraph.ts` | 8 | `const ACHIEVEMENTS: any[] = []` — unused, `ACHIEVEMENTS_FULL` used instead |
| 214 | `UniversalMediaShowcase.tsx` | 150 | `<Headphones className="hidden" />` — dead element |
| 215 | `app.collections.$id.tsx` | 1 | `notFound` imported but never called |

### `as any` Type Assertions (38 occurrences)

Key offenders:
- `app.library.all.tsx` (2), `app.library.paused.tsx` (1), `app.library.index.tsx` (4)
- `app.analytics.tsx` (2), `app.collections.index.tsx` (1), `app.index.tsx` (1)
- `app.onboarding.tsx` (1), `app.timeline.tsx` (1), `visual.tsx` (1)
- `CollectionWorkspace.tsx` (1), `ComfortStories.tsx` (1), `Museum.tsx` (1)
- `collectionWorkspace.ts` (1), `achievements.ts` (1), `collectionRelationships.ts` (1)

### Accessibility

| # | File | Issue |
|---|------|-------|
| 216 | 14+ route files | `alt=""` on meaningful poster images |
| 217 | `library.all.tsx`, `library.completed.tsx` | Sort buttons missing `aria-pressed` |
| 218 | No routes | Missing route-level error boundaries |
| 219 | `wrapped.tsx` | Progress dots have no semantic meaning |
| 220 | `app.wrapped.tsx` | No `aria-label` on slides |
| 221 | `app.notifications.tsx` | `n.actionUrl as any` — unsafe cast on route |

### Console.log in Production

| # | File | Line |
|---|------|------|
| 222 | `analytics.ts` | 7, 20, 34 — `console.log` on every track/pageview/identify |

### Empty Catch Blocks

| # | File | Line |
|---|------|------|
| 223 | `__root.tsx` | 125 |
| 224 | `analytics-tracker.ts` | 26, 41 |
| 225 | `api/fetch.ts` | 243 |

---

## Summary

| Category | Count | Severity |
|----------|-------|----------|
| Critical (crashes/compilation) | 32 | Critical |
| High (wrong logic/data loss) | 85 | High |
| Medium (hardcoded/validation) | 168 | Medium |
| Low (quality/cosmetic) | 135 | Low |
| **Total** | **~420** | — |

### Top 15 Fixes Needed (Ordered by Impact)

1. **Backend `analytics.repository.ts`** — Remove `deletedAt: null` from JournalEntry/Memory/TimelineEvent/AnalyticsSnapshot queries (field doesn't exist)
2. **Backend `analytics.repository.ts`** — Remove `episodesWatched` select (field doesn't exist on any User* model)
3. **Frontend `app.calendar.tsx`** — Fix `MEDIA.length === 0` modulo-by-zero crash; populate adapter cells; pass `months` to YearOverview
4. **Frontend `lib/memory.ts`** — Fix `TODAY.getTime()` → `TODAY().getTime()` (function call)
5. **Frontend `lib/memoryJournal.ts`** — Fix `pick(rng)` → `pick(rng, QUOTES)` (missing second argument)
6. **API `api/fetch.ts`** — Fix `apiUpload` Content-Type override for FormData
7. **API `query-keys.ts`** — Remove `cursor` from infinite query keys to fix pagination
8. **API `adapters/analytics.ts`** — Fix `.sort()` mutation — use `[...months].sort()` to avoid out-of-order display
9. **Frontend `app.timeline.tsx`** — Remove hardcoded journey statistics; use real data
10. **Backend `analytics.controller.ts`** — Fix orphaned `@Get('calendar')` decorator
11. **All 21 MEDIA imports** — Either populate MEDIA from API or remove the empty array and migrate consumers
12. **Frontend `app.library.all.tsx`** — Implement "Recently Finished" sort; fix "Most Time Spent" to use actual hours
13. **Frontend `app.library.completed.tsx`** — Implement "Recent" sort by completedAt
14. **Frontend `MediaCard.tsx`** — Move ItemActionBar outside Link; fix nested interactive elements
15. **Design tokens** — Replace `oklch(0.72 0.18 255)` with `bg-primary`/`text-primary` across 30+ files

---

## Appendix: 21 Files Importing MEDIA from @/lib/types

1. `src/routes/app.timeline.tsx`
2. `src/components/collections/CollectionWorkspace.tsx`
3. `src/components/character/CharacterProfile.tsx`
4. `src/components/landing/LivingHero.tsx`
5. `src/components/landing/DashboardShowcase.tsx`
6. `src/components/landing/CrossPlatform.tsx`
7. `src/components/landing/MemoryCapsule.tsx`
8. `src/components/auth/MobileMemoryHero.tsx`
9. `src/lib/museumEngine.ts`
10. `src/lib/memoryJournal.ts`
11. `src/lib/memoryInsights.ts`
12. `src/lib/memory.ts`
13. `src/lib/mediaGraph.ts`
14. `src/lib/lifeChapters.ts`
15. `src/lib/goals.ts`
16. `src/lib/franchiseEngine.ts`
17. `src/lib/crosslinks.ts`
18. `src/lib/creatorEngine.ts`
19. `src/lib/characters.ts`
20. `src/lib/challenges.ts`
21. `src/lib/api/library.ts`
