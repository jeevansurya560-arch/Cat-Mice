/**
 * @file Seed calculation module.
 * Derives a deterministic 32-bit seed from user identity and temporal cadence.
 */

import { hash32 } from "../utils/hash.js";

/**
 * Calculates a deterministic seed for an ecosystem generation.
 *
 * @param {object} params
 * @param {string} params.userId - GitHub user ID or login.
 * @param {string} [params.timestamp] - Snapshot ISO timestamp.
 * @param {number} [params.customSeed] - Explicit seed override.
 * @returns {number} 32-bit unsigned seed integer.
 */
export function deriveSeed({ userId, timestamp, customSeed }) {
  if (typeof customSeed === "number" && !Number.isNaN(customSeed)) {
    return customSeed >>> 0;
  }

  // Derive weekly epoch identifier from timestamp to allow subtle weekly variation
  const date = timestamp ? new Date(timestamp) : new Date();
  const year = date.getUTCFullYear();
  const dayOfYear = Math.floor((date - new Date(Date.UTC(year, 0, 0))) / 86400000);
  const weekNumber = Math.ceil((dayOfYear + 1) / 7);

  const seedPayload = `${userId}:${year}-W${weekNumber}`;
  return hash32(seedPayload);
}
