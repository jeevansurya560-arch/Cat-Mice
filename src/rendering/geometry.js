/**
 * @file Raster geometry drawing primitives.
 * Provides line, circle, border, and dithered shape rasterizers.
 */

import { setPixel, fillRect } from "./canvas.js";

/**
 * Draws a filled circle on the pixel buffer.
 *
 * @param {Uint8ClampedArray} buffer
 * @param {number} width
 * @param {number} height
 * @param {number} cx - Center X.
 * @param {number} cy - Center Y.
 * @param {number} radius - Circle radius.
 * @param {[number, number, number, number]} rgba
 */
export function fillCircle(buffer, width, height, cx, cy, radius, rgba) {
  const r2 = radius * radius;
  const startX = Math.max(0, Math.floor(cx - radius));
  const endX = Math.min(width, Math.ceil(cx + radius));
  const startY = Math.max(0, Math.floor(cy - radius));
  const endY = Math.min(height, Math.ceil(cy + radius));

  for (let y = startY; y <= endY; y++) {
    const dy = y - cy;
    for (let x = startX; x <= endX; x++) {
      const dx = x - cx;
      if (dx * dx + dy * dy <= r2) {
        setPixel(buffer, width, height, x, y, rgba);
      }
    }
  }
}

/**
 * Draws a hollow rectangular border.
 *
 * @param {Uint8ClampedArray} buffer
 * @param {number} width
 * @param {number} height
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} borderWidth
 * @param {[number, number, number, number]} rgba
 */
export function drawBorder(buffer, width, height, x, y, w, h, borderWidth, rgba) {
  // Top
  fillRect(buffer, width, height, x, y, w, borderWidth, rgba);
  // Bottom
  fillRect(buffer, width, height, x, y + h - borderWidth, w, borderWidth, rgba);
  // Left
  fillRect(buffer, width, height, x, y, borderWidth, h, rgba);
  // Right
  fillRect(buffer, width, height, x + w - borderWidth, y, borderWidth, h, rgba);
}
