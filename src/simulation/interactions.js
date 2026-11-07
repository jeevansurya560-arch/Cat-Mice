/**
 * @file Cat and mouse spatial interactions module.
 * Evaluates peaceful ecosystem interactions: fish consumption, wool play, cheese collection, and burrow transit.
 */

import { distance, clampToBounds } from "./behavior.js";
import { CAT_ACTIONS } from "./cat.js";
import { MOUSE_ACTIONS } from "./mouse.js";

/**
 * Resolves mutual interactions between cat, mouse, and environmental props.
 *
 * @param {object} cat - Cat entity state.
 * @param {object} mouse - Mouse entity state.
 * @param {object} props - Environmental props (fish, woolBall, cheese, mouseHole).
 * @param {{ width: number, height: number }} bounds
 * @param {import("../utils/random.js").createRng} rng
 * @returns {{ cat: object, mouse: object, props: object, event: string | null }}
 */
export function resolveInteractions(cat, mouse, props, bounds, rng) {
  let updatedCat = { ...cat };
  let updatedMouse = { ...mouse };
  let updatedProps = { ...props };
  let event = null;

  // 1. Cat eats fish (leaving fish bones)
  if (
    updatedCat.action === CAT_ACTIONS.EATING_FISH &&
    updatedProps.fish &&
    !updatedProps.fish.consumed
  ) {
    const distToFish = distance(updatedCat, updatedProps.fish);
    if (distToFish <= 22 * updatedCat.scale) {
      updatedProps.fish = {
        ...updatedProps.fish,
        consumed: true,
        bones: true
      };
      event = "FISH_CONSUMED";
    }
  }

  // 2. Cat plays with wool ball
  if (updatedCat.action === CAT_ACTIONS.PLAYING_WOOL && updatedProps.woolBall) {
    const distToWool = distance(updatedCat, updatedProps.woolBall);
    if (distToWool <= 24 * updatedCat.scale) {
      event = "WOOL_BATTED";
      const impulseAngle = rng.next() * Math.PI * 2;
      const impulseSpeed = rng.nextInt(6, 14);
      updatedProps.woolBall = {
        ...updatedProps.woolBall,
        vx: Number((Math.cos(impulseAngle) * impulseSpeed).toFixed(1)),
        vy: Number((Math.sin(impulseAngle) * impulseSpeed).toFixed(1))
      };
    }
  }

  // Update wool ball movement physics if active
  if (
    updatedProps.woolBall &&
    (Math.abs(updatedProps.woolBall.vx || 0) > 0.1 || Math.abs(updatedProps.woolBall.vy || 0) > 0.1)
  ) {
    const nextX = updatedProps.woolBall.x + (updatedProps.woolBall.vx || 0);
    const nextY = updatedProps.woolBall.y + (updatedProps.woolBall.vy || 0);
    const clamped = clampToBounds({ x: nextX, y: nextY }, bounds, 12);

    updatedProps.woolBall = {
      ...updatedProps.woolBall,
      x: Number(clamped.x.toFixed(1)),
      y: Number(clamped.y.toFixed(1)),
      vx: Number(((updatedProps.woolBall.vx || 0) * 0.78).toFixed(1)),
      vy: Number(((updatedProps.woolBall.vy || 0) * 0.78).toFixed(1))
    };
  }

  // 3. Mouse collects cheese
  if (
    updatedMouse.unlocked &&
    updatedMouse.visible &&
    updatedProps.cheese &&
    !updatedProps.cheese.collected &&
    (updatedMouse.action === MOUSE_ACTIONS.COLLECTING_CHEESE ||
      updatedMouse.action === MOUSE_ACTIONS.EXPLORING)
  ) {
    const distToCheese = distance(updatedMouse, updatedProps.cheese);
    if (distToCheese <= 14) {
      updatedProps.cheese = {
        ...updatedProps.cheese,
        collected: true
      };
      event = "CHEESE_COLLECTED";
    }
  }

  // 4. Mouse hole transit events
  const hole = updatedProps.mouseHole || updatedProps.burrow;
  if (hole && updatedMouse.unlocked) {
    const distToHole = distance(updatedMouse, hole);
    if (updatedMouse.action === MOUSE_ACTIONS.HIDING && distToHole < 16 && !event) {
      event = "MOUSE_IN_HOLE";
    }
  }

  return {
    cat: updatedCat,
    mouse: updatedMouse,
    props: updatedProps,
    event
  };
}
