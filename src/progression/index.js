/**
 * @file Progression Engine Orchestrator.
 * Transforms an AnalyticsMetricsDTO into a ProgressionStateDTO.
 */

import { calculateGrowth } from "./growth.js";
import { determineCatState } from "./cat.js";
import { determineMouseState } from "./mouse.js";
import { detectMilestones } from "./milestones.js";
import { DEFAULT_THEME_PALETTE } from "../core/constants.js";
import { config } from "../core/config.js";

/**
 * Evaluates full ecosystem progression state from analytics metrics and deterministic seed.
 *
 * @param {import("../analytics/index.js").computeAnalytics} analytics
 * @param {number} seed - Deterministic PRNG seed.
 * @param {object} [progressionConfig=config.progression]
 * @returns {Readonly<{
 *   cat: ReturnType<typeof determineCatState>,
 *   mouse: ReturnType<typeof determineMouseState>,
 *   growth: ReturnType<typeof calculateGrowth>,
 *   milestones: ReturnType<typeof detectMilestones>,
 *   worldSeed: number,
 *   theme: typeof DEFAULT_THEME_PALETTE,
 *   evaluatedAt: string
 * }>}
 */
export function evaluateProgression(analytics, seed, progressionConfig = config.progression) {
  if (!analytics) {
    throw new Error("Cannot evaluate progression: Analytics metrics are missing.");
  }

  const safeSeed = seed >>> 0 || 1;
  const growth = calculateGrowth(
    analytics.totalContributions,
    progressionConfig.maxCatContributions
  );

  const cat = determineCatState(growth, safeSeed);
  const mouse = determineMouseState(
    growth,
    analytics.consistencyScore,
    progressionConfig,
    safeSeed
  );
  const milestones = detectMilestones(analytics);

  const primaryAccent =
    analytics.languages?.primaryAccentColor || DEFAULT_THEME_PALETTE.primaryAccent;
  const secondaryAccent =
    analytics.languages?.secondaryLanguage?.color || DEFAULT_THEME_PALETTE.secondaryAccent;

  const theme = Object.freeze({
    ...DEFAULT_THEME_PALETTE,
    primaryAccent,
    secondaryAccent
  });

  return Object.freeze({
    cat,
    mouse,
    growth,
    milestones,
    worldSeed: safeSeed,
    theme,
    evaluatedAt: new Date().toISOString()
  });
}
