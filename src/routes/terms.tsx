import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-[oklch(0.08_0.02_270)] py-20 px-4 md:px-8 text-white flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full space-y-8">
        <Link to="/" className="text-sm text-white/50 hover:text-white transition-colors">
          &larr; Back home
        </Link>
        <h1 className="text-4xl font-display tracking-tight">Terms of Service</h1>
        <p className="text-white/70">
          By using Chronicle, you agree to treat your personal data with care.
          This is a personal memory sanctuary.
        </p>
        <p className="text-white/70">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
