/**
 * @file Modern pixel-art Environmental backdrop and prop rasterizer.
 * Renders a lush storybook garden & cottage scene: atmospheric dusk sky,
 * wooden signboard with carved Octocat emblem, hanging warm brass lantern with glowing light cast,
 * mossy stone ledge with stone bricks, arched mouse hole, fresh fish bowl, cheese, and yarn ball.
 */

import { fillRect, setPixel } from "./canvas.js";
import { fillCircle, drawBorder } from "./geometry.js";

/**
 * Draws the atmospheric background, foliage, hanging lantern, and mossy stone ledge.
 *
 * @param {Uint8ClampedArray} buffer
 * @param {number} width
 * @param {number} height
 * @param {Record<string, [number, number, number, number]>} palette
 */
export function renderBackdrop(buffer, width, height, palette) {
  // 1. Twilight / Enchanted evening sky gradient
  const skyHeight = 70;
  for (let y = 0; y < skyHeight; y++) {
    const t = y / skyHeight;
    // Dark twilight blue-indigo gradient
    const r = Math.round(18 + t * 14);
    const g = Math.round(22 + t * 18);
    const b = Math.round(34 + t * 24);
    fillRect(buffer, width, height, 0, y, width, 1, [r, g, b, 255]);
  }

  // Soft distant stars/fireflies in the evening sky
  const stars = [
    [75, 14],
    [115, 22],
    [148, 10],
    [178, 26],
    [92, 38],
    [132, 44]
  ];
  for (const [sx, sy] of stars) {
    setPixel(buffer, width, height, sx, sy, [255, 255, 220, 180]);
  }

  // 2. Hanging canopy foliage & cherry blossom petals at top
  const canopyGreen = [52, 94, 58, 255];
  const canopyLight = [75, 138, 82, 255];
  const canopyDark = [32, 60, 38, 255];
  const blossomPink = [255, 172, 190, 255];
  const blossomDeep = [235, 128, 155, 255];

  // Top leaf clusters
  for (let x = 0; x < width; x += 12) {
    const wave = Math.sin(x * 0.08) * 4;
    const lh = Math.round(8 + wave);
    fillRect(buffer, width, height, x, 0, 12, lh, canopyDark);
    fillRect(buffer, width, height, x + 2, 0, 8, lh - 2, canopyGreen);
    fillRect(buffer, width, height, x + 4, 0, 4, lh - 4, canopyLight);
  }

  // Left top foliage & cherry blossoms
  for (let y = 0; y < 35; y += 4) {
    const w = Math.round(28 - y * 0.6);
    fillRect(buffer, width, height, 0, y, w, 4, canopyGreen);
    fillRect(buffer, width, height, 0, y + 1, w - 3, 2, canopyLight);
    // Cherry blossoms
    if (y % 8 === 0) {
      setPixel(buffer, width, height, w - 2, y + 2, blossomPink);
      setPixel(buffer, width, height, w - 1, y + 1, blossomDeep);
    }
  }

  // 3. Wooden Signboard with Carved GitHub Octocat (Left Side)
  const signX = 14;
  const signY = 20;
  const signW = 34;
  const signH = 26;

  // Wooden hanging posts & border
  fillRect(buffer, width, height, signX - 2, 0, 3, signY, [80, 50, 30, 255]);
  fillRect(buffer, width, height, signX + signW - 1, 0, 3, signY, [80, 50, 30, 255]);

  // Signboard wood planks
  fillRect(buffer, width, height, signX, signY, signW, signH, [130, 85, 52, 255]);
  fillRect(buffer, width, height, signX + 2, signY + 2, signW - 4, signH - 4, [155, 105, 65, 255]);
  drawBorder(buffer, width, height, signX, signY, signW, signH, 1, [70, 42, 24, 255]);
  // Wood plank seam
  fillRect(
    buffer,
    width,
    height,
    signX + 1,
    signY + Math.round(signH / 2),
    signW - 2,
    1,
    [105, 68, 40, 255]
  );

  // Carved GitHub Octocat Silhouette on wood sign
  const cx = signX + Math.round(signW / 2);
  const cy = signY + Math.round(signH / 2);
  const carveColor = [70, 40, 22, 255];
  const carveLight = [185, 130, 85, 255];

  // Head and ears
  setPixel(buffer, width, height, cx - 4, cy - 5, carveColor);
  setPixel(buffer, width, height, cx + 4, cy - 5, carveColor);
  fillRect(buffer, width, height, cx - 4, cy - 4, 9, 7, carveColor);
  fillRect(buffer, width, height, cx - 5, cy - 3, 11, 5, carveColor);
  // Highlights around carving
  setPixel(buffer, width, height, cx - 4, cy + 3, carveLight);
  setPixel(buffer, width, height, cx + 4, cy + 3, carveLight);

  // 4. Hanging Brass Lantern with Warm Light Glow (Right Side)
  const lanX = 205;
  const lanY = 14;

  // Hanging chain from roof
  fillRect(buffer, width, height, lanX - 1, 0, 2, lanY, [50, 45, 55, 255]);

  // Lantern cap (brass)
  fillRect(buffer, width, height, lanX - 7, lanY, 14, 3, [180, 130, 45, 255]);
  fillRect(buffer, width, height, lanX - 5, lanY - 2, 10, 2, [140, 100, 35, 255]);

  // Golden glowing glass body
  fillRect(buffer, width, height, lanX - 6, lanY + 3, 12, 12, [255, 215, 80, 255]);
  fillRect(buffer, width, height, lanX - 4, lanY + 5, 8, 8, [255, 250, 210, 255]);
  // Lantern frame struts
  drawBorder(buffer, width, height, lanX - 6, lanY + 3, 12, 12, 1, [110, 75, 25, 255]);
  fillRect(buffer, width, height, lanX - 1, lanY + 3, 2, 12, [110, 75, 25, 255]);

  // Lantern bottom
  fillRect(buffer, width, height, lanX - 7, lanY + 15, 14, 2, [180, 130, 45, 255]);
  fillRect(buffer, width, height, lanX - 2, lanY + 17, 4, 3, [140, 100, 35, 255]);

  // Soft Ambient Golden Light Cast (radial glow over the ledge)
  const glowR = 48;
  for (let dy = -glowR; dy <= glowR; dy += 2) {
    for (let dx = -glowR; dx <= glowR; dx += 2) {
      const d = Math.hypot(dx, dy);
      if (d <= glowR) {
        const alpha = Math.round((1 - d / glowR) * 38);
        setPixel(buffer, width, height, lanX + dx, lanY + 8 + dy, [255, 220, 120, alpha]);
      }
    }
  }

  // 5. Mossy Stone Ledge & Foundation (Ground & Walking Surface)
  const groundY = 70;

  // Ledge top stone paver pathway (y: 70 to 78)
  const paverHeight = 8;
  fillRect(buffer, width, height, 0, groundY, width, paverHeight, [75, 88, 108, 255]);
  fillRect(buffer, width, height, 0, groundY, width, 1, [105, 122, 148, 255]); // top highlight line

  // Stone cobblestone tile seams & moss patches
  for (let x = 0; x < width; x += 24) {
    fillRect(buffer, width, height, x, groundY, 1, paverHeight, [48, 56, 70, 255]);
    // Moss clusters on stone
    if (x % 48 === 0) {
      fillRect(buffer, width, height, x + 3, groundY + 1, 6, 2, [65, 120, 72, 255]);
      setPixel(buffer, width, height, x + 5, groundY, [95, 165, 105, 255]);
    }
  }

  // Front stone wall foundation (y: 78 to height)
  for (let y = groundY + paverHeight; y < height; y++) {
    const t = (y - 78) / (height - 78);
    const r = Math.round(48 - t * 14);
    const g = Math.round(56 - t * 15);
    const b = Math.round(70 - t * 18);
    fillRect(buffer, width, height, 0, y, width, 1, [r, g, b, 255]);
  }

  // Stone block grid mortar lines on wall face
  const blockW = 32;
  const blockH = 10;
  for (let row = 0; row < 5; row++) {
    const by = groundY + paverHeight + row * blockH;
    fillRect(buffer, width, height, 0, by, width, 1, [32, 38, 48, 255]);
    const xOff = row % 2 === 1 ? blockW / 2 : 0;
    for (let bx = xOff; bx < width; bx += blockW) {
      fillRect(buffer, width, height, Math.floor(bx), by, 1, blockH, [32, 38, 48, 255]);
    }
  }

  // Grass & wildflower tufts along the bottom ledge edge
  const tufts = [18, 55, 95, 140, 185];
  for (const tx of tufts) {
    fillRect(buffer, width, height, tx, groundY - 2, 2, 3, [70, 135, 78, 255]);
    setPixel(buffer, width, height, tx - 1, groundY - 1, [95, 168, 105, 255]);
    setPixel(buffer, width, height, tx + 2, groundY - 1, [95, 168, 105, 255]);
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
 * Draws modern pixel-art props (fresh blue fish dish, fish bones, cheese wedge, wool ball, arched mouse hole).
 *
 * @param {Uint8ClampedArray} buffer
 * @param {number} width
 * @param {number} height
 * @param {object} props - World props object.
 * @param {Record<string, [number, number, number, number]>} [_palette]
 */
export function renderProps(buffer, width, height, props, _palette) {
  if (!props) return;

  // 1. Arched Wooden Mouse Hole (Right Stone Wall)
  const hole = props.mouseHole || props.burrow;
  if (hole) {
    const hx = Math.round(hole.x);
    const hy = Math.round(hole.y);

    // Arched wooden frame
    fillRect(buffer, width, height, hx - 8, hy - 10, 16, 14, [75, 48, 30, 255]);
    fillCircle(buffer, width, height, hx, hy - 9, 8, [75, 48, 30, 255]);

    // Dark cozy hole interior
    fillRect(buffer, width, height, hx - 6, hy - 8, 12, 12, [18, 16, 24, 255]);
    fillCircle(buffer, width, height, hx, hy - 7, 6, [18, 16, 24, 255]);

    // Polished stone threshold step
    fillRect(buffer, width, height, hx - 9, hy + 3, 18, 2, [95, 108, 130, 255]);
    fillRect(buffer, width, height, hx - 10, hy + 5, 20, 2, [55, 64, 78, 255]);
  }

  // 2. Ceramic Blue Fish Dish & Fresh Fish / Fish Bones
  if (props.fish) {
    const fx = Math.round(props.fish.x);
    const fy = Math.round(props.fish.y);

    // Ceramic ocean-blue serving bowl/dish
    fillRect(buffer, width, height, fx - 10, fy + 2, 20, 4, [45, 95, 145, 255]);
    fillRect(buffer, width, height, fx - 8, fy + 1, 16, 2, [75, 145, 205, 255]);
    fillRect(buffer, width, height, fx - 11, fy + 3, 22, 1, [30, 65, 105, 255]);

    if (!props.fish.consumed) {
      // Fresh delicious silver-blue fish
      const fishBlue = [75, 160, 225, 255];
      const fishSilver = [215, 235, 255, 255];
      const fishDark = [25, 55, 90, 255];

      // Fish body
      fillRect(buffer, width, height, fx - 6, fy - 1, 12, 4, fishBlue);
      fillRect(buffer, width, height, fx - 4, fy, 8, 2, fishSilver);
      // Head & eye
      fillRect(buffer, width, height, fx + 5, fy, 2, 2, fishBlue);
      setPixel(buffer, width, height, fx + 5, fy, fishDark);
      // Fins
      fillRect(buffer, width, height, fx - 8, fy - 2, 2, 2, fishBlue); // tail top
      fillRect(buffer, width, height, fx - 8, fy + 2, 2, 2, fishBlue); // tail bottom
      setPixel(buffer, width, height, fx, fy - 2, fishBlue); // dorsal
    } else {
      // Clean neat fish bones skeleton
      const bone = [245, 248, 252, 255];
      const boneShadow = [170, 178, 190, 255];

      // Fish head skull with eye socket
      fillRect(buffer, width, height, fx + 4, fy - 1, 4, 4, bone);
      setPixel(buffer, width, height, fx + 5, fy, [40, 45, 55, 255]); // eye socket

      // Central spine line
      fillRect(buffer, width, height, fx - 6, fy + 1, 10, 1, bone);

      // Rib bones (top and bottom)
      for (let rx = fx - 4; rx <= fx + 2; rx += 2) {
        setPixel(buffer, width, height, rx, fy - 1, bone);
        setPixel(buffer, width, height, rx, fy + 3, boneShadow);
      }

      // Tail bone
      setPixel(buffer, width, height, fx - 7, fy, bone);
      setPixel(buffer, width, height, fx - 7, fy + 2, boneShadow);
    }
  }

  // 3. Golden Swiss Cheese Wedge
  if (props.cheese && !props.cheese.collected) {
    const cx = Math.round(props.cheese.x);
    const cy = Math.round(props.cheese.y);
    const goldYellow = [255, 210, 50, 255];
    const cheeseHole = [215, 160, 25, 255];
    const outline = [160, 110, 15, 255];

    // Triangular wedge with 3D depth
    fillRect(buffer, width, height, cx - 6, cy + 2, 12, 3, goldYellow);
    fillRect(buffer, width, height, cx - 3, cy - 1, 9, 3, goldYellow);
    fillRect(buffer, width, height, cx, cy - 3, 6, 2, [255, 230, 95, 255]); // top highlight
    drawBorder(buffer, width, height, cx - 6, cy - 3, 12, 8, 1, outline);

    // Cheese swiss holes
    setPixel(buffer, width, height, cx - 2, cy + 3, cheeseHole);
    setPixel(buffer, width, height, cx + 2, cy + 1, cheeseHole);
    setPixel(buffer, width, height, cx, cy, cheeseHole);
  }

  // 4. Textured Red Wool Ball with Curled Loose Yarn
  const wool = props.woolBall || props.yarnBall;
  if (wool && wool.active !== false) {
    const wx = Math.round(wool.x);
    const wy = Math.round(wool.y);

    // Textured sphere
    fillCircle(buffer, width, height, wx, wy, 6, [215, 45, 55, 255]);
    fillCircle(buffer, width, height, wx - 1, wy - 1, 3, [255, 105, 115, 255]);
    // Woven yarn lines across ball
    fillRect(buffer, width, height, wx - 4, wy - 1, 8, 1, [170, 30, 40, 255]);
    fillRect(buffer, width, height, wx - 1, wy - 4, 1, 8, [170, 30, 40, 255]);

    // Curled loose yarn thread winding across stone
    fillRect(buffer, width, height, wx + 5, wy + 3, 4, 1, [215, 45, 55, 255]);
    fillRect(buffer, width, height, wx + 9, wy + 4, 4, 1, [215, 45, 55, 255]);
    setPixel(buffer, width, height, wx + 13, wy + 3, [215, 45, 55, 255]);
  }
}
