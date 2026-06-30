import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowRight, Lock, Mail, Check, Loader as Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { AtmosphereBackground } from "@/components/atmosphere/AtmosphereBackground";

import { AuthStage } from "@/components/auth/AuthStage";
import { MobileMemoryHero } from "@/components/auth/MobileMemoryHero";
import { BottomBorderInput } from "@/components/auth/BottomBorderInput";
import { LiquidGlassCard } from "@/components/auth/LiquidGlassCard";
import { ParticleBurst } from "@/components/auth/ParticleBurst";
import { useMouseParallax } from "@/lib/useParallax";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Enter Chronicle — the portal" },
      {
        name: "description",
        content: "Sign in to Chronicle. Pick up your story where you left it.",
      },
    ],
  }),
  component: Auth,
});

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  remember: z.boolean().optional(),
});
const signUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type SignIn = z.infer<typeof signInSchema>;
type SignUp = z.infer<typeof signUpSchema>;

type Mode = "signin" | "signup";

function Auth() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<Mode>("signin");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const { x: ax, y: ay } = useMouseParallax(18);

  const signIn = useForm<SignIn>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", remember: true },
  });
  const signUp = useForm<SignUp>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = () => {
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => navigate({ to: "/app" }), 700);
    }, 900);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.08_0.02_270)]">
      <AtmosphereBackground intensity="vivid" />

      {/* === FULL-CANVAS MEMORY STAGE (desktop) === */}
      <div className="absolute inset-0">
        <AuthStage />
      </div>

      {/* === COMPRESSED MEMORY SCENE (mobile/tablet) === */}
      <MobileMemoryHero />

      {/* === AURORA / LIGHT-LEAK BLOB behind the card === */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] top-1/2 z-[2] hidden h-[820px] w-[820px] -translate-y-1/2 rounded-full lg:block"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.22 290 / 0.30) 0%, oklch(0.62 0.20 240 / 0.18) 35%, transparent 70%)",
          filter: "blur(80px)",
          x: reduced ? 0 : (ax as never),
          y: reduced ? 0 : (ay as never),
        }}
        animate={
          reduced
            ? undefined
            : { scale: [1, 1.06, 0.98, 1], opacity: [0.85, 1, 0.9, 0.85] }
        }
        transition={
          reduced ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }
        }
      />
      {/* warm counter-leak from below */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] right-[8%] z-[2] hidden h-[520px] w-[520px] rounded-full lg:block"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.18 35 / 0.22) 0%, transparent 70%)",
          filter: "blur(70px)",
          x: reduced ? 0 : (ax as never),
          y: reduced ? 0 : (ay as never),
        }}
      />

      {/* === FLOATING AUTH SLAB === */}
      <div className="relative z-10 flex min-h-screen items-end justify-center px-4 pb-6 lg:items-center lg:justify-end lg:px-0 lg:pb-0 lg:pr-[5vw] xl:pr-[7vw]">
        <LiquidGlassCard className="w-full max-w-[440px] p-7 md:p-9">
          {/* Particle burst on success */}
          <ParticleBurst active={status === "success"} />

          {/* === Card content === */}
          <div className="relative">
            {/* Mobile brand */}
            <Link to="/" className="mb-5 inline-flex items-center gap-2 lg:hidden">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                <span className="font-display leading-none">C</span>
              </div>
              <span className="font-display text-lg">Chronicle</span>
            </Link>

            <span className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-white/40">
              Portal
            </span>
            <h1 className="font-display text-[2.6rem] leading-none tracking-tight text-white md:text-[3rem]">
              {mode === "signin" ? "Welcome back" : (
                <>Begin your <span className="italic text-white/80">Chronicle</span></>
              )}
            </h1>
            <p className="mt-3 text-[13.5px] font-sans text-neutral-400">
              {mode === "signin"
                ? "Pick up your story where you left it."
                : "One quiet place for every story you finish."}
            </p>

            {/* Tabs — slimmer, less chrome */}
            <div className="relative mt-7 grid grid-cols-2 text-[12px] uppercase tracking-[0.18em]">
              <motion.div
                layout
                className="absolute bottom-0 h-px w-1/2 bg-white/70"
                style={{ left: mode === "signin" ? 0 : "50%" }}
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
              />
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`pb-2 text-left transition-colors duration-300 ${mode === "signin" ? "text-white" : "text-white/35 hover:text-white/60"}`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`pb-2 text-right transition-colors duration-300 ${mode === "signup" ? "text-white" : "text-white/35 hover:text-white/60"}`}
              >
                Create
              </button>
              <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.08]" />
            </div>

            {/* Google */}
            <button
              onClick={onSubmit}
              type="button"
              className="group relative mt-7 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-[13px] font-medium tracking-wide text-white/90 transition-all duration-300 hover:scale-[1.01] hover:border-white/20 hover:bg-white/[0.07] active:scale-[0.99]"
            >
              <GoogleIcon /> Continue with Google
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -translate-x-full opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[420%] group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                }}
              />
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
              <span className="text-[9px] uppercase tracking-[0.28em] text-white/35">
                or with email
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
            </div>

            <AnimatePresence mode="wait">
              {mode === "signin" ? (
                <motion.form
                  key="signin"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.35 }}
                  onSubmit={signIn.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <BottomBorderInput
                    label="Email"
                    type="email"
                    icon={<Mail className="h-4 w-4" />}
                    error={signIn.formState.errors.email?.message}
                    {...signIn.register("email")}
                  />
                  <BottomBorderInput
                    label="Password"
                    type="password"
                    icon={<Lock className="h-4 w-4" />}
                    error={signIn.formState.errors.password?.message}
                    {...signIn.register("password")}
                  />

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <label className="inline-flex cursor-pointer items-center gap-2 text-white/45 transition hover:text-white/70">
                      <input
                        type="checkbox"
                        {...signIn.register("remember")}
                        className="peer sr-only"
                      />
                      <span className="grid h-3.5 w-3.5 place-items-center rounded-sm border border-white/20 bg-white/[0.04] transition peer-checked:border-white/70 peer-checked:bg-white/80">
                        <Check className="h-2.5 w-2.5 text-black opacity-0 peer-checked:opacity-100" />
                      </span>
                      Remember me
                    </label>
                    <a href="#" className="text-white/45 transition hover:text-white/80">
                      Forgot password?
                    </a>
                  </div>

                  <CreamButton status={status} label="Continue" />
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.35 }}
                  onSubmit={signUp.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <BottomBorderInput
                    label="Email"
                    type="email"
                    icon={<Mail className="h-4 w-4" />}
                    error={signUp.formState.errors.email?.message}
                    {...signUp.register("email")}
                  />
                  <BottomBorderInput
                    label="Create a password"
                    type="password"
                    icon={<Lock className="h-4 w-4" />}
                    error={signUp.formState.errors.password?.message}
                    {...signUp.register("password")}
                  />
                  <CreamButton status={status} label="Begin Chronicle" />
                </motion.form>
              )}
            </AnimatePresence>

            <p className="mt-6 text-center text-[10.5px] tracking-wide text-white/35">
              By continuing you agree to our{" "}
              <a className="text-white/55 underline-offset-4 hover:underline" href="#">
                Terms
              </a>{" "}
              &{" "}
              <a className="text-white/55 underline-offset-4 hover:underline" href="#">
                Privacy
              </a>
              .
            </p>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
}

function CreamButton({
  status,
  label,
}: {
  status: "idle" | "loading" | "success";
  label: string;
}) {
  return (
    <button
      type="submit"
      disabled={status !== "idle"}
      className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#F9F9F6] px-5 py-3.5 text-[13.5px] font-medium tracking-wide text-black shadow-[0_18px_50px_-18px_rgba(255,255,255,0.55),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-[0_24px_70px_-18px_rgba(255,255,255,0.75),inset_0_1px_0_rgba(255,255,255,0.95)] active:scale-[0.98] disabled:opacity-95"
    >
      {/* metallic shimmer sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -translate-x-full opacity-0 transition-all duration-[900ms] ease-out group-hover:translate-x-[420%] group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)",
        }}
      />
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.span
            key="i"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="inline-flex items-center gap-2"
          >
            {label}{" "}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </motion.span>
        )}
        {status === "loading" && (
          <motion.span
            key="l"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="inline-flex items-center gap-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" /> Entering…
          </motion.span>
        )}
        {status === "success" && (
          <motion.span
            key="s"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2"
          >
            <Check className="h-4 w-4" /> Welcome
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 10.2v3.9h5.5c-.24 1.27-1.7 3.73-5.5 3.73a6.1 6.1 0 1 1 0-12.2c1.93 0 3.23.83 3.97 1.54l2.7-2.6C16.93 2.97 14.7 2 12 2 6.97 2 2.9 6.07 2.9 11.1S6.97 20.2 12 20.2c6.92 0 9.5-4.86 9.5-9.32 0-.62-.06-1.1-.16-1.58H12z"
      />
    </svg>
  );
}
