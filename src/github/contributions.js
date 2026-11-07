/**
 * @file GitHub contribution calendar collector using GraphQL.
 * Extracts lifetime totals and daily calendar counts with minimal quota consumption.
 */

const CONTRIBUTIONS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetches contribution calendar data for a user via GitHub GraphQL API.
 *
 * @param {import("octokit").Octokit} octokit
 * @param {string} username
 * @returns {Promise<{
 *   totalContributions: number,
 *   calendarDays: Array<{ date: string, contributionCount: number, color?: string }>
 * }>}
 */
export async function fetchContributions(octokit, username) {
  try {
    const data = await octokit.graphql(CONTRIBUTIONS_QUERY, { username });
    const calendar = data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      return { totalContributions: 0, calendarDays: [] };
    }

    const calendarDays = [];
    for (const week of calendar.weeks || []) {
      for (const day of week.contributionDays || []) {
        calendarDays.push({
          date: day.date,
          contributionCount: day.contributionCount || 0,
          color: day.color || undefined
        });
      }
    }

    return {
      totalContributions: calendar.totalContributions || 0,
      calendarDays
    };
  } catch (err) {
    throw new Error(`Failed to fetch contribution calendar for "${username}": ${err.message}`);
  }
}
