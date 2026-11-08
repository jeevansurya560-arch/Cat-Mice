/**
 * @file Cat entity simulation and Finite State Machine (FSM).
 * Controls cat movement physics, peaceful behaviors, and stage-specific actions.
 */

import { CAT_STAGES } from "../core/constants.js";
import { distance, wander, seek, clampToBounds } from "./behavior.js";

export const CAT_ACTIONS = Object.freeze({
  SLEEPING: "SLEEPING",
  EATING_FISH: "EATING_FISH",
  GROOMING: "GROOMING",
  PLAYING_WOOL: "PLAYING_WOOL",
  WALKING: "WALKING",
  EXPLORING: "EXPLORING"
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
  const initialX = bounds.width * 0.4 + (rng.next() - 0.5) * 30;
  const initialY = bounds.height === 120 ? 71 : bounds.height * 0.5 + (rng.next() - 0.5) * 20;

  return {
    x: Number(initialX.toFixed(1)),
    y: Number(initialY.toFixed(1)),
    vx: 0,
    vy: 0,
    action: catProgression.stage === CAT_STAGES.KITTEN ? CAT_ACTIONS.SLEEPING : CAT_ACTIONS.WALKING,
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
 * @param {object|null} mouse - Current mouse entity state.
 * @param {object} props - Environmental props (fish, woolBall, mouseHole, rug).
 * @param {{ width: number, height: number }} bounds
 * @param {import("../utils/random.js").createRng} rng
 * @returns {object} Updated cat entity state.
 */
export function updateCat(cat, mouse, props, bounds, rng) {
  const updated = { ...cat };
  updated.timer = Math.max(0, updated.timer - 1);

  // Speed modifiers by developmental stage
  const baseSpeed =
    updated.stage === CAT_STAGES.ELDER ? 0.9 : updated.stage === CAT_STAGES.KITTEN ? 1.1 : 1.3;

  // FSM State Logic
  switch (updated.action) {
    case CAT_ACTIONS.SLEEPING: {
      updated.vx = 0;
      updated.vy = 0;
      if (updated.timer === 0) {
        // Wake up and stretch / explore
        updated.action = rng.next() < 0.5 ? CAT_ACTIONS.WALKING : CAT_ACTIONS.EXPLORING;
        updated.timer = rng.nextInt(20, 40);
      }
      break;
    }

    case CAT_ACTIONS.WALKING: {
      // Check opportunities to interact
      const fishAvailable = props.fish && !props.fish.consumed;
      const distToFish = fishAvailable ? distance(updated, props.fish) : Infinity;
      const distToWool = props.woolBall ? distance(updated, props.woolBall) : Infinity;

      if (distToFish < 30 || (distToFish < 55 && rng.next() < 0.4)) {
        updated.action = CAT_ACTIONS.EATING_FISH;
        updated.timer = rng.nextInt(15, 25);
        break;
      }

      if (distToWool < 25 || (distToWool < 45 && rng.next() < 0.4)) {
        updated.action = CAT_ACTIONS.PLAYING_WOOL;
        updated.timer = rng.nextInt(15, 30);
        break;
      }

      // Natural walking movement
      const vel = wander({ vx: updated.vx, vy: updated.vy }, rng, baseSpeed);
      updated.vx = vel.vx;
      updated.vy = vel.vy;

      if (updated.timer === 0) {
        const roll = rng.next();
        if (roll < 0.3) {
          updated.action = CAT_ACTIONS.GROOMING;
          updated.timer = rng.nextInt(15, 25);
        } else if (roll < 0.6) {
          updated.action = CAT_ACTIONS.EXPLORING;
          updated.timer = rng.nextInt(15, 30);
        } else if (roll < 0.8) {
          updated.action = CAT_ACTIONS.SLEEPING;
          updated.timer = rng.nextInt(20, 35);
        } else {
          updated.timer = rng.nextInt(20, 40);
        }
      }
      break;
    }

    case CAT_ACTIONS.EXPLORING: {
      // Curious sniff and slow wander
      const slowSpeed = baseSpeed * 0.6;
      const vel = wander({ vx: updated.vx, vy: updated.vy }, rng, slowSpeed);
      updated.vx = vel.vx;
      updated.vy = vel.vy;

      // May inspect wool or fish
      if (props.fish && !props.fish.consumed && distance(updated, props.fish) < 35) {
        updated.action = CAT_ACTIONS.EATING_FISH;
        updated.timer = rng.nextInt(15, 25);
        break;
      }

      if (props.woolBall && distance(updated, props.woolBall) < 30) {
        updated.action = CAT_ACTIONS.PLAYING_WOOL;
        updated.timer = rng.nextInt(15, 30);
        break;
      }

      if (updated.timer === 0) {
        const roll = rng.next();
        if (roll < 0.5) {
          updated.action = CAT_ACTIONS.WALKING;
          updated.timer = rng.nextInt(20, 40);
        } else {
          updated.action = CAT_ACTIONS.GROOMING;
          updated.timer = rng.nextInt(12, 22);
        }
      }
      break;
    }

    case CAT_ACTIONS.EATING_FISH: {
      if (props.fish) {
        const distToFish = distance(updated, props.fish);
        if (distToFish > 14) {
          const vel = seek(updated, props.fish, baseSpeed * 0.9);
          updated.vx = vel.vx;
          updated.vy = vel.vy;
        } else {
          // Standing right at the fish eating
          updated.vx = 0;
          updated.vy = 0;
        }
      }

      if (updated.timer === 0) {
        // After meal, cat contentedly grooms
        updated.action = CAT_ACTIONS.GROOMING;
        updated.timer = rng.nextInt(18, 30);
      }
      break;
    }

    case CAT_ACTIONS.PLAYING_WOOL: {
      if (props.woolBall) {
        const distToWool = distance(updated, props.woolBall);
        if (distToWool > 15) {
          const vel = seek(updated, props.woolBall, baseSpeed * 1.1);
          updated.vx = vel.vx;
          updated.vy = vel.vy;
        } else {
          // Playful pawing at wool ball
          updated.vx = (rng.next() - 0.5) * 0.5;
          updated.vy = (rng.next() - 0.5) * 0.5;
        }
      }

      if (updated.timer === 0) {
        updated.action = rng.next() < 0.5 ? CAT_ACTIONS.WALKING : CAT_ACTIONS.GROOMING;
        updated.timer = rng.nextInt(15, 30);
      }
      break;
    }

    case CAT_ACTIONS.GROOMING: {
      updated.vx = 0;
      updated.vy = 0;
      if (updated.timer === 0) {
        const roll = rng.next();
        if (roll < 0.45) {
          updated.action = CAT_ACTIONS.WALKING;
          updated.timer = rng.nextInt(20, 40);
        } else if (roll < 0.75) {
          updated.action = CAT_ACTIONS.SLEEPING;
          updated.timer = rng.nextInt(25, 45);
        } else {
          updated.action = CAT_ACTIONS.EXPLORING;
          updated.timer = rng.nextInt(15, 30);
        }
      }
      break;
    }

    default: {
      updated.action = CAT_ACTIONS.WALKING;
      updated.timer = 20;
      break;
    }
  }

  // Position update and boundary constraints
  const margin = 16 * updated.scale;
  const nextPos = clampToBounds(
    { x: updated.x + updated.vx, y: updated.y + updated.vy },
    bounds,
    margin
  );

  updated.x = Number(nextPos.x.toFixed(1));
  updated.y = Number(nextPos.y.toFixed(1));

  // Determine top-down directional heading
  const absVx = Math.abs(updated.vx);
  const absVy = Math.abs(updated.vy);
  if (absVx > 0.08 || absVy > 0.08) {
    if (absVx >= absVy) {
      updated.facing = updated.vx > 0 ? "east" : "west";
    } else {
      updated.facing = updated.vy > 0 ? "south" : "north";
    }
  }

  return updated;
}
