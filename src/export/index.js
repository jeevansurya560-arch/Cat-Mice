/**
 * @file Export Engine Orchestrator.
 * Transforms RenderedPixelBuffersDTO into final GIF and PNG distribution artifacts.
 */

import { encodeGif } from "./gif.js";
import { encodePng } from "./png.js";
import { writeArtifacts } from "./writer.js";

/**
 * Encodes, validates, and writes distribution artifacts to disk.
 *
 * @param {import("../rendering/index.js").renderTimeline} renderedBuffers
 * @param {object} [options]
 * @param {string} [options.outputDir="output"]
 * @param {string} [options.filenamePrefix="cat-mice"]
 * @param {number} [options.maxColors=64]
 * @param {number} [options.posterFrameIndex=0]
 * @returns {Promise<Readonly<{
 *   gifPath: string,
 *   gifSize: number,
 *   pngPath: string,
 *   pngSize: number,
 *   width: number,
 *   height: number,
 *   frameCount: number,
 *   fps: number,
 *   exportedAt: string
 * }>>}
 */
export async function exportArtifacts(renderedBuffers, options = {}) {
  if (!renderedBuffers || !renderedBuffers.frames || renderedBuffers.frames.length === 0) {
    throw new Error("Cannot export artifacts: Rendered pixel frames are missing or empty.");
  }

  const { width, height, frames, fps } = renderedBuffers;
  const posterIndex = Math.min(frames.length - 1, options.posterFrameIndex || 0);
  const posterFrame = frames[posterIndex];

  // 1. Encode Animated GIF
  const gifData = encodeGif(renderedBuffers, options);

  // 2. Encode Static Poster PNG
  const pngData = await encodePng(posterFrame, width, height);

  // 3. Write Artifacts to Disk
  const writeResult = await writeArtifacts({
    gifData,
    pngData,
    outputDir: options.outputDir || "output",
    filenamePrefix: options.filenamePrefix || "cat-mice"
  });

  return Object.freeze({
    gifPath: writeResult.gifPath,
    gifSize: writeResult.gifSize,
    pngPath: writeResult.pngPath,
    pngSize: writeResult.pngSize,
    width,
    height,
    frameCount: frames.length,
    fps,
    exportedAt: writeResult.writtenAt
  });
}
