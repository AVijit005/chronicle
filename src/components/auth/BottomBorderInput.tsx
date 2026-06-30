import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  success?: boolean;
}

export const BottomBorderInput = forwardRef<HTMLInputElement, Props>(
  function BottomBorderInput(
    { label, icon, error, success, id, className, onFocus, onBlur, ...rest },
    ref,
  ) {
    const reduced = useReducedMotion();
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(rest.defaultValue || rest.value));
    const [shakeKey, setShakeKey] = useState(0);
    const [mouseX, setMouseX] = useState(0.5);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputId = id ?? `bb-${label.replace(/\s+/g, "-").toLowerCase()}`;

    useEffect(() => {
      if (error && !reduced) setShakeKey((k) => k + 1);
    }, [error, reduced]);

    const isError = Boolean(error);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || reduced) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMouseX((e.clientX - rect.left) / rect.width);
    };

    return (
      <div className={className}>
        {/* Label */}
        <motion.label
          htmlFor={inputId}
          className="mb-2.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.32em]"
          animate={{
            color: isError
              ? "rgba(252,165,165,0.85)"
              : focused
                ? "rgba(200,190,255,1)"
                : "rgba(255,255,255,0.38)",
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Animated indicator dot */}
          <motion.span
            className="inline-block h-1 w-1 rounded-full flex-shrink-0"
            animate={{
              background: isError
                ? "rgba(252,165,165,0.9)"
                : focused
                  ? "oklch(0.72 0.22 272)"
                  : "rgba(255,255,255,0.18)",
              boxShadow: focused && !isError
                ? "0 0 8px oklch(0.72 0.22 272 / 0.9), 0 0 16px oklch(0.72 0.22 272 / 0.5)"
                : "none",
              scale: focused ? 1.4 : 1,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
          {label}
        </motion.label>

        <motion.div
          key={shakeKey}
          animate={
            isError && !reduced ? { x: [0, -5, 5, -4, 4, -2, 2, 0] } : { x: 0 }
          }
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Outer glow ring — blooms on focus */}
          <div className="relative">
            {!reduced && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -inset-[3px] rounded-full"
                animate={{
                  opacity: focused && !isError ? 1 : 0,
                  scale: focused ? 1 : 0.97,
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background:
                    "conic-gradient(from 200deg, oklch(0.68 0.26 272 / 0.0), oklch(0.78 0.22 272 / 0.85) 20%, oklch(0.80 0.20 220 / 0.60) 40%, oklch(0.68 0.26 272 / 0.0) 60%)",
                  filter: "blur(5px)",
                }}
              />
            )}

            {/* Error outer glow */}
            {!reduced && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -inset-[3px] rounded-full"
                animate={{ opacity: isError ? 0.85 : 0 }}
                transition={{ duration: 0.35 }}
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 100%, rgba(252,165,165,0.5) 0%, transparent 70%)",
                  filter: "blur(6px)",
                }}
              />
            )}

            {/* Pill container */}
            <motion.div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              className="relative flex h-[54px] items-center gap-3 overflow-hidden rounded-full px-5"
              animate={{
                backgroundColor: focused
                  ? "rgba(255,255,255,0.11)"
                  : "rgba(255,255,255,0.06)",
                boxShadow: isError
                  ? "0 0 0 1.5px rgba(252,165,165,0.55), inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.3)"
                  : focused
                    ? "0 0 0 1.5px oklch(0.72 0.22 272 / 0.75), inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 32px rgba(0,0,0,0.35), 0 0 0 4px oklch(0.72 0.22 272 / 0.08)"
                    : "0 0 0 1px rgba(255,255,255,0.14), inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.25)",
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
            >
              {/* Traveling light sweep on focus */}
              {!reduced && (
                <AnimatePresence>
                  {focused && (
                    <motion.span
                      aria-hidden
                      key="sweep"
                      initial={{ x: "-100%", opacity: 0 }}
                      animate={{ x: "250%", opacity: [0, 0.7, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                      className="pointer-events-none absolute inset-y-0 w-1/3"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(190,180,255,0.35), rgba(220,210,255,0.18), transparent)",
                        filter: "blur(4px)",
                      }}
                    />
                  )}
                </AnimatePresence>
              )}

              {/* Mouse-tracked inner spotlight */}
              {!reduced && focused && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/4 w-3/4 rounded-full"
                  style={{
                    background: `radial-gradient(ellipse at ${mouseX * 100}% 50%, rgba(175,165,255,0.18) 0%, transparent 70%)`,
                    transition: "background 0.05s linear",
                  }}
                />
              )}

              {/* Inner top shimmer line */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                animate={{
                  opacity: focused ? 1 : 0.3,
                  background: focused
                    ? `linear-gradient(90deg, transparent 5%, oklch(0.82 0.18 272 / 0.65) ${mouseX * 100}%, transparent 95%)`
                    : "linear-gradient(90deg, transparent 15%, rgba(255,255,255,0.18) 50%, transparent 85%)",
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Icon */}
              {icon && (
                <motion.span
                  className="flex-shrink-0 z-10"
                  animate={{
                    color: isError
                      ? "rgba(252,165,165,0.80)"
                      : focused
                        ? "rgba(200,190,255,0.95)"
                        : "rgba(255,255,255,0.28)",
                    filter:
                      focused && !isError && !reduced
                        ? "drop-shadow(0 0 8px rgba(175,165,255,0.70))"
                        : "none",
                    scale: focused ? 1.08 : 1,
                  }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                >
                  {icon}
                </motion.span>
              )}

              {/* Input */}
              <input
                ref={ref}
                id={inputId}
                {...rest}
                onFocus={(e) => {
                  setFocused(true);
                  onFocus?.(e);
                }}
                onBlur={(e) => {
                  setFocused(false);
                  setHasValue(Boolean(e.target.value));
                  onBlur?.(e);
                }}
                onChange={(e) => {
                  setHasValue(Boolean(e.target.value));
                  rest.onChange?.(e);
                }}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="relative z-10 flex-1 bg-transparent text-[15px] tracking-wide text-white outline-none placeholder:text-white/18"
                style={{ caretColor: "oklch(0.82 0.20 272)" }}
              />

              {/* Success check */}
              <AnimatePresence>
                {success && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.4 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 flex-shrink-0 text-emerald-300/90"
                    style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.5))" }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Bottom inner glow on focus */}
              {!reduced && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
                  animate={{
                    opacity: focused && !isError ? 1 : 0,
                    background: "linear-gradient(90deg, transparent 10%, oklch(0.72 0.22 272 / 0.8) 50%, transparent 90%)",
                  }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Error text */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 pl-5 text-[11px] tracking-wide"
              style={{ color: "rgba(252,165,165,0.85)" }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
