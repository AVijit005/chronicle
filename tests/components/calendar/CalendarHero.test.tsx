import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CalendarHero } from "@/components/calendar/CalendarHero";

vi.mock("@/components/ui/PremiumGlass", () => ({
  PremiumGlass: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/analytics/AnalyticsKit", () => ({
  CountUp: ({ to }: { to: number }) => <span>{to}</span>,
}));

describe("CalendarHero", () => {
  it("renders the year and stats", () => {
    render(<CalendarHero currentYear={2025} yearOffset={0} onChangeYear={() => {}} />);
    expect(screen.getByText(/Memory map/)).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
  });

  it("shows prev/next year buttons", () => {
    render(<CalendarHero currentYear={2025} yearOffset={0} onChangeYear={() => {}} />);
    expect(screen.getByLabelText("Previous year")).toBeInTheDocument();
    expect(screen.getByLabelText("Next year")).toBeInTheDocument();
  });
});
