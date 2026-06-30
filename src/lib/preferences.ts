// User preferences — localStorage-backed, SSR-safe.
const KEY = "chronicle:prefs:v1";

export interface Prefs {
  preferredView?: "grid" | "list" | "editorial";
  preferredSort?: "recent" | "rating" | "title";
  collapsedSections?: string[];
  sidebarOpen?: boolean;
  searchHistory?: string[];
}

const DEFAULTS: Prefs = {
  preferredView: "editorial",
  preferredSort: "recent",
  collapsedSections: [],
  sidebarOpen: false,
  searchHistory: [],
};

export function getPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Prefs) };
  } catch {
    return DEFAULTS;
  }
}

export function setPrefs(patch: Partial<Prefs>) {
  if (typeof window === "undefined") return;
  const next = { ...getPrefs(), ...patch };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function pushSearchHistory(term: string) {
  const p = getPrefs();
  const history = [term, ...(p.searchHistory ?? []).filter((t) => t !== term)].slice(0, 12);
  setPrefs({ searchHistory: history });
}
