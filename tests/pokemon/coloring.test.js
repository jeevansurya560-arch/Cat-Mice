import { describe, it, expect } from "vitest";
import { EVOLUTION_TIERS } from "../../src/pokemon/definitions.js";
import {
  clamp,
  smoothstep,
  blendHex,
  calculateProgressiveColoring
} from "../../src/engine/coloring.js";

describe("Mathematical Progressive Colouring Engine", () => {
  it("should clamp values correctly within [min, max]", () => {
    expect(clamp(-0.5, 0, 1)).toBe(0);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
    expect(clamp(1.5, 0, 1)).toBe(1);
  });

  it("should calculate smoothstep Hermite curve correctly", () => {
    expect(smoothstep(0)).toBe(0);
    expect(smoothstep(0.5)).toBe(0.5);
    expect(smoothstep(1)).toBe(1);
    // Derivative at boundaries is zero
    expect(smoothstep(0.1)).toBeCloseTo(0.028, 3);
    expect(smoothstep(0.9)).toBeCloseTo(0.972, 3);
  });

  it("should blend hex colors cleanly", () => {
    const black = "#000000";
    const white = "#ffffff";
    expect(blendHex(black, white, 0)).toBe("#000000");
    expect(blendHex(black, white, 1)).toBe("#ffffff");
    expect(blendHex(black, white, 0.5)).toBe("#808080");
  });

  it("should guarantee monotonic colouring progress within any evolution stage", () => {
    const charizard = EVOLUTION_TIERS[2]; // Charizard
    const progressSteps = [0.0, 0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0];

    let previousPercentage = -1;
    for (const step of progressSteps) {
      const state = calculateProgressiveColoring(charizard, step);
      expect(state.overallPercentage).toBeGreaterThanOrEqual(previousPercentage);
      expect(state.overallPercentage).toBeLessThanOrEqual(100);
      previousPercentage = state.overallPercentage;
    }

    expect(previousPercentage).toBe(100);
  });

  it("should verify anatomical priority sequence order", () => {
    const charmander = EVOLUTION_TIERS[0];
    const midState = calculateProgressiveColoring(charmander, 0.3);

    // Regions are evaluated in priority order
    expect(midState.regions[0].id).toBe("tail_flame"); // priority 1 (weight 15%) -> complete
    expect(midState.regions[0].status).toBe("complete");
    expect(midState.regions[0].completion).toBe(1.0);

    expect(midState.regions[1].id).toBe("head"); // priority 2 (weight 20%, interval [0.15, 0.35]) -> coloring
    expect(midState.regions[1].status).toBe("coloring");
    expect(midState.regions[1].completion).toBeGreaterThan(0);

    expect(midState.regions[2].id).toBe("torso"); // priority 3 (interval [0.35, 0.60]) -> monochrome
    expect(midState.regions[2].status).toBe("monochrome");
    expect(midState.regions[2].completion).toBe(0);
  });
});
