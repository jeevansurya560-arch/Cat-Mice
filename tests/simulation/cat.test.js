import { describe, it, expect } from "vitest";
import { initCat, updateCat, CAT_ACTIONS } from "../../src/simulation/cat.js";
import { CAT_STAGES } from "../../src/core/constants.js";
import { createRng } from "../../src/utils/random.js";

describe("Simulation: Cat Entity & State Machine", () => {
  const bounds = { width: 240, height: 120 };

  it("should initialize kitten in sleeping state", () => {
    const rng = createRng(42);
    const cat = initCat({ stage: CAT_STAGES.KITTEN, scale: 1, variant: "tabby" }, bounds, rng);

    expect(cat.stage).toBe(CAT_STAGES.KITTEN);
    expect(cat.action).toBe(CAT_ACTIONS.SLEEPING);
    expect(cat.scale).toBe(1);
    expect(cat.x).toBeGreaterThan(0);
    expect(cat.y).toBeGreaterThan(0);
  });

  it("should initialize adult in walking state", () => {
    const rng = createRng(42);
    const cat = initCat({ stage: CAT_STAGES.ADULT, scale: 2, variant: "calico" }, bounds, rng);

    expect(cat.stage).toBe(CAT_STAGES.ADULT);
    expect(cat.action).toBe(CAT_ACTIONS.WALKING);
    expect(cat.scale).toBe(2);
  });

  it("should transition from sleeping to walking or exploring when timer expires", () => {
    const rng = createRng(100);
    let cat = {
      x: 100,
      y: 60,
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
    expect([CAT_ACTIONS.WALKING, CAT_ACTIONS.EXPLORING]).toContain(cat.action);
  });

  it("should transition cat to eating fish when fresh fish is near", () => {
    const rng = createRng(100);
    let cat = {
      x: 40,
      y: 90,
      vx: 1,
      vy: 0,
      action: CAT_ACTIONS.WALKING,
      facing: "right",
      stage: CAT_STAGES.ADULT,
      scale: 2,
      variant: "tabby",
      timer: 20
    };

    const props = {
      fish: { x: 42, y: 92, consumed: false, bones: false }
    };

    cat = updateCat(cat, null, props, bounds, rng);
    expect(cat.action).toBe(CAT_ACTIONS.EATING_FISH);
  });

  it("should transition cat to playing wool when wool ball is near", () => {
    const rng = createRng(42);
    let cat = {
      x: 80,
      y: 70,
      vx: 1,
      vy: 0,
      action: CAT_ACTIONS.WALKING,
      facing: "right",
      stage: CAT_STAGES.ADULT,
      scale: 2,
      variant: "tabby",
      timer: 20
    };

    const props = {
      woolBall: { x: 85, y: 72, active: true }
    };

    cat = updateCat(cat, null, props, bounds, rng);
    expect(cat.action).toBe(CAT_ACTIONS.PLAYING_WOOL);
  });
});
