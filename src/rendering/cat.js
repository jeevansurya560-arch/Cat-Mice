/**
 * @file Cat pixel-art sprite matrices and variant color resolution.
 * Provides compact 16x16 pixel sprites for all cat behaviors and coat variants.
 */

/*
  Legend:
  . = transparent
  B = dark outline / markings
  O = primary coat color
  o = secondary coat color
  W = white chest / paws
  E = eye color
  P = nose / ear pink
*/

export const CAT_SPRITES = {
  // Curled up sleeping loaf
  SLEEPING: [
    "................",
    "................",
    "................",
    "................",
    "................",
    "......BB..BB....",
    ".....BOOBBOOB...",
    "....BOOPPBOOOB..",
    "...BOOBBBBBBBOB.",
    "..BOOOOOOOOOOOB.",
    "..BOOOOOOOOOOOB.",
    "..BOOOWWWOOOOB..",
    "...BBOWWWOOBB...",
    "....BBBBBBB.....",
    "................",
    "................"
  ],

  // Walking cycle frame 0
  PROWLING_0: [
    "................",
    "................",
    "....B....B......",
    "...BOB..BOB.....",
    "...BOPBBOPOB....",
    "...BOEBOOEOB....",
    "...BOOBOOOBB....",
    "...BOOOOOOOOB...",
    "..BBOOOOOOOOB...",
    ".BOOOOOOOOOOOBB.",
    ".BOOWOOOOOWOOOB.",
    "..BWWBB..BWWBB..",
    "..BB......BB....",
    "................",
    "................",
    "................"
  ],

  // Walking cycle frame 1
  PROWLING_1: [
    "................",
    "................",
    "....B....B......",
    "...BOB..BOB.....",
    "...BOPBBOPOB....",
    "...BOEBOOEOB....",
    "...BOOBOOOBB....",
    "...BOOOOOOOOB...",
    "..BBOOOOOOOOB...",
    ".BOOOOOOOOOOOBB.",
    ".BOOWOOOOOWOOOB.",
    "...BWWBB.BWWBB..",
    "....BB....BB....",
    "................",
    "................",
    "................"
  ],

  // Low crouch stalking
  STALKING: [
    "................",
    "................",
    "................",
    "................",
    "................",
    "....B...B.......",
    "...BOB.BOB......",
    "..BOEBOOEOBB....",
    ".BOOOOOOOOOOOBB.",
    "BBOOOOOOOOOOOOOB",
    ".BOOWOOOOOWOOOB.",
    "..BWWBB.BWWBB...",
    "...BB....BB.....",
    "................",
    "................",
    "................"
  ],

  // Leaping pounce
  POUNCING: [
    "................",
    "...B....B.......",
    "..BOB..BOB......",
    ".BOEBOOEOB......",
    ".BOOOOOOOBB.....",
    "..BOOOOOOOOOBB..",
    "...BOOOOOOOOOOBB",
    "...BWWBOOOOOOOOB",
    "..BWWBB.BOOOOOOB",
    "...BB....BWWBB..",
    "..........BB....",
    "................",
    "................",
    "................",
    "................",
    "................"
  ],

  // Sitting upright licking paw
  GROOMING: [
    "................",
    "....B...B.......",
    "...BOB.BOB......",
    "...BOPBPOB......",
    "...BOEBOEB......",
    "...BOOOOOB......",
    "...BOOOWWWB.....",
    "...BOOBWWWB.....",
    "..BOOOOOOOOB....",
    "..BOOOOOOOOB....",
    "..BOOWOOOOBB....",
    "...BWWBOOBB.....",
    "....BB..BB......",
    "................",
    "................",
    "................"
  ]
};

/**
 * Resolves color palette mapping for a cat coat variant.
 *
 * @param {string} variant - "tabby" | "calico" | "tuxedo" | "ginger" | "midnight".
 * @param {Record<string, [number, number, number, number]>} palette
 * @returns {Record<string, [number, number, number, number]>}
 */
export function getCatColorMap(variant, palette) {
  let primary = palette.catTabbyLight;
  let secondary = palette.catTabbyDark;
  let white = palette.catTuxedoWhite;
  let eye = palette.catEyeGreen;

  switch (variant) {
    case "calico":
      primary = palette.catCalicoOrange;
      secondary = palette.catTabbyDark;
      white = palette.catCalicoWhite;
      eye = palette.catEyeGold;
      break;
    case "tuxedo":
      primary = palette.catTuxedoBlack;
      secondary = [40, 40, 45, 255];
      white = palette.catTuxedoWhite;
      eye = palette.catEyeGreen;
      break;
    case "ginger":
      primary = palette.catGingerLight;
      secondary = palette.catGingerDark;
      white = palette.catCalicoWhite;
      eye = palette.catEyeGold;
      break;
    case "midnight":
      primary = palette.catMidnight;
      secondary = [30, 30, 40, 255];
      white = palette.catMidnight;
      eye = palette.catEyeGold;
      break;
    default: // tabby
      primary = palette.catTabbyLight;
      secondary = palette.catTabbyDark;
      white = palette.catCalicoWhite;
      eye = palette.catEyeGreen;
      break;
  }

  return {
    ".": palette.transparent,
    B: [15, 15, 20, 255], // Dark outline
    O: primary,
    o: secondary,
    W: white,
    E: eye,
    P: palette.catNosePink
  };
}
