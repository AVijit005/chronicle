import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { motion } from "motion/react";
import { Sparkles, Star, Compass, Heart } from "lucide-react";
import { getProfileIdentity } from "@/lib/profileEngine";
import { dur, ease } from "@/lib/motion";

export function IdentityHero({ compact = false }: { compact?: boolean }) {
  const id = getProfileIdentity();
  return (
    <PremiumGlass variant="strong" glow="oklch(0.72 0.18 255 / 0.4)">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: dur.large, ease: ease.out }}
        className={compact ? "p-6" : "p-8 md:p-10"}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {id.memoryAgeYears} years of memory · since {id.memberSince}
            </div>
            <h1
              className={`mt-2 font-display tracking-tight ${compact ? "text-3xl" : "text-4xl md:text-5xl"}`}
            >
              {id.name}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {id.personalitySummary}
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
            <Chip icon={<Star className="h-3 w-3" />}>{id.totalStories} stories</Chip>
            <Chip>{id.totalHours.toLocaleString()} h lived</Chip>
            <Chip>{id.readingIdentity}</Chip>
            <Chip>{id.watchingIdentity}</Chip>
            <Chip>{id.gamingIdentity}</Chip>
          </div>
        )}
      </motion.div>
    </PremiumGlass>
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
    <div className="glass-subtle min-w-[88px] rounded-2xl px-3 py-2.5 text-center">
      <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-display text-2xl tracking-tight">{value}</div>
    </div>
  );
}
