import { createFileRoute, Link } from "@tanstack/react-router";
import { AtmosphereBackground } from "@/components/atmosphere/AtmosphereBackground";
import { LiquidGlassCard } from "@/components/auth/LiquidGlassCard";

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.08_0.02_270)] flex items-center justify-center p-4">
      <AtmosphereBackground intensity="vivid" />
      <LiquidGlassCard className="relative z-10 w-full max-w-[448px] p-7 md:p-9 text-center space-y-6">
        <h1 className="text-2xl font-display text-white">Reset Password</h1>
        <p className="text-white/60 text-sm">Enter your email and we'll send you a link to get back into your account.</p>
        <input 
          type="email" 
          placeholder="Enter email"
          className="w-full h-12 rounded-full bg-white/5 border border-white/10 px-4 text-white placeholder:text-white/30 outline-none focus:border-white/30"
        />
        <button className="w-full h-12 rounded-full bg-white text-black font-medium text-sm hover:scale-[1.02] transition-transform">
          Send reset link
        </button>
        <div className="pt-4">
          <Link to="/auth" className="text-white/40 hover:text-white/80 text-xs">
            &larr; Back to sign in
          </Link>
        </div>
      </LiquidGlassCard>
    </div>
  );
}
