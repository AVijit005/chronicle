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
- Never create duplicate component implementations (e.g., two CinemaHero, two FavoriteMoments). Merge into canonical versions instead. Confidence: 0.70
- All frontend data fetching must use React Query hooks from a centralized API client, not direct mock data. Confidence: 0.85
- Every page must handle loading, error, empty, and offline states before connecting to real API. Confidence: 0.70
- ComingSoon placeholders should be replaced with functional implementations before public release. Confidence: 0.70
