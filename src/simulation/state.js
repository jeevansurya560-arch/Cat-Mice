/**
 * @file World state management and simulation tick engine.
 * Generates deterministic discrete frame sequences (SimulationTimelineDTO).
 */

import { createRng } from "../utils/random.js";
import { initCat, updateCat } from "./cat.js";
import { initMouse, updateMouse } from "./mouse.js";
import { resolveInteractions } from "./interactions.js";
import { config } from "../core/config.js";

/**
 * Initializes world state prior to simulation execution.
 *
 * @param {object} progressionState - State from evaluateProgression.
 * @param {object} [simConfig] - Dimensions and tick parameters.
 * @param {import("../utils/random.js").createRng} rng
 * @returns {object} Initial world state.
 */
export function createWorld(progressionState, simConfig = {}, rng) {
  const bounds = {
    width: simConfig.width || config.rendering.width || 240,
    height: simConfig.height || config.rendering.height || 120
  };

  const holePos = {
    x: bounds.width - 24,
    y: bounds.height - 24,
    radius: 12
  };

  const woolBallPos = {
    x: Math.round(bounds.width * 0.42),
    y: Math.round(bounds.height * 0.62),
    vx: 0,
    vy: 0,
    active: true
  };

  const props = {
    mouseHole: holePos,
    burrow: holePos, // Alias for backward compatibility
    woolBall: woolBallPos,
    yarnBall: woolBallPos, // Alias for backward compatibility
    fish: {
      x: 42,
      y: bounds.height - 26,
      consumed: false,
      bones: false
    },
    cheese: {
      x: Math.round(bounds.width * 0.72),
      y: Math.round(bounds.height * 0.52),
      collected: false
    },
    rug: {
      x: Math.round(bounds.width * 0.2),
      y: Math.round(bounds.height * 0.28),
      w: 86,
      h: 48
    },
    foodBowl: {
      x: 24,
      y: bounds.height - 24
    }
  };

  const cat = initCat(progressionState.cat, bounds, rng);
  const mouse = initMouse(progressionState.mouse, bounds, props);

  return {
    tick: 0,
    bounds,
    props,
    cat,
    mouse,
    events: []
  };
}

/**
 * Advances the world state forward by exactly one discrete simulation tick.
 *
 * @param {object} worldState - Current world state.
 * @param {import("../utils/random.js").createRng} rng
 * @returns {object} Next world state.
 */
export function stepWorld(worldState, rng) {
  const { bounds, props } = worldState;

  // 1. Advance individual entity physics and FSMs
  const nextCat = updateCat(worldState.cat, worldState.mouse, props, bounds, rng);
  const nextMouse = updateMouse(worldState.mouse, worldState.cat, props, bounds, rng);

  // 2. Resolve mutual interactions & collisions
  const interaction = resolveInteractions(nextCat, nextMouse, props, bounds, rng);

  const events = [...worldState.events];
  if (interaction.event) {
    events.push({
      tick: worldState.tick,
      type: interaction.event
    });
  }

  return {
    tick: worldState.tick + 1,
    bounds,
    props: interaction.props,
    cat: interaction.cat,
    mouse: interaction.mouse,
    events
  };
}

/**
 * Runs the discrete 2D spatial simulation across N ticks.
 *
 * @param {object} progressionState - State from evaluateProgression.
 * @param {object} [simConfig] - Configuration overrides (totalTicks, width, height).
 * @returns {Readonly<{
 *   totalTicks: number,
 *   bounds: { width: number, height: number },
 *   worldSeed: number,
 *   frames: Array<{
 *     tick: number,
 *     cat: { x: number, y: number, action: string, facing: string, stage: string, scale: number, variant: string },
 *     mouse: { x: number, y: number, action: string, facing: string, tier: string, visible: boolean, unlocked: boolean },
 *     props: object
 *   }>,
 *   events: Array<{ tick: number, type: string }>
 * }>}
 */
export function simulateWorld(progressionState, simConfig = {}) {
  if (!progressionState) {
    throw new Error("Cannot run simulation: ProgressionState is missing.");
  }

  const seed = progressionState.worldSeed || 1;
  const rng = createRng(seed);

  const totalTicks = simConfig.totalTicks || 60;
  let currentState = createWorld(progressionState, simConfig, rng);

  const frames = [];

  for (let tick = 0; tick < totalTicks; tick++) {
    // Record current scene graph frame state
    frames.push({
      tick,
      cat: {
        x: currentState.cat.x,
        y: currentState.cat.y,
        action: currentState.cat.action,
        facing: currentState.cat.facing,
        stage: currentState.cat.stage,
        scale: currentState.cat.scale,
        variant: currentState.cat.variant
      },
      mouse: {
        x: currentState.mouse.x,
        y: currentState.mouse.y,
        action: currentState.mouse.action,
        facing: currentState.mouse.facing,
        tier: currentState.mouse.tier,
        visible: currentState.mouse.visible,
        unlocked: currentState.mouse.unlocked
      },
      props: JSON.parse(JSON.stringify(currentState.props))
    });

    // Step physics & behavior forward
    currentState = stepWorld(currentState, rng);
  }

  return Object.freeze({
    totalTicks,
    bounds: currentState.bounds,
    worldSeed: seed,
    frames,
    events: currentState.events
  });
}
