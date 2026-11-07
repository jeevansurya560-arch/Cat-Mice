/**
 * @file Octokit client factory and GitHub authentication boundary.
 * Isolated module handling GitHub REST and GraphQL connections.
 */

import { Octokit } from "octokit";

/**
 * Creates an authenticated Octokit client instance.
 *
 * @param {string} [token] - GitHub Personal Access Token or GITHUB_TOKEN.
 * @returns {Octokit}
 */
export function createGitHubClient(token = process.env.GITHUB_TOKEN) {
  return new Octokit({
    auth: token || undefined,
    userAgent: "cat-mice/0.1.0"
  });
}
