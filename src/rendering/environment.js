/**
 * @file Environmental backdrop and prop pixel-art rasterizer.
 * Renders cozy wooden floorboards, decorative rug, mouse hole, fish, fish bones, cheese, and wool ball.
 */

import { fillRect, setPixel } from "./canvas.js";
import { fillCircle, drawBorder } from "./geometry.js";

/**
 * Draws the background floor, wall wainscoting, and decorative room rug.
 *
 * @param {Uint8ClampedArray} buffer
 * @param {number} width
 * @param {number} height
 * @param {Record<string, [number, number, number, number]>} palette
 */
export function renderBackdrop(buffer, width, height, palette) {
  // 1. Fill base dark room background
  fillRect(buffer, width, height, 0, 0, width, height, palette.background);

  // 2. Upper wall / skirting board (retro room wainscoting)
  const wallHeight = 14;
  fillRect(buffer, width, height, 0, 0, width, wallHeight, [18, 22, 28, 255]);
  // Skirting baseboard moulding
  fillRect(buffer, width, height, 0, wallHeight - 2, width, 2, palette.surfaceBorder);
  fillRect(buffer, width, height, 0, wallHeight, width, 1, palette.woodSeam || [22, 26, 33, 255]);

  // 3. Wooden floorboard planks (horizontal planks with staggered seams)
  const plankHeight = 10;
  const plankWidth = 40;
  const numPlanksY = Math.ceil((height - wallHeight) / plankHeight);

  for (let py = 0; py < numPlanksY; py++) {
    const y = wallHeight + py * plankHeight;
    const isOdd = py % 2 === 1;
    const xOffset = isOdd ? plankWidth / 2 : 0;
    const plankColor = py % 2 === 0 ? palette.groundTileA : palette.groundTileB;

    // Plank row background
    fillRect(buffer, width, height, 0, y, width, plankHeight, plankColor);
    // Horizontal seam line
    fillRect(
      buffer,
      width,
      height,
      0,
      y + plankHeight - 1,
      width,
      1,
      palette.woodSeam || [20, 24, 30, 255]
    );

    // Vertical plank seams
    for (let x = xOffset; x < width; x += plankWidth) {
      fillRect(
        buffer,
        width,
        height,
        Math.floor(x),
        y,
        1,
        plankHeight - 1,
        palette.woodSeam || [20, 24, 30, 255]
      );
    }
  }

  // 4. Decorative woven rug in the center/left area
  const rugX = Math.round(width * 0.18);
  const rugY = Math.round(height * 0.28);
  const rugW = Math.round(width * 0.38);
  const rugH = Math.round(height * 0.44);

  // Rug base
  fillRect(buffer, width, height, rugX, rugY, rugW, rugH, [20, 25, 32, 255]);
  // Inner weave
  fillRect(buffer, width, height, rugX + 2, rugY + 2, rugW - 4, rugH - 4, [25, 31, 40, 255]);
  // Rug border with secondary accent color
  drawBorder(buffer, width, height, rugX, rugY, rugW, rugH, 1, palette.secondaryAccent);
  // Rug fringe on left and right
  for (let fy = rugY + 2; fy < rugY + rugH - 2; fy += 3) {
    setPixel(buffer, width, height, rugX - 1, fy, palette.secondaryAccent);
    setPixel(buffer, width, height, rugX + rugW, fy, palette.secondaryAccent);
  }

  // 5. Room perimeter border with primary accent corner markers
  drawBorder(buffer, width, height, 2, 2, width - 4, height - 4, 1, palette.surfaceBorder);
  fillRect(buffer, width, height, 2, 2, 6, 1, palette.primaryAccent);
  fillRect(buffer, width, height, 2, 2, 1, 6, palette.primaryAccent);
  fillRect(buffer, width, height, width - 8, 2, 6, 1, palette.primaryAccent);
  fillRect(buffer, width, height, width - 3, 2, 1, 6, palette.primaryAccent);
}

/**
 * Draws environmental props (mouse hole, fish, fish bones, cheese, wool ball, bowls).
 *
 * @param {Uint8ClampedArray} buffer
 * @param {number} width
 * @param {number} height
 * @param {object} props - World props object.
 * @param {Record<string, [number, number, number, number]>} palette
 */
export function renderProps(buffer, width, height, props, palette) {
  if (!props) return;

  // 1. Mouse Hole / Burrow (Arched wooden entrance in baseboard)
  const hole = props.mouseHole || props.burrow;
  if (hole) {
    const hx = Math.round(hole.x);
    const hy = Math.round(hole.y);

    // Arched wood frame
    fillRect(buffer, width, height, hx - 7, hy - 8, 14, 10, [60, 48, 38, 255]);
    fillCircle(buffer, width, height, hx, hy - 7, 6, [60, 48, 38, 255]);

    // Dark hole interior
    fillRect(buffer, width, height, hx - 5, hy - 6, 10, 8, palette.burrowHole);
    fillCircle(buffer, width, height, hx, hy - 5, 4, palette.burrowHole);

    // Stone doorstep
    fillRect(buffer, width, height, hx - 8, hy + 2, 16, 2, [45, 50, 58, 255]);
  }

  // 2. Fish or Fish Bones
  if (props.fish) {
    const fx = Math.round(props.fish.x);
    const fy = Math.round(props.fish.y);

    // Little wooden serving board / mat under fish
    fillRect(buffer, width, height, fx - 8, fy - 2, 16, 8, [50, 38, 28, 255]);
    drawBorder(buffer, width, height, fx - 8, fy - 2, 16, 8, 1, [35, 26, 20, 255]);

    if (!props.fish.consumed) {
      // Whole fresh fish
      const fishColor = palette.fishBlue || [100, 175, 235, 255];
      const silverColor = palette.fishSilver || [200, 220, 240, 255];
      const darkColor = [20, 30, 45, 255];

      // Fish body
      fillRect(buffer, width, height, fx - 5, fy, 8, 4, fishColor);
      fillRect(buffer, width, height, fx - 3, fy + 1, 6, 2, silverColor);
      // Head & eye
      fillRect(buffer, width, height, fx + 3, fy + 1, 2, 2, fishColor);
      setPixel(buffer, width, height, fx + 3, fy + 1, darkColor); // eye
      // Tail fin
      fillRect(buffer, width, height, fx - 7, fy - 1, 2, 2, fishColor);
      fillRect(buffer, width, height, fx - 7, fy + 3, 2, 2, fishColor);
      // Dorsal fin
      setPixel(buffer, width, height, fx - 1, fy - 1, fishColor);
    } else {
      // Fish bones remain afterward
      const boneColor = palette.fishBonesWhite || [235, 238, 242, 255];
      const shadowBone = [160, 165, 175, 255];

      // Head skull with empty eye socket
      fillRect(buffer, width, height, fx + 2, fy, 3, 3, boneColor);
      setPixel(buffer, width, height, fx + 3, fy + 1, [30, 25, 20, 255]); // socket

      // Spine line
      fillRect(buffer, width, height, fx - 5, fy + 1, 7, 1, boneColor);

      // Rib bones (top and bottom)
      setPixel(buffer, width, height, fx - 3, fy, boneColor);
      setPixel(buffer, width, height, fx - 3, fy + 2, boneColor);
      setPixel(buffer, width, height, fx - 1, fy, boneColor);
      setPixel(buffer, width, height, fx - 1, fy + 2, boneColor);
      setPixel(buffer, width, height, fx + 1, fy, shadowBone);
      setPixel(buffer, width, height, fx + 1, fy + 2, shadowBone);

      // Tail bone fin
      setPixel(buffer, width, height, fx - 6, fy, boneColor);
      setPixel(buffer, width, height, fx - 6, fy + 2, boneColor);
    }
  }

  // 3. Cheese Wedge
  if (props.cheese && !props.cheese.collected) {
    const cx = Math.round(props.cheese.x);
    const cy = Math.round(props.cheese.y);
    const yellow = palette.cheeseYellow || [255, 205, 45, 255];
    const holeColor = palette.cheeseHole || [215, 160, 25, 255];
    const outline = [160, 110, 15, 255];

    // Triangular wedge shape
    fillRect(buffer, width, height, cx - 4, cy + 2, 8, 2, yellow);
    fillRect(buffer, width, height, cx - 2, cy, 6, 2, yellow);
    fillRect(buffer, width, height, cx, cy - 2, 4, 2, yellow);
    fillRect(buffer, width, height, cx + 2, cy - 3, 2, 1, outline);

    // Cheese swiss holes
    setPixel(buffer, width, height, cx - 1, cy + 2, holeColor);
    setPixel(buffer, width, height, cx + 1, cy, holeColor);
  }

  // 4. Wool Ball / Yarn Ball
  const wool = props.woolBall || props.yarnBall;
  if (wool && wool.active !== false) {
    const wx = Math.round(wool.x);
    const wy = Math.round(wool.y);

    // Red textured sphere
    fillCircle(buffer, width, height, wx, wy, 5, palette.yarnRed);
    fillCircle(buffer, width, height, wx - 1, wy - 1, 2, palette.yarnHighlight);
    // Yarn loose strand winding off
    fillRect(buffer, width, height, wx + 4, wy + 2, 3, 1, palette.yarnRed);
    fillRect(buffer, width, height, wx + 7, wy + 3, 3, 1, palette.yarnRed);
    setPixel(buffer, width, height, wx + 10, wy + 2, palette.yarnRed);
  }

  // 5. Food Bowl / Milk Dish (if present)
  if (props.foodBowl) {
    const bx = Math.round(props.foodBowl.x);
    const by = Math.round(props.foodBowl.y);
    fillCircle(buffer, width, height, bx, by, 6, palette.foodBowlGrey);
    fillCircle(buffer, width, height, bx, by, 4, palette.foodMilkWhite);
  }
}
