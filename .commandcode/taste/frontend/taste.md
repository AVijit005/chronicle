# frontend
- Never create duplicate component implementations (e.g., two CinemaHero, two FavoriteMoments). Merge into canonical versions instead. Confidence: 0.70
- All frontend data fetching must use React Query hooks from a centralized API client, not direct mock data. Confidence: 0.85
- Every page must handle loading, error, empty, and offline states before connecting to real API. Confidence: 0.70
- ComingSoon placeholders should be replaced with functional implementations before public release. Confidence: 0.70
- Create a barrel export (index.ts) for every new component directory with named re-exports. Confidence: 0.70
- Keep route files as thin orchestrators — retain state and memo derivation but delegate all rendering to extracted components. Confidence: 0.70
- Interactive glass components (chips, pills, cards) must use premium glass standard: glass-subtle base, hover:-translate-y-0.5, hover:border-white/20, OkLCH glow shadow, active:scale-95, cursor-pointer — not just plain bg-white/[0.05]. Confidence: 0.75
- Avoid hover:bg-white/[0.03] micro-glass effects on small text/label items like Fact rows — keep hover transitions subtle (text color only) without background changes. Confidence: 0.70
