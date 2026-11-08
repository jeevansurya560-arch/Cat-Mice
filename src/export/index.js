/**
 * @file Export Engine Orchestrator.
 * Transforms RenderedPixelBuffersDTO into final GIF, PNG, and SVG distribution artifacts.
 */

import { encodeGif } from "./gif.js";
import { encodePng } from "./png.js";
import { writeArtifacts } from "./writer.js";
import { generateWorldSvg } from "../svg/world.js";

/**
 * Encodes, validates, and writes distribution artifacts to disk.
 *
 * @param {import("../rendering/index.js").renderTimeline} renderedBuffers
 * @param {object} [options]
 * @param {string} [options.outputDir="output"]
 * @param {string} [options.filenamePrefix="cat-mice"]
 * @param {number} [options.maxColors=64]
 * @param {number} [options.posterFrameIndex=0]
 * @param {object} [options.frame] - Optional simulation frame for SVG generation.
 * @param {object} [options.themeSpec] - Optional palette theme spec.
 * @param {string} [options.svgData] - Optional direct SVG XML string.
 * @returns {Promise<Readonly<{
 *   gifPath: string,
 *   gifSize: number,
 *   pngPath: string,
 *   pngSize: number,
 *   svgPath?: string,
 *   svgSize?: number,
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

  // 3. Generate Static World SVG
  let svgData = options.svgData || null;
  if (!svgData && options.frame) {
    svgData = generateWorldSvg(options.frame, options.themeSpec || {}, {
      width,
      height,
      displayWidth: width * 4,
      displayHeight: height * 4
    });
  }

  // 4. Write Artifacts to Disk
  const writeResult = await writeArtifacts({
    gifData,
    pngData,
    svgData,
    outputDir: options.outputDir || "output",
    filenamePrefix: options.filenamePrefix || "cat-mice"
  });

  return Object.freeze({
    gifPath: writeResult.gifPath,
    gifSize: writeResult.gifSize,
    pngPath: writeResult.pngPath,
    pngSize: writeResult.pngSize,
    svgPath: writeResult.svgPath,
    svgSize: writeResult.svgSize,
    width,
    height,
    frameCount: frames.length,
    fps,
    exportedAt: writeResult.writtenAt
  });
}
