import { motion, useReducedMotion } from "motion/react";
import { ParticleField } from "./ParticleField";
import { useTimeOfDay, timeOfDayTint } from "@/lib/useTimeOfDay";

interface Props {
  accent?: string;
  intensity?: "soft" | "normal" | "vivid";
  showParticles?: boolean;
  showBeams?: boolean;
}

export function AtmosphereBackground({
  accent,
  intensity = "normal",
  showParticles = true,
  showBeams = true,
}: Props) {
  const opacity = intensity === "soft" ? 0.35 : intensity === "vivid" ? 0.7 : 0.5;
  const tod = useTimeOfDay();
  const tint = accent ?? timeOfDayTint[tod];
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* deep gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 80% at 50% -10%, oklch(0.22 0.04 270) 0%, oklch(0.14 0.012 270) 55%, oklch(0.09 0.01 270) 100%)",
        }}
      />

      {/* time-of-day mood wash */}
      <motion.div
        className="absolute inset-0"
        animate={reduced ? undefined : { opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `radial-gradient(80% 60% at 50% 0%, ${tint} 0%, transparent 60%)`,
          opacity: 0.22,
        }}
      />

      {/* aurora blobs */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 h-[80vh] w-[80vh] rounded-full blur-3xl"
        style={{ background: tint, opacity: opacity * 0.55 }}
        animate={
          reduced
            ? undefined
            : { x: [0, 60, -40, 0], y: [0, -30, 40, 0], scale: [1, 1.08, 0.95, 1] }
        }
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-1/4 h-[70vh] w-[70vh] rounded-full blur-3xl"
        style={{ background: "var(--aurora-2)", opacity: opacity * 0.5 }}
        animate={
          reduced
            ? undefined
            : { x: [0, -50, 30, 0], y: [0, 40, -20, 0], scale: [1, 0.92, 1.07, 1] }
        }
        transition={{ duration: 44, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/4 left-1/3 h-[60vh] w-[60vh] rounded-full blur-3xl"
        style={{ background: "var(--aurora-3)", opacity: opacity * 0.4 }}
        animate={reduced ? undefined : { x: [0, 40, -30, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 50, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* cinematic light beams */}
      {showBeams && (
        <>
          <motion.div
            className="absolute -top-40 left-1/4 h-[120vh] w-[40vh] rotate-12 rounded-full blur-3xl"
            style={{
              background: "linear-gradient(180deg, oklch(0.85 0.12 250 / 0.18), transparent 70%)",
            }}
            animate={reduced ? undefined : { x: [0, 40, -20, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 right-1/4 h-[100vh] w-[35vh] -rotate-12 rounded-full blur-3xl"
            style={{
              background: "linear-gradient(0deg, oklch(0.7 0.18 310 / 0.14), transparent 70%)",
            }}
            animate={reduced ? undefined : { x: [0, -30, 20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* particles */}
      {showParticles && (
        <div className="absolute inset-0 opacity-60">
          <ParticleField count={tod === "night" ? 50 : 28} />
        </div>
      )}

      {/* noise */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(120% 80% at 50% 110%, oklch(0 0 0 / 0.6), transparent 55%)",
        }}
      />
    </div>
  );
}
