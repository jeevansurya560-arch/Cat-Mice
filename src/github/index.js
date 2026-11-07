/**
 * @file GitHub Ingestion Subsystem Orchestrator.
 * Isolated boundary communicating with GitHub API and producing raw snapshot payloads.
 */

import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createGitHubClient } from "./client.js";
import { fetchUserProfile } from "./account.js";
import { fetchContributions } from "./contributions.js";
import { fetchLanguageStats } from "./repositories.js";

/**
 * Fetches user activity from GitHub API and formats a SnapshotDTO-compatible payload.
 *
 * @param {object} params
 * @param {string} params.username - Target GitHub login.
 * @param {string} [params.token] - GitHub auth token.
 * @param {string} [params.savePath] - Optional path to write snapshot JSON.
 * @returns {Promise<object>} Raw snapshot object satisfying SnapshotSchema.
 */
export async function fetchGitHubSnapshot({ username, token, savePath }) {
  if (!username) {
    throw new Error("Cannot fetch GitHub snapshot: Username is required.");
  }

  const octokit = createGitHubClient(token);

  // Parallel data collection
  const [userProfile, contributionsData, languages] = await Promise.all([
    fetchUserProfile(octokit, username),
    fetchContributions(octokit, username),
    fetchLanguageStats(octokit, username)
  ]);

  const rawSnapshot = {
    version: 1,
    timestamp: new Date().toISOString(),
    user: {
      id: userProfile.id,
      login: userProfile.login,
      createdAt: userProfile.createdAt
    },
    metrics: {
      totalContributions: contributionsData.totalContributions,
      calendarDays: contributionsData.calendarDays,
      languages
    }
  };

  if (savePath) {
    const fullPath = resolve(process.cwd(), savePath);
    await writeFile(fullPath, JSON.stringify(rawSnapshot, null, 2), "utf-8");
  }

  return rawSnapshot;
}
