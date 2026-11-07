/**
 * @file Activity calculus module.
 * Analyzes active contribution days, counts, and density.
 */

/**
 * Calculates activity metrics from chronologically sorted contribution calendar days.
 *
 * @param {Array<{ date: string, contributionCount: number }>} calendarDays
 * @returns {{
 *   totalDays: number,
 *   activeDays: number,
 *   activeRatio: number,
 *   totalContributions: number,
 *   averagePerActiveDay: number,
 *   maxInSingleDay: number
 * }}
 */
export function calculateActivity(calendarDays = []) {
  if (!calendarDays || calendarDays.length === 0) {
    return {
      totalDays: 0,
      activeDays: 0,
      activeRatio: 0,
      totalContributions: 0,
      averagePerActiveDay: 0,
      maxInSingleDay: 0
    };
  }

  let activeDays = 0;
  let totalContributions = 0;
  let maxInSingleDay = 0;

  for (const day of calendarDays) {
    const count = day.contributionCount || 0;
    totalContributions += count;
    if (count > 0) {
      activeDays++;
      if (count > maxInSingleDay) {
        maxInSingleDay = count;
      }
    }
  }

  const totalDays = calendarDays.length;
  const activeRatio = totalDays > 0 ? Number((activeDays / totalDays).toFixed(4)) : 0;
  const averagePerActiveDay =
    activeDays > 0 ? Number((totalContributions / activeDays).toFixed(2)) : 0;

  return {
    totalDays,
    activeDays,
    activeRatio,
    totalContributions,
    averagePerActiveDay,
    maxInSingleDay
  };
}
