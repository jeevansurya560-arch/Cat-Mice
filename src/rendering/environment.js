/**
 * @file Environmental backdrop and prop rasterizer.
 * Renders floorboards, borders, burrow entrance, food bowl, and toys.
 */

import { fillRect } from "./canvas.js";
import { fillCircle, drawBorder } from "./geometry.js";

/**
 * Draws the background floor and room borders.
 *
 * @param {Uint8ClampedArray} buffer
 * @param {number} width
 * @param {number} height
 * @param {Record<string, [number, number, number, number]>} palette
 */
export function renderBackdrop(buffer, width, height, palette) {
  // 1. Fill base floorboard background
  fillRect(buffer, width, height, 0, 0, width, height, palette.background);

  // 2. Checkerboard floor pattern (16x16 tiles)
  const tileSize = 16;
  const cols = Math.ceil(width / tileSize);
  const rows = Math.ceil(height / tileSize);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tileColor = (r + c) % 2 === 0 ? palette.groundTileA : palette.groundTileB;
      fillRect(buffer, width, height, c * tileSize, r * tileSize, tileSize, tileSize, tileColor);
    }
  }

  // 3. Room perimeter border with primary accent corner accents
  drawBorder(buffer, width, height, 4, 4, width - 8, height - 8, 2, palette.surfaceBorder);
  fillRect(buffer, width, height, 4, 4, 8, 2, palette.primaryAccent);
  fillRect(buffer, width, height, 4, 4, 2, 8, palette.primaryAccent);
  fillRect(buffer, width, height, width - 12, 4, 8, 2, palette.primaryAccent);
  fillRect(buffer, width, height, width - 6, 4, 2, 8, palette.primaryAccent);
}

/**
 * Draws environmental props onto the buffer.
 *
 * @param {Uint8ClampedArray} buffer
 * @param {number} width
 * @param {number} height
 * @param {object} props - Burrow, foodBowl, yarnBall.
 * @param {Record<string, [number, number, number, number]>} palette
 */
export function renderProps(buffer, width, height, props, palette) {
  // 1. Mouse Burrow Hole
  if (props.burrow) {
    const { x, y } = props.burrow;
    // Dark hollow
    fillCircle(buffer, width, height, x, y, 10, palette.burrowHole);
    // Wooden arch trim
    fillCircle(buffer, width, height, x, y - 2, 8, [50, 40, 30, 255]);
    fillCircle(buffer, width, height, x, y, 7, palette.burrowHole);
  }

  // 2. Food Bowl
  if (props.foodBowl) {
    const { x, y } = props.foodBowl;
    // Ceramic bowl outer
    fillCircle(buffer, width, height, x, y, 8, palette.foodBowlGrey);
    // Milk/water interior
    fillCircle(buffer, width, height, x, y, 5, palette.foodMilkWhite);
  }

  // 3. Yarn Ball (Active for Kittens)
  if (props.yarnBall?.active) {
    const { x, y } = props.yarnBall;
    // Red yarn sphere
    fillCircle(buffer, width, height, x, y, 6, palette.yarnRed);
    fillCircle(buffer, width, height, x - 1, y - 1, 3, palette.yarnHighlight);
    // Trailing thread tail
    fillRect(buffer, width, height, x + 4, y + 3, 5, 1, palette.yarnRed);
    fillRect(buffer, width, height, x + 8, y + 4, 4, 1, palette.yarnRed);
  }
}
