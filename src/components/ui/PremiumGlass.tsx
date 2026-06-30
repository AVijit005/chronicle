import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";

type Variant = "subtle" | "default" | "strong";

interface Props extends HTMLMotionProps<"div"> {
  variant?: Variant;
  reflection?: boolean;
  glow?: string; // oklch
}

const variantClass: Record<Variant, string> = {
  subtle: "glass-subtle",
  default: "glass",
  strong: "glass-strong",
};

/**
 * Living Glass — pointer-tracked diagonal reflection + proximity border
 * illumination. The reflection slides with the cursor while hovering and
 * fades smoothly on leave. No layout work, only CSS variable writes; safe
 * on reduced-motion (the reflection simply never reveals).
 */
export const PremiumGlass = forwardRef<HTMLDivElement, Props>(
  (
    {
      variant = "default",
      reflection = true,
      glow,
      className,
      children,
      style,
      onPointerMove,
      onPointerLeave,
      onPointerEnter,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLDivElement | null>(null);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    const handleMove = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>) => {
        const el = innerRef.current;
        if (el) {
          const r = el.getBoundingClientRect();
          const px = ((e.clientX - r.left) / Math.max(1, r.width)) * 100;
          const py = ((e.clientY - r.top) / Math.max(1, r.height)) * 100;
          el.style.setProperty("--glass-px", `${px}%`);
          el.style.setProperty("--glass-py", `${py}%`);
        }
        onPointerMove?.(e);
      },
      [onPointerMove],
    );

    const handleEnter = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>) => {
        innerRef.current?.style.setProperty("--glass-rev", "1");
        onPointerEnter?.(e);
      },
      [onPointerEnter],
    );

    const handleLeave = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>) => {
        innerRef.current?.style.setProperty("--glass-rev", "0");
        onPointerLeave?.(e);
      },
      [onPointerLeave],
    );

    return (
      <motion.div
        ref={setRefs}
        {...rest}
        onPointerMove={handleMove}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        className={cn(
          "group/glass relative overflow-hidden rounded-3xl",
          variantClass[variant],
          className,
        )}
        style={
          {
            ...style,
            // defaults consumed by reflection layers
            ["--glass-px" as string]: "50%",
            ["--glass-py" as string]: "0%",
            ["--glass-rev" as string]: "0",
          } as React.CSSProperties
        }
      >
        {/* outer highlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.35), transparent)",
          }}
        />
        {/* inner highlight + proximity border */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl transition-[box-shadow] duration-[260ms] ease-out"
          style={{
            boxShadow:
              "inset 0 1px 0 oklch(1 0 0 / 0.06), inset 0 -1px 0 oklch(0 0 0 / 0.25), inset 0 0 0 1px oklch(1 0 0 / calc(0.04 + var(--glass-rev) * 0.06))",
          }}
        />
        {/* artwork tint glow */}
        {glow && (
          <span
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
            style={{ background: glow }}
          />
        )}
        {/* Living diagonal reflection — follows pointer, fades on leave. */}
        {reflection && (
          <>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 transition-opacity duration-[600ms] ease-out"
              style={{
                opacity: "calc(var(--glass-rev) * 0.55)",
                background:
                  "radial-gradient(420px circle at var(--glass-px) var(--glass-py), oklch(1 0 0 / 0.10), transparent 60%)",
                mixBlendMode: "screen",
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 transition-opacity duration-[700ms] ease-out"
              style={{
                opacity: "calc(var(--glass-rev) * 0.5)",
                background:
                  "linear-gradient(125deg, transparent calc(var(--glass-px) - 22%), oklch(1 0 0 / 0.08) var(--glass-px), transparent calc(var(--glass-px) + 22%))",
                mixBlendMode: "overlay",
              }}
            />
          </>
        )}
        <div className="relative">{children as React.ReactNode}</div>
      </motion.div>
    );
  },
);
PremiumGlass.displayName = "PremiumGlass";
