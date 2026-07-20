// Resurfacing — Memory OS Part 03.
// Deterministic SSR-safe selectors used by the resurfacing engine.
import { mulberry } from "@/lib/seed";
import { MEDIA, type MediaItem } from "@/lib/types";
import { MEMORIES_BY_MEDIA, TODAY, type MediaMemory, type Season } from "@/lib/memory";

interface Pair {
  media: MediaItem;
  memory: MediaMemory;
}

function all(): Pair[] {
  return MEDIA.map((m) => ({ media: m, memory: MEMORIES_BY_MEDIA[m.id] })).filter(
    (x): x is Pair => !!x.memory,
  );
}

function daysBetween(a: Date, b: Date) {
  return Math.floor((a.getTime() - b.getTime()) / 86_400_000);
}

const yearsAgo = (n: number) => {
  const d = new Date(TODAY);
  d.setUTCFullYear(d.getUTCFullYear() - n);
  return d;
};

export function getOnThisDay() {
  return all().filter(({ memory }) => {
    if (!memory.finishedAt) return false;
    const fin = new Date(memory.finishedAt);
    return (
      fin.getUTCMonth() === TODAY.getUTCMonth() &&
      fin.getUTCDate() === TODAY.getUTCDate() &&
      fin.getUTCFullYear() < TODAY.getUTCFullYear()
    );
  });
}

export function getThisWeekYearsAgo() {
  const buckets: { years: number; items: Pair[] }[] = [
    { years: 1, items: [] },
    { years: 2, items: [] },
    { years: 5, items: [] },
  ];
  for (const p of all()) {
    if (!p.memory.finishedAt) continue;
    const fin = new Date(p.memory.finishedAt);
    for (const b of buckets) {
      const target = yearsAgo(b.years);
      const delta = Math.abs(daysBetween(fin, target));
      if (delta <= 7) b.items.push(p);
    }
  }
  return buckets.filter((b) => b.items.length);
}

export function getForgottenFavorites() {
  return all().filter(({ media, memory }) => {
    if (!memory.finishedAt) return false;
    return (media.rating ?? 0) >= 4.6 && daysBetween(TODAY, new Date(memory.finishedAt)) > 500;
  });
}

export function getLongTimeNoSee() {
  return all()
    .filter(({ memory }) => memory.finishedAt)
    .sort(
      (a, b) => new Date(a.memory.finishedAt!).getTime() - new Date(b.memory.finishedAt!).getTime(),
    )
    .slice(0, 6);
}

export function getSeasonalMemoriesBySeason(season?: Season) {
  const cur =
    season ??
    (["Spring", "Summer", "Autumn", "Winter"] as Season[])[
      Math.floor(((TODAY.getUTCMonth() + 1) % 12) / 3)
    ];
  return all().filter(({ memory }) => memory.season === cur);
}

export function getAnniversaryMemories() {
  return all().filter(({ memory }) => {
    if (!memory.finishedAt) return false;
    const fin = new Date(memory.finishedAt);
    return (
      fin.getUTCMonth() === TODAY.getUTCMonth() && fin.getUTCFullYear() < TODAY.getUTCFullYear()
    );
  });
}

export function getComfortRewatches() {
  return all().filter(
    ({ memory }) =>
      memory.revisits > 0 &&
      (memory.badges.includes("Comfort") || memory.personalImpact === "Comfort story"),
  );
}

export function getOldJournalEntries() {
  return all()
    .filter(({ memory }) => memory.journalEntries > 0 && memory.finishedAt)
    .sort(
      (a, b) => new Date(a.memory.finishedAt!).getTime() - new Date(b.memory.finishedAt!).getTime(),
    )
    .slice(0, 6);
}

export function getRandomTreasure(seed = 7) {
  const pool = all();
  if (!pool.length) return null;
  const rng = mulberry(seed);
  return pool[Math.floor(rng() * pool.length)] ?? null;
}

export function getHiddenGemMemories() {
  return all().filter(
    ({ memory }) => memory.badges.includes("Hidden Gem") || memory.badges.includes("Underrated"),
  );
}
