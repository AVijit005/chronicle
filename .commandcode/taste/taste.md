# architecture
- For all new implementation work, start with a shared types package before connecting frontend to backend. Confidence: 0.70
- Delete ~97 dead/deprecated component files before adding new code. Confidence: 0.70
- Create a single canonical API client with React Query before connecting any frontend page to the backend. Confidence: 0.85

# database
- Fix the 45 redundant indexes on user-media junction tables (remove standalone `@@index([status])`, `@@index([favorite])`, `@@index([lastInteractionAt])` patterns). Confidence: 0.70
- Change cascade deletes from media entities to user junction tables to `Restrict` or `SetNull` to prevent data loss on media deletion. Confidence: 0.70
- Add `ON_HOLD` to DTO STATUS_VALUES array to match Prisma schema enum. Confidence: 0.80

# backend
- Never make endpoints that bypass the global exception filter with manual `res.status().json()`. Confidence: 0.70
- Always add ownership checks for storage deletion operations. Confidence: 0.70
- Add cursor pagination to `GET /collections` and `GET /shelves` before any frontend integration. Confidence: 0.70
- Create proper DTO validation classes for analytics, wrapped generate, and storage endpoints. Confidence: 0.70

# frontend
See [frontend/taste.md](frontend/taste.md)

# typescript
- useReducedMotion() returns boolean | null — always use ?? false fallback before passing to components expecting boolean. Confidence: 0.70
- Replace dangerouslySetInnerHTML style blocks with CSS custom properties set via inline style prop. Confidence: 0.70
- Replace unsafe `as any` type casts with proper adapter functions that bridge incompatible types (e.g., RecentActivityItem → ContinueItem → UIMediaItem). Confidence: 0.70

# quality
- Apply "billion dollar SaaS" polish standard: every UI interaction needs proper hover/active/focus states, glass morphism with OkLCH glows, smooth transitions, and production-grade error/empty/loading handling. Confidence: 0.70

# workflow
- Run 'npx tsc --noEmit' after each phase of refactoring to verify TypeScript compilation. Confidence: 0.85
- When the user asks you to fix pre-existing TypeScript errors before continuing, solve all of them immediately — don't dismiss them as "pre-existing" and move on. Confidence: 0.75
- Before implementing a new feature or capability, verify what existing infrastructure already exists (theme classes, CSS variables, utility modules) to avoid duplicating work. Confidence: 0.60
