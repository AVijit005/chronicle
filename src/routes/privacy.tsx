import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[oklch(0.08_0.02_270)] py-20 px-4 md:px-8 text-white flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full space-y-8">
        <Link to="/" className="text-sm text-white/50 hover:text-white transition-colors">
          &larr; Back home
        </Link>
        <h1 className="text-4xl font-display tracking-tight">Privacy Policy</h1>
        <p className="text-white/70">
          Your data belongs to you. We do not sell your personal media history.
        </p>
        <p className="text-white/70">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
