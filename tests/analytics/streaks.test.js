import { describe, it, expect } from "vitest";
import { calculateStreaks } from "../../src/analytics/streaks.js";

describe("Analytics: Streak Calculus", () => {
  it("should handle empty days array", () => {
    const res = calculateStreaks([]);
    expect(res.currentStreak).toBe(0);
    expect(res.longestStreak).toBe(0);
    expect(res.weekendActiveDays).toBe(0);
  });

  it("should compute continuous streaks across multiple consecutive days", () => {
    const days = [
      { date: "2026-11-01", contributionCount: 2 },
      { date: "2026-11-02", contributionCount: 4 },
      { date: "2026-11-03", contributionCount: 1 },
      { date: "2026-11-04", contributionCount: 0 },
      { date: "2026-11-05", contributionCount: 8 },
      { date: "2026-11-06", contributionCount: 3 },
      { date: "2026-11-07", contributionCount: 5 }
    ];

    const res = calculateStreaks(days);
    expect(res.longestStreak).toBe(3);
    expect(res.currentStreak).toBe(3); // Nov 5, 6, 7
  });

  it("should detect weekend active days correctly", () => {
    // 2026-11-01 is Sunday, 2026-11-07 is Saturday
    const days = [
      { date: "2026-11-01", contributionCount: 5 }, // Sunday
      { date: "2026-11-02", contributionCount: 2 }, // Monday
      { date: "2026-11-07", contributionCount: 3 } // Saturday
    ];

    const res = calculateStreaks(days);
    expect(res.weekendActiveDays).toBe(2);
  });
});
