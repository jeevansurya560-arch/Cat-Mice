import { describe, it, expect } from "vitest";
import { createWorld, stepWorld, simulateWorld } from "../../src/simulation/state.js";
import { createRng } from "../../src/utils/random.js";

describe("Simulation: World State & Timeline Simulation", () => {
  const mockProgression = {
    cat: { stage: "ADULT", scale: 2, variant: "tabby", demeanor: "alert", level: 30 },
    mouse: {
      unlocked: true,
      tier: "RUNNER",
      speedModifier: 1.25,
      evasionChance: 0.6,
      variant: "field_mouse"
    },
    worldSeed: 123456
  };

  it("should create world with props and initial entity positions", () => {
    const rng = createRng(mockProgression.worldSeed);
    const world = createWorld(mockProgression, { width: 256, height: 256 }, rng);

    expect(world.tick).toBe(0);
    expect(world.bounds.width).toBe(256);
    expect(world.props.burrow).toBeDefined();
    expect(world.cat.x).toBeGreaterThan(0);
    expect(world.mouse.action).toBe("HIDDEN");
  });

  it("should advance ticks sequentially on stepWorld", () => {
    const rng = createRng(mockProgression.worldSeed);
    let world = createWorld(mockProgression, { width: 256, height: 256 }, rng);

    world = stepWorld(world, rng);
    expect(world.tick).toBe(1);

    world = stepWorld(world, rng);
    expect(world.tick).toBe(2);
  });

  it("should generate complete discrete timeline of 60 frames", () => {
    const timeline = simulateWorld(mockProgression, { totalTicks: 60 });

    expect(timeline.totalTicks).toBe(60);
    expect(timeline.frames).toHaveLength(60);
    expect(timeline.frames[0].tick).toBe(0);
    expect(timeline.frames[59].tick).toBe(59);

    // Verify frame contents
    const frame = timeline.frames[10];
    expect(frame.cat.x).toBeDefined();
    expect(frame.cat.y).toBeDefined();
    expect(frame.cat.action).toBeDefined();
    expect(frame.mouse.tier).toBe("RUNNER");
  });

  it("should be 100% deterministic for identical progression state and seed", () => {
    const timelineA = simulateWorld(mockProgression, { totalTicks: 30 });
    const timelineB = simulateWorld(mockProgression, { totalTicks: 30 });

    expect(timelineA.frames).toEqual(timelineB.frames);
    expect(timelineA.events).toEqual(timelineB.events);
  });
});
