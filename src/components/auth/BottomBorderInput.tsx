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

    useEffect(() => {
      if (error && !reduced) setShakeKey((k) => k + 1);
    }, [error, reduced]);

    const isError = Boolean(error);

    return (
      <div className={className}>
        {/* Label sits above the pill — always visible, never floats inside */}
        <motion.label
          htmlFor={inputId}
          className="mb-2 block text-[10px] uppercase tracking-[0.30em]"
          animate={{
            color: isError
              ? "rgba(252,165,165,0.80)"
              : focused
                ? "rgba(185,175,255,0.90)"
                : "rgba(255,255,255,0.42)",
          }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.label>

        <motion.div
          key={shakeKey}
          animate={
            isError && !reduced ? { x: [0, -4, 4, -3, 3, 0] } : { x: 0 }
          }
          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Pill container */}
          <motion.div
            className="relative flex h-[52px] items-center gap-3 rounded-full px-5"
            style={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
            animate={{
              backgroundColor: focused
                ? "rgba(255,255,255,0.13)"
                : "rgba(255,255,255,0.09)",
              boxShadow: isError
                ? "0 0 0 1.5px rgba(252,165,165,0.60), 0 0 20px rgba(252,165,165,0.12)"
                : focused
                  ? "0 0 0 1.5px oklch(0.68 0.22 272 / 0.80), 0 0 28px oklch(0.68 0.22 272 / 0.22)"
                  : "0 0 0 1px rgba(255,255,255,0.22)",
            }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Icon */}
            {icon && (
              <motion.span
                className="flex-shrink-0"
                animate={{
                  color: isError
                    ? "rgba(252,165,165,0.70)"
                    : focused
                      ? "rgba(185,175,255,0.85)"
                      : "rgba(255,255,255,0.30)",
                  filter:
                    focused && !isError && !reduced
                      ? "drop-shadow(0 0 6px rgba(175,165,255,0.50))"
                      : "none",
                }}
                transition={{ duration: 0.35 }}
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
              className="flex-1 bg-transparent text-[15px] tracking-wide text-white outline-none placeholder:text-white/22"
              style={{ caretColor: "oklch(0.78 0.18 272)" }}
            />

            {/* Success check */}
            <AnimatePresence>
              {success && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex-shrink-0 text-emerald-300/90"
                >
                  <Check className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Error text */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.26 }}
              className="mt-1.5 pl-5 text-[11px] tracking-wide text-rose-300/85"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
