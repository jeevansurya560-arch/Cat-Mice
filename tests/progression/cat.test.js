import { describe, it, expect } from "vitest";
import { determineCatState } from "../../src/progression/cat.js";
import { CAT_STAGES } from "../../src/core/constants.js";

describe("Progression: Cat State & Maturation", () => {
  it("should assign KITTEN stage and 1x scale for low growth", () => {
    const cat = determineCatState({ growthRatio: 0.15, level: 5 }, 12345);
    expect(cat.stage).toBe(CAT_STAGES.KITTEN);
    expect(cat.scale).toBe(1);
    expect(cat.demeanor).toBe("playful");
    expect(cat.variant).toBeDefined();
  });

  it("should assign ADULT stage and 2x scale for intermediate growth", () => {
    const cat = determineCatState({ growthRatio: 0.55, level: 28 }, 12345);
    expect(cat.stage).toBe(CAT_STAGES.ADULT);
    expect(cat.scale).toBe(2);
    expect(cat.demeanor).toBe("alert");
  });

  it("should assign ELDER stage and zen demeanor for high growth", () => {
    const cat = determineCatState({ growthRatio: 0.85, level: 44 }, 12345);
    expect(cat.stage).toBe(CAT_STAGES.ELDER);
    expect(cat.scale).toBe(2);
    expect(cat.demeanor).toBe("zen");
  });

  it("should produce deterministic cosmetic variants from the same seed", () => {
    const catA = determineCatState({ growthRatio: 0.5, level: 25 }, 9999);
    const catB = determineCatState({ growthRatio: 0.5, level: 25 }, 9999);
    expect(catA.variant).toBe(catB.variant);
  });
});
