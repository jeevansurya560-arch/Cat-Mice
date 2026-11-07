import { describe, it, expect } from "vitest";
import { initCat, updateCat, CAT_ACTIONS } from "../../src/simulation/cat.js";
import { CAT_STAGES } from "../../src/core/constants.js";
import { createRng } from "../../src/utils/random.js";

describe("Simulation: Cat Entity & State Machine", () => {
  const bounds = { width: 256, height: 256 };

  it("should initialize kitten in sleeping state", () => {
    const rng = createRng(42);
    const cat = initCat({ stage: CAT_STAGES.KITTEN, scale: 1, variant: "tabby" }, bounds, rng);

    expect(cat.stage).toBe(CAT_STAGES.KITTEN);
    expect(cat.action).toBe(CAT_ACTIONS.SLEEPING);
    expect(cat.scale).toBe(1);
    expect(cat.x).toBeGreaterThan(0);
    expect(cat.y).toBeGreaterThan(0);
  });

  it("should initialize adult in prowling state", () => {
    const rng = createRng(42);
    const cat = initCat({ stage: CAT_STAGES.ADULT, scale: 2, variant: "calico" }, bounds, rng);

    expect(cat.stage).toBe(CAT_STAGES.ADULT);
    expect(cat.action).toBe(CAT_ACTIONS.PROWLING);
    expect(cat.scale).toBe(2);
  });

  it("should transition from sleeping to prowling when timer expires", () => {
    const rng = createRng(100);
    let cat = {
      x: 100,
      y: 100,
      vx: 0,
      vy: 0,
      action: CAT_ACTIONS.SLEEPING,
      facing: "right",
      stage: CAT_STAGES.KITTEN,
      scale: 1,
      variant: "tabby",
      timer: 1
    };

    cat = updateCat(cat, null, {}, bounds, rng);
    expect(cat.action).toBe(CAT_ACTIONS.PROWLING);
  });

  it("should transition adult cat to stalking when mouse is in detection range", () => {
    const rng = createRng(100);
    let cat = {
      x: 100,
      y: 100,
      vx: 1,
      vy: 0,
      action: CAT_ACTIONS.PROWLING,
      facing: "right",
      stage: CAT_STAGES.ADULT,
      scale: 2,
      variant: "tabby",
      timer: 20
    };

    const mouse = {
      unlocked: true,
      visible: true,
      x: 140, // 40 units away (within 110px range)
      y: 100
    };

    cat = updateCat(cat, mouse, {}, bounds, rng);
    expect(cat.action).toBe(CAT_ACTIONS.STALKING);
  });
});
