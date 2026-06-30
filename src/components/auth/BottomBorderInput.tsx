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
        {/* Label */}
        <motion.label
          htmlFor={inputId}
          className="mb-2 block text-[10px] uppercase tracking-[0.30em]"
          animate={{
            color: isError
              ? "rgba(252,165,165,0.85)"
              : focused
                ? "rgba(190,182,255,0.95)"
                : "rgba(255,255,255,0.38)",
          }}
          transition={{ duration: 0.28 }}
        >
          {label}
        </motion.label>

        <motion.div
          key={shakeKey}
          animate={
            isError && !reduced ? { x: [0, -5, 5, -4, 4, -2, 2, 0] } : { x: 0 }
          }
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Pill */}
          <motion.div
            className="relative flex h-[52px] items-center gap-3 overflow-hidden rounded-full px-5"
            animate={{
              backgroundColor: focused
                ? "rgba(255,255,255,0.10)"
                : "rgba(255,255,255,0.07)",
              boxShadow: isError
                ? "0 0 0 1.5px rgba(252,165,165,0.55), inset 0 1px 0 rgba(255,255,255,0.05)"
                : focused
                  ? "0 0 0 1.5px rgba(155,145,255,0.55), 0 0 22px rgba(130,120,255,0.15), inset 0 1px 0 rgba(255,255,255,0.09)"
                  : "0 0 0 1px rgba(255,255,255,0.14), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
          >
            {/* Scan sweep — appears once on focus */}
            {!reduced && (
              <AnimatePresence>
                {focused && (
                  <motion.span
                    key="sweep"
                    aria-hidden
                    initial={{ x: "-110%", opacity: 0 }}
                    animate={{ x: "260%", opacity: [0, 0.55, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-none absolute inset-y-0 w-2/5"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(170,162,255,0.22), transparent)",
                    }}
                  />
                )}
              </AnimatePresence>
            )}

            {/* Top hairline — brightens on focus */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              animate={{
                opacity: focused ? 1 : 0.4,
                background: focused
                  ? "linear-gradient(90deg, transparent 12%, rgba(180,172,255,0.55) 50%, transparent 88%)"
                  : "linear-gradient(90deg, transparent 15%, rgba(255,255,255,0.14) 50%, transparent 85%)",
              }}
              transition={{ duration: 0.35 }}
            />

            {/* Icon */}
            {icon && (
              <motion.span
                className="flex-shrink-0 z-10"
                animate={{
                  color: isError
                    ? "rgba(252,165,165,0.75)"
                    : focused
                      ? "rgba(190,182,255,0.90)"
                      : "rgba(255,255,255,0.28)",
                }}
                transition={{ duration: 0.28 }}
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
              className="relative z-10 flex-1 bg-transparent text-[15px] tracking-wide text-white outline-none border-0 ring-0 placeholder:text-white/20"
              style={{
                caretColor: "oklch(0.80 0.18 272)",
                WebkitBoxShadow: "0 0 0 1000px transparent inset",
                WebkitTextFillColor: "white",
                transition: "background-color 5000s ease-in-out 0s",
              }}
            />

            {/* Success */}
            <AnimatePresence>
              {success && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 flex-shrink-0 text-emerald-300/90"
                >
                  <Check className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Bottom glow line — draws in from center on focus */}
          {!reduced && (
            <div className="absolute inset-x-4 bottom-0 h-[1px] overflow-hidden rounded-full">
              <motion.span
                className="absolute inset-0 origin-center"
                animate={{ scaleX: focused && !isError ? 1 : 0, opacity: focused ? 1 : 0 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.70 0.20 272 / 0.0), oklch(0.78 0.18 272 / 0.9) 50%, oklch(0.70 0.20 272 / 0.0))",
                  filter: "blur(0.5px)",
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="mt-1.5 pl-5 text-[11px] tracking-wide"
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
