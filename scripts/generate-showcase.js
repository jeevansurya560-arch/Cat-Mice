/**
 * @file Generates dist/showcase.png and assets/generated/showcase.png progression showcase matrix.
 * Demonstrates Cat growth stages and Mouse companion tiers side-by-side across language themes like git-koi.
 */

import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { createBuffer, blitSprite, fillRect } from "../src/rendering/canvas.js";
import { CAT_SPRITES, getCatColorMap } from "../src/rendering/cat.js";
import { MOUSE_SPRITES, getMouseColorMap } from "../src/rendering/mouse.js";

/**
 * Generates the multi-row, multi-column progression matrix matching git-koi style.
 *
 * @param {string} [outputPath="dist/showcase.png"]
 */
export function generateShowcase(outputPath = "dist/showcase.png") {
  const W = 800;
  const H = 600;
  const buffer = createBuffer(W, H);

  // 1. Sleek pitch-dark background (#0d1117)
  fillRect(buffer, W, H, 0, 0, W, H, [13, 17, 23, 255]);

  // Subtle clean border (#21262d)
  fillRect(buffer, W, H, 0, 0, W, 1, [33, 38, 45, 255]);
  fillRect(buffer, W, H, 0, H - 1, W, 1, [33, 38, 45, 255]);
  fillRect(buffer, W, H, 0, 0, 1, H, [33, 38, 45, 255]);
  fillRect(buffer, W, H, W - 1, 0, 1, H, [33, 38, 45, 255]);

  // Subtle horizontal track guides between rows
  for (let y = 110; y <= 470; y += 90) {
    fillRect(buffer, W, H, 32, y, W - 64, 1, [22, 27, 34, 255]);
  }

  // Row 5 divider separating Cat ecosystem and Mouse companion
  fillRect(buffer, W, H, 24, 470, W - 48, 1, [38, 44, 54, 255]);

  const palette = {
    transparent: [0, 0, 0, 0],
    catScarf: [165, 42, 58, 255],
    primaryAccent: [165, 42, 58, 255]
  };

  const colCenters = [90, 225, 375, 525, 685];

  // Rows 1 - 5: Cat Growth Stages across Language / Coat Themes
  const catRows = [
    { name: "Rust / Ginger", variant: "rust", y: 60 },
    { name: "Python", variant: "python", y: 150 },
    { name: "JavaScript", variant: "javascript", y: 240 },
    { name: "C++", variant: "cpp", y: 330 },
    { name: "Midnight", variant: "midnight", y: 420 }
  ];

  const catStageSpecs = [
    { name: "Kitten", scale: 1.0, sprite: CAT_SPRITES.SLEEP },
    { name: "Young", scale: 1.3, sprite: CAT_SPRITES.WALK_SOUTH_0 },
    { name: "Adult", scale: 1.6, sprite: CAT_SPRITES.IDLE_SOUTH },
    { name: "Pro", scale: 1.9, sprite: CAT_SPRITES.PLAY },
    { name: "Master", scale: 2.2, sprite: CAT_SPRITES.IDLE_SOUTH, crown: true }
  ];

  for (const row of catRows) {
    const colorMap = getCatColorMap(row.variant, palette);

    for (let c = 0; c < 5; c++) {
      const cx = colCenters[c];
      const cy = row.y;
      const spec = catStageSpecs[c];

      const spriteW = 32;
      const spriteH = 32;
      const drawW = Math.round(spriteW * spec.scale);
      const drawH = Math.round(spriteH * spec.scale);
      const destX = Math.round(cx - drawW / 2);
      const destY = Math.round(cy - drawH / 2);

      blitSprite(buffer, W, H, spec.sprite, colorMap, destX, destY, { scale: spec.scale });

      if (spec.crown) {
        // Royal golden crown on Master cat head
        const crW = Math.round(20 * (spec.scale / 2));
        const crX = cx - Math.round(crW / 2);
        const crY = destY - 8;
        fillRect(buffer, W, H, crX, crY, crW, 3, [249, 199, 79, 255]);
        fillRect(buffer, W, H, crX, crY - 5, 4, 5, [249, 199, 79, 255]);
        fillRect(buffer, W, H, cx - 2, crY - 7, 5, 7, [249, 199, 79, 255]);
        fillRect(buffer, W, H, crX + crW - 4, crY - 5, 4, 5, [249, 199, 79, 255]);
        fillRect(buffer, W, H, cx - 1, crY - 2, 3, 3, [217, 119, 6, 255]); // ruby gem
      }
    }
  }

  // Row 6: Mouse Companion Evolution across Consistency Tiers (y: 535)
  const mouseSpecs = [
    {
      name: "Newbie",
      tier: "NEWBIE",
      variant: "field_mouse",
      scale: 1.2,
      sprite: MOUSE_SPRITES.IDLE_SOUTH
    },
    {
      name: "Regular",
      tier: "REGULAR",
      variant: "companion",
      scale: 1.4,
      sprite: MOUSE_SPRITES.WALK_SOUTH_0
    },
    {
      name: "Consistent",
      tier: "CONSISTENT",
      variant: "companion",
      scale: 1.6,
      sprite: MOUSE_SPRITES.COLLECT
    },
    {
      name: "Dedicated",
      tier: "DEDICATED",
      variant: "companion",
      scale: 1.8,
      sprite: MOUSE_SPRITES.WORK
    },
    {
      name: "Streaker",
      tier: "STREAKER",
      variant: "companion",
      scale: 2.1,
      sprite: MOUSE_SPRITES.CHEER,
      crown: true
    }
  ];

  const mouseRowY = 530;
  for (let c = 0; c < 5; c++) {
    const spec = mouseSpecs[c];
    const colorMap = getMouseColorMap(spec.tier, spec.variant, palette);
    const cx = colCenters[c];
    const cy = mouseRowY;

    const spriteW = 24;
    const spriteH = 24;
    const drawW = Math.round(spriteW * spec.scale);
    const drawH = Math.round(spriteH * spec.scale);
    const destX = Math.round(cx - drawW / 2);
    const destY = Math.round(cy - drawH / 2);

    blitSprite(buffer, W, H, spec.sprite, colorMap, destX, destY, { scale: spec.scale });

    if (spec.crown) {
      // Golden crown on Streaker mouse head
      const crW = Math.round(16 * (spec.scale / 2));
      const crX = cx - Math.round(crW / 2);
      const crY = destY - 6;
      fillRect(buffer, W, H, crX, crY, crW, 3, [249, 199, 79, 255]);
      fillRect(buffer, W, H, crX, crY - 4, 3, 4, [249, 199, 79, 255]);
      fillRect(buffer, W, H, cx - 2, crY - 6, 4, 6, [249, 199, 79, 255]);
      fillRect(buffer, W, H, crX + crW - 3, crY - 4, 3, 4, [249, 199, 79, 255]);
    }
  }

  // Write PNG buffer
  const png = new PNG({ width: W, height: H });
  png.data = Buffer.from(buffer);
  const pngData = PNG.sync.write(png);

  // Ensure output directory exists
  const resolvedOut = path.resolve(process.cwd(), outputPath);
  fs.mkdirSync(path.dirname(resolvedOut), { recursive: true });
  fs.writeFileSync(resolvedOut, pngData);
  console.log(`Generated ${outputPath} successfully.`);

  // Also write to assets/generated/showcase.png
  const assetOut = path.resolve(process.cwd(), "assets/generated/showcase.png");
  fs.mkdirSync(path.dirname(assetOut), { recursive: true });
  fs.writeFileSync(assetOut, pngData);
  console.log(`Generated assets/generated/showcase.png successfully.`);
}

if (process.argv[1]?.endsWith("generate-showcase.js")) {
  generateShowcase();
}
