import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export const PremiumField = forwardRef<HTMLInputElement, Props>(
  ({ label, hint, error, success, loading, leading, trailing, className, id, ...rest }, ref) => {
    const auto = useId();
    const inputId = id ?? auto;
    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
        >
          {label}
        </label>
        <div
          className={cn(
            "glass-subtle flex h-11 items-center gap-2 rounded-2xl px-3 transition-[box-shadow,background] duration-[var(--dur-normal)] ease-[var(--ease-out)]",
            "focus-within:ring-2 focus-within:ring-primary/40",
            error && "ring-1 ring-red-500/50",
            success && "ring-1 ring-emerald-500/40",
          )}
        >
          {leading && <span className="text-muted-foreground">{leading}</span>}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70",
              loading && "opacity-60",
              className,
            )}
            {...rest}
          />
          {trailing && <span className="text-muted-foreground">{trailing}</span>}
        </div>
        {error ? (
          <p id={`${inputId}-err`} className="mt-1 text-xs text-red-400">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="mt-1 text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
PremiumField.displayName = "PremiumField";
