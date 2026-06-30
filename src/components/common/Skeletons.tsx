// Layout-matching skeletons. Each variant mirrors its target page rhythm.
// Stagger via parent variants; reduced-motion respected by ShimmerSkeleton CSS.
import { motion } from "motion/react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { ShimmerSkeleton } from "@/components/ui/ShimmerSkeleton";
import { ease } from "@/lib/motion";

function Block({ className }: { className?: string }) {
  return <ShimmerSkeleton className={className} />;
}

const parent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const child = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: ease.out } },
};

function Group({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={parent} initial="hidden" animate="visible" className={className}>
      {children}
    </motion.div>
  );
}

export function DashboardSkeleton() {
  return (
    <Group className="space-y-8">
      <motion.div variants={child}>
        <PremiumGlass variant="strong">
          <div className="space-y-4 p-10">
            <Block className="h-3 w-32 rounded-full" />
            <Block className="h-10 w-3/4 rounded-2xl" />
            <Block className="h-4 w-1/2 rounded-md" />
          </div>
        </PremiumGlass>
      </motion.div>
      <motion.div variants={child} className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <PremiumGlass key={i}>
            <div className="space-y-3 p-6">
              <Block className="h-3 w-1/3 rounded-full" />
              <Block className="h-10 w-2/3 rounded-lg" />
              <Block className="h-3 w-full rounded-md" />
            </div>
          </PremiumGlass>
        ))}
      </motion.div>
      <motion.div variants={child} className="grid grid-cols-2 gap-4 md:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Block key={i} className="aspect-[2/3] rounded-2xl" />
        ))}
      </motion.div>
    </Group>
  );
}

export function LibrarySkeleton() {
  return (
    <Group className="space-y-8">
      <motion.div variants={child} className="space-y-3">
        <Block className="h-3 w-24 rounded-full" />
        <Block className="h-10 w-2/3 max-w-md rounded-2xl" />
        <Block className="h-4 w-1/3 max-w-xs rounded-md" />
      </motion.div>
      <motion.div
        variants={child}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Block className="aspect-[2/3] rounded-2xl" />
            <Block className="h-3 w-3/4 rounded-md" />
            <Block className="h-2 w-1/2 rounded-md" />
          </div>
        ))}
      </motion.div>
    </Group>
  );
}

export function MediaDetailSkeleton() {
  return (
    <Group className="space-y-8">
      <motion.div variants={child}>
        <Block className="aspect-[21/9] w-full rounded-3xl" />
      </motion.div>
      <motion.div variants={child} className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <PremiumGlass key={i}>
            <div className="space-y-2 p-5">
              <Block className="h-3 w-1/3 rounded-full" />
              <Block className="h-6 w-2/3 rounded-md" />
              <Block className="h-3 w-full rounded-md" />
            </div>
          </PremiumGlass>
        ))}
      </motion.div>
      <motion.div variants={child} className="space-y-3">
        <Block className="h-3 w-32 rounded-full" />
        <Block className="h-8 w-1/2 max-w-md rounded-xl" />
        <Block className="h-3 w-3/4 rounded-md" />
        <Block className="h-3 w-2/3 rounded-md" />
      </motion.div>
    </Group>
  );
}

export function CollectionsSkeleton() {
  return (
    <Group className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div key={i} variants={child}>
          <Block className="aspect-[16/10] rounded-3xl" />
        </motion.div>
      ))}
    </Group>
  );
}

export function AnalyticsSkeleton() {
  return (
    <Group className="space-y-10">
      <motion.div variants={child}>
        <PremiumGlass variant="strong">
          <div className="space-y-3 p-10">
            <Block className="h-3 w-24 rounded-full" />
            <Block className="h-10 w-2/3 rounded-2xl" />
            <Block className="h-4 w-1/3 rounded-md" />
          </div>
        </PremiumGlass>
      </motion.div>
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div key={i} variants={child} className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
          <PremiumGlass>
            <div className="space-y-3 p-6">
              <Block className="h-3 w-32 rounded-full" />
              <Block className="h-56 w-full rounded-2xl" />
            </div>
          </PremiumGlass>
          <div className="space-y-3 p-2">
            <Block className="h-2 w-16 rounded-full" />
            <Block className="h-3 w-3/4 rounded-md" />
            <Block className="h-3 w-2/3 rounded-md" />
            <Block className="h-3 w-1/2 rounded-md" />
          </div>
        </motion.div>
      ))}
    </Group>
  );
}

export function TimelineSkeleton() {
  return (
    <Group className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div key={i} variants={child}>
          <PremiumGlass>
            <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 p-5">
              <Block className="h-3 w-full rounded-md" />
              <div className="space-y-2">
                <Block className="h-4 w-2/3 rounded-md" />
                <Block className="h-3 w-1/2 rounded-md" />
              </div>
            </div>
          </PremiumGlass>
        </motion.div>
      ))}
    </Group>
  );
}

export function WrappedSkeleton() {
  return (
    <Group className="space-y-8">
      <motion.div variants={child}>
        <Block className="aspect-[16/9] w-full rounded-[40px]" />
      </motion.div>
      <motion.div variants={child} className="mx-auto max-w-2xl space-y-3">
        <Block className="h-3 w-24 mx-auto rounded-full" />
        <Block className="h-10 w-2/3 mx-auto rounded-xl" />
        <Block className="h-3 w-1/2 mx-auto rounded-md" />
      </motion.div>
    </Group>
  );
}

export function CalendarSkeleton() {
  return (
    <Group className="grid grid-cols-7 gap-2">
      {Array.from({ length: 35 }).map((_, i) => (
        <motion.div key={i} variants={child}>
          <Block className="aspect-square rounded-xl" />
        </motion.div>
      ))}
    </Group>
  );
}

export function JournalSkeleton() {
  return (
    <Group className="space-y-10">
      <motion.div variants={child}>
        <Block className="h-48 w-full rounded-[40px]" />
      </motion.div>
      <motion.div variants={child} className="mx-auto max-w-2xl">
        <Block className="h-64 w-full rounded-3xl" />
      </motion.div>
      <motion.div variants={child} className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Block key={i} className="h-44 w-full rounded-3xl" />
        ))}
      </motion.div>
    </Group>
  );
}
export function GoalsSkeleton() {
  return <CollectionsSkeleton />;
}
export function AchievementsSkeleton() {
  return <CollectionsSkeleton />;
}

export function SearchSkeleton() {
  return (
    <Group className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div key={i} variants={child}>
          <Block className="h-14 w-full rounded-2xl" />
        </motion.div>
      ))}
    </Group>
  );
}
