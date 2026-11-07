/**
 * @file Mouse unlocking and independent progression module.
 * Mouse unlocks after a cat threshold and evolves based on developer consistency.
 */

import { MOUSE_TIERS } from "../core/constants.js";
import { config } from "../core/config.js";
import { createRng } from "../utils/random.js";

const MOUSE_VARIANTS = ["field_mouse", "dormouse", "white_mouse"];

/**
 * Evaluates mouse unlock state, agility tier, and traits.
 *
 * @param {{ growthRatio: number }} growthData
 * @param {number} consistencyScore - Developer consistency index (0.0 to 1.0).
 * @param {object} [progressionConfig=config.progression]
 * @param {number} [seed=1] - Deterministic PRNG seed.
 * @returns {{
 *   unlocked: boolean,
 *   tier: keyof typeof MOUSE_TIERS,
 *   speedModifier: number,
 *   evasionChance: number,
 *   variant: string | null,
 *   unlockThreshold: number,
 *   currentProgress: number
 * }}
 */
export function determineMouseState(
  growthData,
  consistencyScore,
  progressionConfig = config.progression,
  seed = 1
) {
  const unlockThreshold = progressionConfig.mouseUnlockThreshold ?? 0.65;
  const isUnlocked = growthData.growthRatio >= unlockThreshold;

  if (!isUnlocked) {
    return {
      unlocked: false,
      tier: MOUSE_TIERS.LOCKED,
      speedModifier: 0,
      evasionChance: 0,
      variant: null,
      unlockThreshold,
      currentProgress: Number(growthData.growthRatio.toFixed(3))
    };
  }

  const rng = createRng(seed ^ 0x9e3779b9);
  const variant = rng.pick(MOUSE_VARIANTS) || "field_mouse";

  let tier = MOUSE_TIERS.SCOUT;
  let speedModifier = 1.0;
  let evasionChance = 0.3;

  if (consistencyScore >= 0.75) {
    tier = MOUSE_TIERS.NINJA;
    speedModifier = 1.5;
    evasionChance = 0.85;
  } else if (consistencyScore >= 0.4) {
    tier = MOUSE_TIERS.RUNNER;
    speedModifier = 1.25;
    evasionChance = 0.6;
  }

  return {
    unlocked: true,
    tier,
    speedModifier,
    evasionChance,
    variant,
    unlockThreshold,
    currentProgress: Number(growthData.growthRatio.toFixed(3))
  };
}
