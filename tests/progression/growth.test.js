import { describe, it, expect } from "vitest";
import { calculateGrowth } from "../../src/progression/growth.js";

describe("Progression: Cat Growth Calculus", () => {
  it("should return level 1 and 0.0 growth for zero contributions", () => {
    const res = calculateGrowth(0, 25000);
    expect(res.level).toBe(1);
    expect(res.growthRatio).toBe(0.0);
    expect(res.contributions).toBe(0);
  });

  it("should scale logarithmically with contributions", () => {
    const low = calculateGrowth(100, 25000);
    const mid = calculateGrowth(1000, 25000);
    const high = calculateGrowth(10000, 25000);

    expect(low.growthRatio).toBeLessThan(mid.growthRatio);
    expect(mid.growthRatio).toBeLessThan(high.growthRatio);
    expect(low.level).toBeLessThan(mid.level);
    expect(mid.level).toBeLessThan(high.level);
  });

  it("should cap growth at 1.0 and level 50 for max contributions", () => {
    const res = calculateGrowth(30000, 25000);
    expect(res.growthRatio).toBe(1.0);
    expect(res.level).toBe(50);
  });
});
