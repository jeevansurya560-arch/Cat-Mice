/**
 * @file Generates dist/showcase.png progression showcase matrix.
 * Demonstrates Cat growth stages and Mouse companion tiers side-by-side like git-koi.
 */

import fs from "node:fs";
import { PNG } from "pngjs";
import { createBuffer, blitSprite, fillRect } from "../src/rendering/canvas.js";
import { CAT_SPRITES, getCatColorMap } from "../src/rendering/cat.js";
import { MOUSE_SPRITES, getMouseColorMap } from "../src/rendering/mouse.js";

export function generateShowcase(outputPath = "dist/showcase.png") {
  const W = 640;
  const H = 240;
  const buffer = createBuffer(W, H);

  // 1. Dark elegant backdrop
  fillRect(buffer, W, H, 0, 0, W, H, [13, 17, 23, 255]); // #0d1117
  // Border
  fillRect(buffer, W, H, 0, 0, W, 1, [33, 38, 45, 255]);
  fillRect(buffer, W, H, 0, H - 1, W, 1, [33, 38, 45, 255]);
  fillRect(buffer, W, H, 0, 0, 1, H, [33, 38, 45, 255]);
  fillRect(buffer, W, H, W - 1, 0, 1, H, [33, 38, 45, 255]);

  // Decorative middle subtle divider
  fillRect(buffer, W, H, 24, 120, W - 48, 1, [30, 36, 46, 255]);

  const palette = {
    transparent: [0, 0, 0, 0],
    catScarf: [165, 42, 58, 255]
  };

  // Row 1: Cat Growth Stages (5 columns)
  const catCols = [
    { name: "Kitten", desc: "0 - 50", sprite: CAT_SPRITES.SLEEP, variant: "tabby", x: 64, y: 55 },
    {
      name: "Young",
      desc: "51 - 250",
      sprite: CAT_SPRITES.WALK_0,
      variant: "ginger",
      x: 192,
      y: 55
    },
    {
      name: "Adult",
      desc: "251 - 1,000",
      sprite: CAT_SPRITES.IDLE,
      variant: "ginger",
      x: 320,
      y: 55
    },
    {
      name: "Pro",
      desc: "1,001 - 2,500",
      sprite: CAT_SPRITES.PLAY,
      variant: "midnight",
      x: 448,
      y: 55
    },
    {
      name: "Master",
      desc: "2,501+",
      sprite: CAT_SPRITES.IDLE,
      variant: "ginger",
      crown: true,
      x: 576,
      y: 55
    }
  ];

  for (const c of catCols) {
    const colorMap = getCatColorMap(c.variant, palette);
    blitSprite(buffer, W, H, c.sprite, colorMap, c.x - 32, c.y - 32, { scale: 2 });
    if (c.crown) {
      // Golden crown on master cat head
      fillRect(buffer, W, H, c.x - 12, c.y - 40, 24, 4, [249, 199, 79, 255]);
      fillRect(buffer, W, H, c.x - 12, c.y - 46, 6, 6, [249, 199, 79, 255]);
      fillRect(buffer, W, H, c.x - 3, c.y - 48, 6, 8, [249, 199, 79, 255]);
      fillRect(buffer, W, H, c.x + 6, c.y - 46, 6, 6, [249, 199, 79, 255]);
      fillRect(buffer, W, H, c.x - 2, c.y - 42, 4, 4, [217, 119, 6, 255]); // ruby
    }
  }

  // Row 2: Mouse Consistency Tiers (5 columns)
  const mouseCols = [
    {
      name: "Newbie",
      desc: "0 - 15",
      sprite: MOUSE_SPRITES.IDLE,
      tier: "NEWBIE",
      variant: "field_mouse",
      x: 64,
      y: 175
    },
    {
      name: "Regular",
      desc: "16 - 50",
      sprite: MOUSE_SPRITES.WALK_0,
      tier: "REGULAR",
      variant: "companion",
      x: 192,
      y: 175
    },
    {
      name: "Consistent",
      desc: "51 - 150",
      sprite: MOUSE_SPRITES.COLLECT,
      tier: "CONSISTENT",
      variant: "companion",
      x: 320,
      y: 175
    },
    {
      name: "Dedicated",
      desc: "151 - 300",
      sprite: MOUSE_SPRITES.WORK,
      tier: "DEDICATED",
      variant: "companion",
      x: 448,
      y: 175
    },
    {
      name: "Streaker",
      desc: "301+",
      sprite: MOUSE_SPRITES.CHEER,
      tier: "STREAKER",
      variant: "companion",
      crown: true,
      x: 576,
      y: 175
    }
  ];

  for (const m of mouseCols) {
    const colorMap = getMouseColorMap(m.tier, m.variant, palette);
    blitSprite(buffer, W, H, m.sprite, colorMap, m.x - 24, m.y - 24, { scale: 2 });
    if (m.crown) {
      // Golden crown on streaker mouse head
      fillRect(buffer, W, H, m.x - 8, m.y - 32, 16, 4, [249, 199, 79, 255]);
      fillRect(buffer, W, H, m.x - 8, m.y - 38, 4, 6, [249, 199, 79, 255]);
      fillRect(buffer, W, H, m.x - 2, m.y - 40, 4, 8, [249, 199, 79, 255]);
      fillRect(buffer, W, H, m.x + 4, m.y - 38, 4, 6, [249, 199, 79, 255]);
    }
  }

  const png = new PNG({ width: W, height: H });
  png.data = Buffer.from(buffer);
  fs.writeFileSync(outputPath, PNG.sync.write(png));
  console.log(`Generated ${outputPath} successfully.`);
}

if (process.argv[1]?.endsWith("generate-showcase.js")) {
  generateShowcase();
}
