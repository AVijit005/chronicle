// Quote engine — deterministic across media, journal, characters.
import { MEDIA, JOURNAL, QUOTES } from "@/lib/types";
import { CHARACTERS } from "@/lib/characters";
import { mulberry } from "@/lib/seed";

export type QuoteSource = "media" | "journal" | "character" | "platform";

export interface Quote {
  id: string;
  text: string;
  source: QuoteSource;
  refId: string; // media/journal/character id
  refTitle: string;
  accent: string;
}

let _quotes: Quote[] | null = null;
export function allQuotes(): Quote[] {
  if (_quotes) return _quotes;
  const rng = mulberry(13);
  const list: Quote[] = [];

  for (const m of MEDIA) {
    const text = `In ${m.title}: ${m.synopsis.split(".")[0]}.`;
    list.push({
      id: `q_m_${m.id}`,
      text,
      source: "media",
      refId: m.id,
      refTitle: m.title,
      accent: m.accent ?? "oklch(0.72 0.18 255)",
    });
  }
  for (const j of JOURNAL) {
    list.push({
      id: `q_j_${j.id}`,
      text: j.excerpt,
      source: "journal",
      refId: j.id,
      refTitle: j.title,
      accent: j.accent,
    });
  }
  for (const c of CHARACTERS) {
    for (let i = 0; i < c.quotes.length; i++) {
      list.push({
        id: `q_c_${c.id}_${i}`,
        text: c.quotes[i]!,
        source: "character",
        refId: c.id,
        refTitle: c.name,
        accent: c.accent,
      });
    }
  }
  for (let i = 0; i < QUOTES.length; i++) {
    list.push({
      id: `q_p_${i}`,
      text: QUOTES[i]!,
      source: "platform",
      refId: `p${i}`,
      refTitle: "Chronicle",
      accent: "oklch(0.72 0.18 255)",
    });
  }

  // Deterministic shuffle for "random" buckets via seeded sort.
  _quotes = list.sort((a, b) => Math.sign(rng() - 0.5 - (rng() - 0.5)));
  return _quotes;
}

export function quoteOfTheDay(): Quote {
  const q = allQuotes();
  return q[new Date().getUTCDate() % q.length]!;
}

export function searchQuotes(term: string): Quote[] {
  const t = term.trim().toLowerCase();
  if (!t) return [];
  return allQuotes().filter(
    (q) => q.text.toLowerCase().includes(t) || q.refTitle.toLowerCase().includes(t),
  );
}

export function quotesForMedia(id: string) {
  return allQuotes().filter((q) => q.source === "media" && q.refId === id);
}
export function quotesForCharacter(id: string) {
  return allQuotes().filter((q) => q.source === "character" && q.refId === id);
}
