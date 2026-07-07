import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { motion } from "motion/react";
import { Sparkles, Star, Compass, Heart, Pencil } from "lucide-react";
import { getProfileIdentity } from "@/lib/profileEngine";
import { dur, ease } from "@/lib/motion";
import { useProfile } from "@/hooks/use-users";
import { useOverview } from "@/hooks/use-analytics";
import { adaptProfile } from "@/lib/adapters/users";
import { adaptOverview } from "@/lib/adapters/analytics";
import { EditProfileDialog } from "./EditProfileDialog";
import { useState } from "react";

export function IdentityHero({ compact = false }: { compact?: boolean }) {
  const [editOpen, setEditOpen] = useState(false);
  const { data: rawProfile, isLoading: pLoading } = useProfile();
  const { data: rawOverview, isLoading: oLoading } = useOverview();

  const id = getProfileIdentity(); // Fallback for unsupported backend metrics

  if (pLoading || oLoading) {
    return <PremiumGlass variant="strong" className="h-64 animate-pulse bg-white/[0.02]" />;
  }

  const profile = rawProfile ? adaptProfile(rawProfile) : null;
  const overview = rawOverview ? adaptOverview(rawOverview) : null;

  const name = profile?.displayName || profile?.username || id.name;
  const bio = profile?.bio || id.personalitySummary;
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : id.memberSince;
  const memoryAgeYears = profile?.createdAt
    ? Math.max(1, Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (365.25 * 86400_000)))
    : id.memoryAgeYears;
  
  const totalStories = overview?.totalItems ?? id.totalStories;
  const totalHours = overview?.hoursSpent ?? id.totalHours;

  return (
    <>
      <PremiumGlass variant="strong" glow="oklch(0.72 0.18 255 / 0.4)">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.large, ease: ease.out }}
          className={compact ? "p-6" : "p-8 md:p-10"}
        >
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 sm:flex sm:flex-wrap sm:justify-between">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground flex items-center justify-between">
                <span>{memoryAgeYears} years of memory · since {memberSince}</span>
                {!compact && (
                  <button onClick={() => setEditOpen(true)} className="relative z-10 flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 transition-colors hover:bg-white/10 hover:text-primary cursor-pointer press-scale">
                    <Pencil className="h-3 w-3" /> Edit Profile
                  </button>
                )}
              </div>
              <h1
                className={`mt-2 font-display tracking-tight ${compact ? "text-3xl" : "text-4xl md:text-5xl"}`}
              >
                {name}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {bio}
              </p>
              <blockquote className="mt-4 border-l-2 border-primary/40 pl-3 text-sm italic text-foreground/85">
                "{id.personalQuote}"
              </blockquote>
            </div>
            {!compact && (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <ScoreCard
                  icon={<Heart className="h-4 w-4" />}
                  label="Memory"
                  value={id.memoryScore}
                />
                <ScoreCard
                  icon={<Compass className="h-4 w-4" />}
                  label="Discovery"
                  value={id.discoveryScore}
                />
                <ScoreCard
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Curiosity"
                  value={id.curiosityScore}
                />
              </div>
            )}
          </div>
          {!compact && (
            <div className="mt-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <Chip icon={<Star className="h-3 w-3" />}>{totalStories} stories</Chip>
              <Chip>{totalHours.toLocaleString()} h lived</Chip>
              <Chip>{id.readingIdentity}</Chip>
              <Chip>{id.watchingIdentity}</Chip>
              <Chip>{id.gamingIdentity}</Chip>
            </div>
          )}
        </motion.div>
      </PremiumGlass>

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} profile={profile} />
    </>
  );
}

function Chip({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span className="glass-subtle inline-flex items-center gap-1.5 rounded-full px-3 py-1.5">
      {icon}
      {children}
    </span>
  );
}
function ScoreCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <PremiumGlass 
      variant="subtle" 
      className="min-w-[88px] px-3 py-2.5 text-center cursor-pointer press-scale relative z-10"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
    >
      <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-display text-2xl tracking-tight">{value}</div>
    </PremiumGlass>
  );
}
