/**
 * @file Cat and mouse spatial interactions module.
 * Evaluates contact dynamics, evasion rolls, and toy interactions.
 */

import { distance, clampToBounds } from "./behavior.js";
import { CAT_ACTIONS } from "./cat.js";
import { MOUSE_ACTIONS } from "./mouse.js";

/**
 * Resolves mutual interactions between cat, mouse, and environmental props.
 *
 * @param {object} cat - Cat entity state.
 * @param {object} mouse - Mouse entity state.
 * @param {object} props - Environmental props (burrow, yarnBall).
 * @param {{ width: number, height: number }} bounds
 * @param {import("../utils/random.js").createRng} rng
 * @returns {{ cat: object, mouse: object, props: object, event: string | null }}
 */
export function resolveInteractions(cat, mouse, props, bounds, rng) {
  let updatedCat = { ...cat };
  let updatedMouse = { ...mouse };
  let updatedProps = { ...props };
  let event = null;

  // 1. Pounce Strike Resolution
  if (updatedCat.action === CAT_ACTIONS.POUNCING && updatedMouse.unlocked && updatedMouse.visible) {
    const dist = distance(updatedCat, updatedMouse);
    const strikeRadius = 22 * updatedCat.scale;

    if (dist <= strikeRadius) {
      // Mouse evasion check based on progression agility tier
      const evaded = rng.next() < updatedMouse.evasionChance;

      if (evaded) {
        event = "POUNCE_EVADED";
        // Mouse escapes into darting mode with burst speed
        updatedMouse.action = MOUSE_ACTIONS.DARTING;
        // Cat misses and transitions to grooming recovery
        updatedCat.action = CAT_ACTIONS.GROOMING;
        updatedCat.timer = rng.nextInt(15, 25);
        updatedCat.vx = 0;
        updatedCat.vy = 0;
      } else {
        event = "NEAR_MISS";
        // Close call: mouse scrambles back to burrow
        updatedMouse.action = MOUSE_ACTIONS.DARTING;
        updatedCat.action = CAT_ACTIONS.GROOMING;
        updatedCat.timer = rng.nextInt(12, 20);
      }
    }
  }

  // 2. Kitten Yarn Ball Play
  if (updatedCat.stage === "KITTEN" && updatedProps.yarnBall?.active) {
    const distToYarn = distance(updatedCat, updatedProps.yarnBall);
    if (distToYarn < 20) {
      event = "YARN_BATTED";
      // Impart random impulse to yarn ball
      const impulseAngle = rng.next() * Math.PI * 2;
      const impulseSpeed = rng.nextInt(15, 30);
      const nextYarnPos = clampToBounds(
        {
          x: updatedProps.yarnBall.x + Math.cos(impulseAngle) * impulseSpeed,
          y: updatedProps.yarnBall.y + Math.sin(impulseAngle) * impulseSpeed
        },
        bounds,
        14
      );
      updatedProps.yarnBall = {
        ...updatedProps.yarnBall,
        x: Number(nextYarnPos.x.toFixed(1)),
        y: Number(nextYarnPos.y.toFixed(1))
      };
    }
  }

  return {
    cat: updatedCat,
    mouse: updatedMouse,
    props: updatedProps,
    event
  };
}
