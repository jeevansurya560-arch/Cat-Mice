/**
 * @file GitHub account metadata collector.
 * Retrieves authenticated or public user account details.
 */

/**
 * Fetches user profile account metadata.
 *
 * @param {import("octokit").Octokit} octokit
 * @param {string} [username] - Target user login. If omitted, gets authenticated user.
 * @returns {Promise<{ id: string, login: string, createdAt: string }>}
 */
export async function fetchUserProfile(octokit, username) {
  try {
    const response = username
      ? await octokit.rest.users.getByUsername({ username })
      : await octokit.rest.users.getAuthenticated();

    const data = response.data;
    return {
      id: String(data.node_id || data.id),
      login: data.login,
      createdAt: data.created_at || new Date().toISOString()
    };
  } catch (err) {
    throw new Error(
      `Failed to fetch GitHub user profile for "${username || "self"}": ${err.message}`
    );
  }
}
