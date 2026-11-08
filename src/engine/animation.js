/**
 * @file Animation Keyframe Engine.
 * Generates natural breathing cycles, flame perturbation phases, and floating ember particles.
 */

/**
 * Generates an array of animation frame states for a complete loop.
 *
 * @param {number} [frameCount=12] - Total frames for one complete breathing & flame cycle
 * @returns {Array<{
 *   frameIndex: number,
 *   breath: number,
 *   wingFlap: number,
 *   flamePhase: number,
 *   embers: Array<{ x: number, y: number, r: number, opacity: number }>
 * }>}
 */
export function generateAnimationFrames(frameCount = 12) {
  const frames = [];

  for (let i = 0; i < frameCount; i++) {
    const progress = i / frameCount;
    const angle = progress * 2 * Math.PI;

    // Breathing: smooth cosine expansion and contraction
    const breath = -Math.cos(angle);

    // Wing flap oscillation (cycles twice per breathing period)
    const wingFlap = Math.sin(angle * 2);

    // Flame flicker phase
    const flamePhase = angle * 3;

    // 4 ambient floating embers rising
    const embers = [
      {
        x: 80 + Math.sin(angle + 1) * 8,
        y: 160 - ((i * 12) % 120),
        r: 2.5,
        opacity: Math.max(0.2, 1 - ((i * 12) % 120) / 120)
      },
      {
        x: 95 + Math.cos(angle + 2) * 10,
        y: 140 - (((i + 4) * 12) % 120),
        r: 3,
        opacity: Math.max(0.2, 1 - (((i + 4) * 12) % 120) / 120)
      },
      {
        x: 70 + Math.sin(angle * 1.5) * 6,
        y: 150 - (((i + 8) * 12) % 120),
        r: 2,
        opacity: Math.max(0.2, 1 - (((i + 8) * 12) % 120) / 120)
      }
    ];

    frames.push({
      frameIndex: i,
      breath,
      wingFlap,
      flamePhase,
      embers
    });
  }

  return frames;
}
