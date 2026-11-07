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
  Y = cheese yellow
*/

export const MOUSE_SPRITES = {
  // Curious exploring & sniffing
  EXPLORING: [
    "..........",
    "...B.B....",
    "..BPMPM...",
    ".BMMMMMB..",
    "BMMMMMMMB.",
    ".BMMMMMMMT",
    "..BB.BB..T",
    ".........T"
  ],

  // Running scamper frame 0
  RUNNING_0: [
    "..........",
    "....B.B...",
    "..BMPMB...",
    ".BMMMMMB..",
    "BMMMMMMMB.",
    "..BMMMMMMT",
    ".BB..BB..T",
    ".........."
  ],

  // Running scamper frame 1
  RUNNING_1: [
    "..........",
    "....B.B...",
    "..BMPMB...",
    "BMMMMMMMB.",
    ".BMMMMMMMT",
    "..BMMMMMBT",
    "..BB..BB..",
    ".........."
  ],

  // Upright observing the cat alertly
  OBSERVING_CAT: [
    "....B.B...",
    "...BPMPM..",
    "...BMMMB..",
    "...BMMMB..",
    "..BMMMMMB.",
    "..BMMMMMT.",
    "...BB.BBT.",
    "........T."
  ],

  // Collecting & nibbling cheese
  COLLECTING_CHEESE: [
    "..........",
    "...B.B....",
    "..BPMPM...",
    ".BMMMMMB..",
    "BMMMYYMMB.",
    ".BMMYYMMMT",
    "..BB.BB..T",
    ".........T"
  ],

  // Sleeping curled up bean
  SLEEPING: [
    "..........",
    "..........",
    "..........",
    "....B.B...",
    "...BPMPMB.",
    "..BMMMMMMB",
    "...BBBBBBT",
    "........T."
  ],

  // Peeking from hole / hiding
  HIDING: [
    "..........",
    "..........",
    "..........",
    "....B.B...",
    "...BPMPM..",
    "..BMMMMMB.",
    "...BBBBB..",
    ".........."
  ]
};

// Aliases for compatibility
MOUSE_SPRITES.FORAGING = MOUSE_SPRITES.EXPLORING;
MOUSE_SPRITES.DARTING_0 = MOUSE_SPRITES.RUNNING_0;
MOUSE_SPRITES.DARTING_1 = MOUSE_SPRITES.RUNNING_1;
MOUSE_SPRITES.TAUNTING = MOUSE_SPRITES.OBSERVING_CAT;

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
    T: [190, 140, 150, 255], // Tail pink-grey
    Y: palette.cheeseYellow || [255, 205, 45, 255]
  };
}
