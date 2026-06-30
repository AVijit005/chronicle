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

    return (
      <div className={className}>
        <motion.div
          key={shakeKey}
          animate={error && !reduced ? { x: [0, -3, 3, -2, 2, 0] } : { x: 0 }}
          transition={{ duration: error ? 0.34 : 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="group relative"
        >
          {/* Focus glow wash */}
          <AnimatePresence>
            {focused && !reduced && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -bottom-1 -top-1 rounded-lg"
                style={{
                  background:
                    error
                      ? "radial-gradient(ellipse at 50% 100%, rgba(252,165,165,0.08) 0%, transparent 70%)"
                      : "radial-gradient(ellipse at 50% 100%, rgba(175,165,255,0.10) 0%, transparent 70%)",
                }}
              />
            )}
          </AnimatePresence>

          {icon && (
            <span
              className={`pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-500 ${
                focused ? "text-white/85" : "text-white/30"
              }`}
              style={
                focused && !reduced
                  ? { filter: "drop-shadow(0 0 6px rgba(175,165,255,0.6))" }
                  : undefined
              }
            >
              {icon}
            </span>
          )}

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
            className={`peer block w-full bg-transparent pb-2.5 pt-6 text-[15px] tracking-wide text-white outline-none placeholder:text-transparent ${
              icon ? "pl-7 pr-8" : "pr-8"
            }`}
          />

          <label
            htmlFor={inputId}
            className={`pointer-events-none absolute left-0 origin-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              icon ? "pl-7" : ""
            } ${
              float
                ? "top-0 text-[10px] tracking-[0.28em] uppercase"
                : "top-1/2 -translate-y-1/2 text-[14px]"
            }`}
            style={
              float
                ? {
                    color: error
                      ? "rgba(252,165,165,0.75)"
                      : focused
                        ? "rgba(185,175,255,0.85)"
                        : "rgba(255,255,255,0.50)",
                  }
                : { color: "rgba(255,255,255,0.38)" }
            }
          >
            {label}
          </label>

          {/* Static hairline */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-px bg-white/[0.07]"
          />

          {/* Animated focus underline */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-px origin-center"
            animate={{
              scaleX: focused ? 1 : 0,
              opacity: focused ? 1 : 0,
            }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: error
                ? "linear-gradient(90deg, transparent, rgba(252,165,165,0.80), transparent)"
                : "linear-gradient(90deg, oklch(0.72 0.18 290 / 0), oklch(0.82 0.16 270 / 0.9), oklch(0.78 0.18 220 / 0), transparent)",
              boxShadow: focused
                ? error
                  ? "0 0 16px rgba(252,165,165,0.40)"
                  : "0 0 20px oklch(0.72 0.18 290 / 0.50)"
                : "none",
            }}
          />

          <AnimatePresence>
            {success && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-emerald-300/90"
              >
                <Check className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.28 }}
              className="mt-1.5 text-[11px] tracking-wide text-rose-300/85"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
