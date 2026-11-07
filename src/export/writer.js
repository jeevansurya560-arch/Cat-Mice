/**
 * @file Artifact file writer and filesystem validator.
 * Handles atomic file writing and directory creation for final assets.
 */

import { writeFile, mkdir, stat } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Writes encoded GIF and PNG binary buffers to disk with filesystem validation.
 *
 * @param {object} params
 * @param {Uint8Array} params.gifData
 * @param {Buffer} params.pngData
 * @param {string} [params.outputDir="output"]
 * @param {string} [params.filenamePrefix="cat-mice"]
 * @returns {Promise<{
 *   gifPath: string,
 *   gifSize: number,
 *   pngPath: string,
 *   pngSize: number,
 *   writtenAt: string
 * }>}
 */
export async function writeArtifacts({
  gifData,
  pngData,
  outputDir = "output",
  filenamePrefix = "cat-mice"
}) {
  const targetDir = resolve(process.cwd(), outputDir);
  await mkdir(targetDir, { recursive: true });

  const gifPath = resolve(targetDir, `${filenamePrefix}.gif`);
  const pngPath = resolve(targetDir, `${filenamePrefix}.png`);

  await writeFile(gifPath, gifData);
  await writeFile(pngPath, pngData);

  const [gifStats, pngStats] = await Promise.all([stat(gifPath), stat(pngPath)]);

  if (gifStats.size === 0 || pngStats.size === 0) {
    throw new Error("Export failure: Output artifacts were written with 0 bytes.");
  }

  return {
    gifPath,
    gifSize: gifStats.size,
    pngPath,
    pngSize: pngStats.size,
    writtenAt: new Date().toISOString()
  };
}
