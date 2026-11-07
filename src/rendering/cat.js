/**
 * @file Cat pixel-art sprite matrices and variant color resolution.
 * Provides cohesive 16x16 pixel sprites for all cat behaviors and coat variants.
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
  WALKING_0: [
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
    "................",
    "................"
  ],

  // Walking cycle frame 1
  WALKING_1: [
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
    "................",
    "................"
  ],

  // Exploring / curious sniffing
  EXPLORING: [
    "................",
    "................",
    "....B...B.......",
    "...BOB.BOB......",
    "...BOPBBOPOB....",
    "..BOEBOOEOBB....",
    "..BOOBOOOBB.....",
    "..BOOOOOOOOBB...",
    ".BOOOOOOOOOOOBB.",
    ".BOOWOOOOOWOOOB.",
    "..BWWBB.BWWBB...",
    "...BB....BB.....",
    "................",
    "................",
    "................",
    "................"
  ],

  // Eating fish happily
  EATING_FISH: [
    "................",
    "................",
    "................",
    "................",
    "....B...B.......",
    "...BOB.BOB......",
    "..BOBBOOBB......",
    "..BOPBOEOB.BB...",
    "..BOOOOOOOBOB...",
    ".BOOOOOOOOOOOBB.",
    ".BOOWOOOOOWOOOB.",
    "..BWWBB.BWWBB...",
    "...BB....BB.....",
    "................",
    "................",
    "................"
  ],

  // Playing with wool ball (batting paw)
  PLAYING_WOOL: [
    "................",
    "................",
    "....B....B......",
    "...BOB..BOB.....",
    "...BOPBBOPOB....",
    "...BOEBOOEOB.B..",
    "...BOOBOOOBB.WB.",
    "..BBOOOOOOOOBBB.",
    ".BOOOOOOOOOOOB..",
    ".BOOWOOOOOWOOOB.",
    "..BWWBB...BWWBB.",
    "..BB.......BB...",
    "................",
    "................",
    "................",
    "................"
  ],

  // Sitting upright grooming paw
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

// Aliases for compatibility
CAT_SPRITES.PROWLING_0 = CAT_SPRITES.WALKING_0;
CAT_SPRITES.PROWLING_1 = CAT_SPRITES.WALKING_1;
CAT_SPRITES.STALKING = CAT_SPRITES.EXPLORING;
CAT_SPRITES.POUNCING = CAT_SPRITES.PLAYING_WOOL;

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
      primary = palette.catMidnight || [36, 38, 48, 255];
      secondary = [22, 24, 32, 255];
      white = palette.catMidnight || [36, 38, 48, 255];
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
