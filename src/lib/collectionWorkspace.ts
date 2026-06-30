// Collection Workspace — pinned widgets (deterministic mock).
import { type Collection } from "@/lib/mock";
import { getCollectionItems } from "@/lib/collectionEngine";

export interface PinnedNote {
  id: string;
  text: string;
}
export interface PinnedQuote {
  id: string;
  quote: string;
  source?: string;
}
export interface PinnedMemory {
  id: string;
  mediaId: string;
  note: string;
}

export interface Workspace {
  notes: PinnedNote[];
  quotes: PinnedQuote[];
  memories: PinnedMemory[];
}

export function getWorkspace(c: Collection): Workspace {
  const items = getCollectionItems(c);
  return {
    notes: [
      { id: "n1", text: `Why I started ${c.name}: a feeling I wanted to keep.` },
      { id: "n2", text: "Future addition: anything that feels like the first one." },
    ],
    quotes: items
      .slice(0, 2)
      .map((m, i) => ({ id: `q${i}`, quote: "A line that stays with me.", source: m.title })),
    memories: items
      .slice(0, 3)
      .map((m, i) => ({ id: `m${i}`, mediaId: m.id, note: "A scene I keep returning to." })),
  };
}
