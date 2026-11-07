/**
 * @file Cat entity simulation and Finite State Machine (FSM).
 * Controls cat movement physics, hunting behaviors, and stage-specific actions.
 */

import { CAT_STAGES } from "../core/constants.js";
import { distance, wander, seek, clampToBounds } from "./behavior.js";

export const CAT_ACTIONS = Object.freeze({
  SLEEPING: "SLEEPING",
  PROWLING: "PROWLING",
  STALKING: "STALKING",
  POUNCING: "POUNCING",
  GROOMING: "GROOMING"
});

/**
 * Initializes cat state at beginning of simulation.
 *
 * @param {object} catProgression - Stage, scale, variant from ProgressionStateDTO.
 * @param {{ width: number, height: number }} bounds
 * @param {import("../utils/random.js").createRng} rng
 * @returns {object} Cat simulation entity state.
 */
export function initCat(catProgression, bounds, rng) {
  const initialX = bounds.width * 0.4 + (rng.next() - 0.5) * 40;
  const initialY = bounds.height * 0.45 + (rng.next() - 0.5) * 40;

  return {
    x: Number(initialX.toFixed(1)),
    y: Number(initialY.toFixed(1)),
    vx: 0,
    vy: 0,
    action:
      catProgression.stage === CAT_STAGES.KITTEN ? CAT_ACTIONS.SLEEPING : CAT_ACTIONS.PROWLING,
    facing: "right",
    stage: catProgression.stage,
    scale: catProgression.scale,
    variant: catProgression.variant,
    timer: rng.nextInt(15, 30),
    target: null
  };
}

/**
 * Updates cat entity physics and FSM state for one tick.
 *
 * @param {object} cat - Current cat entity state.
 * @param {object|null} mouse - Current mouse entity state (or null if locked/hidden).
 * @param {object} props - Environmental props (burrow, yarn, etc.).
 * @param {{ width: number, height: number }} bounds
 * @param {import("../utils/random.js").createRng} rng
 * @returns {object} Updated cat entity state.
 */
export function updateCat(cat, mouse, props, bounds, rng) {
  const updated = { ...cat };
  updated.timer = Math.max(0, updated.timer - 1);

  // Speed modifiers by stage
  const baseSpeed =
    updated.stage === CAT_STAGES.ELDER ? 1.0 : updated.stage === CAT_STAGES.KITTEN ? 1.2 : 1.5;

  const mouseVisible = mouse && mouse.unlocked && mouse.visible;
  const distToMouse = mouseVisible ? distance(updated, mouse) : Infinity;

  // FSM State Transitions
  switch (updated.action) {
    case CAT_ACTIONS.SLEEPING: {
      updated.vx = 0;
      updated.vy = 0;
      if (updated.timer === 0) {
        updated.action = CAT_ACTIONS.PROWLING;
        updated.timer = rng.nextInt(20, 45);
      }
      break;
    }

    case CAT_ACTIONS.PROWLING: {
      // Check if mouse detected in stalking range (only for adult / elder)
      if (mouseVisible && distToMouse < 110 && updated.stage !== CAT_STAGES.KITTEN) {
        updated.action = CAT_ACTIONS.STALKING;
        updated.timer = rng.nextInt(12, 24);
        break;
      }

      // Check kitten interaction with yarn
      if (updated.stage === CAT_STAGES.KITTEN && props.yarnBall?.active) {
        const vel = seek(updated, props.yarnBall, baseSpeed * 0.9);
        updated.vx = vel.vx;
        updated.vy = vel.vy;
      } else {
        // Normal wandering
        const vel = wander({ vx: updated.vx, vy: updated.vy }, rng, baseSpeed);
        updated.vx = vel.vx;
        updated.vy = vel.vy;
      }

      if (updated.timer === 0) {
        // Chance to sleep or groom
        if (rng.next() < 0.35) {
          updated.action = CAT_ACTIONS.SLEEPING;
          updated.timer = rng.nextInt(15, 30);
        } else if (rng.next() < 0.6) {
          updated.action = CAT_ACTIONS.GROOMING;
          updated.timer = rng.nextInt(10, 20);
        } else {
          updated.timer = rng.nextInt(20, 40);
        }
      }
      break;
    }

    case CAT_ACTIONS.STALKING: {
      if (!mouseVisible) {
        updated.action = CAT_ACTIONS.PROWLING;
        updated.timer = 15;
        break;
      }

      // Slow stealthy stalk
      const vel = seek(updated, mouse, baseSpeed * 0.6);
      updated.vx = vel.vx;
      updated.vy = vel.vy;

      // Check strike zone
      if (distToMouse < 45 || updated.timer === 0) {
        updated.action = CAT_ACTIONS.POUNCING;
        updated.timer = 8; // Burst duration
      }
      break;
    }

    case CAT_ACTIONS.POUNCING: {
      if (mouseVisible) {
        const vel = seek(updated, mouse, baseSpeed * 2.2);
        updated.vx = vel.vx;
        updated.vy = vel.vy;
      }

      if (updated.timer === 0) {
        // Transition to grooming after strike
        updated.action = CAT_ACTIONS.GROOMING;
        updated.timer = rng.nextInt(12, 25);
      }
      break;
    }

    case CAT_ACTIONS.GROOMING: {
      updated.vx = 0;
      updated.vy = 0;
      if (updated.timer === 0) {
        updated.action = CAT_ACTIONS.PROWLING;
        updated.timer = rng.nextInt(25, 50);
      }
      break;
    }
  }

  // Position update and bounds clamping
  const nextPos = clampToBounds(
    { x: updated.x + updated.vx, y: updated.y + updated.vy },
    bounds,
    18 * updated.scale
  );

  updated.x = Number(nextPos.x.toFixed(1));
  updated.y = Number(nextPos.y.toFixed(1));

  // Determine facing direction
  if (updated.vx > 0.1) {
    updated.facing = "right";
  } else if (updated.vx < -0.1) {
    updated.facing = "left";
  }

  return updated;
}
