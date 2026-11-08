/**
 * @file Cat progression and maturation state module.
 * Evaluates developmental stage, scale, and cosmetic traits.
 */

import { CAT_STAGES } from "../core/constants.js";
import { createRng } from "../utils/random.js";

const CAT_VARIANTS = ["tabby", "calico", "tuxedo", "ginger", "midnight"];

/**
 * Resolves a language or theme string into a supported cat visual variant.
 *
 * @param {string} [themeOrLanguage]
 * @returns {string | null}
 */
export function resolveCatVariant(themeOrLanguage) {
  if (!themeOrLanguage) return null;
  const normalized = String(themeOrLanguage).toLowerCase().trim();
  if (normalized === "javascript" || normalized === "js") return "javascript";
  if (normalized === "python" || normalized === "py") return "python";
  if (normalized === "rust" || normalized === "rs") return "rust";
  if (normalized === "cpp" || normalized === "c++" || normalized === "c") return "cpp";
  if (normalized === "java") return "java";
  if (normalized === "midnight") return "midnight";
  if (normalized === "ginger") return "ginger";
  if (normalized === "tuxedo") return "tuxedo";
  if (normalized === "calico") return "calico";
  if (normalized === "tabby") return "tabby";
  return null;
}

/**
 * Determines cat developmental stage and deterministic visual traits.
 *
 * @param {{ growthRatio: number, level: number }} growthData
 * @param {number} seed - Deterministic PRNG seed.
 * @param {string | null} [variantOverride=null] - Optional variant or theme override.
 * @returns {{
 *   stage: keyof typeof CAT_STAGES,
 *   scale: number,
 *   variant: string,
 *   demeanor: "playful" | "alert" | "zen",
 *   level: number
 * }}
 */
export function determineCatState(growthData, seed, variantOverride = null) {
  const rng = createRng(seed);
  const resolved = variantOverride ? resolveCatVariant(variantOverride) : null;
  const variant = resolved || rng.pick(CAT_VARIANTS) || "tabby";
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
