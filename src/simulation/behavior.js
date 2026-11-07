/**
 * @file Steering behaviors and 2D spatial math utilities.
 * Pure mathematical functions for entity movement, bounds clamping, and vector steering.
 */

/**
 * Calculates Euclidean distance between two 2D points.
 *
 * @param {{ x: number, y: number }} p1
 * @param {{ x: number, y: number }} p2
 * @returns {number}
 */
export function distance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.hypot(dx, dy);
}

/**
 * Computes normalized direction vector from point A to point B.
 *
 * @param {{ x: number, y: number }} from
 * @param {{ x: number, y: number }} to
 * @returns {{ dx: number, dy: number }}
 */
export function direction(from, to) {
  const dist = distance(from, to);
  if (dist === 0) {
    return { dx: 0, dy: 0 };
  }
  return {
    dx: (to.x - from.x) / dist,
    dy: (to.y - from.y) / dist
  };
}

/**
 * Clamps a position within bounding box margins.
 *
 * @param {{ x: number, y: number }} pos
 * @param {{ width: number, height: number }} bounds
 * @param {number} [margin=16]
 * @returns {{ x: number, y: number }}
 */
export function clampToBounds(pos, bounds, margin = 16) {
  return {
    x: Math.max(margin, Math.min(bounds.width - margin, pos.x)),
    y: Math.max(margin, Math.min(bounds.height - margin, pos.y))
  };
}

/**
 * Generates a wandering velocity vector based on current velocity and a small random delta.
 *
 * @param {{ vx: number, vy: number }} currentVel
 * @param {import("../utils/random.js").createRng} rng
 * @param {number} maxSpeed
 * @returns {{ vx: number, vy: number }}
 */
export function wander(currentVel, rng, maxSpeed = 1.5) {
  // Add small angular perturbation
  const angleDelta = (rng.next() - 0.5) * 0.8;
  const currentAngle = Math.atan2(currentVel.vy || 0.1, currentVel.vx || 0.1);
  const newAngle = currentAngle + angleDelta;

  const speed = Math.min(
    maxSpeed,
    Math.max(0.5, (currentVel.vx ** 2 + currentVel.vy ** 2) ** 0.5 + (rng.next() - 0.5) * 0.3)
  );

  return {
    vx: Number((Math.cos(newAngle) * speed).toFixed(2)),
    vy: Number((Math.sin(newAngle) * speed).toFixed(2))
  };
}

/**
 * Steers an entity toward a target point.
 *
 * @param {{ x: number, y: number }} from
 * @param {{ x: number, y: number }} target
 * @param {number} speed
 * @returns {{ vx: number, vy: number }}
 */
export function seek(from, target, speed) {
  const dir = direction(from, target);
  return {
    vx: Number((dir.dx * speed).toFixed(2)),
    vy: Number((dir.dy * speed).toFixed(2))
  };
}

/**
 * Steers an entity away from a threat point.
 *
 * @param {{ x: number, y: number }} from
 * @param {{ x: number, y: number }} threat
 * @param {number} speed
 * @returns {{ vx: number, vy: number }}
 */
export function flee(from, threat, speed) {
  const dir = direction(threat, from);
  return {
    vx: Number((dir.dx * speed).toFixed(2)),
    vy: Number((dir.dy * speed).toFixed(2))
  };
}
