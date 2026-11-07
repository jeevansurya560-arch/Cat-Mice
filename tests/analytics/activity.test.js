import { describe, it, expect } from "vitest";
import { calculateActivity } from "../../src/analytics/activity.js";

describe("Analytics: Activity Calculus", () => {
  it("should return zeros for empty or null calendar days", () => {
    const res = calculateActivity([]);
    expect(res.totalDays).toBe(0);
    expect(res.activeDays).toBe(0);
    expect(res.activeRatio).toBe(0);
    expect(res.totalContributions).toBe(0);
  });

  it("should calculate active counts and ratios accurately", () => {
    const days = [
      { date: "2026-11-01", contributionCount: 5 },
      { date: "2026-11-02", contributionCount: 0 },
      { date: "2026-11-03", contributionCount: 15 },
      { date: "2026-11-04", contributionCount: 0 }
    ];

    const res = calculateActivity(days);
    expect(res.totalDays).toBe(4);
    expect(res.activeDays).toBe(2);
    expect(res.activeRatio).toBe(0.5);
    expect(res.totalContributions).toBe(20);
    expect(res.averagePerActiveDay).toBe(10);
    expect(res.maxInSingleDay).toBe(15);
  });
});
