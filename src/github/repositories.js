/**
 * @file GitHub repository language statistics collector using GraphQL.
 * Aggregates byte distributions across owned repositories in a single API query.
 */

const LANGUAGES_QUERY = `
  query($username: String!) {
    user(login: $username) {
      repositories(first: 30, ownerAffiliations: OWNER, orderBy: { field: UPDATED_AT, direction: DESC }, isFork: false) {
        nodes {
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetches and aggregates language usage statistics for a user.
 *
 * @param {import("octokit").Octokit} octokit
 * @param {string} username
 * @returns {Promise<Array<{ name: string, bytes: number, color?: string }>>}
 */
export async function fetchLanguageStats(octokit, username) {
  try {
    const data = await octokit.graphql(LANGUAGES_QUERY, { username });
    const repos = data?.user?.repositories?.nodes || [];

    const languageMap = new Map();

    for (const repo of repos) {
      for (const edge of repo.languages?.edges || []) {
        const name = edge.node?.name;
        const bytes = edge.size || 0;
        const color = edge.node?.color || undefined;

        if (!name) continue;

        if (languageMap.has(name)) {
          const entry = languageMap.get(name);
          entry.bytes += bytes;
          if (!entry.color && color) entry.color = color;
        } else {
          languageMap.set(name, { name, bytes, color });
        }
      }
    }

    return Array.from(languageMap.values()).sort((a, b) => b.bytes - a.bytes);
  } catch (err) {
    // If language query fails (e.g. scope restrictions), return empty array gracefully
    console.warn(`Warning: Could not fetch repository languages for "${username}": ${err.message}`);
    return [];
  }
}
