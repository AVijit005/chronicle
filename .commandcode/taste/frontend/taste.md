# frontend
- Never create duplicate component implementations (e.g., two CinemaHero, two FavoriteMoments). Merge into canonical versions instead. Confidence: 0.70
- All frontend data fetching must use React Query hooks from a centralized API client, not direct mock data. Confidence: 0.85
- Every page must handle loading, error, empty, and offline states before connecting to real API. Confidence: 0.70
- ComingSoon placeholders should be replaced with functional implementations before public release. Confidence: 0.70
- Create a barrel export (index.ts) for every new component directory with named re-exports. Confidence: 0.70
- Keep route files as thin orchestrators — retain state and memo derivation but delegate all rendering to extracted components. Confidence: 0.70
