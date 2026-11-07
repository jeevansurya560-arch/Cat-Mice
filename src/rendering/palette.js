/**
 * @file Palette generator and color resolution module.
 * Maps language theme accents into a cohesive retro 16-color pixel palette.
 */

/**
 * Converts a hex color string (#rrggbb) to RGBA components.
 *
 * @param {string} hex
 * @param {number} [alpha=255]
 * @returns {[number, number, number, number]}
 */
export function hexToRgba(hex, alpha = 255) {
  if (!hex || typeof hex !== "string" || !hex.startsWith("#")) {
    return [0, 0, 0, alpha];
  }
  const clean = hex.slice(1);
  const num = parseInt(
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean,
    16
  );
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return [r, g, b, alpha];
}

/**
 * Resolves full cohesive retro palette from theme spec.
 *
 * @param {object} themeSpec - Theme containing primaryAccent and secondaryAccent.
 * @returns {Record<string, [number, number, number, number]>}
 */
export function createPalette(themeSpec = {}) {
  const primaryRgba = hexToRgba(themeSpec.primaryAccent || "#58a6ff");
  const secondaryRgba = hexToRgba(themeSpec.secondaryAccent || "#3fb950");

  return {
    transparent: [0, 0, 0, 0],
    background: [13, 17, 23, 255], // GitHub Dark canvas
    surface: [22, 27, 34, 255], // Surface cards
    surfaceBorder: [48, 54, 61, 255], // Borders
    groundTileA: [24, 29, 36, 255], // Floor pattern A
    groundTileB: [29, 35, 43, 255], // Floor pattern B
    primaryAccent: primaryRgba,
    secondaryAccent: secondaryRgba,

    // Cat Coat Colors
    catTabbyDark: [90, 70, 50, 255],
    catTabbyLight: [180, 140, 100, 255],
    catCalicoOrange: [220, 110, 40, 255],
    catCalicoWhite: [240, 240, 240, 255],
    catTuxedoBlack: [25, 25, 28, 255],
    catTuxedoWhite: [245, 245, 245, 255],
    catGingerDark: [195, 75, 20, 255],
    catGingerLight: [240, 150, 60, 255],
    catMidnight: [36, 38, 48, 255],
    catEyeGreen: [80, 215, 90, 255],
    catEyeGold: [245, 200, 40, 255],
    catNosePink: [240, 130, 160, 255],

    // Mouse Colors
    mouseFurGrey: [140, 140, 145, 255],
    mouseFurDark: [95, 95, 100, 255],
    mouseEarPink: [235, 145, 165, 255],
    mouseNinjaDark: [45, 45, 55, 255],

    // Environmental Props & Items
    burrowHole: [10, 12, 16, 255],
    yarnRed: [230, 60, 60, 255],
    yarnHighlight: [255, 110, 110, 255],
    foodBowlGrey: [120, 130, 140, 255],
    foodMilkWhite: [240, 245, 255, 255],
    cheeseYellow: [255, 205, 45, 255],
    cheeseHole: [215, 160, 25, 255],
    fishBlue: [100, 175, 235, 255],
    fishSilver: [195, 215, 235, 255],
    fishBonesWhite: [235, 238, 242, 255],
    woodFloorA: [34, 40, 50, 255],
    woodFloorB: [39, 46, 57, 255],
    woodSeam: [22, 26, 33, 255]
  };
}
