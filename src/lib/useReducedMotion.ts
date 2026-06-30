import { useReducedMotion as framerReduced } from "motion/react";
export function useReducedMotionGuard() {
  const reduced = framerReduced();
  return Boolean(reduced);
}
