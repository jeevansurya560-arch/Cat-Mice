/**
 * @file Modern pixel-art Mouse sprites and tier color resolution.
 * Provides high-fidelity 24x24 chibi mouse animations with aviator goggles,
 * leather backpack, tiny scarf, big rounded ears, and laptop coding pose.
 */

/*
  Legend:
  . = transparent
  B = dark outline [45, 38, 55, 255]
  M = soft lavender fur [155, 150, 178, 255]
  m = lavender shadow [120, 114, 142, 255]
  C = lilac-cream cheeks & belly [228, 224, 240, 255]
  P = soft pink ears, nose, paws, tail [245, 168, 184, 255]
  p = deep inner ear pink [225, 130, 150, 255]
  G = aviator goggles brass rim [224, 172, 56, 255]
  g = goggles leather strap [80, 52, 35, 255]
  A = goggles sky blue glass [165, 216, 255, 255]
  S = tiny burgundy scarf [165, 42, 58, 255]
  s = scarf shadow [116, 24, 37, 255]
  X = leather backpack [140, 80, 40, 255]
  L = laptop slate body [42, 46, 56, 255]
  l = laptop white logo [255, 255, 255, 255]
  Y = golden cheese / gear [255, 205, 45, 255]
  E = cute eye dot [45, 38, 55, 255]
*/

export const MOUSE_SPRITES = {
  // Standing Idle with aviator goggles, backpack, and scarf
  IDLE: [
    "........................",
    "....BBBB........BBBB....",
    "...BPPPPB......BPPPPB...",
    "..BPppppPB....BPppppPB..",
    "..BPppppPB....BPppppPB..",
    "...BPPPPB..BB..BPPPPB...",
    "....BBBB.BBGGBB.BBBB....",
    "........BGGAAGGAB.......",
    "........BGGAAGGAB.......",
    ".......BgGGggGGgB.......",
    "......BMMMMMMMMMMB......",
    ".....BMMEBMMMMBEMMB.....",
    ".....BMMMBBPPBBMMMB.....",
    ".....BCCCCBPPBCCCCB.....",
    "......BCCCCCCCCCCB......",
    ".......BBSSSSSSBB.......",
    "......BXXBSSSSBXXB......",
    "......BXXBCCCCBXXB......",
    ".....BMXXBCCCCBMXXB.BB..",
    ".....BMMMBWWWWBMMPBPB...",
    ".....BMMMMWWWWMMMPB.....",
    "......BBBB.BB.BBBPPB....",
    "........BPB..BPB..PB....",
    ".........BB...BB........"
  ],

  // Walking cycle frame 0
  WALK_0: [
    "........................",
    "....BBBB........BBBB....",
    "...BPPPPB......BPPPPB...",
    "..BPppppPB....BPppppPB..",
    "..BPppppPB....BPppppPB..",
    "...BPPPPB..BB..BPPPPB...",
    "....BBBB.BBGGBB.BBBB....",
    "........BGGAAGGAB.......",
    "........BGGAAGGAB.......",
    ".......BgGGggGGgB.......",
    "......BMMMMMMMMMMB......",
    ".....BMMEBMMMMBEMMB.....",
    ".....BMMMBBPPBBMMMB.....",
    ".....BCCCCBPPBCCCCB.....",
    "......BCCCCCCCCCCB......",
    ".......BBSSSSSSBB.......",
    "......BXXBSSSSBXXB......",
    ".....BMXXBCCCCBMXXB.....",
    ".....BMMMBCCCCBMMMB.BB..",
    ".....BMMMBWWWWBMMPBPB...",
    "....BPPB.MWWWWM..BPB....",
    "....BPPB..BBBB...PPB....",
    ".....BB.........BPB.....",
    ".................BB....."
  ],

  // Walking cycle frame 1
  WALK_1: [
    "........................",
    "....BBBB........BBBB....",
    "...BPPPPB......BPPPPB...",
    "..BPppppPB....BPppppPB..",
    "..BPppppPB....BPppppPB..",
    "...BPPPPB..BB..BPPPPB...",
    "....BBBB.BBGGBB.BBBB....",
    "........BGGAAGGAB.......",
    "........BGGAAGGAB.......",
    ".......BgGGggGGgB.......",
    "......BMMMMMMMMMMB......",
    ".....BMMEBMMMMBEMMB.....",
    ".....BMMMBBPPBBMMMB.....",
    ".....BCCCCBPPBCCCCB.....",
    "......BCCCCCCCCCCB......",
    ".......BBSSSSSSBB.......",
    "......BXXBSSSSBXXB......",
    ".....BMXXBCCCCBMXXB.....",
    ".....BMMMBCCCCBMMMB.BB..",
    ".....BMMMBWWWWBMMPBPB...",
    "......M..MWWWWM.BPPB....",
    ".....BB...BBBB..BPPB....",
    "................BB......",
    "........................"
  ],

  // Coding on laptop with glowing GitHub logo
  WORK: [
    "........................",
    "....BBBB........BBBB....",
    "...BPPPPB......BPPPPB...",
    "..BPppppPB....BPppppPB..",
    "..BPppppPB....BPppppPB..",
    "...BPPPPB..BB..BPPPPB...",
    "....BBBB.BBGGBB.BBBB....",
    "........BGGAAGGAB.......",
    ".......BgGGggGGgB.......",
    "......BMMMMMMMMMMB......",
    ".....BMMEBMMMMBEMMB.....",
    ".....BMMMBBPPBBMMMB.....",
    ".....BCCCCBPPBCCCCB.....",
    "......BCCCCCCCCCCB......",
    ".......BBSSSSSSBB.......",
    "......BXXBSSSSBXXB......",
    ".....BMXXBCCCCBMXXB.BB..",
    ".....BMMMBCCCCBMMPBPB...",
    "....BLLLLLLLLLLLBPPB....",
    "....BLDDDllDDDLB........",
    "....BLDDllllDDLB........",
    "...BPPBLLLLLLLLLB.......",
    "...BPPB.BBBBBBBB........",
    "....BB.................."
  ],

  // Collecting & carrying golden cheese / gear proudly
  COLLECT: [
    "..........YYYY..........",
    ".........YYYYYY.........",
    ".........YYYYYY.........",
    ".........YYYYYY.........",
    "....BBBB..YYYY..BBBB....",
    "...BPPPPB..BB..BPPPPB...",
    "..BPppppPB....BPppppPB..",
    "..BPppppPB....BPppppPB..",
    "...BPPPPBGGAAGGBPPPPB...",
    "....BBBB.BGGAAGB.BBBB...",
    ".......BgGGggGGgB.......",
    "......BMMMMMMMMMMB......",
    ".....BMMEBMMMMBEMMB.....",
    ".....BMMMBBPPBBMMMB.....",
    ".....BCCCCBPPBCCCCB.....",
    "......BCCCCCCCCCCB......",
    ".......BBSSSSSSBB.......",
    "......BXXBSSSSBXXB......",
    "......BXXBCCCCBXXB..BB..",
    ".....BMXXBCCCCBMMPBPB...",
    ".....BMMMBWWWWBMMPB.....",
    "......BBBB.BB.BBBPPB....",
    "........BPB..BPB..PB....",
    ".........BB...BB........"
  ],

  // Cheerful jump with sparkles
  CHEER: [
    "........................",
    "...G......BBBB......G...",
    "..GGG....BPPPPB....GGG..",
    "...G....BPppppPB....G...",
    "........BPppppPB........",
    ".........BPPPPB..BB.....",
    "....BPPB..BBGGBB.BPPB...",
    "...BPPPPBGGAAGGABPPPPB..",
    "...BPPPPBgGGggGGgBPPPB..",
    "....BPPBMMMMMMMMMB..B...",
    "......BMMEBMMMMBEMMB....",
    "......BMMMBBPPBBMMMB....",
    "......BCCCCBPPBCCCCB....",
    ".......BCCCCCCCCCCB.....",
    "........BBSSSSSSBB......",
    ".......BXXBSSSSBXXB.....",
    ".......BXXBCCCCBXXB.BB..",
    "......BMXXBCCCCBMMPBPB..",
    "......BMMMBWWWWBMMPB....",
    ".......BBBB.BB.BBBPPB...",
    ".........BPB..BPB..PB...",
    "..........BB...BB.......",
    "........................",
    "........................"
  ],

  // Curled up sleeping bean with folded ears
  SLEEP: [
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "..........BBBB..........",
    "........BBPppPBB........",
    ".......BPPppppPPB.......",
    "......BPppppppppPB......",
    ".....BPppppppppppPB.....",
    "....BMMBBPPppppPPBMMB...",
    "...BMMMMMBBBBBBBMMMMMB..",
    "..BMMMMMMMMMMMMMMMMMMMB.",
    ".BMMMEEEEMMMMMMEEEEMMMB.",
    ".BCCCMEEEMCCCCMEEEMCCCB.",
    ".BCCCCCCCHBPPBHCCCCCCB..",
    "..BBSSSSSSSSSSSSSSSSBB..",
    "...BSSSSSSSSSSSSSSSSB...",
    "...BssSSSWWWWWWWWSSsB...",
    "....BBBBBBBBBBBBBBBB....",
    "........................",
    "........................"
  ],

  // Peeking from mouse hole
  HIDING: [
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "....BBBB........BBBB....",
    "...BPPPPB......BPPPPB...",
    "..BPppppPB....BPppppPB..",
    "..BPppppPB....BPppppPB..",
    "...BPPPPB..BB..BPPPPB...",
    "....BBBB.BBGGBB.BBBB....",
    "........BGGAAGGAB.......",
    "........BGGAAGGAB.......",
    ".......BgGGggGGgB.......",
    "......BMMMMMMMMMMB......",
    ".....BMMEBMMMMBEMMB.....",
    ".....BMMMBBPPBBMMMB.....",
    ".....BCCCCBPPBCCCCB.....",
    "......BCCCCCCCCCCB......",
    ".......BBBBBBBBBB.......",
    "........................",
    "........................",
    "........................",
    "........................"
  ]
};

// Aliases for compatibility
MOUSE_SPRITES.FORAGING = MOUSE_SPRITES.IDLE;
MOUSE_SPRITES.EXPLORING = MOUSE_SPRITES.IDLE;
MOUSE_SPRITES.DARTING_0 = MOUSE_SPRITES.WALK_0;
MOUSE_SPRITES.DARTING_1 = MOUSE_SPRITES.WALK_1;
MOUSE_SPRITES.RUNNING_0 = MOUSE_SPRITES.WALK_0;
MOUSE_SPRITES.RUNNING_1 = MOUSE_SPRITES.WALK_1;
MOUSE_SPRITES.COLLECTING_CHEESE = MOUSE_SPRITES.COLLECT;
MOUSE_SPRITES.OBSERVING_CAT = MOUSE_SPRITES.WORK;
MOUSE_SPRITES.TAUNTING = MOUSE_SPRITES.CHEER;
MOUSE_SPRITES.SLEEPING = MOUSE_SPRITES.SLEEP;

/**
 * Resolves color palette mapping for mouse tier and variant.
 *
 * @param {string} tier - "SCOUT" | "RUNNER" | "NINJA" | "NEWBIE" | "REGULAR" | "CONSISTENT" | "DEDICATED" | "STREAKER".
 * @param {string} [variant] - "field_mouse" | "dormouse" | "white_mouse".
 * @param {Record<string, [number, number, number, number]>} palette
 * @returns {Record<string, [number, number, number, number]>}
 */
export function getMouseColorMap(tier, variant, palette) {
  let fur = [155, 150, 178, 255]; // Soft lavender-grey
  let shadow = [120, 114, 142, 255];
  let cream = [228, 224, 240, 255];
  let pink = [245, 168, 184, 255];
  let innerPink = [225, 130, 150, 255];
  let outline = [45, 38, 55, 255];

  if (tier === "NINJA" || tier === "STREAKER") {
    fur = [85, 80, 105, 255]; // Sleek dark slate ninja
    shadow = [55, 50, 75, 255];
    cream = [170, 165, 190, 255];
  } else if (variant === "dormouse") {
    fur = [175, 135, 95, 255]; // Golden caramel dormouse
    shadow = [140, 100, 65, 255];
    cream = [245, 225, 195, 255];
  } else if (variant === "white_mouse") {
    fur = [248, 248, 252, 255]; // Pearl white
    shadow = [215, 215, 228, 255];
    cream = [255, 255, 255, 255];
  }

  const scarf = palette.primaryAccent || [165, 42, 58, 255];

  return {
    ".": palette.transparent || [0, 0, 0, 0],
    B: outline,
    M: fur,
    m: shadow,
    C: cream,
    P: pink,
    p: innerPink,
    G: [224, 172, 56, 255], // Brass goggles rim
    g: [80, 52, 35, 255], // Goggles strap
    A: [165, 216, 255, 255], // Sky blue goggles glass
    S: scarf,
    s: [116, 24, 37, 255],
    X: [140, 80, 40, 255], // Leather backpack
    L: [42, 46, 56, 255], // Slate laptop
    l: [255, 255, 255, 255], // White GitHub logo on laptop
    Y: [255, 205, 45, 255], // Golden cheese / gear
    E: outline,
    W: [254, 252, 248, 255],
    T: pink
  };
}
