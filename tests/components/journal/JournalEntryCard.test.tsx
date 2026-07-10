import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { JournalEntryCard } from "@/components/journal/JournalEntryCard";
import type { UIJournalEntry } from "@/lib/adapters/types";

vi.mock("@/components/editorial/DropCap", () => ({
  DropCap: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const entry: UIJournalEntry = {
  id: "1", title: "Test Entry", content: "Hello world this is a journal entry.",
  mood: "Happy", weather: null, location: null, isPrivate: false,
  coverImage: null, createdAt: "2025-01-15T00:00:00Z", updatedAt: "2025-01-15T00:00:00Z",
};

describe("JournalEntryCard", () => {
  it("renders entry title and content", () => {
    render(<JournalEntryCard entry={entry} index={1} />);
    expect(screen.getByText("Test Entry")).toBeInTheDocument();
    expect(screen.getByText(/Hello world/)).toBeInTheDocument();
  });

  it("shows drop cap for first entry", () => {
    render(<JournalEntryCard entry={entry} index={0} />);
    expect(screen.getByText(/Hello world/)).toBeInTheDocument();
  });
});
