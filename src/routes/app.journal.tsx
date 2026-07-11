import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { StatCardPremium } from "@/components/analytics/AnalyticsKit";
import { MemoryBookmarks } from "@/components/memory/MemoryBookmarks";
import { getActiveChallenge } from "@/lib/challenges";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { MemoryDNA } from "@/components/intelligence/MemoryDNA";
import { YourReflectionsRail } from "@/components/memory/YourReflectionsRail";
import { LiveStatsStrip } from "@/components/memory/LiveStatsStrip";
import { useJournalEntries, useJournalStats, useCreateJournalEntry, useJournalPrompts } from "@/hooks/use-journal";
import { useDiscovery } from "@/hooks/use-analytics";
import { toast } from "sonner";
import { adaptJournalEntry } from "@/lib/adapters/journal";
import { useMemo, useState, useEffect, useRef } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShimmerSkeleton } from "@/components/ui/ShimmerSkeleton";
import { PremiumErrorState } from "@/components/common/PremiumErrorState";
import { countWords } from "@/lib/utils/words";
import { JournalHero, JournalPrompt, MoodChart, JournalEntryCard, WriteOverlay } from "@/components/journal";
import { MemoryZone } from "@/components/calendar";

export const Route = createFileRoute("/app/journal")({
  component: JournalPage,
  head: () => ({
    meta: [
      { title: "Journal — Chronicle" },
      { name: "description", content: "Write about the stories that stayed with you. Capture moods, memories, and moments." },
      { property: "og:title", content: "Chronicle Journal" },
      { property: "og:description", content: "Words for the stories that stayed." },
    ],
  }),
});

function JournalPage() {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [isSealing, setIsSealing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const createJournalEntry = useCreateJournalEntry();

  useEffect(() => {
    if (isWriting && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 400);
    }
  }, [isWriting]);

  useEffect(() => {
    if (!isWriting) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsWriting(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isWriting]);

  const { data: journalData, isLoading: isLoadingJournal, isError: isJournalError, refetch: refetchJournal, hasNextPage, fetchNextPage, isFetchingNextPage } = useJournalEntries();
  const { data: statsData } = useJournalStats();
  const { data: discovery } = useDiscovery();
  const { data: prompts } = useJournalPrompts();

  const hour = new Date().getHours();
  const timeContext =
    hour < 12 ? "This morning" :
    hour < 17 ? "This afternoon" :
    hour < 21 ? "This evening" :
    "Tonight";

  const entries = useMemo(() => {
    return journalData?.pages.flatMap((p) => p.data).map(adaptJournalEntry) ?? [];
  }, [journalData]);

  const favoriteMood = useMemo(() => {
    const tally: Record<string, number> = {};
    entries.forEach((e) => { if (e.mood) tally[e.mood] = (tally[e.mood] || 0) + 1; });
    const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? null;
  }, [entries]);

  const moodTimeline = useMemo(() => {
    const MOOD_COLORS: Record<string, string> = {
      "Happy": "oklch(0.78 0.16 80)", "Inspired": "oklch(0.7 0.2 145)",
      "Emotional": "oklch(0.65 0.22 295)", "Excited": "oklch(0.7 0.18 25)",
      "Relaxed": "oklch(0.72 0.18 255)", "Thoughtful": "oklch(0.55 0.18 280)",
    };
    const last30 = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().slice(0, 10);
      const entry = entries.find((e) => e.createdAt.slice(0, 10) === dateStr);
      const moodStr = entry?.mood ?? null;
      const color = moodStr ? (MOOD_COLORS[moodStr] || "oklch(0.5 0 0)") : "oklch(0.5 0 0 / 0.15)";
      const words = entry ? countWords(entry.content) : 0;
      return { day: 30 - i, mood: moodStr, color, intensity: moodStr ? Math.min(1, Math.max(0.08, words / 1500)) : 0.04 };
    }).reverse();
    return last30;
  }, [entries]);

  const favoriteEntries = useMemo(() => {
    return [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 2);
  }, [entries]);

  const handleSeal = async () => {
    setIsSealing(true);
    try {
      await createJournalEntry.mutateAsync({ content: journalText, mood: "Reflective" });
      toast.success("Entry sealed and saved.");
      setIsWriting(false);
      setJournalText("");
    } catch {
      toast.error("Failed to save entry. Please try again.");
    } finally {
      setIsSealing(false);
    }
  };

  if (isJournalError) {
    return (
      <div className="py-20">
        <PremiumErrorState
          title="Couldn't load your journal"
          description="Something went wrong fetching your entries. Please try again."
          action={<PremiumButton variant="primary" onClick={() => refetchJournal()}>Retry</PremiumButton>}
        />
      </div>
    );
  }

  return (
    <div className="pb-32 pt-2">
      <JournalHero isLoading={isLoadingJournal} stats={statsData ? { journalCount: statsData.journalCount, writingStreak: statsData.writingStreak } : null} entries={entries} favoriteMood={favoriteMood} />

      <MemoryZone title={`A prompt for ${timeContext.toLowerCase()}`} sub="One question. No pressure.">
        <JournalPrompt promptIndex={promptIndex} timeContext={timeContext} onStartWriting={() => setIsWriting(true)} onNextPrompt={() => setPromptIndex((prev) => (prev + 1) % ((prompts?.length ?? 1) || 1))} />
      </MemoryZone>

      <MemoryZone title="Your writing, today" sub="Pulled straight from your library — no demo data.">
        <LiveStatsStrip />
      </MemoryZone>

      <MemoryZone title="What you watched & played" sub="The stories that shaped your thoughts this month.">
        <MemoryBookmarks />
      </MemoryZone>

      <MemoryZone title="Recurring themes" sub="The algorithm noticed these patterns in your writing.">
        <MemoryDNA mediaId={entries[0]?.title?.slice(0, 20) || "interstellar"} />
      </MemoryZone>

      <MemoryZone title="Follow the thread">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ChallengeCard challenge={getActiveChallenge()} />
        </div>
      </MemoryZone>

      <MemoryZone title="Past reflections" sub="Your own words, resurfaced when relevant.">
        <YourReflectionsRail />
      </MemoryZone>

      <MemoryZone title="Lately">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {entries.length === 0 && !isLoadingJournal && (
            <div className="text-muted-foreground">No recent journal entries found.</div>
          )}
          {entries.slice(0, 4).map((j, i) => <JournalEntryCard key={j.id} entry={j} index={i} />)}
        </div>
        {hasNextPage && entries.length > 0 && (
          <div className="mt-6 flex justify-center">
            <PremiumButton variant="secondary" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? "Loading…" : "Load more entries"}
            </PremiumButton>
          </div>
        )}
      </MemoryZone>

      <MemoryZone title="Moods across the month">
        {isLoadingJournal ? (
          <div className="mt-16 md:mt-24">
            <ShimmerSkeleton className="mb-6 h-6 w-48 rounded-full" variant="line" />
            <ShimmerSkeleton className="h-[260px] rounded-2xl" variant="glass" />
          </div>
        ) : entries.length === 0 ? (
          <EmptyState
            icon={<NotebookPen className="h-6 w-6" />}
            title="No entries yet"
            description="Start journaling to see your mood patterns emerge over time."
            action={<PremiumButton variant="primary" onClick={() => setIsWriting(true)}>Write your first entry</PremiumButton>}
          />
        ) : (
          <PremiumGlass interactive variant="strong" glow="oklch(0.7 0.18 35 / 0.15)" className="p-6 md:p-8">
            <MoodChart moodTimeline={moodTimeline} hoveredDay={hoveredDay} onHoverDay={setHoveredDay} />
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {["Happy", "Inspired", "Emotional", "Excited", "Relaxed", "Thoughtful"].map((m, i) => {
                const colors = ["oklch(0.78 0.16 80)", "oklch(0.7 0.2 145)", "oklch(0.65 0.22 295)", "oklch(0.7 0.18 25)", "oklch(0.72 0.18 255)", "oklch(0.55 0.18 280)"];
                const isActive = selectedMood === m;
                return (
                  <button key={m}
                    onClick={() => setSelectedMood(isActive ? null : m)}
                    className={`glass-subtle group flex items-center gap-2.5 rounded-full px-4 py-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${isActive ? 'border-white/20 shadow-[0_0_16px_-4px_' + colors[i].replace('oklch', '') + '40]' : 'border border-transparent hover:border-white/5'}`}
                  >
                    <span className="h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: colors[i], boxShadow: `0 0 12px ${colors[i]}80` }} />
                    <span className={`text-[10px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>{m}</span>
                  </button>
                );
              })}
            </div>
          </PremiumGlass>
        )}
      </MemoryZone>

      {isLoadingJournal ? (
        <div className="mt-16 md:mt-24">
          <ShimmerSkeleton className="mb-6 h-6 w-48 rounded-full" variant="line" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => <ShimmerSkeleton key={i} className="h-24 rounded-2xl" variant="glass" />)}
          </div>
        </div>
      ) : (
        <MemoryZone title="Writing statistics">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <StatCardPremium label="Entries" value={statsData?.journalCount ?? 0} />
            <StatCardPremium label="Words" value={entries.reduce((acc, cur) => acc + countWords(cur.content), 0)} accent="oklch(0.65 0.22 295 / 0.4)" />
            <StatCardPremium label="Longest streak" value={statsData?.writingStreak ?? 0} accent="oklch(0.82 0.16 80 / 0.4)" />
            <StatCardPremium label="Average length" value={entries.length ? Math.round(entries.reduce((acc, cur) => acc + countWords(cur.content), 0) / entries.length) : 0} accent="oklch(0.72 0.16 160 / 0.4)" />
            <StatCardPremium label="Top mood" value={favoriteMood ?? "—"} accent="oklch(0.78 0.18 50 / 0.4)" />
          </div>
        </MemoryZone>
      )}

      <MemoryZone title="Recent highlights">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {favoriteEntries.map((j) => <JournalEntryCard key={j.id} entry={j} index={-1} />)}
          {favoriteEntries.length === 0 && <div className="text-muted-foreground text-sm">No entries yet. Start writing.</div>}
        </div>
      </MemoryZone>

      <MemoryZone title="Bookmarked memories" sub="Saved to return to, separate from favorites.">
        <MemoryBookmarks />
      </MemoryZone>

      <WriteOverlay
        isOpen={isWriting}
        promptIndex={promptIndex}
        timeContext={timeContext}
        journalText={journalText}
        isSealing={isSealing}
        textareaRef={textareaRef}
        onTextChange={setJournalText}
        onClose={() => setIsWriting(false)}
        onSeal={handleSeal}
      />
    </div>
  );
}
