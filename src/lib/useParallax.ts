import { useEffect } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "motion/react";

export function useMouseParallax(strength = 1) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 60, damping: 18, mass: 0.4 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const handler = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2 * strength;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2 * strength;
      x.set(nx);
      y.set(ny);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [strength, x, y, reduced]);

  return { x: sx, y: sy };
}
