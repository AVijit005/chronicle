// Deterministic PRNG so SSR and client render the same values (no hydration drift).
export function mulberry(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
export const seeded = (seed: number, n: number) => {
  const rng = mulberry(seed);
  return Array.from({ length: n }, () => rng());
};
