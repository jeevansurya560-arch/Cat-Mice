import { describe, it, expect } from "vitest";
import { calculateConsistency } from "../../src/analytics/consistency.js";

describe("Analytics: Consistency Calculus", () => {
  it("should return 0.0 for empty days or zero activity", () => {
    const score = calculateConsistency(
      [],
      { currentStreak: 0, longestStreak: 0 },
      { activeDays: 0, totalDays: 0 }
    );
    expect(score).toBe(0.0);
  });

  it("should reward high active coverage and stable streaks", () => {
    const days = [
      { date: "2026-11-01", contributionCount: 5 },
      { date: "2026-11-02", contributionCount: 4 },
      { date: "2026-11-03", contributionCount: 6 },
      { date: "2026-11-04", contributionCount: 8 },
      { date: "2026-11-05", contributionCount: 3 },
      { date: "2026-11-06", contributionCount: 7 },
      { date: "2026-11-07", contributionCount: 10 }
    ];

    const score = calculateConsistency(
      days,
      { currentStreak: 7, longestStreak: 7 },
      { activeDays: 7, totalDays: 7 }
    );

    expect(score).toBeGreaterThanOrEqual(0.8);
    expect(score).toBeLessThanOrEqual(1.0);
  });

  it("should penalize long gaps between commits", () => {
    const days = [
      { date: "2026-11-01", contributionCount: 5 },
      { date: "2026-11-02", contributionCount: 0 },
      { date: "2026-11-03", contributionCount: 0 },
      { date: "2026-11-04", contributionCount: 0 },
      { date: "2026-11-05", contributionCount: 0 },
      { date: "2026-11-06", contributionCount: 0 },
      { date: "2026-11-07", contributionCount: 1 }
    ];

    const score = calculateConsistency(
      days,
      { currentStreak: 1, longestStreak: 1 },
      { activeDays: 2, totalDays: 7 }
    );

    expect(score).toBeLessThan(0.4);
  });
});
