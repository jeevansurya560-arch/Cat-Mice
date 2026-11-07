/**
 * @file Consistency calculus module.
 * Evaluates developer cadence, commit regularity, and streak health.
 */

/**
 * Calculates a normalized consistency score from 0.0 (erratic/inactive) to 1.0 (highly consistent).
 *
 * @param {Array<{ date: string, contributionCount: number }>} sortedCalendarDays
 * @param {{ currentStreak: number, longestStreak: number }} streakData
 * @param {{ activeDays: number, totalDays: number }} activityData
 * @returns {number} Normalized consistency index (0.0 to 1.0).
 */
export function calculateConsistency(sortedCalendarDays = [], streakData, activityData) {
  const totalDays = activityData.totalDays || sortedCalendarDays.length;
  const activeDays = activityData.activeDays || 0;

  if (totalDays === 0 || activeDays === 0) {
    return 0.0;
  }

  // 1. Cadence Component (active days coverage: 70%+ active ratio yields 1.0)
  const activeRatio = activeDays / totalDays;
  const cadenceScore = Math.min(1.0, activeRatio * 1.4);

  // 2. Streak Stability Component
  const targetStreak = Math.min(14, Math.max(3, Math.round(totalDays * 0.4)));
  const streakScore = Math.min(1.0, (streakData.longestStreak || 0) / targetStreak);

  // 3. Regularity / Gap Dispersion Component
  let maxGap = 0;
  let currentGap = 0;

  for (const day of sortedCalendarDays) {
    if (day.contributionCount === 0) {
      currentGap++;
      if (currentGap > maxGap) {
        maxGap = currentGap;
      }
    } else {
      currentGap = 0;
    }
  }
  // Check trailing gap at end of calendar
  if (currentGap > maxGap) {
    maxGap = currentGap;
  }

  const gapRatio = totalDays > 0 ? maxGap / totalDays : 0;
  const regularityScore = Math.max(0.0, 1.0 - gapRatio * 1.5);

  // Weighted composite score: 45% cadence, 35% streak, 20% regularity
  const composite = cadenceScore * 0.45 + streakScore * 0.35 + regularityScore * 0.2;
  const clamped = Math.max(0.0, Math.min(1.0, composite));

  return Number(clamped.toFixed(3));
}
