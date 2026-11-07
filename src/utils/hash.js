/**
 * @file Deterministic 32-bit FNV-1a hashing utility.
 * Used for seeding PRNG from user identity and temporal epochs.
 */

/**
 * Hashes a string into a non-negative 32-bit integer using FNV-1a.
 *
 * @param {string} str - The input string to hash.
 * @returns {number} An unsigned 32-bit integer.
 */
export function hash32(str) {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    // 32-bit FNV prime multiplication: hash * 0x01000193
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0; // Convert to unsigned 32-bit integer
}
