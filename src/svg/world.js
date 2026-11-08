/**
 * @file Scalable Vector Graphics (SVG) World Ecosystem Renderer.
 * Produces resolution-independent, self-contained SVG static artwork for GitHub profile README.
 */

import { CAT_SPRITES, getCatColorMap } from "../rendering/cat.js";
import { MOUSE_SPRITES, getMouseColorMap } from "../rendering/mouse.js";
import { renderBackdrop, renderProps } from "../rendering/environment.js";
import { createPalette } from "../rendering/palette.js";
import { createBuffer } from "../rendering/canvas.js";

/**
 * Converts a raw RGBA pixel buffer into an SVG group with run-length compressed rectangles.
 *
 * @param {Uint8ClampedArray} buffer - RGBA pixel buffer.
 * @param {number} width - Canvas width.
 * @param {number} height - Canvas height.
 * @param {string} groupId - DOM group identifier.
 * @returns {string} XML SVG group string.
 */
export function bufferToSvgGroup(buffer, width, height, groupId) {
  const colorBuckets = new Map();

  for (let y = 0; y < height; y++) {
    let currentHex = null;
    let runStart = 0;
    let runLength = 0;

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const alpha = buffer[idx + 3];

      let hex = null;
      if (alpha > 0) {
        hex = `#${buffer[idx].toString(16).padStart(2, "0")}${buffer[idx + 1].toString(16).padStart(2, "0")}${buffer[idx + 2].toString(16).padStart(2, "0")}`;
      }

      if (hex === currentHex) {
        if (hex !== null) runLength++;
      } else {
        if (currentHex !== null && runLength > 0) {
          if (!colorBuckets.has(currentHex)) colorBuckets.set(currentHex, []);
          colorBuckets.get(currentHex).push({ x: runStart, y, w: runLength, h: 1 });
        }
        currentHex = hex;
        runStart = x;
        runLength = hex !== null ? 1 : 0;
      }
    }

    if (currentHex !== null && runLength > 0) {
      if (!colorBuckets.has(currentHex)) colorBuckets.set(currentHex, []);
      colorBuckets.get(currentHex).push({ x: runStart, y, w: runLength, h: 1 });
    }
  }

  const lines = [`  <g id="${groupId}">`];
  for (const [hex, rects] of colorBuckets.entries()) {
    lines.push(`    <g fill="${hex}">`);
    for (const r of rects) {
      lines.push(`      <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" />`);
    }
    lines.push(`    </g>`);
  }
  lines.push(`  </g>`);
  return lines.join("\n");
}

/**
 * Generates a complete, resolution-independent SVG representation of the CAT-MICE world.
 *
 * @param {object} frame - Simulation frame state.
 * @param {object} [themeSpec] - Palette theme spec.
 * @param {object} [dimensions] - { width: 240, height: 120, displayWidth: 960, displayHeight: 480 }.
 * @returns {string} Standalone SVG XML string.
 */
export function generateWorldSvg(frame, themeSpec = {}, dimensions = {}) {
  const width = dimensions.width || 240;
  const height = dimensions.height || 120;
  const displayW = dimensions.displayWidth || 960;
  const displayH = dimensions.displayHeight || 480;

  const palette = createPalette(themeSpec);

  // 1. Render Environment Backdrop Layer
  const envBuffer = createBuffer(width, height);
  renderBackdrop(envBuffer, width, height, palette);
  const envGroup = bufferToSvgGroup(envBuffer, width, height, "environment");

  // 2. Render Environmental Props Layer
  const propsBuffer = createBuffer(width, height);
  renderProps(propsBuffer, width, height, frame.props, palette);
  const propsGroup = bufferToSvgGroup(propsBuffer, width, height, "props");

  // 3. Render Cat Layer
  const catBuffer = createBuffer(width, height);
  const cat = frame.cat;
  const catColorMap = getCatColorMap(cat.variant, palette);
  let catSprite = CAT_SPRITES.IDLE;
  if (CAT_SPRITES[cat.action]) catSprite = CAT_SPRITES[cat.action];

  const catOffsetX = Math.round(cat.x - 16);
  const catOffsetY = Math.round(cat.y - 16);

  blitToBuffer(
    catBuffer,
    width,
    height,
    catSprite,
    catColorMap,
    catOffsetX,
    catOffsetY,
    cat.facing === "west" || cat.facing === "left"
  );
  const catGroup = bufferToSvgGroup(catBuffer, width, height, "cat");

  // 4. Render Mouse Layer
  const mouseBuffer = createBuffer(width, height);
  const mouse = frame.mouse;
  let mouseGroup = '  <g id="mouse"></g>';

  if (mouse && mouse.unlocked && mouse.visible) {
    const mouseColorMap = getMouseColorMap(mouse.tier, mouse.variant, palette);
    let mouseSprite = MOUSE_SPRITES.IDLE;
    if (MOUSE_SPRITES[mouse.action]) mouseSprite = MOUSE_SPRITES[mouse.action];

    const mouseOffsetX = Math.round(mouse.x - 12);
    const mouseOffsetY = Math.round(mouse.y - 12);

    blitToBuffer(
      mouseBuffer,
      width,
      height,
      mouseSprite,
      mouseColorMap,
      mouseOffsetX,
      mouseOffsetY,
      mouse.facing === "west" || mouse.facing === "left"
    );
    mouseGroup = bufferToSvgGroup(mouseBuffer, width, height, "mouse");
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${displayW}" height="${displayH}" shape-rendering="crispEdges">
  <title>CAT-MICE Developer Ecosystem</title>
${envGroup}
${propsGroup}
${catGroup}
${mouseGroup}
</svg>
`;
}

function blitToBuffer(buffer, width, height, matrix, colorMap, destX, destY, flipX) {
  const spriteH = matrix.length;
  const spriteW = matrix[0]?.length || 0;

  for (let r = 0; r < spriteH; r++) {
    const row = matrix[r];
    for (let c = 0; c < spriteW; c++) {
      const sourceCol = flipX ? spriteW - 1 - c : c;
      const char = row[sourceCol];
      const color = colorMap[char];
      if (!color || color[3] === 0) continue;

      const px = destX + c;
      const py = destY + r;
      if (px < 0 || px >= width || py < 0 || py >= height) continue;

      const idx = (py * width + px) * 4;
      buffer[idx] = color[0];
      buffer[idx + 1] = color[1];
      buffer[idx + 2] = color[2];
      buffer[idx + 3] = color[3];
    }
  }
}
