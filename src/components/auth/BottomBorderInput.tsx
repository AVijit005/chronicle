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

/* oklch → rgba approximations used in animate() props only.
   Static CSS strings (background in style={}) can still use oklch. */
const V = {
  coreDim:   "rgba(148,128,255,0.70)",
  coreBright:"rgba(165,145,255,0.90)",
  centerDim: "rgba(200,188,255,1)",
  centerBrt: "rgba(225,215,255,1)",
  midInner:  "rgba(130,108,248,0.38)",
  midOuter:  "rgba(125,100,245,0.14)",
  midInnerB: "rgba(145,120,255,0.50)",
  midOuterB: "rgba(138,112,250,0.20)",
  spillIn:   "rgba(95,72,220,0.20)",
  spillOut:  "rgba(88,65,208,0.08)",
  spillInB:  "rgba(108,84,235,0.28)",
  spillOutB: "rgba(98,74,220,0.12)",
} as const;

const gradCore = (a: typeof V.coreDim, c: typeof V.centerDim) =>
  `linear-gradient(90deg, transparent, ${a} 22%, ${c} 50%, ${a} 78%, transparent)`;

const gradMid = (inner: string, outer: string) =>
  `radial-gradient(ellipse 72% 100% at 50% 100%, ${inner} 0%, ${outer} 50%, transparent 80%)`;

const gradSpill = (inner: string, outer: string) =>
  `radial-gradient(ellipse 92% 100% at 50% 100%, ${inner} 0%, ${outer} 55%, transparent 80%)`;

export const BottomBorderInput = forwardRef<HTMLInputElement, Props>(
  function BottomBorderInput(
    { label, icon, error, success, id, className, onFocus, onBlur, ...rest },
    ref,
  ) {
    const reduced = useReducedMotion();
    const [focused, setFocused] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(rest.defaultValue || rest.value));
    const [shakeKey, setShakeKey] = useState(0);
    const inputId = id ?? `bb-${label.replace(/\s+/g, "-").toLowerCase()}`;

    useEffect(() => {
      if (error && !reduced) setShakeKey((k) => k + 1);
    }, [error, reduced]);

    const isError = Boolean(error);
    const isLit = focused && !isError;

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
                : hovered
                  ? "rgba(255,255,255,0.55)"
                  : "rgba(255,255,255,0.38)",
          }}
          transition={{ duration: 0.25 }}
        >
          {label}
        </motion.label>

        {/* Hover wrapper — scales the whole pill without disrupting shake key */}
        <motion.div
          className="relative"
          whileHover={reduced ? undefined : { scale: 1.01 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
        <motion.div
          key={shakeKey}
          animate={
            isError && !reduced ? { x: [0, -5, 5, -4, 4, -2, 2, 0] } : { x: 0 }
          }
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* ── PILL ── */}
          <motion.div
            className="relative flex h-[52px] items-center gap-3 overflow-hidden rounded-full px-5"
            animate={{
              boxShadow: isError
                ? "0 0 0 1px rgba(252,165,165,0.38), 0 4px 12px rgba(0,0,0,0.20)"
                : focused
                  ? "0 0 0 1px rgba(255,255,255,0.20), 0 4px 14px rgba(0,0,0,0.22)"
                  : hovered
                    ? "0 0 0 1px rgba(255,255,255,0.22), 0 4px 12px rgba(0,0,0,0.20)"
                    : "0 0 0 1px rgba(255,255,255,0.10)",
            }}
            transition={{ duration: 0.25 }}
            style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
          >
            {/* Reflective surface — always-on gradient, opacity-faded when not focused */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.07) 55%, rgba(148,138,255,0.18) 88%, rgba(120,110,255,0.26) 100%)",
              }}
              animate={{ opacity: isLit ? 1 : 0 }}
              transition={{ duration: 0.65, ease: "easeInOut" }}
            />

            {/* Icon */}
            {icon && (
              <motion.span
                className="relative z-10 flex-shrink-0"
                animate={{
                  color: isError
                    ? "rgba(252,165,165,0.75)"
                    : focused
                      ? "rgba(190,182,255,0.92)"
                      : "rgba(255,255,255,0.28)",
                }}
                transition={{ duration: 0.30 }}
              >
                {icon}
              </motion.span>
            )}

            {/* Input — text blooms with light source */}
            <motion.input
              ref={ref}
              id={inputId}
              {...(rest as object)}
              onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                setFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                setFocused(false);
                setHasValue(Boolean(e.target.value));
                onBlur?.(e);
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setHasValue(Boolean(e.target.value));
                rest.onChange?.(e);
              }}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="relative z-10 flex-1 bg-transparent text-[15px] tracking-wide outline-none border-0 ring-0 placeholder:text-white/20"
              animate={{
                textShadow: isLit
                  ? "0 0 12px rgba(168,158,255,0.55)"
                  : "0 0 0px rgba(168,158,255,0)",
              }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              style={{
                caretColor: "#b0a8ff",
                color: focused ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.82)",
                WebkitBoxShadow: "0 0 0 1000px transparent inset",
                WebkitTextFillColor: focused ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.82)",
                transition: "background-color 5000s ease-in-out 0s, color 0.3s ease, -webkit-text-fill-color 0.3s ease",
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

          {/* ── PHYSICAL LIGHT SOURCE — outside overflow-hidden so it spills freely ── */}
          {!reduced && (
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0">

              {/* Core strip line — the "filament" of the light source */}
              <motion.div
                className="absolute inset-x-8 bottom-0 h-[1.5px] origin-center rounded-full"
                animate={
                  isLit
                    ? {
                        scaleX: [1, 1],
                        opacity: [0.75, 1, 0.75],
                        background: [
                          gradCore(V.coreDim, V.centerDim),
                          gradCore(V.coreBright, V.centerBrt),
                          gradCore(V.coreDim, V.centerDim),
                        ],
                      }
                    : isError
                      ? {
                          scaleX: 1,
                          opacity: 1,
                          background: "linear-gradient(90deg, transparent, rgba(252,165,165,0.55) 25%, rgba(252,165,165,1) 50%, rgba(252,165,165,0.55) 75%, transparent)",
                        }
                      : { scaleX: 0, opacity: 0, background: "linear-gradient(90deg,transparent,transparent)" }
                }
                transition={
                  isLit
                    ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.50, ease: [0.22, 1, 0.36, 1] }
                }
              />

              {/* Mid halo — tight diffuse bloom */}
              <motion.div
                className="absolute inset-x-0 bottom-0"
                style={{ height: "30px", transformOrigin: "center bottom" }}
                animate={
                  isLit
                    ? {
                        opacity: [0.65, 1, 0.65],
                        scaleY: [0.88, 1.06, 0.88],
                        background: [
                          gradMid(V.midInner, V.midOuter),
                          gradMid(V.midInnerB, V.midOuterB),
                          gradMid(V.midInner, V.midOuter),
                        ],
                      }
                    : isError
                      ? { opacity: 0.7, scaleY: 1, background: "radial-gradient(ellipse 72% 100% at 50% 100%, rgba(252,165,165,0.28) 0%, transparent 70%)" }
                      : { opacity: 0, scaleY: 0.4, background: "radial-gradient(ellipse 72% 100% at 50% 100%, transparent 0%, transparent 100%)" }
                }
                transition={
                  isLit
                    ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.55, ease: "easeOut" }
                }
              />

              {/* Wide volumetric spill — bleeds far below, blurred */}
              <motion.div
                className="absolute inset-x-0 bottom-0"
                style={{ height: "72px", transformOrigin: "center bottom", filter: "blur(7px)" }}
                animate={
                  isLit
                    ? {
                        opacity: [0.50, 0.90, 0.50],
                        scaleY: [0.82, 1.02, 0.82],
                        background: [
                          gradSpill(V.spillIn, V.spillOut),
                          gradSpill(V.spillInB, V.spillOutB),
                          gradSpill(V.spillIn, V.spillOut),
                        ],
                      }
                    : isError
                      ? { opacity: 0.45, scaleY: 1, background: "radial-gradient(ellipse 92% 100% at 50% 100%, rgba(252,165,165,0.12) 0%, transparent 70%)" }
                      : { opacity: 0, scaleY: 0.3, background: "radial-gradient(ellipse 92% 100% at 50% 100%, transparent 0%, transparent 100%)" }
                }
                transition={
                  isLit
                    ? { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.08 }
                    : { duration: 0.65, ease: "easeOut" }
                }
              />
            </div>
          )}
        </motion.div>
        </motion.div>{/* end hover wrapper */}

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
