import { useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

/**
 * LiquidGlassCard — Mouse-reactive, living glass surface.
 * Fresnel highlights, caustic refraction, and pointer-tracking liquid sheen.
 * Uses CSS custom properties updated via spring physics for smooth reactivity.
 */
export function LiquidGlassCard({ children, className = "" }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 80, damping: 20, mass: 0.3 });
  const smy = useSpring(my, { stiffness: 80, damping: 20, mass: 0.3 });

  const updatePointer = useCallback(
    (e: PointerEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      mx.set(Math.max(0, Math.min(1, nx)));
      my.set(Math.max(0, Math.min(1, ny)));
    },
    [mx, my]
  );

  // Subscribe to springs and update CSS custom properties
  useEffect(() => {
    if (reduced) return;
    const el = cardRef.current;
    if (!el) return;

    const unsubX = smx.on("change", (v) => {
      el.style.setProperty("--lg-x", String(v));
    });
    const unsubY = smy.on("change", (v) => {
      el.style.setProperty("--lg-y", String(v));
    });
    el.addEventListener("pointermove", updatePointer);
    return () => {
      unsubX();
      unsubY();
      el.removeEventListener("pointermove", updatePointer);
    };
  }, [updatePointer, smx, smy, reduced]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 28, filter: "blur(16px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.05, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden ${className}`}
      style={{
        "--lg-x": 0.5,
        "--lg-y": 0.5,
        background:
          "linear-gradient(135deg, rgba(15, 15, 20, 0.55) 0%, rgba(25, 25, 35, 0.32) 100%)",
        backdropFilter: "blur(32px) saturate(140%)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow:
          "0 40px 100px -20px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        borderRadius: "28px",
      } as React.CSSProperties}
    >
      {/* LIQUID SHEEN — tracks pointer via CSS vars */}
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.55,
            background:
              "linear-gradient(120deg, transparent 0%, rgba(140, 130, 255, 0.16) 25%, transparent 50%, rgba(255, 170, 200, 0.10) 75%, transparent 100%)",
            backgroundSize: "220% 220%",
            backgroundPosition:
              "calc(var(--lg-x) * 100%) calc(var(--lg-y) * 100%)",
            transition: "background-position 0.05s linear",
          }}
        />
      )}

      {/* FRESNEL EDGE — glows brightest at cursor position */}
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: "28px",
            padding: "1px",
            background:
              "radial-gradient(400px 400px at calc(var(--lg-x) * 100%) calc(var(--lg-y) * 100%), rgba(200, 195, 255, 0.45) 0%, rgba(255, 180, 210, 0.25) 35%, transparent 70%)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            mixBlendMode: "screen",
            opacity: 0.55,
          }}
        />
      )}

      {/* CAUSTIC REFRACTION — warped light blob follows cursor */}
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute h-64 w-64 rounded-full"
          style={{
            left: "calc(var(--lg-x) * 100% - 8rem)",
            top: "calc(var(--lg-y) * 100% - 8rem)",
            background:
              "radial-gradient(circle, rgba(170, 160, 255, 0.14) 0%, rgba(255, 180, 210, 0.08) 40%, transparent 70%)",
            mixBlendMode: "screen",
            filter: "blur(24px)",
            opacity: 0.5,
            transition: "left 0.08s linear, top 0.08s linear",
          }}
        />
      )}

      {/* AMBIENT CONIC BORDER — slow rotation */}
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[28px]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, rgba(170,160,255,0.5) 12%, transparent 28%, transparent 72%, rgba(255,180,210,0.35) 88%, transparent 100%)",
            maskImage:
              "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
            opacity: 0.35,
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* TOP HAIRLINE */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
        }}
      />

      {/* STATIC INNER GLARE */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/4 left-1/4 h-1/2 w-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
