# Chronicle Project — Complete Work Summary

**Project:** `chronicle-your-media-story-mainzipzip`  
**Stack:** React + TanStack Router + TanStack Query (frontend) | NestJS + Prisma + PostgreSQL (backend)  
**Frontend Port:** 5000 (Vite) | **Backend Port:** 3000  
**Last Updated:** 2026-07-24  

---

## Table of Contents

1. [Environment & Setup](#environment--setup)
2. [Git Commits](#git-commits)
3. [Audit Rounds Overview](#audit-rounds-overview)
4. [V5–V8 Fixes Applied & Verified](#v5v8-fixes-applied--verified)
5. [V9 Audit Findings](#v9-audit-findings)
6. [V10 Audit Findings](#v10-audit-findings)
7. [V10 Fixes Applied](#v10-fixes-applied)
8. [V11 Audit Findings](#v11-audit-findings)
9. [V12 Audit Findings](#v12-audit-findings)
10. [Critical Issues Still Open](#critical-issues-still-open)
11. [All Affected Files](#all-affected-files)

---

## Environment & Setup

| Property | Value |
|----------|-------|
| Auth | Custom JWT access tokens (in-memory) + refresh tokens (httpOnly cookie at `/api/auth`) |
| `EMAIL_VERIFICATION_REQUIRED` | `false` |
| Test Credentials | `chronicle-tester@example.com` / `MockPassword123!` |
| Design System | `src/styles.css` — radius tokens (8px–40px), duration tokens (140ms–560ms), glass tokens, 30+ color tokens, 8 shadow tokens |
| Actual Usage | 438 oklch colors across 107 files — **95% not referencing CSS variables** |

---

## Git Commits

| Hash | Message | Files | Insertions | Deletions |
|------|---------|-------|------------|-----------|
| `78b7cff` | V8 fixes: calendar imports, memory migrations, PremiumButton, CommandPalette, CSV, CDN SRI, rate limiting, email normalization, library soft-delete | 233 | 7,387 | 1,499 |
| `a945fdb` | V10 fixes: deletedAt null removal, ActivityType mapping, currentModule, getCalendarDay, calculateCompletionStreak, favoriteCount, sort mutation, shortcuts, ItemActionBar | 33 | 1,846 | 156 |

---

## Audit Rounds Overview

| Round | Issues Found | Report File |
|-------|-------------|-------------|
| V3 | Early audit | `CHRONICLE-AUDIT-V3.md`, `CHRONICLE-AUDIT-V3-FULL.md` |
| V4 | Expanded audit | `CHRONICLE-AUDIT-V4.md`, `CHRONICLE-AUDIT-V4-FULL.md` |
| V5 | 22 issues | `CHRONICLE-AUDIT-V5.md` |
| V6 | 89 issues | `CHRONICLE-AUDIT-V6.md` |
| V7 | 145 issues | `CHRONICLE-AUDIT-V7.md` |
| V8 | 137 issues | `CHRONICLE-AUDIT-V8.md` |
| V9 | ~420 findings | `CHRONICLE-AUDIT-V9.md` |
| V10 | ~500 findings | `CHRONICLE-AUDIT-V10.md` |
| V11 | ~650 findings | `CHRONICLE-AUDIT-V11.md` |
| V12 | ~200 issues (114 categories) | `CHRONICLE-AUDIT-V12.md` |

---

## V5–V8 Fixes Applied & Verified

These were committed in `78b7cff` and verified by V9 audit:

| Fix | Status |
|-----|--------|
| `TODAY.getTime()` → `TODAY().getTime()` | ✅ Verified |
| Calendar fallbacks (empty array default) | ✅ Verified |
| `pick(rng, array)` second argument fix | ✅ Verified |
| `apiUpload` Content-Type header | ✅ Verified |
| Infinite query key cursor fix | ✅ Verified |
| `.sort()` copy mutation fix | ✅ Verified |
| Route guards (protected routes) | ✅ Verified |
| Multiple `@ts-ignore` removed | ✅ Verified |
| `use-auth.ts` stale user data cache cleared | ✅ Verified |
| PremiumButton light mode fix | ✅ Verified |
| CommandPalette "undefined" fix | ✅ Verified |
| CSV import fixes | ✅ Verified |
| CDN SRI hashes | ✅ Verified |
| Backend rate limiting | ✅ Verified |
| Email normalization | ✅ Verified |
| Library soft-delete | ✅ Verified |
| Calendar/Memory hardcoded data cleared | ✅ Verified |
| Memory component migrations | ✅ Verified |

---

## V9 Audit Findings

**Report:** `CHRONICLE-AUDIT-V9.md` (~420 findings from 10 sub-agents)

### Key Categories
- **Pagination Bug:** `hasMore` always false in multiple services
- **Auth Guard Missing:** Analytics/media endpoints unprotected
- **Schema Desync:** Prisma schema vs DB migration mismatch
- **Mock Data/CDN:** 52+ external image URLs
- **Design Token Bypass:** 438 oklch, 120 rgba, 59 rounded, 75 shadow, 504 text-[...], 318 tracking-[...]
- **Accessibility:** 30+ issues (missing aria-labels, alt text, reduced-motion)
- **Empty Stubs:** 22+ components returning null/empty
- **Type Safety:** 37+ `any` casts
- **Console Logs:** 27 in production
- **Empty Catch Blocks:** 4

---

## V10 Audit Findings

**Report:** `CHRONICLE-AUDIT-V10.md` (~500 findings from 10 sub-agents)

### Key Categories
- Same critical issues as V9 plus deeper analysis
- **N+1 Queries:** `analytics.repository.ts` sequential loops (lines 85–98, 191–215)
- **Token Refresh Race:** TOCTOU in `fetch.ts` (line 125)
- **Double Retry:** 6 attempts for 429 errors (query-client.ts + fetch.ts)
- **SSR Crash:** `use-theme.ts` module-level `document.documentElement` (lines 3–6)
- **Zustand Stale Hydration:** `libraryStore.ts`
- **Hardcoded Year:** `adapters.ts` always returns 2024

---

## V10 Fixes Applied

Committed in `a945fdb`:

| Fix | File | Status |
|-----|------|--------|
| Removed `deletedAt: null` from queries | JournalEntry, TimelineEvent, AnalyticsSnapshot | ✅ |
| `ActivityType` mapping (WATCH/READ/PLAY/LISTEN/LEARN) | `interaction.repository.ts` | ✅ |
| Removed `currentModule` from progress updates | `progress.service.ts` | ✅ |
| Implemented `getCalendarDay()` with real DB queries | `analytics.service.ts` | ✅ |
| Implemented `calculateCompletionStreak()` using activity data | `analytics-aggregation.service.ts` | ✅ |
| Added `countFavorites()` to library repository | `library.repository.ts` | ✅ |
| Added `deletedAt` field to 8 User* models | `schema.prisma` | ✅ |
| Fixed sort mutation in `adapters/analytics.ts` | `.sort()` now works on copy | ✅ |
| Fixed `shortcuts.ts` useEffect dependency | `shortcuts.ts` | ✅ |
| Moved `ItemActionBar` outside `Link` in `MediaCard` | `MediaCard.tsx` | ✅ |

---

## V11 Audit Findings

**Report:** `CHRONICLE-AUDIT-V11.md` (~650 findings from 10 sub-agents)

### Critical Issues
| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | Pagination `hasMore` always false | CRITICAL | 10 services |
| 2 | Auth guard missing | HIGH | analytics/media/storage controllers |
| 3 | Schema desync (Cascade vs Restrict) | HIGH | schema.prisma vs migration |
| 4 | `search()` uses `startsWith` | MEDIUM | media.repository.ts |
| 5 | Timezone bugs | MEDIUM | analytics.repository.ts |

### High Priority
| # | Issue | Location |
|---|-------|----------|
| 6 | `MEDIA: any[] = []` root cause | `types.ts:96` — 30+ downstream features empty |
| 7 | `any` types throughout | 37+ locations |
| 8 | `longestStreak` hardcoded to 0 | `analytics-aggregation.service.ts:105` |
| 9 | `favoriteCount` hardcoded to 0 | `library-statistics.service.ts` |
| 10 | `loginAttempts` Map no TTL | `auth.service.ts:18` |

### Medium Priority
| # | Issue | Details |
|---|-------|---------|
| 11 | Mock Data/CDN | 52+ URLs across 14 files |
| 12 | Design Token Bypass | 438 oklch, 120 rgba, 59 rounded, 75 shadow |
| 13 | Accessibility | 30+ issues |
| 14 | Empty Catch Blocks | 4 |
| 15 | Console Logs | 27 in production |
| 16 | `as any` casts | 37+ |
| 17 | Missing Error Boundaries | 15 routes |
| 18 | Empty Stub Components | 22+ |

---

## V12 Audit Findings

**Report:** `CHRONICLE-AUDIT-V12.md` (~200 issues, 114 categories)

### Critical (Must Fix)
| # | Issue | Impact | Services |
|---|-------|--------|----------|
| 1 | Pagination `hasMore` always false | Infinite scroll never loads next page | 10 services (interaction.repository.ts, search.repository.ts use `take: limit` instead of `take: limit + 1`) |
| 2 | Auth guard missing on controllers | User data accessible without auth | analytics.controller.ts, media.controller.ts, storage.controller.ts |
| 3 | Schema desync | FK constraints differ from schema | 12+ FK mismatches |
| 4 | `search()` uses `startsWith` | Search only matches prefix | media.repository.ts (NOTE: actually uses `contains` — audit may have been stale) |
| 5 | Timezone bugs | Calendar off by day | analytics.repository.ts:352, analytics-aggregation.service.ts:85–98 |

### High Priority
| # | Issue | Location |
|---|-------|----------|
| 6 | `MEDIA` empty array | `types.ts:96` — 30+ features empty |
| 7 | `any` types | 37+ locations |
| 8 | `longestStreak` hardcoded to 0 | `analytics-aggregation.service.ts:105` |
| 9 | `favoriteCount` hardcoded to 0 | `library-statistics.service.ts` |
| 10 | `loginAttempts` no TTL | `auth.service.ts:18` |
| 11 | `verifyDownloadToken`/`verifyUploadToken` never called | `storage.controller.ts` |
| 12 | N+1 queries | `analytics.repository.ts:85–98, 191–215` |

### Pagination Bug — Root Cause
```
// interaction.repository.ts — BUGGY
take: limit,          // Fetches exactly `limit` items

// interaction.service.ts
const hasMore = items.length > limit;  // Always false!

// FIX: Fetch limit + 1
take: limit + 1,      // Fetches one extra to detect if more exist
```

**Affected methods in `interaction.repository.ts`:**
- `findFavorites` (line 145)
- `findBookmarks` (line 181)
- `findWithReviews` (line 222)
- `findHistory` (line 260)

**Affected methods in `search.repository.ts`:**
- `searchLibrary` (line 54)
- `searchMedia` (line 117)
- `searchJournal` (line 179)
- `searchCollections` (line 214)
- `searchMemories` (line 249)
- `searchQuotes` (line 285)
- `searchHighlights` (line 320)
- `searchShelves` (line 355)
- `searchTimeline` (line 390)
- `recordSearch` (line 441) — may not need fix

---

## Critical Issues Still Open

### Must Fix Before Production

| # | Issue | Severity | Files |
|---|-------|----------|-------|
| 1 | Pagination `hasMore` always false | CRITICAL | `interaction.repository.ts` (4 methods), `search.repository.ts` (9 methods) |
| 2 | Auth guards missing | HIGH | `media.controller.ts`, `storage.controller.ts` |
| 3 | Schema desync (Cascade vs Restrict) | HIGH | `schema.prisma` + migration |
| 4 | `longestStreak` hardcoded to 0 | MEDIUM | `analytics-aggregation.service.ts:105` |
| 5 | `favoriteCount` hardcoded to 0 | MEDIUM | `library-statistics.service.ts` |
| 6 | Token refresh TOCTOU race | MEDIUM | `fetch.ts:125–128` |
| 7 | `anySignal` memory leak | MEDIUM | `fetch.ts:229–238` |
| 8 | `register()` doesn't store token | MEDIUM | `api/auth.ts:40–42` |
| 9 | SSR URL hardcoded | MEDIUM | `api/constants.ts:1` |
| 10 | `use-theme.ts` SSR crash | MEDIUM | `use-theme.ts:3–6` |
| 11 | Zustand stale hydration | MEDIUM | `libraryStore.ts` |
| 12 | `analytics-tracker.ts` no SSR guard | MEDIUM | `analytics-tracker.ts:10–11` |
| 13 | CDN script injection (XSS) | MEDIUM | `app.wrapped.tsx:35–41` |
| 14 | N+1 queries | MEDIUM | `analytics.repository.ts:85–98, 191–215` |

### Should Fix (Quality)

| # | Issue | Count |
|---|-------|-------|
| 15 | Mock Data/CDN URLs | 52+ across 14 files |
| 16 | Design token bypass | 438 oklch, 120 rgba, 59 rounded, 75 shadow, 504 text-[...], 318 tracking-[...] |
| 17 | Accessibility issues | 30+ |
| 18 | Empty stub components | 22+ |
| 19 | Console logs in production | 27 |
| 20 | `as any` casts | 37+ |
| 21 | Missing error boundaries | 15 routes |
| 22 | Empty catch blocks | 4 |

### Nice to Have (Polish)

| # | Issue | Count |
|---|-------|-------|
| 23 | `alert()` in production | 2 (app.wrapped.tsx) |
| 24 | Synthetic KeyboardEvent (no-op) | 1 (app.search.tsx) |
| 25 | Hardcoded year 2024 | 3 (adapters.ts) |
| 26 | Double retry (6 attempts) | 1 (query-client.ts + fetch.ts) |
| 27 | `undefined as T` for 204 | 1 (fetch.ts:122) |
| 28 | `use-mobile.tsx` layout shift | 1 |
| 29 | `shortcuts.ts` drops function values | 1 |
| 30 | `error-capture.ts` returns undefined | 1 |
| 31 | `shareCard.ts` identical ternary | 1 |
| 32 | `creatorEngine.ts` fake hours | 1 |

---

## All Affected Files

### Backend — Critical
| File | Issues |
|------|--------|
| `apps/backend/src/interaction/interaction.repository.ts` | Pagination bug (4 methods: `take: limit` → `take: limit + 1`), remove `.slice(0, limit)` |
| `apps/backend/src/search/search.repository.ts` | Pagination bug (9 methods: `take: limit` → `take: limit + 1`) |
| `apps/backend/src/media/media.controller.ts` | No auth guard on any endpoint |
| `apps/backend/src/storage/storage.controller.ts` | `verifyDownloadToken`/`verifyUploadToken` never called; `any` file types |
| `apps/backend/src/analytics/analytics.controller.ts` | `pageview` and `health` endpoints unguarded |
| `apps/backend/prisma/schema.prisma` | Schema says CASCADE but DB has RESTRICT (migration desync) |
| `apps/backend/src/analytics/analytics-aggregation.service.ts` | `longestStreak` hardcoded to 0 (line 105); `documentary` mediaType (line 46) |
| `apps/backend/src/library/library-statistics.service.ts` | `favoriteCount` hardcoded to 0 |

### Backend — High
| File | Issues |
|------|--------|
| `apps/backend/src/analytics/analytics.repository.ts` | N+1 queries (85–98, 191–215); timezone bugs (352, 388–440) |
| `apps/backend/src/analytics/streak.service.ts` | `calculateCompletionStreak()` partially fixed in V10 |
| `apps/backend/src/interaction/interaction.repository.ts` | `ActivityType` fixed in V10 (maps to WATCH/READ/PLAY/LISTEN/LEARN) |
| `apps/backend/src/library/library.repository.ts` | `countFavorites()` added in V10 |
| `apps/backend/src/library/library.service.ts` | `IN_PROGRESS` invalid enum (103); `mediaType` defaults to `'movie'` (140); `startedAt` not set on active transitions |
| `apps/backend/src/journal/journal.service.ts` | `hasMore` always false (66–67, 154–155, 217–218, 264–265, 335–336); timeline cursor mismatch (198) |
| `apps/backend/src/wrapped/wrapped.service.ts` | Hardcoded zeros (105–117); `sharePayload` 3 shapes (142–146) |
| `apps/backend/src/wrapped/wrapped-generator.service.ts` | `totalHours` not output (32); `sortOrder: 9` duplicated (90); broken pluralization (122) |
| `apps/backend/src/auth/services/refresh-token.service.ts` | `revokeAllByUser` doesn't delete from DB (98–104) |
| `apps/backend/src/auth/auth.service.ts` | `loginAttempts` Map has no TTL cleanup (18) |

### Backend — Medium
| File | Issues |
|------|--------|
| `apps/backend/src/settings/settings.controller.ts` | Returns hardcoded timezone data |
| `apps/backend/src/media/media.repository.ts` | Search uses `contains` (correct — audit may have been stale) |

### Frontend — Critical
| File | Issues |
|------|--------|
| `src/lib/types.ts:96` | `MEDIA: any[] = []` — root of 30+ empty features |
| `src/lib/api/fetch.ts` | Token refresh TOCTOU race (125–128); `anySignal` memory leak (229–238); `undefined as T` for 204 (122) |
| `src/lib/api/auth.ts` | `register()` doesn't store token (40–42) |
| `src/lib/api/constants.ts` | SSR URL hardcoded `http://api:3000/api` (1) |
| `src/hooks/use-theme.ts` | Module-level `document.documentElement` crashes SSR (3–6) |
| `src/lib/analytics-tracker.ts` | `document.title`/`navigator.sendBeacon` without SSR guard (10–11, 17) |

### Frontend — High
| File | Issues |
|------|--------|
| `src/lib/library.ts` | `ALL_LIBRARY = []` (43); `trendFor()` null (124–126); `smartInsights()` empty (135–137) |
| `src/lib/memory.ts` | `COLLECTIONS = []`, `JOURNAL = []` (5–6) |
| `src/lib/goals.ts` | `GOALS_FULL = []` (37); `getGoalInsights()` empty (45–47) |
| `src/lib/achievements.ts` | `ACHIEVEMENTS_FULL = []` (32); `getAchievementsByCategory()` returns `{}` (41–43) |
| `src/lib/challenges.ts` | `CHALLENGES = []` (27) |
| `src/lib/memoryInsights.ts` | 8 empty arrays |
| `src/lib/lifeChapters.ts` | `getLifeChapters()` returns `[]` (13–14) |
| `src/lib/collectionWorkspace.ts` | Empty stub |
| `src/lib/collectionInsights.ts` | Empty stub |
| `src/lib/error-capture.ts` | `reportError()` returns `undefined` (62–64) |
| `src/lib/shareCard.ts` | Both ternary branches identical (26–30) |
| `src/lib/shortcuts.ts` | `JSON.stringify(map)` drops function values (60) |
| `src/lib/store/libraryStore.ts` | `SEED_META` unused (97); `deriveDefault()` unused (99–104) |
| `src/lib/api/adapters.ts` | Hardcoded `year: 2024` (37, 57, 79) |
| `src/lib/api/query-client.ts` | Double retry = 6 attempts for 429 |
| `src/lib/hooks/use-mobile.tsx` | Returns `false` first render — layout shift (18) |
| `src/lib/adapters/status.ts` | `adaptStatusToBackend` maps `in_progress` to `WATCHING` for all types (31–42) |

### Frontend — Routes
| File | Issues |
|------|--------|
| `src/routes/app.calendar.tsx` | `CALENDAR_YEAR` and `MEDIA` empty stubs (13–14); `Story 1`/`Story 2` placeholders |
| `src/routes/app.timeline.tsx` | Journey stats hardcoded 312/4/38412 (287–301); editorial highlights `{[].map(...)}` (249) |
| `src/routes/app.search.tsx` | Synthetic KeyboardEvent does nothing; empty stub (10–14) |
| `src/routes/app.wrapped.tsx` | CDN script injection for html2canvas (35–41); `alert()` (38, 41); only 5 generic slides |
| `src/routes/app.analytics.tsx` | Range/scope filters cosmetic (95–96); all deltas `0` (167–173); genre bar ÷ 2 (502) |
| `src/routes/app.library.all.tsx` | `ALL_LIBRARY` empty (27); sort by progress not hours (56); `Math.random()` (64) |
| `src/routes/app.library.completed.tsx` | "Recent" sort no-op (22) |
| `src/routes/app.characters.index.tsx` | `.items` should be `.data` (11) |
| `src/routes/app.import.tsx` | CSV dropped/archived → `in_progress` (99–108) |
| `src/routes/app.collections.$id.tsx` | Edit/Share stubs; Save no onClick (180–188) |
| `src/routes/app.collections.index.tsx` | `<RelatedJourney mediaId="interstellar" />` hardcoded (102) |
| `src/routes/pricing.tsx` | `navigate({ to: "/app/settings/email-capture" as any })` (74) |
| `src/routes/auth.forgot-password.tsx` | setTimeout simulates API (19–26) |
| `src/routes/app.settings.tsx` | 5 timezone / 4 language options hardcoded (108–119); notifications dead placeholder |
| `src/routes/app.onboarding.tsx` | localStorage only, no server persistence (33) |
| `src/routes/app.achievements.tsx` | ComingSoon placeholder |
| `src/routes/app.goals.tsx` | ComingSoon placeholder |
| `src/routes/app.tags.$tag.tsx` | Empty stub |
| `src/routes/app.recently-finished.tsx` | No sort logic |
| `src/routes/app.bookmarks.tsx` | Missing `useMemo` |

### Frontend — CDN/Mock Data (52+ URLs)
| File | CDN URLs |
|------|----------|
| `src/components/auth/AuthStage.tsx` | 11 TMDB URLs (232–246) |
| `src/components/auth/MobileMemoryHero.tsx` | 2 TMDB URLs (13–14) |
| `src/components/landing/LivingHero.tsx` | 5 CDN URLs (9–43) |
| `src/components/landing/DashboardShowcase.tsx` | Hardcoded backdrops (18–46) |
| `src/components/landing/CrossPlatform.tsx` | TMDB/IGDB URLs (5–7) |
| `src/components/landing/MemoryCapsule.tsx` | TMDB/Unsplash URLs (4–22) |
| `src/components/landing/CollectionsPreview.tsx` | 4 Unsplash URLs (4–7) |
| `src/components/landing/UniversalMediaShowcase.tsx` | 10 Unsplash URLs (31–121) |
| `src/components/discovery/ComfortStories.tsx` | 4 Unsplash URLs; fake rewatchCount |
| `src/components/discovery/SeasonalRecommendations.tsx` | Hardcoded to winter; `data` typed `any` |
| `src/components/collections/CollectionTimeline.tsx` | 8 of 10 events fabricated |
| `src/components/collections/CollectionStory.tsx` | Fabricated narrative text (7–9) |
| `src/components/challenges/JourneyTracker.tsx` | All 6 steps hardcoded |

### Frontend — Design Token Bypass (Top Offenders)
| File | oklch Count |
|------|-------------|
| `src/components/auth/AuthStage.tsx` | 58 |
| `src/routes/app.analytics.tsx` | 29 |
| `src/components/auth/MobileMemoryHero.tsx` | 14 |
| `src/components/hero/CinematicHero.tsx` | 13 |
| `src/components/journey/MemoryMap.tsx` | 13 |
| `src/components/ui/PremiumGlass.tsx` | 10 |
| `src/routes/app.journal.tsx` | 10 |
| `src/components/atmosphere/AtmosphereBackground.tsx` | 10 |

### Frontend — Accessibility
| Issue | Count |
|-------|-------|
| `alt=""` on meaningful images without `aria-hidden` | 20+ |
| Interactive elements missing `aria-label` | 10+ |
| Sort buttons missing `aria-pressed` | Multiple |
| Components missing reduced-motion support | 16 |
| `prefers-reduced-motion` in components | 0 |
| `motion-safe:animate-*` usage | 1 (PosterCard.tsx only) |
| Non-interactive divs with `cursor-pointer` | Multiple |
| Form inputs without labels | Multiple |
| Nested interactive elements (button inside link) | Multiple |

### Frontend — Null Stubs (22+)
StoryJourney, EmotionJourney, CharactersYouLoved, WhyItWorked, LifeContext, SimilarMemories, EditorialStats, CompanionStories, DiscussionNotes, RewatchIntelligence, CompletionReflection, SessionHistory, MediaRelationships, FavoriteMoments, StoryDNA, StoryUniverse, StoryImpact, PersonalStatements, ThisWeekHistory, RememberAgain, OnThisDay, IdentityHero, MediaDNA, MemoryCapsules, QuoteGallery, RelationshipPanel

### Frontend — Hardcoded Intelligence Components
| File | Issue |
|------|-------|
| `src/components/intelligence/MemoryDNA.tsx` | All radar values hardcoded (20–50) |
| `src/components/intelligence/LibraryMap.tsx` | All genre counts/colors hardcoded (11–16) |
| `src/components/intelligence/MediaEvolution.tsx` | All year/genre values hardcoded |
| `src/components/intelligence/LifeSoundtrack.tsx` | Album/artist/hours hardcoded |
| `src/components/intelligence/RelatedJourney.tsx` | Ternary always "Then" (12) |

### Frontend — Other
| File | Issues |
|------|--------|
| `src/components/media/PosterCard.tsx` | Favorite button inside Link (128–141) |
| `src/components/media/ItemActionBar.tsx` | Identical ternary (260); hardcoded shadows |
| `src/components/ui/PremiumButton.tsx` | oklch hardcoded sheen/glow |
| `src/components/ui/PremiumGlass.tsx` | Interactive no keyboard handlers (96–98); hardcoded oklch |
| `src/components/landing/AnalyticsPreview.tsx` | `Math.random()` in render (144) |
| `src/lib/creatorEngine.ts` | `totalHours: works.length * 14` (80) |
| `src/lib/franchiseEngine.ts` | Hardcoded IDs — all fail |
| `src/lib/museumEngine.ts` | Hardcoded IDs — all fail |
| `src/lib/characters.ts` | Hardcoded IDs — all fail |
| `src/lib/collectionRelationships.ts` | Hardcoded static labels (13–22) |

### Schema
| File | Issues |
|------|--------|
| `apps/backend/prisma/schema.prisma` | Schema says Cascade but DB has Restrict (12+ FKs); JournalEntry/TimelineEvent/AnalyticsSnapshot lack `deletedAt`; 6 media models lack `deletedAt`; User models lack `verificationToken`; no index on `JournalEntry.eventDate`; `UserTvShow.lastInteractionAt` lacks index; `UserMovie.liked` nullable inconsistently; no full-text search index |
| `apps/backend/prisma/migrations/20260721005559_fix_media_cascade_restrict/` | Changed FKs to RESTRICT but schema still says Cascade |

---

## Next Steps

### V13 Priority
1. Fix pagination `hasMore` bug in `interaction.repository.ts` (4 methods) and `search.repository.ts` (9 methods)
2. Add auth guards to `media.controller.ts` and `storage.controller.ts`
3. Fix schema desync (update schema to RESTRICT or create new migration)
4. Fix `longestStreak` and `favoriteCount` hardcoded values
5. Add TTL cleanup to `loginAttempts` Map
6. Fix `register()` to store token
7. Fix `use-theme.ts` SSR crash
8. Add SSR guards to `analytics-tracker.ts`

### V14 Priority
1. Replace CDN URLs with local images or API data
2. Fix design token compliance (438 oklch, 120 rgba, etc.)
3. Add accessibility improvements (aria-labels, alt text, reduced-motion)
4. Remove console logs
5. Fix `any` types

### V15+ Priority
1. Implement or remove 22+ empty stub components
2. Add error boundaries to 15 routes
3. Fix nested interactive elements
4. Add loading skeletons
5. Add entrance animations
6. Implement keyboard shortcuts properly
