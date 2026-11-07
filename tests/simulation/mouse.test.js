import { describe, it, expect } from "vitest";
import { initMouse, updateMouse, MOUSE_ACTIONS } from "../../src/simulation/mouse.js";
import { CAT_ACTIONS } from "../../src/simulation/cat.js";
import { createRng } from "../../src/utils/random.js";

describe("Simulation: Mouse Entity & State Machine", () => {
  const bounds = { width: 240, height: 120 };
  const props = { mouseHole: { x: 216, y: 96, radius: 12 } };

  it("should keep mouse hidden and invisible when locked", () => {
    const mouse = initMouse({ unlocked: false, tier: "LOCKED" }, bounds, props);
    expect(mouse.unlocked).toBe(false);
    expect(mouse.visible).toBe(false);
    expect(mouse.action).toBe(MOUSE_ACTIONS.HIDING);

    const updated = updateMouse(
      mouse,
      { action: CAT_ACTIONS.SLEEPING, x: 50, y: 50 },
      props,
      bounds,
      createRng(1)
    );
    expect(updated.visible).toBe(false);
    expect(updated.action).toBe(MOUSE_ACTIONS.HIDING);
  });

  it("should emerge from mouse hole to exploring when timer reaches 0", () => {
    const rng = createRng(10);
    let mouse = {
      unlocked: true,
      visible: false,
      x: 216,
      y: 96,
      vx: 0,
      vy: 0,
      action: MOUSE_ACTIONS.HIDING,
      facing: "left",
      tier: "RUNNER",
      speedModifier: 1.25,
      evasionChance: 0.6,
      timer: 1
    };

    const cat = { action: CAT_ACTIONS.SLEEPING, x: 50, y: 50 };
    mouse = updateMouse(mouse, cat, props, bounds, rng);

    expect(mouse.visible).toBe(true);
    expect([MOUSE_ACTIONS.EXPLORING, MOUSE_ACTIONS.COLLECTING_CHEESE]).toContain(mouse.action);
  });

  it("should seek and collect cheese when cheese is available", () => {
    const rng = createRng(10);
    let mouse = {
      unlocked: true,
      visible: true,
      x: 170,
      y: 60,
      vx: 0,
      vy: 0,
      action: MOUSE_ACTIONS.EXPLORING,
      facing: "left",
      tier: "RUNNER",
      speedModifier: 1.25,
      evasionChance: 0.6,
      timer: 20
    };

    const cat = { action: CAT_ACTIONS.SLEEPING, x: 50, y: 50 };
    const roomProps = {
      ...props,
      cheese: { x: 172, y: 62, collected: false }
    };

    mouse = updateMouse(mouse, cat, roomProps, bounds, rng);
    expect(mouse.action).toBe(MOUSE_ACTIONS.COLLECTING_CHEESE);
  });

  it("should observe cat when cat is calm and within safe range", () => {
    const rng = createRng(10);
    let mouse = {
      unlocked: true,
      visible: true,
      x: 90,
      y: 60,
      vx: 0,
      vy: 0,
      action: MOUSE_ACTIONS.EXPLORING,
      facing: "left",
      tier: "RUNNER",
      speedModifier: 1.25,
      evasionChance: 0.6,
      timer: 20
    };

    const cat = { action: CAT_ACTIONS.SLEEPING, x: 60, y: 60 };
    mouse = updateMouse(mouse, cat, props, bounds, rng);

    expect([MOUSE_ACTIONS.OBSERVING_CAT, MOUSE_ACTIONS.RUNNING]).toContain(mouse.action);
  });
});
