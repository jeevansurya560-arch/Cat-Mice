/**
 * @file Cat progression and maturation state module.
 * Evaluates developmental stage, scale, and cosmetic traits.
 */

import { CAT_STAGES } from "../core/constants.js";
import { createRng } from "../utils/random.js";

const CAT_VARIANTS = ["tabby", "calico", "tuxedo", "ginger", "midnight"];

/**
 * Determines cat developmental stage and deterministic visual traits.
 *
 * @param {{ growthRatio: number, level: number }} growthData
 * @param {number} seed - Deterministic PRNG seed.
 * @returns {{
 *   stage: keyof typeof CAT_STAGES,
 *   scale: number,
 *   variant: string,
 *   demeanor: "playful" | "alert" | "zen",
 *   level: number
 * }}
 */
export function determineCatState(growthData, seed) {
  const rng = createRng(seed);
  const variant = rng.pick(CAT_VARIANTS) || "tabby";
  const ratio = growthData.growthRatio;

  let stage = CAT_STAGES.KITTEN;
  let scale = 1;
  let demeanor = "playful";

  if (ratio >= 0.8) {
    stage = CAT_STAGES.ELDER;
    scale = 2;
    demeanor = "zen";
  } else if (ratio >= 0.35) {
    stage = CAT_STAGES.ADULT;
    scale = 2;
    demeanor = "alert";
  }

  return {
    stage,
    scale,
    variant,
    demeanor,
    level: growthData.level
  };
}
