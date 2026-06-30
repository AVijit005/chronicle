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

/**
 * Ultra-minimal field — no box, only a bottom hairline that brightens on focus.
 * Designed for the Memory Portal: invisible until touched.
 */
export const BottomBorderInput = forwardRef<HTMLInputElement, Props>(function BottomBorderInput(
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
        animate={
          error && !reduced
            ? { x: [0, -3, 3, -2, 2, 0] }
            : { x: 0 }
        }
        transition={{ duration: error ? 0.34 : 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="group relative"
      >
        {icon && (
          <span
            className={`pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 transition-colors duration-500 ${
              focused ? "text-white/80" : "text-white/30"
            }`}
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
          className={`pointer-events-none absolute left-0 origin-left text-white/40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            icon ? "pl-7" : ""
          } ${
            float
              ? "top-0 text-[10px] tracking-[0.28em] uppercase text-white/55"
              : "top-1/2 -translate-y-1/2 text-[14px]"
          }`}
        >
          {label}
        </label>

        {/* Static hairline */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-white/[0.08]"
        />
        {/* Animated focus underline — grows from center */}
        <div
          aria-hidden
          className={`absolute inset-x-0 bottom-0 h-px origin-center scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            focused ? "scale-x-100" : ""
          } ${error ? "bg-rose-300/70" : success ? "bg-emerald-300/70" : "bg-white/55"}`}
          style={{
            boxShadow: focused
              ? "0 0 18px rgba(255,255,255,0.35)"
              : undefined,
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
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="mt-1.5 text-[11px] tracking-wide text-rose-300/85"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
