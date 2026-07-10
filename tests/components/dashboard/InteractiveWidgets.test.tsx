import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { InteractiveWidgets } from "@/components/dashboard/QuickActions";

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
}));
vi.mock("@/lib/store/MediaActionsContext", () => ({
  useMediaActions: () => ({ openAdd: vi.fn() }),
}));

describe("InteractiveWidgets", () => {
  it("renders all 4 quick action buttons", () => {
    render(<InteractiveWidgets />);
    expect(screen.getByLabelText("Add media")).toBeInTheDocument();
    expect(screen.getByLabelText("Spotlight")).toBeInTheDocument();
    expect(screen.getByLabelText("Journal entry")).toBeInTheDocument();
    expect(screen.getByLabelText("New collection")).toBeInTheDocument();
  });
});
