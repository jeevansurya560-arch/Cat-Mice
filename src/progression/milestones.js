/**
 * @file Milestone detection module.
 * Identifies notable developer achievements from analytics metrics.
 */

import { MILESTONE_IDS } from "../core/constants.js";

/**
 * Evaluates unlocked milestones based on analytics metrics.
 *
 * @param {import("../analytics/index.js").computeAnalytics} analytics
 * @returns {Array<{ id: string, name: string, description: string }>}
 */
export function detectMilestones(analytics) {
  if (!analytics) return [];

  const milestones = [];
  const contributions = analytics.totalContributions || 0;
  const longestStreak = analytics.streaks?.longestStreak || 0;
  const languageCount = analytics.languages?.languageCount || 0;

  if (contributions >= 1) {
    milestones.push({
      id: MILESTONE_IDS.FIRST_COMMIT,
      name: "First Paws",
      description: "Made the very first contribution to the ecosystem."
    });
  }

  if (contributions >= 100) {
    milestones.push({
      id: MILESTONE_IDS.CENTURY_CLUB,
      name: "Century Club",
      description: "Reached 100 lifetime contributions."
    });
  }

  if (contributions >= 1000) {
    milestones.push({
      id: MILESTONE_IDS.KILO_CODER,
      name: "Kilo Coder",
      description: "Reached 1,000 lifetime contributions."
    });
  }

  if (contributions >= 5000) {
    milestones.push({
      id: MILESTONE_IDS.LEGENDARY_DEV,
      name: "Legendary Developer",
      description: "Reached 5,000 lifetime contributions."
    });
  }

  if (longestStreak >= 7) {
    milestones.push({
      id: MILESTONE_IDS.STREAK_BRONZE,
      name: "Weekly Prowler",
      description: "Maintained a 7-day contribution streak."
    });
  }

  if (longestStreak >= 30) {
    milestones.push({
      id: MILESTONE_IDS.STREAK_SILVER,
      name: "Moon Cycle",
      description: "Maintained a 30-day contribution streak."
    });
  }

  if (longestStreak >= 100) {
    milestones.push({
      id: MILESTONE_IDS.STREAK_GOLD,
      name: "Unstoppable",
      description: "Maintained a 100-day contribution streak."
    });
  }

  if (languageCount >= 3) {
    milestones.push({
      id: MILESTONE_IDS.POLYGLOT,
      name: "Polyglot",
      description: "Contributed across 3 or more programming languages."
    });
  }

  if (languageCount >= 5) {
    milestones.push({
      id: MILESTONE_IDS.MASTER_POLYGLOT,
      name: "Master Polyglot",
      description: "Contributed across 5 or more programming languages."
    });
  }

  return milestones;
}
