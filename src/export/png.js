/**
 * @file Static PNG poster frame encoder using sharp.
 * Converts raw RGBA frame buffers into an optimized PNG image.
 */

import sharp from "sharp";

/**
 * Encodes a single 2D RGBA pixel buffer into an optimized PNG image.
 *
 * @param {Uint8ClampedArray} rgbaBuffer - Raw pixel buffer.
 * @param {number} width - Image width.
 * @param {number} height - Image height.
 * @returns {Promise<Buffer>} Compressed PNG binary buffer.
 */
export async function encodePng(rgbaBuffer, width, height) {
  if (!rgbaBuffer || rgbaBuffer.length !== width * height * 4) {
    throw new Error(`Invalid buffer size for PNG encoding: expected ${width * height * 4} bytes.`);
  }

  return await sharp(Buffer.from(rgbaBuffer), {
    raw: {
      width,
      height,
      channels: 4
    }
  })
    .png({ compressionLevel: 9 })
    .toBuffer();
}
