import { createFileRoute, Link } from "@tanstack/react-router";
import { AtmosphereBackground } from "@/components/atmosphere/AtmosphereBackground";
import { LiquidGlassCard } from "@/components/auth/LiquidGlassCard";

import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    
    // Simulate network request since backend endpoint doesn't exist yet
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("If an account exists, a reset link has been sent.");
      setEmail("");
    }, 1000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.08_0.02_270)] flex items-center justify-center p-4">
      <AtmosphereBackground intensity="vivid" />
      <LiquidGlassCard className="relative z-10 w-full max-w-[448px] p-7 md:p-9 text-center space-y-6">
        <h1 className="text-2xl font-display text-white">Reset Password</h1>
        <p className="text-white/60 text-sm">Enter your email and we'll send you a link to get back into your account.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
            className="w-full h-12 rounded-full bg-white/5 border border-white/10 px-4 text-white placeholder:text-white/30 outline-none focus:border-white/30 disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full h-12 rounded-full bg-white text-black font-medium text-sm hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <div className="pt-4">
          <Link to="/auth" className="text-white/40 hover:text-white/80 text-xs">
            &larr; Back to sign in
          </Link>
        </div>
      </LiquidGlassCard>
    </div>
  );
}
