/**
 * @file Mouse entity simulation and Finite State Machine (FSM).
 * Controls mouse emergence from hole, cheese foraging, exploring, and resting.
 */

import { distance, wander, seek, flee, clampToBounds } from "./behavior.js";
import { CAT_ACTIONS } from "./cat.js";

export const MOUSE_ACTIONS = Object.freeze({
  HIDING: "HIDING",
  EXPLORING: "EXPLORING",
  COLLECTING_CHEESE: "COLLECTING_CHEESE",
  SLEEPING: "SLEEPING",
  OBSERVING_CAT: "OBSERVING_CAT",
  RUNNING: "RUNNING"
});

/**
 * Initializes mouse state at beginning of simulation.
 *
 * @param {object} mouseProgression - Unlocked, tier, speedModifier from ProgressionStateDTO.
 * @param {{ width: number, height: number }} bounds
 * @param {object} props - Environmental props including mouseHole/burrow.
 * @returns {object} Mouse simulation entity state.
 */
export function initMouse(mouseProgression, bounds, props) {
  const hole = props.mouseHole || props.burrow || { x: bounds.width - 24, y: bounds.height - 24 };

  return {
    unlocked: Boolean(mouseProgression.unlocked),
    visible: false,
    x: hole.x,
    y: hole.y,
    vx: 0,
    vy: 0,
    action: MOUSE_ACTIONS.HIDING,
    facing: "left",
    tier: mouseProgression.tier,
    speedModifier: mouseProgression.speedModifier || 1.0,
    evasionChance: mouseProgression.evasionChance || 0.3,
    variant: mouseProgression.variant,
    timer: 8 // Ticks before emerging
  };
}

/**
 * Updates mouse entity physics and FSM state for one tick.
 *
 * @param {object} mouse - Current mouse entity state.
 * @param {object} cat - Current cat entity state.
 * @param {object} props - Environmental props (mouseHole, cheese, etc.).
 * @param {{ width: number, height: number }} bounds
 * @param {import("../utils/random.js").createRng} rng
 * @returns {object} Updated mouse entity state.
 */
export function updateMouse(mouse, cat, props, bounds, rng) {
  if (!mouse.unlocked) {
    return { ...mouse, visible: false, action: MOUSE_ACTIONS.HIDING };
  }

  const updated = { ...mouse };
  const hole = props.mouseHole || props.burrow || { x: bounds.width - 24, y: bounds.height - 24 };
  const distToCat = distance(updated, cat);
  const distToHole = distance(updated, hole);

  const baseSpeed = 1.6 * updated.speedModifier;
  updated.timer = Math.max(0, updated.timer - 1);

  switch (updated.action) {
    case MOUSE_ACTIONS.HIDING: {
      updated.visible = false;
      updated.vx = 0;
      updated.vy = 0;
      updated.x = hole.x;
      updated.y = hole.y;

      // Emerge from hole when timer expires
      if (updated.timer === 0) {
        updated.visible = true;
        // Check if cheese is available on floor to collect
        if (props.cheese && !props.cheese.collected) {
          updated.action = MOUSE_ACTIONS.COLLECTING_CHEESE;
          updated.timer = rng.nextInt(30, 50);
        } else {
          updated.action = MOUSE_ACTIONS.EXPLORING;
          updated.timer = rng.nextInt(25, 45);
        }

        // Venture out into room
        const roomCenter = {
          x: bounds.width * 0.55,
          y: bounds.height === 120 ? 72 : bounds.height * 0.6
        };
        const vel = seek(updated, roomCenter, baseSpeed * 0.7);
        updated.vx = vel.vx;
        updated.vy = vel.vy;
      }
      break;
    }

    case MOUSE_ACTIONS.EXPLORING: {
      updated.visible = true;

      // If cat approaches too close (< 50px), scamper away or observe
      if (distToCat < 50) {
        if (cat.action === CAT_ACTIONS.SLEEPING || rng.next() < 0.4) {
          updated.action = MOUSE_ACTIONS.OBSERVING_CAT;
          updated.timer = rng.nextInt(15, 25);
          updated.vx = 0;
          updated.vy = 0;
        } else {
          updated.action = MOUSE_ACTIONS.RUNNING;
          updated.timer = rng.nextInt(15, 30);
        }
        break;
      }

      // Check if uncollected cheese is spotted
      if (props.cheese && !props.cheese.collected && distance(updated, props.cheese) < 80) {
        updated.action = MOUSE_ACTIONS.COLLECTING_CHEESE;
        updated.timer = rng.nextInt(20, 40);
        break;
      }

      // Gentle exploring wander
      const vel = wander({ vx: updated.vx, vy: updated.vy }, rng, baseSpeed * 0.7);
      updated.vx = vel.vx;
      updated.vy = vel.vy;

      if (updated.timer === 0) {
        const roll = rng.next();
        if (roll < 0.3) {
          updated.action = MOUSE_ACTIONS.OBSERVING_CAT;
          updated.timer = rng.nextInt(15, 30);
        } else if (roll < 0.55) {
          updated.action = MOUSE_ACTIONS.SLEEPING;
          updated.timer = rng.nextInt(15, 25);
        } else if (roll < 0.8) {
          // Run back to hole to hide
          updated.action = MOUSE_ACTIONS.RUNNING;
          updated.timer = rng.nextInt(20, 35);
        } else {
          updated.timer = rng.nextInt(20, 40);
        }
      }
      break;
    }

    case MOUSE_ACTIONS.COLLECTING_CHEESE: {
      updated.visible = true;

      if (props.cheese && !props.cheese.collected) {
        const distToCheese = distance(updated, props.cheese);
        if (distToCheese > 10) {
          const vel = seek(updated, props.cheese, baseSpeed);
          updated.vx = vel.vx;
          updated.vy = vel.vy;
        } else {
          // Nibbling / picking up cheese
          updated.vx = 0;
          updated.vy = 0;
        }
      }

      // Flee if cat is right on top
      if (distToCat < 40 && cat.action !== CAT_ACTIONS.SLEEPING) {
        updated.action = MOUSE_ACTIONS.RUNNING;
        updated.timer = rng.nextInt(15, 25);
        break;
      }

      if (updated.timer === 0) {
        updated.action = rng.next() < 0.5 ? MOUSE_ACTIONS.RUNNING : MOUSE_ACTIONS.EXPLORING;
        updated.timer = rng.nextInt(20, 35);
      }
      break;
    }

    case MOUSE_ACTIONS.OBSERVING_CAT: {
      updated.visible = true;
      updated.vx = 0;
      updated.vy = 0;

      // Face toward cat
      updated.facing = cat.x > updated.x ? "right" : "left";

      // If cat moves too close, break into run
      if (distToCat < 35 && cat.action !== CAT_ACTIONS.SLEEPING) {
        updated.action = MOUSE_ACTIONS.RUNNING;
        updated.timer = rng.nextInt(15, 25);
        break;
      }

      if (updated.timer === 0) {
        updated.action = rng.next() < 0.5 ? MOUSE_ACTIONS.EXPLORING : MOUSE_ACTIONS.RUNNING;
        updated.timer = rng.nextInt(20, 35);
      }
      break;
    }

    case MOUSE_ACTIONS.RUNNING: {
      updated.visible = true;

      // Run either toward mouse hole or away from cat
      if (distToCat < 55) {
        const vel = flee(updated, cat, baseSpeed * 1.3);
        updated.vx = vel.vx;
        updated.vy = vel.vy;
      } else {
        const vel = seek(updated, hole, baseSpeed * 1.2);
        updated.vx = vel.vx;
        updated.vy = vel.vy;
      }

      // Entered hole
      if (distToHole < 16) {
        updated.action = MOUSE_ACTIONS.HIDING;
        updated.timer = rng.nextInt(20, 40);
        updated.visible = false;
        break;
      }

      if (updated.timer === 0) {
        updated.action = MOUSE_ACTIONS.EXPLORING;
        updated.timer = rng.nextInt(20, 40);
      }
      break;
    }

    case MOUSE_ACTIONS.SLEEPING: {
      updated.visible = true;
      updated.vx = 0;
      updated.vy = 0;

      // Wake if cat gets close
      if (distToCat < 40) {
        updated.action = MOUSE_ACTIONS.RUNNING;
        updated.timer = 15;
        break;
      }

      if (updated.timer === 0) {
        updated.action = MOUSE_ACTIONS.EXPLORING;
        updated.timer = rng.nextInt(20, 35);
      }
      break;
    }

    default: {
      updated.action = MOUSE_ACTIONS.EXPLORING;
      updated.timer = 20;
      break;
    }
  }

  // Position update and clamping
  if (updated.visible) {
    const targetY =
      bounds.height === 120
        ? Math.max(70, Math.min(74, updated.y + updated.vy * 0.15))
        : updated.y + updated.vy;
    const nextPos = clampToBounds({ x: updated.x + updated.vx, y: targetY }, bounds, 12);
    updated.x = Number(nextPos.x.toFixed(1));
    updated.y = Number(nextPos.y.toFixed(1));

    if (updated.vx > 0.08) {
      updated.facing = "right";
    } else if (updated.vx < -0.08) {
      updated.facing = "left";
    }
  }

  return updated;
}
