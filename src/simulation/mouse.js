/**
 * @file Mouse entity simulation and Finite State Machine (FSM).
 * Controls mouse emergence, foraging, evasion, and burrow hiding.
 */

import { distance, wander, seek, flee, clampToBounds } from "./behavior.js";
import { CAT_ACTIONS } from "./cat.js";

export const MOUSE_ACTIONS = Object.freeze({
  HIDDEN: "HIDDEN",
  FORAGING: "FORAGING",
  DARTING: "DARTING",
  TAUNTING: "TAUNTING"
});

/**
 * Initializes mouse state at beginning of simulation.
 *
 * @param {object} mouseProgression - Unlocked, tier, speedModifier from ProgressionStateDTO.
 * @param {{ width: number, height: number }} bounds
 * @param {object} props - Environmental props including burrow location.
 * @returns {object} Mouse simulation entity state.
 */
export function initMouse(mouseProgression, bounds, props) {
  const burrow = props.burrow || { x: bounds.width - 32, y: bounds.height - 32 };

  return {
    unlocked: mouseProgression.unlocked,
    visible: false,
    x: burrow.x,
    y: burrow.y,
    vx: 0,
    vy: 0,
    action: MOUSE_ACTIONS.HIDDEN,
    facing: "left",
    tier: mouseProgression.tier,
    speedModifier: mouseProgression.speedModifier || 1.0,
    evasionChance: mouseProgression.evasionChance || 0.3,
    variant: mouseProgression.variant,
    timer: 10 // Emerge delay
  };
}

/**
 * Updates mouse entity physics and FSM state for one tick.
 *
 * @param {object} mouse - Current mouse entity state.
 * @param {object} cat - Current cat entity state.
 * @param {object} props - Environmental props (burrow).
 * @param {{ width: number, height: number }} bounds
 * @param {import("../utils/random.js").createRng} rng
 * @returns {object} Updated mouse entity state.
 */
export function updateMouse(mouse, cat, props, bounds, rng) {
  if (!mouse.unlocked) {
    return { ...mouse, visible: false, action: MOUSE_ACTIONS.HIDDEN };
  }

  const updated = { ...mouse };
  const burrow = props.burrow || { x: bounds.width - 32, y: bounds.height - 32 };
  const distToCat = distance(updated, cat);
  const distToBurrow = distance(updated, burrow);

  const baseSpeed = 1.8 * updated.speedModifier;
  updated.timer = Math.max(0, updated.timer - 1);

  switch (updated.action) {
    case MOUSE_ACTIONS.HIDDEN: {
      updated.visible = false;
      updated.vx = 0;
      updated.vy = 0;
      updated.x = burrow.x;
      updated.y = burrow.y;

      // Emerge if cat is sleeping or sufficiently distant
      if (updated.timer === 0 && (distToCat > 90 || cat.action === CAT_ACTIONS.SLEEPING)) {
        updated.action = MOUSE_ACTIONS.FORAGING;
        updated.visible = true;
        updated.timer = rng.nextInt(25, 50);
        // Step out of burrow
        const outDir = { x: bounds.width * 0.5, y: bounds.height * 0.5 };
        const vel = seek(updated, outDir, baseSpeed * 0.6);
        updated.vx = vel.vx;
        updated.vy = vel.vy;
      }
      break;
    }

    case MOUSE_ACTIONS.FORAGING: {
      updated.visible = true;

      // Danger check: cat stalking, pouncing, or too close
      const inDanger =
        distToCat < 75 ||
        cat.action === CAT_ACTIONS.POUNCING ||
        cat.action === CAT_ACTIONS.STALKING;

      if (inDanger) {
        updated.action = MOUSE_ACTIONS.DARTING;
        break;
      }

      // High-tier ninja taunting opportunity
      if (
        updated.tier === "NINJA" &&
        (cat.action === CAT_ACTIONS.SLEEPING || cat.action === CAT_ACTIONS.GROOMING) &&
        distToCat > 40 &&
        distToCat < 80 &&
        rng.next() < 0.25
      ) {
        updated.action = MOUSE_ACTIONS.TAUNTING;
        updated.timer = rng.nextInt(8, 15);
        break;
      }

      // Normal foraging movement
      const vel = wander({ vx: updated.vx, vy: updated.vy }, rng, baseSpeed * 0.7);
      updated.vx = vel.vx;
      updated.vy = vel.vy;

      if (updated.timer === 0) {
        updated.timer = rng.nextInt(15, 30);
      }
      break;
    }

    case MOUSE_ACTIONS.DARTING: {
      updated.visible = true;

      // Flee toward burrow with evasion steering away from cat
      let vel;
      if (distToCat < 40) {
        // Immediate evasive dodge away from cat
        vel = flee(updated, cat, baseSpeed * 1.3);
      } else {
        // Direct sprint to burrow
        vel = seek(updated, burrow, baseSpeed * 1.2);
      }
      updated.vx = vel.vx;
      updated.vy = vel.vy;

      // Reached burrow safely
      if (distToBurrow < 18) {
        updated.action = MOUSE_ACTIONS.HIDDEN;
        updated.visible = false;
        updated.timer = rng.nextInt(18, 35); // Hide cooldown
      }
      break;
    }

    case MOUSE_ACTIONS.TAUNTING: {
      updated.visible = true;
      updated.vx = 0;
      updated.vy = 0;

      // Flee immediately if cat wakes up or pounces
      if (cat.action !== CAT_ACTIONS.SLEEPING && cat.action !== CAT_ACTIONS.GROOMING) {
        updated.action = MOUSE_ACTIONS.DARTING;
        break;
      }

      if (updated.timer === 0) {
        updated.action = MOUSE_ACTIONS.FORAGING;
        updated.timer = 20;
      }
      break;
    }
  }

  if (updated.visible) {
    const nextPos = clampToBounds(
      { x: updated.x + updated.vx, y: updated.y + updated.vy },
      bounds,
      12
    );
    updated.x = Number(nextPos.x.toFixed(1));
    updated.y = Number(nextPos.y.toFixed(1));

    if (updated.vx > 0.1) {
      updated.facing = "right";
    } else if (updated.vx < -0.1) {
      updated.facing = "left";
    }
  }

  return updated;
}
