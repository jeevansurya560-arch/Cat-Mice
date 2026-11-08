/**
 * @file Artifact file writer and filesystem validator.
 * Handles atomic file writing and directory creation for final assets.
 */

import { writeFile, mkdir, stat } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Writes encoded GIF, PNG, and SVG buffers to disk with filesystem validation.
 *
 * @param {object} params
 * @param {Uint8Array} params.gifData
 * @param {Buffer} params.pngData
 * @param {string|Buffer} [params.svgData]
 * @param {string} [params.outputDir="output"]
 * @param {string} [params.filenamePrefix="cat-mice"]
 * @returns {Promise<{
 *   gifPath: string,
 *   gifSize: number,
 *   pngPath: string,
 *   pngSize: number,
 *   svgPath?: string,
 *   svgSize?: number,
 *   writtenAt: string
 * }>}
 */
export async function writeArtifacts({
  gifData,
  pngData,
  svgData,
  outputDir = "output",
  filenamePrefix = "cat-mice"
}) {
  const targetDir = resolve(process.cwd(), outputDir);
  await mkdir(targetDir, { recursive: true });

  const gifPath = resolve(targetDir, `${filenamePrefix}.gif`);
  const pngPath = resolve(targetDir, `${filenamePrefix}.png`);
  const svgPath = resolve(targetDir, `${filenamePrefix}.svg`);

  await writeFile(gifPath, gifData);
  await writeFile(pngPath, pngData);
  if (svgData) {
    await writeFile(svgPath, svgData);
  }

  const [gifStats, pngStats] = await Promise.all([stat(gifPath), stat(pngPath)]);
  let svgSize = 0;
  if (svgData) {
    const svgStats = await stat(svgPath);
    svgSize = svgStats.size;
  }

  if (gifStats.size === 0 || pngStats.size === 0) {
    throw new Error("Export failure: Output artifacts were written with 0 bytes.");
  }

  return {
    gifPath,
    gifSize: gifStats.size,
    pngPath,
    pngSize: pngStats.size,
    svgPath: svgData ? svgPath : undefined,
    svgSize: svgData ? svgSize : undefined,
    writtenAt: new Date().toISOString()
  };
}
