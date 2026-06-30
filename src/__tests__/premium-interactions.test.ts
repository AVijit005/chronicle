/**
 * Visual-regression snapshot tests for Chronicle's premium interaction system.
 *
 * Goal: catch *drift* in timing, easing, shadow, radius, and glass opacity tokens
 * — and in the className strings of the small set of components that define the
 * product's interaction language. We snapshot the canonical token values from
 * `src/styles.css` and the transition/shadow/radius/duration/ease classes used
 * by each premium component. Any future edit that quietly changes a duration
 * from `var(--dur-large)` to `duration-500` (or swaps a shadow token) fails
 * the snapshot with a clear textual diff — far more precise than pixel diffs
 * and with zero browser/baseline maintenance.
 *
 * Update intentionally: `bunx vitest run -u`.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(import.meta.dirname, "..");
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

/** Extract `--name: value;` declarations whose name matches `pattern`. */
function extractTokens(css: string, pattern: RegExp): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /--([\w-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    if (pattern.test(m[1]) && !(m[1] in out)) {
      out[m[1]] = m[2].trim().replace(/\s+/g, " ");
    }
  }
  return out;
}

/**
 * Pull every class attribute from a TSX source and return only the classes
 * relevant to the premium interaction system (transitions, durations, easing,
 * shadows, radii, rings, glass utilities). Order-stable, dedup'd, sorted —
 * snapshots are robust against unrelated formatting noise but still fail
 * loudly when an interaction-affecting class drifts.
 */
function extractInteractionClasses(source: string): string[] {
  const classes = new Set<string>();
  const attrRe = /class(?:Name)?\s*=\s*(?:"([^"]+)"|`([^`]+)`)/g;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(source))) {
    const raw = (m[1] ?? m[2] ?? "").replace(/\$\{[^}]*\}/g, " ");
    for (const cls of raw.split(/\s+/)) {
      if (!cls) continue;
      if (
        /^(transition|duration-|ease-|shadow-|rounded(?:-|$)|ring(?:-|$)|hover-lift|press-scale|transition-premium|elev-|glass|focus-ring|animate-)/.test(
          cls,
        )
      ) {
        classes.add(cls);
      }
    }
  }
  return [...classes].sort();
}

describe("design tokens (src/styles.css)", () => {
  const css = read("styles.css");

  it("motion tokens are stable", () => {
    expect(extractTokens(css, /^(dur-|ease-)/)).toMatchInlineSnapshot(`
      {
        "dur-large": "360ms",
        "dur-micro": "140ms",
        "dur-normal": "240ms",
        "dur-page": "560ms",
        "ease-in": "cubic-bezier(0.7, 0, 0.84, 0)",
        "ease-out": "cubic-bezier(0.22, 1, 0.36, 1)",
        "ease-page": "cubic-bezier(0.65, 0, 0.35, 1)",
      }
    `);
  });

  it("glass opacity tokens are stable", () => {
    expect(extractTokens(css, /^glass-/)).toMatchInlineSnapshot(`
      {
        "glass-base-alpha": "0.55",
        "glass-strong-alpha": "0.75",
        "glass-subtle-alpha": "0.35",
      }
    `);
  });

  it("radius tokens are stable", () => {
    expect(extractTokens(css, /^radius(-|$)/)).toMatchInlineSnapshot(`
      {
        "radius": "16px",
        "radius-2xl": "24px",
        "radius-3xl": "32px",
        "radius-4xl": "40px",
        "radius-lg": "16px",
        "radius-md": "12px",
        "radius-sm": "8px",
        "radius-xl": "20px",
      }
    `);
  });

  it("shadow tokens are stable", () => {
    expect(extractTokens(css, /^shadow-/)).toMatchSnapshot();
  });
});

describe("premium interaction class surface", () => {
  // The components that define the product's tactile vocabulary. Drift here
  // means the rest of the app feels inconsistent.
  const components = [
    "components/ui/PosterCard.tsx",
    "components/ui/PremiumButton.tsx",
    "components/ui/PremiumField.tsx",
    "components/media/MediaCard.tsx",
    "components/editorial/Collage.tsx",
    "components/discovery/RecommendationCard.tsx",
  ];

  for (const path of components) {
    it(`${path} interaction classes are stable`, () => {
      expect(extractInteractionClasses(read(path))).toMatchSnapshot();
    });
  }
});

describe("no legacy timing escapes", () => {
  // Hard guardrail: premium components must reference motion tokens, never
  // raw Tailwind `duration-200/300/500/700` on transition/hover utilities.
  // (Atmospheric `duration-1000` ambient effects and shadcn UI primitives
  // are intentionally excluded.)
  const premium = [
    "components/ui/PosterCard.tsx",
    "components/ui/PremiumButton.tsx",
    "components/ui/PremiumField.tsx",
    "components/editorial/Collage.tsx",
    "components/discovery/RecommendationCard.tsx",
  ];

  for (const path of premium) {
    it(`${path} uses motion tokens, not raw durations`, () => {
      const src = read(path);
      const offenders = [...src.matchAll(/\bduration-(100|150|200|300|500|700)\b/g)].map(
        (m) => m[0],
      );
      expect(offenders).toEqual([]);
    });
  }
});

describe("no raw shadow values escape", () => {
  // Premium components must reference a `--shadow-*` token, never inline a raw
  // arbitrary box-shadow. `shadow-[var(--shadow-foo)]` is allowed; literal
  // `shadow-[0_8px_...]` is not. Drift here causes hierarchy inconsistency.
  const premium = [
    "components/ui/PosterCard.tsx",
    "components/ui/PremiumButton.tsx",
    "components/ui/PremiumField.tsx",
    "components/editorial/Collage.tsx",
    "components/discovery/RecommendationCard.tsx",
    "components/media/MediaCard.tsx",
  ];

  for (const path of premium) {
    it(`${path} only uses tokenized shadows`, () => {
      const src = read(path);
      // Match every `shadow-[...]` arbitrary value, then reject any that
      // isn't a pure `var(--shadow-*)` reference.
      const offenders = [...src.matchAll(/shadow-\[([^\]]+)\]/g)]
        .map((m) => m[1])
        .filter((value) => !/^var\(--shadow-[\w-]+\)$/.test(value));
      expect(offenders).toEqual([]);
    });
  }
});

describe("no raw radius values escape", () => {
  // Premium components must use the named radius scale (`rounded-md`,
  // `rounded-2xl`, `rounded-full`, etc.) or reference a `--radius-*` token.
  // Literal `rounded-[5px]` / `rounded-[12px]` is forbidden.
  const premium = [
    "components/ui/PosterCard.tsx",
    "components/ui/PremiumButton.tsx",
    "components/ui/PremiumField.tsx",
    "components/editorial/Collage.tsx",
    "components/discovery/RecommendationCard.tsx",
    "components/media/MediaCard.tsx",
  ];

  for (const path of premium) {
    it(`${path} only uses tokenized radii`, () => {
      const src = read(path);
      const offenders = [...src.matchAll(/rounded(?:-[a-z]+)?-\[([^\]]+)\]/g)]
        .map((m) => m[1])
        .filter((value) => !/^var\(--radius[\w-]*\)$/.test(value));
      expect(offenders).toEqual([]);
    });
  }
});
