/**
 * @file Mouse pixel-art sprite matrices and tier color resolution.
 * Provides compact 10x8 pixel sprites for mouse behaviors and agility tiers.
 */

/*
  Legend:
  . = transparent
  B = dark outline / eye
  M = primary fur color
  m = belly / highlight fur
  P = ear pink
  T = tail
*/

export const MOUSE_SPRITES = {
  // Sniffing and foraging
  FORAGING: [
    "..........",
    "...B.B....",
    "..BPMPM...",
    ".BMMMMMB..",
    "BMMMMMMMB.",
    ".BMMMMMMMT",
    "..BB.BB..T",
    ".........T"
  ],

  // Sprinting dart frame 0
  DARTING_0: [
    "..........",
    "....B.B...",
    "..BMPMB...",
    ".BMMMMMB..",
    "BMMMMMMMB.",
    "..BMMMMMMT",
    ".BB..BB..T",
    ".........."
  ],

  // Sprinting dart frame 1
  DARTING_1: [
    "..........",
    "....B.B...",
    "..BMPMB...",
    "BMMMMMMMB.",
    ".BMMMMMMMT",
    "..BMMMMMBT",
    "..BB..BB..",
    ".........."
  ],

  // Standing upright taunting
  TAUNTING: [
    "....B.B...",
    "...BPMPM..",
    "...BMMMB..",
    "...BMMMB..",
    "..BMMMMMB.",
    "..BMMMMMT.",
    "...BB.BBT.",
    "........T."
  ]
};

/**
 * Resolves color palette mapping for mouse tier and variant.
 *
 * @param {string} tier - "SCOUT" | "RUNNER" | "NINJA".
 * @param {string} [variant] - "field_mouse" | "dormouse" | "white_mouse".
 * @param {Record<string, [number, number, number, number]>} palette
 * @returns {Record<string, [number, number, number, number]>}
 */
export function getMouseColorMap(tier, variant, palette) {
  let fur = palette.mouseFurGrey;
  let highlight = [180, 180, 185, 255];
  let pink = palette.mouseEarPink;

  if (tier === "NINJA") {
    fur = palette.mouseNinjaDark;
    highlight = [80, 80, 95, 255];
  } else if (variant === "dormouse") {
    fur = [160, 120, 80, 255]; // Golden brown
    highlight = [200, 160, 110, 255];
  } else if (variant === "white_mouse") {
    fur = [245, 245, 250, 255];
    highlight = [255, 255, 255, 255];
    pink = [255, 160, 180, 255];
  }

  return {
    ".": palette.transparent,
    B: [20, 20, 25, 255],
    M: fur,
    m: highlight,
    P: pink,
    T: [190, 140, 150, 255] // Tail pink-grey
  };
}
