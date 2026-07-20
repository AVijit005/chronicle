// Chronicle Intelligence Layer — deterministic editorial insight.
import { MEDIA, type MediaItem } from "@/lib/types";
import { MEMORIES_BY_MEDIA, type MediaMemory } from "@/lib/memory";
import { MEMORY_EXTENSIONS } from "@/lib/memoryJournal";
import { mulberry } from "@/lib/seed";

function hash(id: string) {
  let h = 0xdeadbeef >>> 0;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface TasteProfile {
  favoriteGenres: { name: string; count: number }[];
  favoriteCreators: { name: string; count: number }[];
  favoriteEras: { name: string; count: number }[];
  favoriteLanguages: string[];
  favoriteRuntime: string;
  favoritePlatforms: string[];
  favoriteSeasons: string[];
  favoriteTimeOfDay: string;
  favoriteMood: string;
  favoriteCompanion: string;
  favoriteCompletionPattern: string;
}

export function buildTasteProfile(): TasteProfile {
  const genreC = new Map<string, number>();
  const creatorC = new Map<string, number>();
  const eraC = new Map<string, number>();
  for (const m of MEDIA) {
    for (const g of m.genres) genreC.set(g, (genreC.get(g) ?? 0) + 1);
    if (m.creator) creatorC.set(m.creator, (creatorC.get(m.creator) ?? 0) + 1);
    const era = `${Math.floor(m.year / 10) * 10}s`;
    eraC.set(era, (eraC.get(era) ?? 0) + 1);
  }
  return {
    favoriteGenres: [...genreC.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })),
    favoriteCreators: [...creatorC.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })),
    favoriteEras: [...eraC.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({ name, count })),
    favoriteLanguages: ["English", "Japanese"],
    favoriteRuntime: "2–3h films, 100h games",
    favoritePlatforms: ["Personal library", "Theatre"],
    favoriteSeasons: ["Winter", "Autumn"],
    favoriteTimeOfDay: "Late evening",
    favoriteMood: "Awe",
    favoriteCompanion: "Alone",
    favoriteCompletionPattern: "Slow & complete",
  };
}

export interface DNAAxis {
  label: string;
  value: number; /* 0..1 */
}

export function buildMediaDNA(id: string): DNAAxis[] {
  const m = MEDIA.find((x) => x.id === id);
  if (!m) return [];
  const rng = mulberry(hash(id));
  const labels = [
    "Mood",
    "Theme",
    "Pacing",
    "Emotional Weight",
    "Complexity",
    "Comfort",
    "Rewatchability",
    "World Building",
    "Character Focus",
    "Ending Impact",
  ];
  return labels.map((label) => ({ label, value: 0.35 + rng() * 0.6 }));
}

export function buildMemoryDNA(id: string) {
  const mem = MEMORIES_BY_MEDIA[id];
  const ext = MEMORY_EXTENSIONS[id];
  if (!mem) return null;
  return {
    dominantEmotion: mem.mood,
    season: mem.season,
    companion: mem.companion,
    importance: Math.min(1, 0.4 + mem.badges.length * 0.2),
    reflectionDepth: ext?.journal ? Math.min(1, ext.journal.fullEntry.length / 500) : 0.2,
    journalRichness: Math.min(1, (mem.journalEntries ?? 0) / 5),
    favoriteLevel: Math.min(1, 0.4 + (mem.revisits ?? 0) * 0.15),
    memoryStrength: Math.min(1, 0.35 + (mem.timelineAppearances ?? 0) * 0.1),
  };
}

export function buildStoryUniverse(id: string) {
  // Returns groups of related media keyed by relation kind.
  const a = MEDIA.find((m) => m.id === id);
  if (!a) return null;
  return {
    creator: MEDIA.filter((m) => m.id !== id && m.creator === a.creator),
    genre: MEDIA.filter((m) => m.id !== id && m.genres.some((g) => a.genres.includes(g))).slice(
      0,
      6,
    ),
    kind: MEDIA.filter((m) => m.id !== id && m.kind === a.kind).slice(0, 6),
  };
}

export function buildJourneyContinuity(id: string) {
  const i = MEDIA.findIndex((m) => m.id === id);
  const prev = i > 0 ? MEDIA[i - 1] : null;
  const next = i >= 0 && i < MEDIA.length - 1 ? MEDIA[i + 1] : null;
  return { previous: prev, current: MEDIA[i] ?? null, next };
}

export function buildRecommendationReason(reason: "creator" | "mood" | "genre" | "memory"): string {
  return {
    creator: "Same creator as a story you loved.",
    mood: "Same emotional tone as your favorites.",
    genre: "Same kind of story you keep returning to.",
    memory: "Connected to a memory you wrote about.",
  }[reason];
}

export function buildLibraryMap() {
  return [
    { id: "comfort", name: "Comfort Shelf", ids: ["one-piece", "dark-side", "harry-potter"] },
    { id: "mind", name: "Mind Bending Shelf", ids: ["interstellar", "cyberpunk", "succession"] },
    { id: "weekend", name: "Weekend Shelf", ids: ["dune", "mkbhd"] },
    { id: "travel", name: "Travel Shelf", ids: ["lex", "harry-potter"] },
    { id: "study", name: "Study Shelf", ids: ["cs50"] },
    { id: "night", name: "Late Night Shelf", ids: ["dark-side", "interstellar"] },
    { id: "rain", name: "Rain Shelf", ids: ["succession", "harry-potter"] },
    { id: "classic", name: "Classic Shelf", ids: ["dark-side"] },
    { id: "childhood", name: "Childhood Shelf", ids: ["one-piece", "harry-potter"] },
  ].map((s) => ({
    ...s,
    items: s.ids.map((id) => MEDIA.find((m) => m.id === id)!).filter(Boolean),
  }));
}

export function buildLifeSoundtrack() {
  return [
    { label: "Exam Week", mediaId: "lex", note: "Long podcasts between study blocks." },
    { label: "Summer Trip", mediaId: "harry-potter", note: "Read on the train." },
    { label: "Lockdown", mediaId: "one-piece", note: "Every evening of spring 2020." },
    { label: "Winter Holiday", mediaId: "dune", note: "On loop in the headphones." },
  ].map((s) => ({ ...s, media: MEDIA.find((m) => m.id === s.mediaId) }));
}

export function buildImpactSummary() {
  return [
    { label: "Inspired Creativity", value: 0.78 },
    { label: "Changed Perspective", value: 0.62 },
    { label: "Comfort During Stress", value: 0.85 },
    { label: "Helped Through Exams", value: 0.5 },
    { label: "Relaxation", value: 0.72 },
    { label: "Motivation", value: 0.55 },
    { label: "Nostalgia", value: 0.81 },
    { label: "Escapism", value: 0.68 },
  ];
}

export function buildEditorialInsight() {
  return "You love hopeful endings, slow middles, and stories that sit in silence.";
}

export function buildPersonalStatements(): string[] {
  return [
    "You love hopeful endings.",
    "You rarely abandon books.",
    "You finish games slowly but completely.",
    "You prefer quiet stories at night.",
    "You revisit comfort stories every winter.",
    "Your highest ratings happen alone, late.",
  ];
}

export function buildMediaEvolution() {
  return [
    { year: "2019", focus: "Action" },
    { year: "2020", focus: "Anime" },
    { year: "2021", focus: "Fantasy" },
    { year: "2022", focus: "Sci-Fi" },
    { year: "2023", focus: "Documentaries" },
    { year: "2024", focus: "Classic Literature" },
    { year: "2025", focus: "Quiet drama" },
    { year: "2026", focus: "Comfort revisits" },
  ];
}

export const _media = MEDIA as MediaItem[];
export type _MM = MediaMemory;
