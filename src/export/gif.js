/**
 * @file Animated GIF encoding module using gifenc.
 * Handles NeuQuant palette quantization, frame timing, and looping GIF generation.
 */

import { GIFEncoder, quantize, applyPalette } from "gifenc/dist/gifenc.esm.js";

/**
 * Encodes raw 2D RGBA pixel buffers into an animated GIF.
 *
 * @param {import("../rendering/index.js").renderTimeline} renderedBuffers
 * @param {object} [options]
 * @param {number} [options.maxColors=64] - Maximum color palette size (up to 256, 64 recommended).
 * @param {boolean} [options.loop=true] - Infinite loop flag.
 * @returns {Uint8Array} Encoded GIF binary bytes.
 */
export function encodeGif(renderedBuffers, options = {}) {
  const { width, height, frames, fps } = renderedBuffers;
  const maxColors = options.maxColors || 64;
  const repeat = options.loop !== false ? 0 : -1; // 0 = infinite loop
  const delay = Math.round(1000 / (fps || 12));

  const gif = GIFEncoder();

  for (const frame of frames) {
    // Quantize 32-bit RGBA down to indexed color palette
    const palette = quantize(frame, maxColors, { format: "rgba4444" });
    const indexed = applyPalette(frame, palette, "rgba4444");

    gif.writeFrame(indexed, width, height, {
      palette,
      delay,
      repeat
    });
  }

  gif.finish();
  return gif.bytes();
}
