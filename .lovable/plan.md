# Chronicle Auth 3.0 — Cinematic Memory Portal

Scope: visual + motion refinement of `/auth` only. Two-column layout, palette, tokens, typography family, and login card location stay. No new routes, no backend, no new deps.

## Files touched

1. `**src/components/auth/AuthStage.tsx**` — full rewrite into a `LivingMemoryWall` composition.
2. `**src/components/auth/MemoryQuote.tsx**` *(new)* — slow cross-fading editorial quotes.
3. `**src/components/auth/MemoryStats.tsx**` *(new)* — re-languaged stat cards w/ hover glow.
4. `**src/components/auth/FloatingInput.tsx**` — refine focus glow, icon brighten, error shake, success tick.
5. `**src/routes/auth.tsx**` — orchestrate staggered cinematic load sequence, tighten card spacing/rhythm; Google button gets soft shimmer-on-hover.

No changes to `src/styles.css` tokens, no new packages, no new colors. Motion uses existing `dur`, `ease`, `t` from `src/lib/motion.ts`.

## 1. Living Memory Wall (`AuthStage.tsx`)

Replace 6 cards with **22 layered memories** drawn from `MEDIA` (loop if needed).

```text
  layer 0 (bg)   layer 1 (mid)     layer 2 (fg)
   8 posters      10 posters         4 posters
   w=200-280     w=120-170         w=88-110
   blur 6-10px   blur 2-3px         blur 0
   opacity .25   opacity .55       opacity .9
   speed 1x      speed 2x           speed 3.5x
```

- Positions: deterministic pseudo-random (seeded by index) across a 140% × 140% canvas, anchored off-center so headline column breathes. No grid.
- Some posters partially cropped by edges (`overflow-hidden` on container, posters allowed to bleed).
- Each layer is its own `motion.div` with one shared parallax (`useMouseParallax`) scaled per depth — total max shift **8px**. No per-card cursor chase.
- Ambient drift: each layer animates `y` by ±6–10px over 18–28s loops, `ease.out`, infinite yoyo. Slightly different periods per layer to avoid sync.
- Reduced motion: disable drift + parallax, keep static composition.

### Atmosphere overlays (inside left panel, above wall, below text)

All pure CSS — zero JS, GPU-cheap:

- **Volumetric light**: one large `radial-gradient` blob, `mix-blend-mode: screen`, opacity .35, slow 40s drift via `@keyframes` already-OK or `motion` once-mounted.
- **Fog layer**: 2 stacked radial gradients, very low opacity.
- **Grain**: existing `AtmosphereBackground` already provides; add a local `.bg-noise` div at opacity .04 if needed.
- **Vignette**: `radial-gradient(ellipse at center, transparent 55%, oklch(0.12 0.02 270 / 0.55))`.
- **Bloom**: soft white radial near headline anchor, blend `screen`, opacity .12.
- Right-edge fade overlay stays.

## 2. Hero story block

Keep current headline copy verbatim. Refinements:

- Eyebrow "The portal" → letter-spacing 0.32em, opacity 0.85.
- Headline: increase line-height to 1.04, add `text-balance`, lift to 5xl/6xl (`xl:text-6xl`).
- Add 1px hairline divider under italic line, 56px wide, `bg-foreground/15`.
- Vertical rhythm: 32px between eyebrow→headline, 28px headline→quote, 40px quote→stats.

## 3. Memory Quote (`MemoryQuote.tsx`)

- Array of 5 quotes (those provided in prompt).
- `useEffect` interval 10s, cross-fade via `AnimatePresence` (opacity + 4px y), `dur.large`.
- Pause cycle when `prefers-reduced-motion`; show first quote only.
- Typography: italic, `text-[15px]`, `text-foreground/70`, max-w prose, leading-relaxed.

## 4. Memory Stats (`MemoryStats.tsx`)

Replace labels:

- 312 → **Stories That Stayed**
- 47 → **Days of Curiosity**
- 1,284 → **Hours Remembered**

Card refinements:

- Keep `glass`, `rounded-2xl`, `CountUp` number.
- Hover (framer `whileHover`): subtle ring `ring-1 ring-primary/25`, number color shifts to `text-foreground` from `text-foreground/90`, very soft inner glow via box-shadow. `dur.normal`.
- Spacing: `p-4`, number `text-2xl`, label `tracking-[0.2em]` uppercase 9px.

## 5. FloatingInput refinements

- Focus: existing ring stays; brighten icon (`text-primary/90`) and lift container `translate-y-[-1px]` over `dur.normal`.
- Placeholder fade already handled by floating label.
- Error: when `error` prop transitions to truthy, apply 1-shot horizontal shake (Framer `animate={{ x: [0,-4,4,-3,3,0] }}` once), gentle (≤4px).
- Success state: optional prop `success?: boolean` → green ring + tiny check icon fade-in (used by submit flow only).

## 6. Auth route load choreography

Use Framer `variants` with shared parent stagger (existing `stagger()`):

```text
0.00s  Atmosphere (already mounted)
0.10s  Memory Wall layers fade (per-layer cascade 0.06s)
0.55s  Eyebrow + headline blur-in
0.85s  Memory quote fade
1.05s  Stat cards stagger (3 × 0.08s)
0.30s  Card slides+blur in (parallel to wall, right column)
+0.25s Google button + tabs reveal
+0.15s Email form
```

All using existing `ease.out` / `dur.large`.

## 7. Google button

Add `group` class, on hover absolutely-positioned span sweeps `linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)` left→right, 900ms ease-out, opacity 0→1→0. Pure CSS keyframe gated to `:hover`.

## 8. Responsive

- Desktop ≥1024: full wall (22 posters).
- Tablet 640–1023: trim to 10 posters, parallax disabled, drift halved.
- Mobile <640: hide wall via `hidden lg:block` (already true on `AuthStage`). Add a single editorial blurred poster behind the card via `<picture>` with `AtmosphereBackground` for depth. No layered animation.

## 9. Accessibility

- `prefers-reduced-motion`: skip drift, parallax, shake, quote cycling.
- All decorative imagery `alt=""` + `aria-hidden`.
- Quote region `aria-live="polite"` so screen readers hear rotation only once per change.
- Maintain focus ring on tabs, inputs, buttons (existing classes).
- Headline structure: single `<h1>` per page (already true — the card uses h1; AuthStage uses h2). Keep that.

## 10. Performance

- No new canvas/WebGL.
- ≤22 `<img>` elements, all existing `MEDIA` posters (already cached).
- Animations on `transform`/`opacity`/`filter` only.
- `will-change-[transform,opacity]` on the three layer groups, not per card.
- Atmosphere overlays are static gradients, no per-frame JS.

## 11. Verification

- `bunx tsgo --noEmit` → 0 errors.
- Playwright capture desktop 1280×1800 + mobile 390×844 screenshots of `/auth`.
- Toggle reduced motion via Playwright emulation; verify drift/parallax off.
- Tab through form: focus visible on every interactive element.

## Out of scope

- No auth backend / Supabase wiring.
- No new routes or copy on other pages.
- No token/color/font edits.
- No CSS file edits unless a single `.bg-noise` utility is missing (will inline if so).

# Creative Direction Addendum (Important)

Before implementing anything above, remember that **Chronicle is NOT a movie tracker, anime tracker, reading tracker, or productivity dashboard.**

Chronicle is a **Memory Operating System**.

Every visual decision should reinforce that identity.

Whenever choosing between something that looks "modern" and something that feels "memorable", always choose the second.

---

## Design Philosophy

The Auth page should not feel like a SaaS login.

It should feel like entering a personal archive.

The experience should feel calm.

Quiet.

Elegant.

Intentional.

Timeless.

Almost museum-like.

The goal is not to impress with effects.

The goal is to make users feel emotionally connected before they even sign in.

---

## Memory Composition

The memory wall should never feel randomly generated.

Instead, it should feel hand-curated.

Use visual hierarchy.

Large memories.

Small memories.

Some close.

Some distant.

Some partially hidden.

Some softly blurred.

Some disappearing into darkness.

No perfect symmetry.

No visible grid.

No repeated rhythm.

The composition should feel like someone carefully arranged memories over many years.

---

## Memory Artifacts

Avoid making every floating object just another poster.

Introduce subtle memory artifacts.

Examples:

- a tiny handwritten note
- a highlighted quote card
- a bookmark sticking out of a book
- a journal fragment
- a date label
- a tiny rating chip
- a saved soundtrack waveform
- a chapter progress marker
- a favorite indicator

Very few.

Very subtle.

Never decorative.

Every artifact should imply that someone actually lived these stories.

---

## Organic Imperfection

Nothing should feel mathematically perfect.

Allow tiny imperfections.

Examples:

- slightly different rotations
- imperfect spacing
- uneven stacking
- cropped corners
- varying blur
- different lighting

Perfection feels artificial.

Small imperfections feel human.

---

## Motion Philosophy

Nothing should move simply because it can.

Every animation must communicate depth.

The scene should feel like a camera slowly drifting through memories.

Not floating cards.

Not UI elements.

Not decorative motion.

Background should barely move.

Foreground should move slightly more.

Text should remain almost perfectly stable.

Movement should create atmosphere, never distraction.

---

## Lighting Philosophy

Treat light like a cinematographer.

Do not illuminate everything equally.

Allow darkness.

Allow shadows.

Allow some memories to disappear into the atmosphere.

Allow bloom only where it helps guide attention.

Depth should come from light rather than color.

---

## Typography Philosophy

Treat typography like editorial design.

Every headline should feel manually composed.

Pay attention to:

- optical alignment
- balanced line breaks
- consistent rhythm
- generous whitespace
- breathing room

Typography should carry emotion without relying on animation.

---

## Emotional Storytelling

Replace generic UI feeling with emotional storytelling.

If possible, gradually reveal memory fragments instead of simply rotating text.

Examples:

Yesterday

Finished Interstellar

★★★★★

—

Two Months Ago

Completed One Piece

Episode 1071

—

Winter 2024

Started Breaking Bad

These should feel like glimpses into someone's life rather than notifications.

---

## Time Awareness

The Auth page should quietly acknowledge time.

Without changing the design language, subtly adapt the atmosphere based on:

- morning
- afternoon
- evening
- late night

Changes should be almost imperceptible.

Never become theme switching.

The page should always remain unmistakably Chronicle.

---

## Premium Glass

The login card should feel like premium architectural glass.

Not generic glassmorphism.

Refine:

- edge reflections
- layered transparency
- subtle Fresnel effect
- believable shadows
- optical depth
- realistic highlights

Avoid exaggerated blur or glow.

Luxury comes from restraint.

---

## Final Emotional Test

After completing the implementation, stop looking at it as a developer.

Look at it as a first-time user.

Ask these questions:

- Does this feel like a premium memory product rather than a media tracker?
- Does the page tell a story before the user logs in?
- Does every animation have a purpose?
- Does the composition feel handcrafted instead of AI-generated?
- Would someone remember this page after closing the browser?
- Does it feel timeless enough to still look premium five years from now?

If any answer is **no**, continue refining.

Do not add more animations.

Do not add more effects.

Instead, improve composition, rhythm, hierarchy, lighting, motion, and storytelling until the page feels unmistakably like **Chronicle**.

---

## Success Criteria

The final Auth experience should make users feel that they are **returning to a place where their memories live**, not merely signing into another application.

The desired emotional response is:

> **"I'm not logging into software. I'm stepping back into my own story."**