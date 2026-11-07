/**
 * @file Streak calculation module.
 * Analyzes consecutive active contribution runs and weekend activity.
 */

/**
 * Computes calendar day difference between two YYYY-MM-DD date strings.
 *
 * @param {string} dateStrA
 * @param {string} dateStrB
 * @returns {number} Days difference (B - A).
 */
function getDayDifference(dateStrA, dateStrB) {
  const msA = Date.parse(dateStrA + "T00:00:00Z");
  const msB = Date.parse(dateStrB + "T00:00:00Z");
  return Math.round((msB - msA) / 86400000);
}

/**
 * Calculates current streak, longest streak, and weekend activity.
 *
 * @param {Array<{ date: string, contributionCount: number }>} sortedCalendarDays
 * @returns {{
 *   currentStreak: number,
 *   longestStreak: number,
 *   weekendActiveDays: number
 * }}
 */
export function calculateStreaks(sortedCalendarDays = []) {
  if (!sortedCalendarDays || sortedCalendarDays.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      weekendActiveDays: 0
    };
  }

  let longestStreak = 0;
  let runningStreak = 0;
  let previousActiveDate = null;
  let weekendActiveDays = 0;

  for (let i = 0; i < sortedCalendarDays.length; i++) {
    const day = sortedCalendarDays[i];
    const count = day.contributionCount || 0;

    // Check weekend active days
    if (count > 0) {
      const dayOfWeek = new Date(day.date + "T00:00:00Z").getUTCDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendActiveDays++;
      }

      if (previousActiveDate === null) {
        runningStreak = 1;
      } else {
        const diff = getDayDifference(previousActiveDate, day.date);
        if (diff === 1) {
          runningStreak++;
        } else {
          runningStreak = 1;
        }
      }

      previousActiveDate = day.date;
      if (runningStreak > longestStreak) {
        longestStreak = runningStreak;
      }
    }
  }

  // Calculate current streak backwards from latest day
  let currentStreak = 0;
  let lastIndex = sortedCalendarDays.length - 1;

  // Allow a grace period of 1 day if the latest day has 0 commits (e.g. day just started)
  if (lastIndex >= 0 && sortedCalendarDays[lastIndex].contributionCount === 0) {
    lastIndex--;
  }

  let expectedDate = null;
  for (let i = lastIndex; i >= 0; i--) {
    const day = sortedCalendarDays[i];
    if (day.contributionCount > 0) {
      if (expectedDate === null) {
        currentStreak = 1;
        expectedDate = day.date;
      } else {
        const diff = getDayDifference(day.date, expectedDate);
        if (diff === 1) {
          currentStreak++;
          expectedDate = day.date;
        } else {
          break;
        }
      }
    } else {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak,
    weekendActiveDays
  };
}
