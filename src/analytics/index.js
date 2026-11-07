/**
 * @file Analytics Engine Orchestrator.
 * Transforms a NormalizedSnapshotDTO into an AnalyticsMetricsDTO.
 */

import { calculateActivity } from "./activity.js";
import { calculateStreaks } from "./streaks.js";
import { calculateLanguages } from "./languages.js";
import { calculateConsistency } from "./consistency.js";

/**
 * Computes complete developer analytics from a validated, normalized snapshot.
 *
 * @param {import("../snapshot/schema.js").SnapshotSchema} snapshot
 * @returns {Readonly<{
 *   totalContributions: number,
 *   activity: ReturnType<typeof calculateActivity>,
 *   streaks: ReturnType<typeof calculateStreaks>,
 *   languages: ReturnType<typeof calculateLanguages>,
 *   consistencyScore: number,
 *   calculatedAt: string
 * }>}
 */
export function computeAnalytics(snapshot) {
  if (!snapshot || !snapshot.metrics) {
    throw new Error("Cannot compute analytics: Missing or invalid snapshot metrics.");
  }

  const calendarDays = snapshot.metrics.calendarDays || [];
  const rawLanguages = snapshot.metrics.languages || [];

  const activity = calculateActivity(calendarDays);
  const streaks = calculateStreaks(calendarDays);
  const languages = calculateLanguages(rawLanguages);
  const consistencyScore = calculateConsistency(calendarDays, streaks, activity);

  // Total contributions preference: verified calendar sum or snapshot reported total
  const totalContributions = Math.max(
    snapshot.metrics.totalContributions || 0,
    activity.totalContributions
  );

  return Object.freeze({
    totalContributions,
    activity,
    streaks,
    languages,
    consistencyScore,
    calculatedAt: new Date().toISOString()
  });
}
