/**
 * @file Seed calculation module.
 * Derives deterministic 32-bit seeds for permanent character identity and weekly simulation.
 */

import { hash32 } from "../utils/hash.js";

/**
 * Derives a permanent character identity seed from GitHub account ID
 * and normalized programming language distribution.
 *
 * This ensures the character's coat variant and visual identity remain
 * perfectly stable even when temporal weeks or activities advance.
 *
 * @param {object} params
 * @param {string} params.userId - GitHub account ID or user login.
 * @param {Array<{ name: string, bytes?: number, percentage?: number }>} [params.languages=[]]
 * @returns {number} 32-bit unsigned seed integer for character identity.
 */
export function deriveIdentitySeed({ userId, languages = [] }) {
  if (!userId) {
    throw new Error("Cannot derive identity seed: userId is required.");
  }

  // Normalize language distribution to ensure deterministic ordering
  const langEntries = (languages || [])
    .map((lang) => {
      const name = String(lang.name || "")
        .trim()
        .toLowerCase();
      const weight = Math.round((Number(lang.percentage) || 0) * 1000) || Number(lang.bytes) || 0;
      return `${name}:${weight}`;
    })
    .sort()
    .join(";");

  const identityPayload = `identity:${userId}:${langEntries}`;
  return hash32(identityPayload);
}

/**
 * Derives a simulation seed incorporating temporal weekly cadence.
 *
 * @param {object} params
 * @param {string} params.userId - GitHub user ID or login.
 * @param {string} [params.timestamp] - Snapshot ISO timestamp.
 * @param {number} [params.customSeed] - Explicit seed override.
 * @returns {number} 32-bit unsigned seed integer for world simulation.
 */
export function deriveSimulationSeed({ userId, timestamp, customSeed }) {
  if (typeof customSeed === "number" && !Number.isNaN(customSeed)) {
    return customSeed >>> 0;
  }

  const date = timestamp ? new Date(timestamp) : new Date();
  const year = date.getUTCFullYear();
  const dayOfYear = Math.floor((date - new Date(Date.UTC(year, 0, 0))) / 86400000);
  const weekNumber = Math.ceil((dayOfYear + 1) / 7);

  const seedPayload = `sim:${userId}:${year}-W${weekNumber}`;
  return hash32(seedPayload);
}

/**
 * Primary seed derivation helper (backwards-compatible with previous deriveSeed callers).
 *
 * @param {object} params
 * @param {string} params.userId - GitHub user ID or login.
 * @param {string} [params.timestamp] - Snapshot ISO timestamp.
 * @param {number} [params.customSeed] - Explicit seed override.
 * @returns {number} 32-bit unsigned seed integer.
 */
export function deriveSeed(params) {
  return deriveSimulationSeed(params);
}
