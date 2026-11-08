/**
 * @file Evolution Progression Engine.
 * Evaluates five-stage Pokémon evolution states, stage progress, mastery tiers, and evolution history.
 */

import { EVOLUTION_TIERS } from "../pokemon/definitions.js";
import { clamp, calculateProgressiveColoring } from "./coloring.js";

/**
 * Evaluates the full evolution state for a given lifetime contributions count.
 *
 * @param {number} lifetimeContributions
 * @returns {{
 *   lifetimeContributions: number,
 *   currentForm: typeof EVOLUTION_TIERS[0],
 *   stageIndex: number,
 *   stageStart: number,
 *   stageEnd: number,
 *   stageContributions: number,
 *   requiredContributions: number,
 *   stageProgress: number,
 *   colouringProgress: number,
 *   isMastery: boolean,
 *   masteryLevel: number,
 *   evolutionHistory: Array<{
 *     id: string,
 *     name: string,
 *     dex: string,
 *     completedAtContributions: number
 *   }>,
 *   coloringState: ReturnType<typeof calculateProgressiveColoring>
 * }}
 */
export function evaluateEvolution(lifetimeContributions = 0, options = {}) {
  const safeContributions = Math.max(0, Number(lifetimeContributions) || 0);

  let currentTier = EVOLUTION_TIERS[0];
  let isMastery = false;
  let masteryLevel = 0;

  if (safeContributions < 200) {
    currentTier = EVOLUTION_TIERS[0]; // Charmander (0–199)
  } else if (safeContributions < 500) {
    currentTier = EVOLUTION_TIERS[1]; // Charmeleon (200–499)
  } else if (safeContributions < 1000) {
    currentTier = EVOLUTION_TIERS[2]; // Charizard (500–999)
  } else if (safeContributions < 1500) {
    currentTier = EVOLUTION_TIERS[3]; // Mega Charizard Y (1000–1499)
  } else {
    currentTier = EVOLUTION_TIERS[4]; // Mega Charizard X (1500+)
    isMastery = true;
    masteryLevel = Math.floor((safeContributions - 1500) / 500) + 1;
  }

  // Calculate stage progress
  let stageStart = currentTier.stageStart;
  let stageEnd = currentTier.stageEnd;

  if (isMastery) {
    stageStart = 1500 + (masteryLevel - 1) * 500;
    stageEnd = stageStart + 500;
  }

  const stageContributions = safeContributions - stageStart;
  const requiredContributions = stageEnd - stageStart;
  const stageProgress = clamp(stageContributions / requiredContributions, 0, 1);

  // Compute mathematical progressive coloring for current form
  const coloringState = calculateProgressiveColoring(currentTier, stageProgress, options);

  // Build completed evolution history
  const evolutionHistory = [];
  for (let i = 0; i < currentTier.stageIndex; i++) {
    const pastForm = EVOLUTION_TIERS[i];
    evolutionHistory.push({
      id: pastForm.id,
      name: pastForm.name,
      dex: pastForm.dex,
      completedAtContributions: pastForm.stageEnd
    });
  }

  return {
    lifetimeContributions: safeContributions,
    currentForm: currentTier,
    stageIndex: currentTier.stageIndex,
    stageStart,
    stageEnd,
    stageContributions: Math.min(requiredContributions, Math.max(0, stageContributions)),
    requiredContributions,
    stageProgress: Number(stageProgress.toFixed(4)),
    colouringProgress: coloringState.overallPercentage,
    isMastery,
    masteryLevel,
    evolutionHistory,
    coloringState
  };
}
