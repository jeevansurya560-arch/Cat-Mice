/**
 * @file Modern pixel-art Environmental backdrop and prop rasterizer.
 * Renders an overhead, top-down (90° bird's-eye view) storybook garden map:
 * lush lawn terrain, winding cobblestone pathway with carved Octocat stone medallion,
 * crystal-clear garden pond with lily pads and swimming fish, overhead tree canopies,
 * warm garden lantern post, top-down mouse burrow, ceramic fish bowl, cheese, and wool ball.
 */

import { fillRect, setPixel } from "./canvas.js";
import { fillCircle, drawBorder } from "./geometry.js";

/**
 * Draws the top-down garden landscape: grass terrain, stone path, pond, trees, and lantern.
 *
 * @param {Uint8ClampedArray} buffer
 * @param {number} width
 * @param {number} height
 * @param {Record<string, [number, number, number, number]>} palette
 */
export function renderBackdrop(buffer, width, height, palette) {
  // 1. Lush Green Grass Lawn (Base Top-Down Terrain)
  const grassBase = [46, 104, 52, 255];
  const grassLight = [54, 118, 62, 255];
  const grassDark = [38, 88, 44, 255];

  fillRect(buffer, width, height, 0, 0, width, height, grassBase);

  // Procedural grass texture tufts (subtle top-down dither)
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const hash = ((x * 37) ^ (y * 73)) % 17;
      if (hash === 1 || hash === 5) {
        setPixel(buffer, width, height, x, y, grassLight);
        setPixel(buffer, width, height, x + 1, y, grassLight);
      } else if (hash === 9) {
        setPixel(buffer, width, height, x, y, grassDark);
      }
    }
  }

  // Scattered tiny wildflowers (buttercups, forget-me-nots, daisies)
  const flowers = [
    [25, 45, [255, 220, 75, 255]],
    [35, 105, [255, 185, 205, 255]],
    [75, 25, [140, 200, 255, 255]],
    [95, 110, [255, 220, 75, 255]],
    [135, 20, [255, 255, 240, 255]],
    [155, 100, [140, 200, 255, 255]],
    [175, 15, [255, 185, 205, 255]],
    [195, 112, [255, 220, 75, 255]],
    [225, 45, [255, 255, 240, 255]],
    [110, 115, [255, 185, 205, 255]]
  ];
  for (const [fx, fy, fColor] of flowers) {
    if (fx < width && fy < height) {
      setPixel(buffer, width, height, fx, fy, fColor);
      setPixel(buffer, width, height, fx + 1, fy, fColor);
      setPixel(buffer, width, height, fx, fy + 1, fColor);
      setPixel(buffer, width, height, fx - 1, fy, [255, 250, 180, 255]); // center dot
    }
  }

  // 2. Top-Down Winding Cobblestone Pathway
  // Path flows from top center (x: 120, y: 0) down through center courtyard (x: 115, y: 58) to right (x: 205, y: 85)
  const pathBase = [85, 96, 112, 255];
  const stoneLight = [120, 132, 148, 255];
  const stoneDark = [58, 66, 78, 255];

  // Draw garden path corridor
  const pathWaypoints = [
    [120, 0, 14],
    [120, 12, 15],
    [118, 24, 16],
    [116, 36, 18],
    [115, 48, 20],
    [115, 60, 22],
    [125, 70, 18],
    [142, 75, 16],
    [160, 78, 16],
    [180, 80, 16],
    [200, 82, 15],
    [218, 84, 14]
  ];

  for (const [px, py, pr] of pathWaypoints) {
    fillCircle(buffer, width, height, px, py, pr, pathBase);
  }

  // Place rounded cobblestone pavers on the pathway
  for (const [px, py, pr] of pathWaypoints) {
    const numStones = 3;
    for (let s = 0; s < numStones; s++) {
      const angle = (s * Math.PI * 2) / numStones;
      const dist = pr * 0.45;
      const sx = Math.round(px + Math.cos(angle) * dist);
      const sy = Math.round(py + Math.sin(angle) * dist);
      fillCircle(buffer, width, height, sx, sy, 3, stoneLight);
      drawBorder(buffer, width, height, sx - 2, sy - 2, 5, 5, 1, stoneDark);
    }
  }

  // Engraved GitHub Octocat Stone Medallion in Central Courtyard (x: 115, y: 58)
  const cx = 115;
  const cy = 58;
  fillCircle(buffer, width, height, cx, cy, 14, stoneDark);
  fillCircle(buffer, width, height, cx, cy, 12, pathBase);
  drawBorder(buffer, width, height, cx - 12, cy - 12, 24, 24, 1, stoneLight);

  // Carved Octocat Silhouette in Medallion
  const carveColor = [45, 52, 62, 255];
  const carveHighlight = [160, 175, 195, 255];
  // Ears
  setPixel(buffer, width, height, cx - 4, cy - 5, carveColor);
  setPixel(buffer, width, height, cx + 4, cy - 5, carveColor);
  // Head
  fillRect(buffer, width, height, cx - 4, cy - 4, 9, 7, carveColor);
  fillRect(buffer, width, height, cx - 5, cy - 3, 11, 5, carveColor);
  // Highlight edge
  setPixel(buffer, width, height, cx - 4, cy + 3, carveHighlight);
  setPixel(buffer, width, height, cx + 4, cy + 3, carveHighlight);

  // 3. Top-Down Circular/Oval Garden Pond (Left side: x: 50, y: 64)
  const pondX = 50;
  const pondY = 64;
  const pondRx = 28;
  const pondRy = 19;

  // River stone bank / pebble shoreline surrounding pond
  for (let dy = -pondRy - 3; dy <= pondRy + 3; dy++) {
    for (let dx = -pondRx - 3; dx <= pondRx + 3; dx++) {
      const d =
        (dx * dx) / ((pondRx + 3) * (pondRx + 3)) + (dy * dy) / ((pondRy + 3) * (pondRy + 3));
      if (d <= 1.0) {
        const stoneColor = (dx + dy) % 3 === 0 ? stoneLight : stoneDark;
        setPixel(buffer, width, height, pondX + dx, pondY + dy, stoneColor);
      }
    }
  }

  // Clear turquoise-blue water layers
  const waterDeep = [38, 88, 136, 255];
  const waterMid = [48, 116, 176, 255];
  const waterShallow = [72, 158, 222, 255];

  for (let dy = -pondRy; dy <= pondRy; dy++) {
    for (let dx = -pondRx; dx <= pondRx; dx++) {
      const d = (dx * dx) / (pondRx * pondRx) + (dy * dy) / (pondRy * pondRy);
      if (d <= 1.0) {
        const color = d > 0.7 ? waterShallow : d > 0.35 ? waterMid : waterDeep;
        setPixel(buffer, width, height, pondX + dx, pondY + dy, color);
      }
    }
  }

  // Water ripple highlights
  const ripples = [
    [pondX - 12, pondY - 6],
    [pondX + 8, pondY - 8],
    [pondX - 4, pondY + 5],
    [pondX + 10, pondY + 6]
  ];
  for (const [rx, ry] of ripples) {
    fillRect(buffer, width, height, rx, ry, 5, 1, [150, 225, 255, 200]);
    setPixel(buffer, width, height, rx + 1, ry - 1, [180, 240, 255, 160]);
  }

  // Water Lily Pad with pink blossom in pond
  const lilyX = pondX - 10;
  const lilyY = pondY + 4;
  fillCircle(buffer, width, height, lilyX, lilyY, 4, [45, 125, 55, 255]);
  setPixel(buffer, width, height, lilyX, lilyY, [28, 85, 38, 255]); // notch
  setPixel(buffer, width, height, lilyX - 1, lilyY - 1, [255, 170, 195, 255]); // flower
  setPixel(buffer, width, height, lilyX, lilyY - 2, [255, 250, 255, 255]);

  // Swimming fish inside pond (orange-gold koi)
  const fishX = pondX + 8;
  const fishY = pondY - 2;
  fillRect(buffer, width, height, fishX - 2, fishY, 6, 2, [245, 125, 45, 255]);
  fillRect(buffer, width, height, fishX, fishY - 1, 3, 4, [255, 165, 60, 255]);
  setPixel(buffer, width, height, fishX + 4, fishY, [230, 85, 30, 255]); // tail
  setPixel(buffer, width, height, fishX - 3, fishY, [30, 40, 60, 255]); // eye

  // 4. Top-Down Overhead Tree Canopies
  // Top-left cherry tree canopy
  const t1x = 18;
  const t1y = 12;
  const t1r = 24;
  fillCircle(buffer, width, height, t1x, t1y, t1r + 2, [28, 62, 32, 255]);
  fillCircle(buffer, width, height, t1x, t1y, t1r, [42, 98, 48, 255]);
  fillCircle(buffer, width, height, t1x - 3, t1y - 3, t1r - 6, [62, 138, 70, 255]);
  fillCircle(buffer, width, height, t1x - 6, t1y - 6, t1r - 12, [82, 172, 92, 255]);

  // Cherry blossoms on canopy
  const blossomPink = [255, 172, 195, 255];
  const blossomDeep = [235, 125, 155, 255];
  for (let b = 0; b < 10; b++) {
    const bx = t1x - 12 + ((b * 19) % 24);
    const by = t1y - 12 + ((b * 23) % 24);
    setPixel(buffer, width, height, bx, by, blossomPink);
    setPixel(buffer, width, height, bx + 1, by, blossomDeep);
  }

  // Top-right oak canopy
  const t2x = 224;
  const t2y = 12;
  const t2r = 20;
  fillCircle(buffer, width, height, t2x, t2y, t2r + 2, [28, 62, 32, 255]);
  fillCircle(buffer, width, height, t2x, t2y, t2r, [38, 90, 44, 255]);
  fillCircle(buffer, width, height, t2x - 3, t2y - 3, t2r - 6, [56, 126, 64, 255]);

  // 5. Top-Down Garden Lantern Post (x: 185, y: 26)
  const lx = 185;
  const ly = 26;
  // Wooden post base
  fillRect(buffer, width, height, lx - 2, ly - 2, 4, 4, [85, 52, 30, 255]);
  // Brass cap
  fillCircle(buffer, width, height, lx, ly, 3, [180, 130, 45, 255]);
  // Glowing core
  fillRect(buffer, width, height, lx - 1, ly - 1, 2, 2, [255, 245, 180, 255]);

  // Soft Ambient Golden Lantern Glow (top-down radial light cast)
  const glowR = 36;
  for (let dy = -glowR; dy <= glowR; dy += 2) {
    for (let dx = -glowR; dx <= glowR; dx += 2) {
      const d = Math.hypot(dx, dy);
      if (d <= glowR) {
        const alpha = Math.round((1 - d / glowR) * 32);
        setPixel(buffer, width, height, lx + dx, ly + dy, [255, 220, 110, alpha]);
      }
    }
  }

  // 6. Primary & Secondary Language Accent Frame Accents
  drawBorder(
    buffer,
    width,
    height,
    1,
    1,
    width - 2,
    height - 2,
    1,
    palette.surfaceBorder || [48, 54, 65, 255]
  );
  fillRect(buffer, width, height, 1, 1, 8, 1, palette.primaryAccent);
  fillRect(buffer, width, height, 1, 1, 1, 8, palette.primaryAccent);
  fillRect(buffer, width, height, width - 9, 1, 8, 1, palette.primaryAccent);
  fillRect(buffer, width, height, width - 2, 1, 1, 8, palette.primaryAccent);
}

/**
 * Draws top-down pixel-art props (ceramic fish dish, fish bones, cheese wedge, wool ball, mouse burrow).
 *
 * @param {Uint8ClampedArray} buffer
 * @param {number} width
 * @param {number} height
 * @param {object} props - World props object.
 * @param {Record<string, [number, number, number, number]>} [_palette]
 */
export function renderProps(buffer, width, height, props, _palette) {
  if (!props) return;

  // 1. Top-Down Mouse Burrow / Hole (Right side lawn)
  const hole = props.mouseHole || props.burrow;
  if (hole) {
    const hx = Math.round(hole.x);
    const hy = Math.round(hole.y);

    // Earthen mound / stone circle ring
    fillCircle(buffer, width, height, hx, hy, 9, [75, 52, 34, 255]);
    fillCircle(buffer, width, height, hx, hy, 7, [95, 72, 48, 255]);

    // Cozy dark circular burrow entry
    fillCircle(buffer, width, height, hx, hy, 5, [18, 16, 24, 255]);
    fillCircle(buffer, width, height, hx + 1, hy + 1, 3, [10, 8, 14, 255]);

    // Small stone threshold pebbles around opening
    setPixel(buffer, width, height, hx - 6, hy - 2, [125, 135, 148, 255]);
    setPixel(buffer, width, height, hx + 6, hy - 1, [125, 135, 148, 255]);
    setPixel(buffer, width, height, hx - 2, hy + 6, [125, 135, 148, 255]);
    setPixel(buffer, width, height, hx + 3, hy + 6, [125, 135, 148, 255]);
  }

  // 2. Ceramic Blue Fish Dish & Fresh Fish / Fish Bones
  if (props.fish) {
    const fx = Math.round(props.fish.x);
    const fy = Math.round(props.fish.y);

    // Ceramic ocean-blue circular serving bowl (top-down view)
    fillCircle(buffer, width, height, fx, fy, 8, [35, 75, 120, 255]);
    fillCircle(buffer, width, height, fx, fy, 7, [55, 120, 185, 255]);
    fillCircle(buffer, width, height, fx, fy, 5, [25, 55, 95, 255]); // inner basin
    fillCircle(buffer, width, height, fx - 2, fy - 2, 2, [85, 165, 235, 255]); // highlight

    if (!props.fish.consumed) {
      // Fresh delicious silver-blue fish lying in dish
      const fishBlue = [75, 160, 225, 255];
      const fishSilver = [215, 235, 255, 255];
      const fishDark = [25, 55, 90, 255];

      fillRect(buffer, width, height, fx - 4, fy - 1, 8, 3, fishBlue);
      fillRect(buffer, width, height, fx - 2, fy, 5, 1, fishSilver);
      // Tail & eye
      fillRect(buffer, width, height, fx - 5, fy - 1, 2, 3, fishBlue);
      setPixel(buffer, width, height, fx + 3, fy, fishDark);
    } else {
      // Clean neat fish bones skeleton
      const bone = [245, 248, 252, 255];
      const boneShadow = [170, 178, 190, 255];

      // Central spine line
      fillRect(buffer, width, height, fx - 4, fy, 8, 1, bone);
      // Ribs
      setPixel(buffer, width, height, fx - 2, fy - 1, bone);
      setPixel(buffer, width, height, fx - 2, fy + 1, boneShadow);
      setPixel(buffer, width, height, fx, fy - 1, bone);
      setPixel(buffer, width, height, fx, fy + 1, boneShadow);
      setPixel(buffer, width, height, fx + 2, fy - 1, bone);
      setPixel(buffer, width, height, fx + 2, fy + 1, boneShadow);
      // Head skull
      fillRect(buffer, width, height, fx + 3, fy - 1, 2, 3, bone);
      setPixel(buffer, width, height, fx + 3, fy, [40, 45, 55, 255]);
    }
  }

  // 3. Golden Swiss Cheese Wedge (Top-down view)
  if (props.cheese && !props.cheese.collected) {
    const cx = Math.round(props.cheese.x);
    const cy = Math.round(props.cheese.y);
    const goldYellow = [255, 210, 50, 255];
    const cheeseHole = [215, 155, 25, 255];
    const outline = [160, 110, 15, 255];

    // Triangular wedge with top-down depth
    fillRect(buffer, width, height, cx - 4, cy - 3, 9, 7, goldYellow);
    fillRect(buffer, width, height, cx - 2, cy - 4, 6, 2, [255, 235, 105, 255]); // highlight
    drawBorder(buffer, width, height, cx - 4, cy - 3, 9, 7, 1, outline);

    // Swiss holes
    setPixel(buffer, width, height, cx - 1, cy - 1, cheeseHole);
    setPixel(buffer, width, height, cx + 2, cy + 1, cheeseHole);
  }

  // 4. Textured Red Wool Ball with Curled Loose Yarn (Top-down view)
  const wool = props.woolBall || props.yarnBall;
  if (wool && wool.active !== false) {
    const wx = Math.round(wool.x);
    const wy = Math.round(wool.y);

    // Textured sphere
    fillCircle(buffer, width, height, wx, wy, 5, [215, 45, 55, 255]);
    fillCircle(buffer, width, height, wx - 1, wy - 1, 2, [255, 105, 115, 255]);
    // Woven yarn lines across ball
    fillRect(buffer, width, height, wx - 3, wy, 6, 1, [170, 30, 40, 255]);
    fillRect(buffer, width, height, wx, wy - 3, 1, 6, [170, 30, 40, 255]);

    // Curled loose yarn thread winding across grass
    fillRect(buffer, width, height, wx + 4, wy + 2, 3, 1, [215, 45, 55, 255]);
    fillRect(buffer, width, height, wx + 7, wy + 3, 3, 1, [215, 45, 55, 255]);
    setPixel(buffer, width, height, wx + 10, wy + 2, [215, 45, 55, 255]);
  }
}
