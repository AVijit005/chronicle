"use client";
import { useEffect, useState } from "react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { listNotes, addNote, removeNote, type Note, type NoteEntityKind } from "@/lib/notesEngine";

export function UniversalNotes({
  kind,
  refId,
  title = "Notes",
}: {
  kind: NoteEntityKind;
  refId: string;
  title?: string;
}) {
  const [items, setItems] = useState<Note[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    setItems(listNotes(kind, refId));
  }, [kind, refId]);

  function add() {
    if (!text.trim()) return;
    addNote(kind, refId, text.trim());
    setText("");
    setItems(listNotes(kind, refId));
  }
  function remove(id: string) {
    removeNote(id);
    setItems(listNotes(kind, refId));
  }

  return (
    <PremiumGlass variant="subtle">
      <div className="p-5">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{title}</div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a quiet note…"
            className="h-10 flex-1 rounded-xl bg-white/[0.04] px-3 text-sm outline-none ring-1 ring-white/10 focus:ring-primary/50"
            aria-label="Note text"
          />
          <PremiumButton variant="secondary" size="sm" onClick={add}>
            Save note
          </PremiumButton>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {items.length === 0 && (
            <li className="text-muted-foreground">No notes yet — your private margin.</li>
          )}
          {items.map((n) => (
            <li
              key={n.id}
              className="flex items-start justify-between gap-3 border-l-2 border-primary/40 pl-3"
            >
              <span>{n.text}</span>
              <button
                onClick={() => remove(n.id)}
                className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </PremiumGlass>
  );
}
