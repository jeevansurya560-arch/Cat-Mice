/**
 * @file Cat growth calculus module.
 * Maps developer contributions to a non-linear, diminishing-returns growth curve.
 */

import { config } from "../core/config.js";

/**
 * Calculates cat growth points and level from total contributions.
 *
 * @param {number} totalContributions
 * @param {number} [maxContributions=config.progression.maxCatContributions]
 * @returns {{
 *   growthRatio: number,
 *   level: number,
 *   contributions: number,
 *   maxContributions: number,
 *   nextLevelContributions: number
 * }}
 */
export function calculateGrowth(
  totalContributions = 0,
  maxContributions = config.progression.maxCatContributions
) {
  const safeContributions = Math.max(0, totalContributions);
  const safeMax = Math.max(100, maxContributions);

  // Logarithmic growth curve: log2(1 + count) / log2(1 + max)
  const logCurrent = Math.log2(1 + safeContributions);
  const logMax = Math.log2(1 + safeMax);
  const rawRatio = logCurrent / logMax;
  const growthRatio = Number(Math.max(0.0, Math.min(1.0, rawRatio)).toFixed(4));

  // 50 discrete progression levels
  const level = Math.max(1, Math.min(50, Math.floor(growthRatio * 50) + 1));

  // Contributions needed for next level
  const nextLevelRatio = Math.min(1.0, level / 50);
  const nextLevelContributions = Math.round(Math.pow(2, nextLevelRatio * logMax) - 1);

  return {
    growthRatio,
    level,
    contributions: safeContributions,
    maxContributions: safeMax,
    nextLevelContributions
  };
}
