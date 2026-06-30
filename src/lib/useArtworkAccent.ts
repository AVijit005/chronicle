import { useMemo } from "react";

// Parses an oklch(L C H[ /A]) string and returns soft, related tints we
// use to light up the page around a media artwork.
export function useArtworkAccent(accent?: string) {
  return useMemo(() => {
    const match = accent?.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/i);
    const L = match ? parseFloat(match[1]) : 0.7;
    const C = match ? parseFloat(match[2]) : 0.18;
    const H = match ? parseFloat(match[3]) : 255;
    const base = `oklch(${L} ${C} ${H})`;
    const glow = `oklch(${Math.min(L + 0.05, 0.92)} ${Math.min(C + 0.02, 0.32)} ${H})`;
    const deep = `oklch(${Math.max(L - 0.35, 0.1)} ${Math.max(C - 0.05, 0)} ${H})`;
    return {
      base,
      glow,
      deep,
      style: {
        "--art-accent": base,
        "--art-glow": glow,
        "--art-deep": deep,
      } as React.CSSProperties,
    };
  }, [accent]);
}
