import { describe, it, expect } from "vitest";
import {
  distance,
  direction,
  clampToBounds,
  seek,
  flee,
  wander
} from "../../src/simulation/behavior.js";
import { createRng } from "../../src/utils/random.js";

describe("Simulation: Spatial Math & Steering Behaviors", () => {
  it("should calculate correct Euclidean distance", () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    expect(distance({ x: 10, y: 10 }, { x: 10, y: 10 })).toBe(0);
  });

  it("should compute normalized direction vector", () => {
    const dir = direction({ x: 0, y: 0 }, { x: 10, y: 0 });
    expect(dir.dx).toBe(1);
    expect(dir.dy).toBe(0);

    const zeroDir = direction({ x: 5, y: 5 }, { x: 5, y: 5 });
    expect(zeroDir.dx).toBe(0);
    expect(zeroDir.dy).toBe(0);
  });

  it("should clamp positions within bounds and margins", () => {
    const bounds = { width: 100, height: 100 };
    const clampedUnder = clampToBounds({ x: -10, y: 5 }, bounds, 15);
    expect(clampedUnder.x).toBe(15);
    expect(clampedUnder.y).toBe(15);

    const clampedOver = clampToBounds({ x: 150, y: 95 }, bounds, 10);
    expect(clampedOver.x).toBe(90);
    expect(clampedOver.y).toBe(90);
  });

  it("should steer toward a target using seek", () => {
    const vel = seek({ x: 0, y: 0 }, { x: 100, y: 0 }, 2.0);
    expect(vel.vx).toBe(2.0);
    expect(vel.vy).toBe(0);
  });

  it("should steer away from a threat using flee", () => {
    const vel = flee({ x: 50, y: 50 }, { x: 60, y: 50 }, 3.0);
    expect(vel.vx).toBe(-3.0);
    expect(vel.vy).toBe(0);
  });

  it("should produce smooth wandering perturbations", () => {
    const rng = createRng(1234);
    const vel = wander({ vx: 1, vy: 0 }, rng, 2.0);
    expect(typeof vel.vx).toBe("number");
    expect(typeof vel.vy).toBe("number");
    expect(Math.hypot(vel.vx, vel.vy)).toBeLessThanOrEqual(2.5);
  });
});
