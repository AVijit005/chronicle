# Chronicle — P0 Beta Blocker Improvements

**Status:** Ready to Execute
**Priority:** Critical (must ship before beta)
**Created:** 2026-07-21

---

## Why This Document Exists

The deep quality audit scored Chronicle at **8.2/10** — visually premium but missing defensive engineering that separates "cool demo" from "product I'd trust with my data." These are the 5 things that **must** be fixed before beta launch.

---

## P0.1: Kill All Dead Links

**Problem:** Footer has 3x `href="#"` links. Auth page has `href="#"` on "Forgot password?" and "Terms"/"Privacy". These are broken links that damage trust.

**Fix:**

| Location | Current | Replacement |
|----------|---------|-------------|
| `src/routes/index.tsx` footer — Privacy | `href="#"` | `href="/privacy"` |
| `src/routes/index.tsx` footer — Terms | `href="#"` | `href="/terms"` |
| `src/routes/index.tsx` footer — Press | `href="#"` | `mailto:press@chronicle.app` |
| `src/routes/auth.tsx` — Forgot password | `href="#"` | `href="/auth/forgot-password"` |
| `src/routes/auth.tsx` — Terms link | `href="#"` | `href="/terms"` |
| `src/routes/auth.tsx` — Privacy link | `href="#"` | `href="/privacy"` |

**Acceptance:** `grep -r 'href="#"' src/` returns zero results in these files.

---

## P0.2: Add Error Boundaries on Dashboard and Analytics

**Problem:** One component crash takes down the entire shell. No error boundary exists anywhere in the app (verified via grep).

**Fix:** Create `src/components/common/ErrorBoundary.tsx` with React class-based error boundary. Wrap:
1. `<Outlet />` in `src/routes/app.tsx` (catches any child crash)
2. Chart containers in `src/routes/app.analytics.tsx` (recharts is fragile)
3. Dashboard sections in `src/routes/app.index.tsx`

**Error boundary behavior:**
- Catches render errors
- Shows a soft "Something went wrong" card with retry button
- Logs error to console (Sentry integration is P2)
- Does NOT unmount the entire page

**Acceptance:** `grep -r 'ErrorBoundary' src/` returns hits in app.tsx, app.analytics.tsx, app.index.tsx.

---

## P0.3: Add ARIA Labels to Charts

**Problem:** All 3 chart containers (AreaChart, PieChart, BarChart) have zero accessibility. Screen readers see meaningless `<svg>` elements. This is WCAG 2.1 AA non-compliance — legal liability.

**Fix:** Add `role="img"` and `aria-label` to every `<ResponsiveContainer>` wrapper:

| Chart | ARIA Label |
|-------|-----------|
| Monthly activity AreaChart | `aria-label="Monthly activity chart showing stories completed over time"` |
| Media distribution PieChart | `aria-label="Pie chart showing distribution of media types in library"` |
| Genre analysis bars | `aria-label="Bar chart showing time spent per genre"` |

**Acceptance:** `grep -r 'role="img"' src/routes/app.analytics.tsx` returns 3+ hits.

---

## P0.4: Fix Social Proof

**Problem:** Auth page shows 4 colored circles as "avatars" with fake count "Joined by 12,400 chroniclers". Colored circles look fake and damage trust.

**Fix:** Replace the colored circles with initials-based avatars and remove the fake count. Replace with:
- Show 4 initials: "A", "K", "M", "S" (generic)
- Change text from "Joined by 12,400 chroniclers" to "Trusted by thousands of chroniclers"

**Acceptance:** No `AVATAR_COLORS` array in auth.tsx. No "12,400" string.

---

## P0.5: Add Password Show/Hide Toggle

**Problem:** Password fields have no visibility toggle. Users can't verify what they typed. This is a basic UX expectation in 2026.

**Fix:** Add an eye/eye-off icon toggle to all password `BottomBorderInput` instances:
1. Sign-in password field
2. Sign-up password field
3. Sign-up confirm password field

Toggle state: local `useState<"password" | "text">` per field. Icon: `Eye` / `EyeOff` from lucide-react.

**Acceptance:** `grep -r 'Eye' src/routes/auth.tsx` returns hits. Password fields toggle between `type="password"` and `type="text"`.

---

## File Manifest

| File | Action |
|------|--------|
| `src/components/common/ErrorBoundary.tsx` | **CREATE** — new error boundary component |
| `src/routes/index.tsx` | **EDIT** — fix footer dead links |
| `src/routes/auth.tsx` | **EDIT** — fix dead links, fix social proof, add password toggle |
| `src/routes/app.tsx` | **EDIT** — wrap Outlet in ErrorBoundary |
| `src/routes/app.analytics.tsx` | **EDIT** — wrap charts in ErrorBoundary, add ARIA labels |
| `src/routes/app.index.tsx` | **EDIT** — wrap dashboard sections in ErrorBoundary |

---

## CI Assertions (Machine Proof)

After all changes, these commands must pass:

```bash
# No dead links remain
! grep -r 'href="#"' src/routes/index.tsx src/routes/auth.tsx

# Error boundary exists and is used
grep -r 'ErrorBoundary' src/components/common/ErrorBoundary.tsx
grep -r 'ErrorBoundary' src/routes/app.tsx
grep -r 'ErrorBoundary' src/routes/app.analytics.tsx
grep -r 'ErrorBoundary' src/routes/app.index.tsx

# Charts have ARIA
grep -c 'role="img"' src/routes/app.analytics.tsx  # >= 3

# Social proof is honest
! grep -r '12,400' src/routes/auth.tsx
! grep -r 'AVATAR_COLORS' src/routes/auth.tsx

# Password toggle exists
grep -c 'Eye' src/routes/auth.tsx  # >= 2
```

---

## After P0: Score Projection

| Dimension | Before | After P0 |
|-----------|--------|----------|
| Visual Polish | 9/10 | 9/10 |
| Animation Quality | 8/10 | 8/10 |
| UX Quality | 7/10 | 8/10 |
| Accessibility | 5/10 | 7/10 |
| Premium Feel | 8/10 | 9/10 |
| **Overall** | **8.2/10** | **8.6/10** |

---

## Next Steps (P1 — Post-Beta)

After P0 ships, tackle these in order:
1. Skeleton-to-content crossfade (AnimatePresence)
2. Wrapped keyboard navigation (arrow keys + escape)
3. Fix `as any` type casts in analytics
4. Scroll progress indicator on long pages
5. Remove infinite pulse-glow on CTA
6. Mobile nav on landing page
7. Chart legends
8. Sidebar tooltips when collapsed
9. NProgress-style route loading bar
10. Dashboard section collapse/expand
