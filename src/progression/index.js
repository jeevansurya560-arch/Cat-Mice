/**
 * @file Progression Engine Orchestrator.
 * Transforms an AnalyticsMetricsDTO into a ProgressionStateDTO.
 */

import { calculateGrowth } from "./growth.js";
import { determineCatState } from "./cat.js";
import { determineMouseState } from "./mouse.js";
import { detectMilestones } from "./milestones.js";
import { DEFAULT_THEME_PALETTE } from "../core/constants.js";
import { KNOWN_LANGUAGE_COLORS } from "../analytics/languages.js";
import { config } from "../core/config.js";

/**
 * Evaluates full ecosystem progression state from analytics metrics and deterministic seed.
 *
 * @param {import("../analytics/index.js").computeAnalytics} analytics
 * @param {number | { identitySeed?: number, simulationSeed?: number }} seedInput - Deterministic PRNG seed(s).
 * @param {object} [progressionConfig=config.progression]
 * @param {object} [options={}] - Optional theme or variant overrides.
 * @returns {Readonly<{
 *   cat: ReturnType<typeof determineCatState>,
 *   mouse: ReturnType<typeof determineMouseState>,
 *   growth: ReturnType<typeof calculateGrowth>,
 *   milestones: ReturnType<typeof detectMilestones>,
 *   worldSeed: number,
 *   identitySeed: number,
 *   theme: typeof DEFAULT_THEME_PALETTE,
 *   evaluatedAt: string
 * }>}
 */
export function evaluateProgression(
  analytics,
  seedInput,
  progressionConfig = config.progression,
  options = {}
) {
  if (!analytics) {
    throw new Error("Cannot evaluate progression: Analytics metrics are missing.");
  }

  let identitySeed;
  let worldSeed;

  if (typeof seedInput === "object" && seedInput !== null) {
    identitySeed = seedInput.identitySeed >>> 0 || seedInput.simulationSeed >>> 0 || 1;
    worldSeed = seedInput.simulationSeed >>> 0 || seedInput.identitySeed >>> 0 || 1;
  } else {
    const safeSeed = seedInput >>> 0 || 1;
    identitySeed = safeSeed;
    worldSeed = safeSeed;
  }

  const growth = calculateGrowth(
    analytics.totalContributions,
    progressionConfig.maxCatContributions
  );

  const themeParam = options.theme && options.theme !== "auto" ? options.theme : null;
  const primaryLang = analytics.languages?.primaryLanguage?.name;
  const targetTheme = themeParam || primaryLang || null;

  // Permanent character identity derived from identitySeed and programming language
  const cat = determineCatState(growth, identitySeed, targetTheme);

  // Mouse threshold: active companion for active developers (ratio >= 0.35)
  const mouseThreshold =
    analytics.totalContributions === 0
      ? 0.65
      : Math.min(progressionConfig.mouseUnlockThreshold ?? 0.35, 0.35);

  const mouse = determineMouseState(
    growth,
    analytics.consistencyScore,
    { ...progressionConfig, mouseUnlockThreshold: mouseThreshold },
    identitySeed
  );
  const milestones = detectMilestones(analytics);

  const primaryAccent =
    (themeParam && KNOWN_LANGUAGE_COLORS[themeParam.toLowerCase()]) ||
    analytics.languages?.primaryAccentColor ||
    DEFAULT_THEME_PALETTE.primaryAccent;
  const secondaryAccent =
    analytics.languages?.secondaryLanguage?.color || DEFAULT_THEME_PALETTE.secondaryAccent;

  const theme = Object.freeze({
    ...DEFAULT_THEME_PALETTE,
    primaryAccent,
    secondaryAccent
  });

  return Object.freeze({
    cat: Object.freeze(cat),
    mouse: Object.freeze(mouse),
    growth: Object.freeze(growth),
    milestones: Object.freeze(milestones),
    worldSeed,
    identitySeed,
    theme,
    evaluatedAt: new Date().toISOString()
  });
}
