import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryStreaks } from "@/components/calendar/MemoryStreaks";
import { MEMORY_STREAKS } from "@/lib/analytics-mock";

vi.mock("@/components/ui/PremiumGlass", () => ({
  PremiumGlass: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/analytics/AnalyticsKit", () => ({
  CountUp: ({ to }: { to: number }) => <span>{to}</span>,
}));

describe("MemoryStreaks", () => {
  it("renders all streak cards", () => {
    render(<MemoryStreaks />);
    MEMORY_STREAKS.forEach((s) => {
      expect(screen.getByText(s.label)).toBeInTheDocument();
    });
  });
});
