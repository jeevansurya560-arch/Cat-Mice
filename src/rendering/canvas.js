/**
 * @file Pixel buffer canvas manipulation utilities.
 * Handles in-memory 2D RGBA rasterization, rectangular fills, and sprite matrix blitting.
 */

/**
 * Creates an uninitialized RGBA pixel buffer.
 *
 * @param {number} width
 * @param {number} height
 * @returns {Uint8ClampedArray}
 */
export function createBuffer(width, height) {
  return new Uint8ClampedArray(width * height * 4);
}

/**
 * Sets a single pixel in an RGBA buffer with boundary checking.
 *
 * @param {Uint8ClampedArray} buffer
 * @param {number} width
 * @param {number} height
 * @param {number} x
 * @param {number} y
 * @param {[number, number, number, number]} rgba
 */
export function setPixel(buffer, width, height, x, y, rgba) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const alpha = rgba[3];
  if (alpha === 0) return; // Full transparency skip

  const idx = (Math.floor(y) * width + Math.floor(x)) * 4;

  if (alpha === 255) {
    buffer[idx] = rgba[0];
    buffer[idx + 1] = rgba[1];
    buffer[idx + 2] = rgba[2];
    buffer[idx + 3] = 255;
  } else {
    // Alpha blending
    const a = alpha / 255;
    const invA = 1 - a;
    buffer[idx] = Math.round(rgba[0] * a + buffer[idx] * invA);
    buffer[idx + 1] = Math.round(rgba[1] * a + buffer[idx + 1] * invA);
    buffer[idx + 2] = Math.round(rgba[2] * a + buffer[idx + 2] * invA);
    buffer[idx + 3] = 255;
  }
}

/**
 * Clears the entire buffer with a solid background color.
 *
 * @param {Uint8ClampedArray} buffer
 * @param {[number, number, number, number]} rgba
 */
export function clearBuffer(buffer, rgba) {
  for (let i = 0; i < buffer.length; i += 4) {
    buffer[i] = rgba[0];
    buffer[i + 1] = rgba[1];
    buffer[i + 2] = rgba[2];
    buffer[i + 3] = rgba[3];
  }
}

/**
 * Draws a filled rectangle on the pixel buffer.
 *
 * @param {Uint8ClampedArray} buffer
 * @param {number} width
 * @param {number} height
 * @param {number} rx
 * @param {number} ry
 * @param {number} rw
 * @param {number} rh
 * @param {[number, number, number, number]} rgba
 */
export function fillRect(buffer, width, height, rx, ry, rw, rh, rgba) {
  const startX = Math.max(0, Math.floor(rx));
  const startY = Math.max(0, Math.floor(ry));
  const endX = Math.min(width, Math.floor(rx + rw));
  const endY = Math.min(height, Math.floor(ry + rh));

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      setPixel(buffer, width, height, x, y, rgba);
    }
  }
}

/**
 * Blits a 2D sprite character matrix onto the destination buffer.
 *
 * @param {Uint8ClampedArray} buffer - Target canvas buffer.
 * @param {number} width - Canvas width.
 * @param {number} height - Canvas height.
 * @param {string[]} matrix - Array of strings representing pixel rows.
 * @param {Record<string, [number, number, number, number]>} colorMap - Map from char to RGBA.
 * @param {number} destX - Target top-left X coordinate.
 * @param {number} destY - Target top-left Y coordinate.
 * @param {object} [options]
 * @param {boolean} [options.flipX=false] - Flip sprite horizontally.
 * @param {number} [options.scale=1] - Pixel scale multiplier (1, 2, etc.).
 */
export function blitSprite(buffer, width, height, matrix, colorMap, destX, destY, options = {}) {
  const flipX = options.flipX || false;
  const scale = options.scale || 1;
  const spriteH = matrix.length;
  const spriteW = matrix[0]?.length || 0;

  for (let r = 0; r < spriteH; r++) {
    const row = matrix[r];
    for (let c = 0; c < spriteW; c++) {
      const char = row[c];
      const color = colorMap[char];
      if (!color || color[3] === 0) continue; // Transparency

      const sourceCol = flipX ? spriteW - 1 - c : c;
      const actualColor = colorMap[matrix[r][sourceCol]];
      if (!actualColor || actualColor[3] === 0) continue;

      const px = Math.floor(destX + c * scale);
      const py = Math.floor(destY + r * scale);

      if (scale === 1) {
        setPixel(buffer, width, height, px, py, actualColor);
      } else {
        fillRect(buffer, width, height, px, py, scale, scale, actualColor);
      }
    }
  }
}
