import {
  forwardRef,
  useEffect,
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
    const inputId = id ?? `bb-${label.replace(/\s+/g, "-").toLowerCase()}`;
    const float = focused || hasValue;

    useEffect(() => {
      if (error && !reduced) setShakeKey((k) => k + 1);
    }, [error, reduced]);

    const borderColor = error
      ? "rgba(252,165,165,0.50)"
      : focused
        ? "oklch(0.70 0.20 272 / 0.75)"
        : "rgba(255,255,255,0.09)";

    const glowShadow = focused
      ? error
        ? "0 0 0 1px rgba(252,165,165,0.45), 0 0 22px rgba(252,165,165,0.12)"
        : "0 0 0 1px oklch(0.70 0.20 272 / 0.55), 0 0 26px oklch(0.68 0.22 272 / 0.18)"
      : "0 0 0 1px rgba(255,255,255,0.09)";

    return (
      <div className={className}>
        <motion.div
          key={shakeKey}
          animate={error && !reduced ? { x: [0, -3, 3, -2, 2, 0] } : { x: 0 }}
          transition={{ duration: error ? 0.34 : 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Frosted glass container */}
          <motion.div
            className="relative flex h-[58px] items-center overflow-hidden rounded-2xl px-4"
            animate={{
              backgroundColor: focused
                ? "rgba(255,255,255,0.075)"
                : "rgba(255,255,255,0.04)",
              boxShadow: glowShadow,
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1px solid ${borderColor}`,
            }}
          >
            {/* Icon */}
            {icon && (
              <motion.span
                className="mr-3 flex-shrink-0"
                animate={{
                  color: focused ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.28)",
                  filter: focused && !reduced
                    ? "drop-shadow(0 0 6px rgba(175,165,255,0.55))"
                    : "none",
                }}
                transition={{ duration: 0.35 }}
              >
                {icon}
              </motion.span>
            )}

            {/* Label + Input stacked in a relative container */}
            <div className="relative flex flex-1 flex-col justify-center h-full">
              <motion.label
                htmlFor={inputId}
                className="pointer-events-none absolute left-0 origin-left"
                animate={
                  float
                    ? {
                        top: "8px",
                        fontSize: "9px",
                        letterSpacing: "0.26em",
                        color: error
                          ? "rgba(252,165,165,0.75)"
                          : focused
                            ? "rgba(185,175,255,0.85)"
                            : "rgba(255,255,255,0.45)",
                      }
                    : {
                        top: "50%",
                        fontSize: "14px",
                        letterSpacing: "0.01em",
                        color: "rgba(255,255,255,0.35)",
                      }
                }
                style={float ? {} : { transform: "translateY(-50%)" }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                {float
                  ? label.toUpperCase()
                  : label}
              </motion.label>

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
                placeholder=" "
                className="block w-full bg-transparent pb-0.5 pt-4 text-[15px] tracking-wide text-white outline-none placeholder:text-transparent"
              />
            </div>

            {/* Success check */}
            <AnimatePresence>
              {success && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="ml-3 flex-shrink-0 text-emerald-300/90"
                >
                  <Check className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.28 }}
              className="mt-1.5 ml-4 text-[11px] tracking-wide text-rose-300/85"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
