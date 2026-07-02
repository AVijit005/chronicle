# RC Engineering: Refactor Mock Data with UI Preservation

The goal of this phase is to eliminate all dependencies on `mock.ts`, `analytics-mock.ts`, and `seed.ts` by connecting the frontend directly to the production backend APIs, while STRICTLY preserving the premium UI hierarchy.

## User Review Required

> [!IMPORTANT]
> **No UI Destruction Mandate**: Unlike the previous approach, we will NEVER replace an entire premium component (e.g., a card, a timeline, a chart) with a generic `<PremiumEmptyState />`.
> If backend data is missing for a specific section, the component will retain its layout, glassmorphism, animations, and typography. The "empty state" will be rendered *within* the beautiful container, preserving the overall page structure.

## Proposed Changes

### 1. Identify Backend Gaps
We will identify which components rely on data that the backend currently lacks (e.g., `timeline`, `stats`, `memory` for media details).

### 2. Surgical Data Source Replacement
For each component importing mock data:
- **Available Data**: Swap the mock import with the corresponding React Query hook (e.g., `useMedia`, `useCollections`). Use adapter functions to map the API response to the expected component props where possible.
- **Unavailable Data**: Remove the mock import. Keep the component's outer shell (the `motion.div`, the glassmorphism classes, headers, icons). Replace the inner `.map()` or content rendering with a styled "Unavailable" message that fits seamlessly into the existing premium design.

### 3. Gradual Deletion
We will process files in batches, verifying functionality as we go.
Once zero imports of `mock.ts`, `analytics-mock.ts`, and `seed.ts` remain, we will delete these files along with their dependent mock engines.

## Verification Plan

### Automated Tests
- Run `npm run build` to verify no type errors or missing imports.
- `grep` to ensure zero instances of `@/lib/mock`, `@/lib/analytics-mock`, and `@/lib/seed`.

### Manual Verification
- Visual inspection of components that were modified to ensure the outer container (glassmorphism, padding, layout) remains intact when data is missing.
