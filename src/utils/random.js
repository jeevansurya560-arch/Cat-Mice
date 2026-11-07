/**
 * @file Mulberry32 Seeded Pseudo-Random Number Generator (PRNG).
 * Provides deterministic random values for reproducible procedural generation.
 */

/**
 * Creates a deterministic Mulberry32 PRNG instance.
 *
 * @param {number} seed - Unsigned 32-bit integer seed.
 * @returns {{
 *   next: () => number,
 *   nextInt: (min: number, max: number) => number,
 *   pick: <T>(items: T[]) => T,
 *   shuffle: <T>(items: T[]) => T[]
 * }}
 */
export function createRng(seed) {
  let state = seed >>> 0;

  function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let z = state;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  }

  function nextInt(min, max) {
    const lo = Math.ceil(min);
    const hi = Math.floor(max);
    return Math.floor(next() * (hi - lo + 1)) + lo;
  }

  function pick(items) {
    if (!items || items.length === 0) return undefined;
    const index = nextInt(0, items.length - 1);
    return items[index];
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = nextInt(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  return {
    next,
    nextInt,
    pick,
    shuffle
  };
}
