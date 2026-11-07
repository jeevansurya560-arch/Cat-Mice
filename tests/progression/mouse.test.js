import { describe, it, expect } from "vitest";
import { determineMouseState } from "../../src/progression/mouse.js";
import { MOUSE_TIERS } from "../../src/core/constants.js";

describe("Progression: Mouse Unlocking & Progression", () => {
  it("should remain LOCKED when cat growth is below threshold", () => {
    const mouse = determineMouseState(
      { growthRatio: 0.5 },
      0.9,
      { mouseUnlockThreshold: 0.65 },
      100
    );
    expect(mouse.unlocked).toBe(false);
    expect(mouse.tier).toBe(MOUSE_TIERS.LOCKED);
    expect(mouse.speedModifier).toBe(0);
  });

  it("should unlock as SCOUT when consistency is low (< 0.40)", () => {
    const mouse = determineMouseState(
      { growthRatio: 0.7 },
      0.25,
      { mouseUnlockThreshold: 0.65 },
      100
    );
    expect(mouse.unlocked).toBe(true);
    expect(mouse.tier).toBe(MOUSE_TIERS.SCOUT);
    expect(mouse.speedModifier).toBe(1.0);
  });

  it("should unlock as RUNNER when consistency is moderate (0.40 - 0.74)", () => {
    const mouse = determineMouseState(
      { growthRatio: 0.75 },
      0.55,
      { mouseUnlockThreshold: 0.65 },
      100
    );
    expect(mouse.unlocked).toBe(true);
    expect(mouse.tier).toBe(MOUSE_TIERS.RUNNER);
    expect(mouse.speedModifier).toBe(1.25);
  });

  it("should unlock as NINJA when consistency is high (>= 0.75)", () => {
    const mouse = determineMouseState(
      { growthRatio: 0.8 },
      0.85,
      { mouseUnlockThreshold: 0.65 },
      100
    );
    expect(mouse.unlocked).toBe(true);
    expect(mouse.tier).toBe(MOUSE_TIERS.NINJA);
    expect(mouse.speedModifier).toBe(1.5);
    expect(mouse.evasionChance).toBe(0.85);
  });
});
