import { describe, it, expect } from "vitest";
import { initMouse, updateMouse, MOUSE_ACTIONS } from "../../src/simulation/mouse.js";
import { CAT_ACTIONS } from "../../src/simulation/cat.js";
import { createRng } from "../../src/utils/random.js";

describe("Simulation: Mouse Entity & State Machine", () => {
  const bounds = { width: 256, height: 256 };
  const props = { burrow: { x: 224, y: 224, radius: 14 } };

  it("should keep mouse hidden and invisible when locked", () => {
    const mouse = initMouse({ unlocked: false, tier: "LOCKED" }, bounds, props);
    expect(mouse.unlocked).toBe(false);
    expect(mouse.visible).toBe(false);
    expect(mouse.action).toBe(MOUSE_ACTIONS.HIDDEN);

    const updated = updateMouse(
      mouse,
      { action: CAT_ACTIONS.SLEEPING, x: 50, y: 50 },
      props,
      bounds,
      createRng(1)
    );
    expect(updated.visible).toBe(false);
    expect(updated.action).toBe(MOUSE_ACTIONS.HIDDEN);
  });

  it("should emerge from burrow to foraging when cat is distant and timer reaches 0", () => {
    const rng = createRng(10);
    let mouse = {
      unlocked: true,
      visible: false,
      x: 224,
      y: 224,
      vx: 0,
      vy: 0,
      action: MOUSE_ACTIONS.HIDDEN,
      facing: "left",
      tier: "RUNNER",
      speedModifier: 1.25,
      evasionChance: 0.6,
      timer: 1
    };

    const cat = { action: CAT_ACTIONS.SLEEPING, x: 50, y: 50 };
    mouse = updateMouse(mouse, cat, props, bounds, rng);

    expect(mouse.visible).toBe(true);
    expect(mouse.action).toBe(MOUSE_ACTIONS.FORAGING);
  });

  it("should transition to darting when cat is in close pursuit", () => {
    const rng = createRng(10);
    let mouse = {
      unlocked: true,
      visible: true,
      x: 150,
      y: 150,
      vx: 0,
      vy: 0,
      action: MOUSE_ACTIONS.FORAGING,
      facing: "left",
      tier: "RUNNER",
      speedModifier: 1.25,
      evasionChance: 0.6,
      timer: 20
    };

    const cat = { action: CAT_ACTIONS.POUNCING, x: 170, y: 150 }; // 20px away & pouncing!
    mouse = updateMouse(mouse, cat, props, bounds, rng);

    expect(mouse.action).toBe(MOUSE_ACTIONS.DARTING);
  });
});
