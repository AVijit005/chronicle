// Media Story helpers — deterministic, SSR-safe building blocks for Media Detail 3.0.
import { MEDIA, type MediaItem } from "@/lib/mock";
import { MEMORIES_BY_MEDIA, type MediaMemory } from "@/lib/memory";
import { mulberry } from "@/lib/seed";

function hash(id: string) {
  let h = 0x84222325 >>> 0;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface LivingHeader {
  status: string;
  completionPct: number;
  streak: number;
  emotionScore: number; // 0..5 stars
  memoryScore: number; // 0..100
  lastActivity: string;
  firstStarted: string;
  totalTime: string;
}
export function getLivingHeader(item: MediaItem): LivingHeader {
  const mem = MEMORIES_BY_MEDIA[item.id];
  const rng = mulberry(hash(item.id));
  return {
    status: item.status,
    completionPct: item.progress ?? (item.status === "completed" ? 100 : 0),
    streak: Math.floor(rng() * 14) + 1,
    emotionScore: Math.round((mem ? 3.5 + rng() * 1.5 : 3 + rng() * 2) * 10) / 10,
    memoryScore: Math.round(40 + rng() * 60),
    lastActivity: item.status === "completed" ? "Yesterday" : "2 hours ago",
    firstStarted: mem?.firstExperiencedAt ?? "Mar 14, 2025",
    totalTime: item.runtime ?? "—",
  };
}

export interface JourneyEvent {
  kind: string;
  label: string;
  when: string;
}
export function getJourneyEvents(item: MediaItem): JourneyEvent[] {
  const mem = MEMORIES_BY_MEDIA[item.id];
  const base: JourneyEvent[] = [
    {
      kind: "Started",
      label: "Began the journey",
      when: mem?.firstExperiencedAt ?? "Mar 14, 2025",
    },
    { kind: "Paused", label: "Paused after a long session", when: "Mar 16" },
    { kind: "Resumed", label: "Returned to the world", when: "Mar 18" },
    { kind: "Favorite Scene", label: mem?.favoriteMoment ?? "A favorite scene", when: "Mar 20" },
    { kind: "Journal", label: "Wrote a journal entry", when: "Mar 21" },
    { kind: "Shared", label: "Shared with a friend", when: "Mar 24" },
  ];
  if (item.status === "completed")
    base.push({
      kind: "Completed",
      label: "Closed the chapter",
      when: mem?.finishedAt ?? "Apr 02",
    });
  if ((mem?.revisits ?? 0) > 0)
    base.push({ kind: "Rewatched", label: `Revisited ${mem!.revisits} times`, when: "Recently" });
  base.push({ kind: "Collection", label: "Added to a collection", when: "Last week" });
  base.push({ kind: "Achievement", label: "Earned a milestone", when: "Recently" });
  base.push({ kind: "Memory", label: "A memory resurfaced", when: "This week" });
  return base;
}

export interface Session {
  date: string;
  duration: string;
  progress: string;
  note: string;
  mood: string;
}
export function getSessions(item: MediaItem, n = 6): Session[] {
  const rng = mulberry(hash(item.id) ^ 0x1234);
  const moods = ["Calm", "Awe", "Tender", "Focused", "Joy"];
  return Array.from({ length: n }, (_, i) => ({
    date: `Mar ${28 - i * 2}`,
    duration: `${30 + Math.floor(rng() * 90)}m`,
    progress: `${Math.min(100, 10 + i * 12)}%`,
    note: i % 2 === 0 ? "Quiet, lights low." : "Watched after dinner.",
    mood: moods[Math.floor(rng() * moods.length)]!,
  }));
}

export interface CharacterCard {
  name: string;
  rating: number;
  favoriteScene: string;
  mood: string;
  note: string;
}
export function getCharacters(item: MediaItem): CharacterCard[] {
  const rng = mulberry(hash(item.id) ^ 0xabcd);
  const seed = [
    "The protagonist",
    "The mentor",
    "The rival",
    "The companion",
    "The antagonist",
    "The quiet one",
  ];
  return seed.slice(0, 4).map((n) => ({
    name: `${n} of ${item.title}`,
    rating: Math.round((3.5 + rng() * 1.5) * 10) / 10,
    favoriteScene: "A scene that stays with you.",
    mood: ["Awe", "Tender", "Triumph", "Curious"][Math.floor(rng() * 4)]!,
    note: "A character you keep thinking about.",
  }));
}

export interface CompanionStory {
  label: string;
  media: MediaItem;
}
export function getCompanionStories(item: MediaItem): CompanionStory[] {
  return MEDIA.filter((m) => m.id !== item.id)
    .slice(0, 3)
    .map((m, i) => ({
      label: ["Watched alongside", "Read in parallel", "Listened during"][i] ?? "Together with",
      media: m,
    }));
}

export interface LifeContext {
  semester?: string;
  travel?: string;
  holiday?: string;
  exam?: string;
  weather: string;
  location: string;
  mood: string;
  journalCount: number;
}
export function getLifeContext(item: MediaItem): LifeContext {
  const mem = MEMORIES_BY_MEDIA[item.id];
  return {
    semester: "Spring semester",
    travel: "Weekend at home",
    weather: mem?.weather ?? "Clear Night",
    location: mem?.location ?? "Home",
    mood: mem?.mood ?? "Awe",
    journalCount: mem?.journalEntries ?? 0,
  };
}

export function getRewatchReasons(item: MediaItem): string[] {
  const mem = MEMORIES_BY_MEDIA[item.id];
  const out = [
    "You revisit every winter.",
    "It's been over a year.",
    "It matches your current mood.",
    "Your memory score is fading.",
  ];
  if (mem?.badges.includes("Comfort")) out.unshift("This is a comfort story.");
  return out;
}

export function getWhyItWorked(item: MediaItem): string[] {
  const mem = MEMORIES_BY_MEDIA[item.id];
  const tags = [
    `${item.genres[0]?.toLowerCase() ?? "slow"} pacing`,
    "beautiful cinematography",
    "hopeful endings",
    "strong character writing",
    "quiet atmosphere",
  ];
  if (mem?.badges.includes("Comfort")) tags.push("comfort and familiarity");
  if (mem?.badges.includes("Life Changing")) tags.push("a perspective shift");
  return tags;
}

export interface SimilarMemory {
  other: MediaItem;
  reason: string;
}
export function getSimilarMemories(item: MediaItem): SimilarMemory[] {
  const mem = MEMORIES_BY_MEDIA[item.id];
  if (!mem) return [];
  return Object.entries(MEMORIES_BY_MEDIA)
    .filter(([id, m]) => id !== item.id && m && m.mood === mem.mood)
    .slice(0, 4)
    .map(([id]) => {
      const o = MEDIA.find((x) => x.id === id)!;
      return { other: o, reason: `Felt like ${item.title} — same ${mem.mood.toLowerCase()} tone.` };
    });
}

export function getEditorialStats(item: MediaItem) {
  const mem = MEMORIES_BY_MEDIA[item.id];
  return [
    { label: "Total hours", value: 24 },
    { label: "Longest session", value: "3h 12m" },
    { label: "Average session", value: "47m" },
    { label: "Completion time", value: "12 days" },
    { label: "Times revisited", value: mem?.revisits ?? 0 },
    { label: "Journal entries", value: mem?.journalEntries ?? 0 },
    { label: "Collections", value: mem?.collectionCount ?? 0 },
    { label: "Timeline events", value: mem?.timelineAppearances ?? 0 },
  ];
}

export function getDiscussionNotes(item: MediaItem): string[] {
  return [
    `The middle act of ${item.title} reframes the opening completely.`,
    "A favorite theory: the ending mirrors the beginning, in reverse.",
    "What this story actually says about its protagonist.",
    "A lesson worth keeping.",
  ];
}

export function getEmotionPath(item: MediaItem) {
  const rng = mulberry(hash(item.id));
  return [
    { label: "Beginning", energy: 0.4 + rng() * 0.2, joy: 0.3 + rng() * 0.2 },
    { label: "Middle", energy: 0.5 + rng() * 0.3, joy: 0.55 + rng() * 0.2 },
    { label: "Ending", energy: 0.8 + rng() * 0.2, joy: 0.7 + rng() * 0.25 },
  ];
}

export function getFavoriteSceneStrip(item: MediaItem) {
  const rng = mulberry(hash(item.id) ^ 0xdead);
  return Array.from({ length: 4 }, (_, i) => ({
    episode: `Ep ${10 + i * 7}`,
    timestamp: `${10 + i * 5}:${String(Math.floor(rng() * 59)).padStart(2, "0")}`,
    quote:
      ["A quiet moment.", "The line that broke me.", "Slow walk at dawn.", "The reunion."][i] ??
      "Favorite moment.",
    reaction: ["★", "♥", "✨", "☾"][i] ?? "★",
  }));
}

export function getMediaRelationships(item: MediaItem) {
  return [
    { kind: "Creator", label: item.creator ?? "Creator" },
    { kind: "Genre", label: item.genres[0] ?? "Genre" },
    { kind: "Collection", label: "Comfort Movies" },
    { kind: "Achievement", label: "Marathoner" },
    { kind: "Journal", label: "12 entries" },
    { kind: "Theme", label: "Hope" },
    { kind: "Timeline", label: "Spring 2025" },
  ];
}

export function getCompletionReflection(item: MediaItem) {
  const mem = MEMORIES_BY_MEDIA[item.id];
  return {
    hours: 83,
    days: 41,
    journalMentions: mem?.journalEntries ?? 0,
    top: "Top 5 Memories",
    line: `You spent 83 hours across 41 days finishing ${item.title}.`,
  };
}
export type MemoryRef = MediaMemory;
