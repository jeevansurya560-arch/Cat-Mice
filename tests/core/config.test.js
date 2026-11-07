import { describe, it, expect } from "vitest";
import { config, getConfig } from "../../src/core/config.js";

describe("Core Configuration", () => {
  it("should have expected application metadata", () => {
    expect(config.application.name).toBe("CAT-MICE");
    expect(config.application.version).toBe("0.1.0");
  });

  it("should enforce offline mode default", () => {
    expect(config.runtime.offlineMode).toBe(true);
  });

  it("should define valid rendering dimensions and fps", () => {
    expect(config.rendering.width).toBe(256);
    expect(config.rendering.height).toBe(256);
    expect(config.rendering.fps).toBe(12);
    expect(config.rendering.scale).toBe(2);
  });

  it("should define animation loop configuration", () => {
    expect(config.animation.loop).toBe(true);
  });

  it("should provide initial progression thresholds without formulas", () => {
    expect(config.progression.maxCatContributions).toBe(25000);
    expect(config.progression.growthCurve).toBe(500);
    expect(config.progression.mouseUnlockThreshold).toBe(0.65);
  });

  it("should return an isolated deep clone when calling getConfig()", () => {
    const clone = getConfig();
    expect(clone).toEqual(config);
    clone.application.name = "MUTATED";
    expect(config.application.name).toBe("CAT-MICE");
  });
});
