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
          {/* Pill — no border glow, just a subtle bg shift */}
          <motion.div
            className="relative flex h-[52px] items-center gap-3 overflow-hidden rounded-full px-5"
            animate={{
              backgroundColor: focused
                ? "rgba(255,255,255,0.09)"
                : "rgba(255,255,255,0.06)",
              boxShadow: isError
                ? "0 0 0 1px rgba(252,165,165,0.40)"
                : "0 0 0 1px rgba(255,255,255,0.10)",
            }}
            transition={{ duration: 0.30, ease: [0.22, 1, 0.36, 1] }}
            style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
          >
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

          {/* ── STRIP LIGHT ── bottom-edge only, center-expand bloom */}
          {!reduced && (
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center"
              style={{ height: "2px" }}
            >
              {/* Core line — expands from center outward */}
              <motion.div
                className="absolute inset-0 origin-center"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: focused && !isError ? 1 : 0,
                  opacity: focused && !isError ? 1 : 0,
                }}
                transition={{
                  scaleX: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.35, ease: "easeOut" },
                }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, oklch(0.72 0.22 272 / 0.60) 20%, oklch(0.85 0.18 250 / 1) 50%, oklch(0.72 0.22 272 / 0.60) 80%, transparent 100%)",
                }}
              />

              {/* Diffuse glow halo below the line */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{
                  opacity: focused && !isError ? 1 : 0,
                  scaleX: focused && !isError ? 1 : 0,
                }}
                transition={{
                  opacity: { duration: 0.6, ease: "easeOut", delay: 0.05 },
                  scaleX: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 },
                }}
                style={{
                  width: "80%",
                  height: "20px",
                  top: "0px",
                  background:
                    "radial-gradient(ellipse at 50% 0%, oklch(0.75 0.22 272 / 0.45) 0%, oklch(0.75 0.22 272 / 0.15) 45%, transparent 75%)",
                  filter: "blur(4px)",
                  transformOrigin: "center top",
                }}
              />

              {/* Error strip — red, same animation */}
              <motion.div
                className="absolute inset-0 origin-center"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: isError ? 1 : 0,
                  opacity: isError ? 1 : 0,
                }}
                transition={{
                  scaleX: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.3 },
                }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(252,165,165,0.5) 25%, rgba(252,165,165,1) 50%, rgba(252,165,165,0.5) 75%, transparent 100%)",
                  boxShadow: "0 0 10px rgba(252,165,165,0.4)",
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Error message */}
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
