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

export const FloatingInput = forwardRef<HTMLInputElement, Props>(function FloatingInput(
  { label, icon, error, success, id, className, onFocus, onBlur, ...rest },
  ref,
) {
  const reduced = useReducedMotion();
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(rest.defaultValue || rest.value));
  const [shakeKey, setShakeKey] = useState(0);
  const inputId = id ?? `fi-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const float = focused || hasValue;

  // Trigger shake whenever error transitions to truthy.
  useEffect(() => {
    if (error && !reduced) setShakeKey((k) => k + 1);
  }, [error, reduced]);

  return (
    <div className={className}>
      <motion.div
        key={shakeKey}
        animate={
          error && !reduced
            ? { x: [0, -4, 4, -3, 3, 0] }
            : { x: 0, y: focused ? -1 : 0 }
        }
        transition={{ duration: error ? 0.36 : 0.24, ease: [0.22, 1, 0.36, 1] }}
        className={`relative rounded-2xl border bg-background/40 backdrop-blur-md transition-shadow duration-300 ${
          focused
            ? "border-primary/60 shadow-[0_0_0_4px_oklch(0.72_0.18_255_/_0.14),0_10px_30px_-18px_oklch(0.72_0.18_255_/_0.4)]"
            : "border-border/70"
        } ${error ? "border-rose-300/50" : ""} ${success ? "border-emerald-300/50 shadow-[0_0_0_4px_oklch(0.78_0.16_160_/_0.14)]" : ""}`}
      >
        {icon && (
          <div
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
              focused ? "text-primary/90" : "text-muted-foreground"
            }`}
          >
            {icon}
          </div>
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
          className={`peer block w-full bg-transparent py-3.5 pr-10 text-sm text-foreground outline-none placeholder:text-transparent ${
            icon ? "pl-11" : "pl-4"
          }`}
        />
        <label
          htmlFor={inputId}
          className={`pointer-events-none absolute left-4 top-1/2 origin-left -translate-y-1/2 text-sm transition-all duration-300 ${
            icon && !float ? "left-11" : "left-4"
          } ${float ? "top-2.5 -translate-y-0 scale-[0.78] text-primary/85" : "text-muted-foreground"}`}
        >
          {label}
        </label>
        <AnimatePresence>
          {success && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300/90"
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
            className="mt-1.5 px-1 text-xs text-rose-300/90"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
