/**
 * @file Modern Top-Down 2D Pixel-Art Mouse Sprites & Color Palette Resolution.
 * Orthographic overhead (90° bird's-eye view) directional sprites for Consistency Mouse Companion:
 * North (up), South (down), East (right), West (left), plus activity animations.
 */

/*
  Palette Legend:
  . = transparent
  B = dark warm outline [45, 38, 55, 255]
  M = lavender companion coat [168, 162, 198, 255]
  m = coat highlight [202, 196, 228, 255]
  C = creamy white cheeks & belly [250, 246, 242, 255]
  W = white paws & chest [255, 255, 255, 255]
  P = soft pink ears & nose [247, 163, 181, 255]
  p = deep pink ear shadow [218, 126, 148, 255]
  G = brass aviator goggles [224, 168, 48, 255]
  g = goggles dark rim [148, 102, 24, 255]
  A = goggles cyan glass reflection [142, 228, 245, 255]
  S = burgundy scarf [165, 42, 58, 255]
  s = scarf shadow [116, 24, 37, 255]
  X = leather backpack [140, 80, 40, 255]
  L = laptop slate body [42, 46, 56, 255]
  l = laptop white logo [255, 255, 255, 255]
  Y = golden cheese / gear [255, 205, 45, 255]
  E = cute eye dot [45, 38, 55, 255]
*/

export const MOUSE_SPRITES = {
  // 1. South Facing (Facing Down toward camera) - Overhead view of ears, goggles, scarf & tail
  IDLE_SOUTH: [
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

  // 2. North Facing (Facing Up / away from camera) - Back of head, leather backpack & long tail
  IDLE_NORTH: [
    "........................",
    "....BBBB........BBBB....",
    "...BPPPPB......BPPPPB...",
    "..BPppppPB....BPppppPB..",
    "..BPppppPB....BPppppPB..",
    "...BPPPPB......BPPPPB...",
    "....BBBB.BBBBBB.BBBB....",
    ".......BMMMMMMMMB.......",
    "......BMMMMMMMMMMB......",
    "......BMMMMMMMMMMB......",
    ".......BBSSSSSSBB.......",
    "......BXXXXXXXXXXB......",
    ".....BXXXXXXXXXXXXB.....",
    ".....BXXXXXXXXXXXXB.....",
    ".....BXXXXXXXXXXXXB.....",
    "......BXXXXXXXXXXB......",
    ".......BBBBBBBBBB.......",
    "......BMMMMMMMMMMB......",
    ".....BMMMMMMMMMMMMB.BB..",
    ".....BMMMMMMMMMMMMPBPB..",
    "......BMMMMMMMMMMPB.....",
    ".......BBBBBBBBBPPB.....",
    "........BPB..BPB..PB....",
    ".........BB...BB........"
  ],

  // 3. East Facing (Facing Right) - Profile overhead view
  IDLE_EAST: [
    "........................",
    "........................",
    ".........BBBB...........",
    "........BPPPPB..BB......",
    ".......BPppppPBBGGB.....",
    ".......BPppppPBGAAGB....",
    "........BPPPPBgGGggB....",
    ".........BBBBBMMMMMB....",
    ".....BBBBBBMMMEBMMMB....",
    "....BXXXXXXBCCBPPBMB....",
    "...BXXXXXXXXBCCCCB......",
    "..BXXXXXXXXXBBSSSSB.....",
    "..BXXXXXXXXXBSSSSB......",
    "..BXXXXXXXXXBMCCCB......",
    "...BXXXXXXXBMMCCCB......",
    "....BBBBBBBMMMMMMB......",
    ".....BMMMMMMMWWWWB......",
    "..BB.BMMMMMMMWWWWB......",
    ".BPBPBMMMMMMMBBBBB......",
    "..BPBBBB.BB.BWWWB.......",
    "...PPB..BPB.BWWWB.......",
    "....PB...BB..BBB........",
    "........................",
    "........................"
  ],

  // 4. West Facing (Facing Left)
  IDLE_WEST: [
    "........................",
    "........................",
    "...........BBBB.........",
    "......BB..BPPPPB........",
    ".....BGGBBPppppPB.......",
    "....BGAAGBPppppPB.......",
    "....bggGGgBPPPPB........",
    "....BMMMMMBBBBB.........",
    "....BMMMEBMMMBBBBBB.....",
    "....BMbPPBCCBXXXXXXB....",
    "......BCCCCBXXXXXXXXB...",
    ".....BSSSSBBXXXXXXXXXB..",
    "......BSSSSBXXXXXXXXXB..",
    "......BCCCMBXXXXXXXXXB..",
    "......BCCCMMBXXXXXXXB...",
    "......BMMMMMMBBBBBBB....",
    "......BWWWWMMMMMMMB.....",
    "......BWWWWMMMMMMMB.BB..",
    "......BBBBBBMMMMMMBPBPB.",
    ".......BWWWB.BB.BBBBPPB.",
    ".......BWWWB.BPB..BPP...",
    "........BBB..BB...BP....",
    "........................",
    "........................"
  ],

  // Walk Cycles - 4 frames South
  WALK_SOUTH_0: [
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

  WALK_SOUTH_1: [
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

  WALK_SOUTH_2: [
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

  WALK_SOUTH_3: [
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

  // Walk Cycles - 4 frames North (Back view of backpack & stepping paws)
  WALK_NORTH_0: [
    "........................",
    "....BBBB........BBBB....",
    "...BPPPPB......BPPPPB...",
    "..BPppppPB....BPppppPB..",
    "..BPppppPB....BPppppPB..",
    "...BPPPPB......BPPPPB...",
    "....BBBB.BBBBBB.BBBB....",
    ".......BMMMMMMMMB.......",
    "......BMMMMMMMMMMB......",
    "......BMMMMMMMMMMB......",
    ".......BBSSSSSSBB.......",
    "......BXXXXXXXXXXB......",
    ".....BXXXXXXXXXXXXB.....",
    ".....BXXXXXXXXXXXXB.....",
    ".....BXXXXXXXXXXXXB.....",
    "......BXXXXXXXXXXB......",
    ".......BBBBBBBBBB.......",
    "....BWWBBMMMMMMMMB......",
    "....BWWWBMMMMMMMMMMB.BB.",
    "....BBBBBMMMMMMMMMMPBPB.",
    "......BMMMMMMMMMMPB.....",
    ".......BBBBBBBBBPPB.....",
    "........BPB..BPB..PB....",
    ".........BB...BB........"
  ],

  WALK_NORTH_1: [
    "........................",
    "....BBBB........BBBB....",
    "...BPPPPB......BPPPPB...",
    "..BPppppPB....BPppppPB..",
    "..BPppppPB....BPppppPB..",
    "...BPPPPB......BPPPPB...",
    "....BBBB.BBBBBB.BBBB....",
    ".......BMMMMMMMMB.......",
    "......BMMMMMMMMMMB......",
    "......BMMMMMMMMMMB......",
    ".......BBSSSSSSBB.......",
    "......BXXXXXXXXXXB......",
    ".....BXXXXXXXXXXXXB.....",
    ".....BXXXXXXXXXXXXB.....",
    ".....BXXXXXXXXXXXXB.....",
    "......BXXXXXXXXXXB......",
    ".......BBBBBBBBBB.......",
    "......BMMMMMMMMMMB......",
    ".....BMMMMMMMMMMMMB.BB..",
    ".....BMMMMMMMMMMMMPBPB..",
    "......BMMMMMMMMMMPB.....",
    ".......BBBBBBBBBPPB.....",
    "........BPB..BPB..PB....",
    ".........BB...BB........"
  ],

  WALK_NORTH_2: [
    "........................",
    "....BBBB........BBBB....",
    "...BPPPPB......BPPPPB...",
    "..BPppppPB....BPppppPB..",
    "..BPppppPB....BPppppPB..",
    "...BPPPPB......BPPPPB...",
    "....BBBB.BBBBBB.BBBB....",
    ".......BMMMMMMMMB.......",
    "......BMMMMMMMMMMB......",
    "......BMMMMMMMMMMB......",
    ".......BBSSSSSSBB.......",
    "......BXXXXXXXXXXB......",
    ".....BXXXXXXXXXXXXB.....",
    ".....BXXXXXXXXXXXXB.....",
    ".....BXXXXXXXXXXXXB.....",
    "......BXXXXXXXXXXB......",
    ".......BBBBBBBBBB.......",
    "......BMMMMMMMMBWWWB....",
    ".....BMMMMMMMMMMBWWWB.BB",
    ".....BMMMMMMMMMMPBBBBBPB",
    "......BMMMMMMMMMMPB.....",
    ".......BBBBBBBBBPPB.....",
    "........BPB..BPB..PB....",
    ".........BB...BB........"
  ],

  WALK_NORTH_3: [
    "........................",
    "....BBBB........BBBB....",
    "...BPPPPB......BPPPPB...",
    "..BPppppPB....BPppppPB..",
    "..BPppppPB....BPppppPB..",
    "...BPPPPB......BPPPPB...",
    "....BBBB.BBBBBB.BBBB....",
    ".......BMMMMMMMMB.......",
    "......BMMMMMMMMMMB......",
    "......BMMMMMMMMMMB......",
    ".......BBSSSSSSBB.......",
    "......BXXXXXXXXXXB......",
    ".....BXXXXXXXXXXXXB.....",
    ".....BXXXXXXXXXXXXB.....",
    ".....BXXXXXXXXXXXXB.....",
    "......BXXXXXXXXXXB......",
    ".......BBBBBBBBBB.......",
    "......BMMMMMMMMMMB......",
    ".....BMMMMMMMMMMMMB.BB..",
    ".....BMMMMMMMMMMMMPBPB..",
    "......BMMMMMMMMMMPB.....",
    ".......BBBBBBBBBPPB.....",
    "........BPB..BPB..PB....",
    ".........BB...BB........"
  ],

  // Walk Cycles - 4 frames East (Profile walking right)
  WALK_EAST_0: [
    "........................",
    "........................",
    ".........BBBB...........",
    "........BPPPPB..BB......",
    ".......BPppppPBBGGB.....",
    ".......BPppppPBGAAGB....",
    "........BPPPPBgGGggB....",
    ".........BBBBBMMMMMB....",
    ".....BBBBBBMMMEBMMMB....",
    "....BXXXXXXBCCBPPBMB....",
    "...BXXXXXXXXBCCCCB......",
    "..BXXXXXXXXXBBSSSSB.....",
    "..BXXXXXXXXXBSSSSB......",
    "..BXXXXXXXXXBMCCCB......",
    "...BXXXXXXXBMMCCCB......",
    "....BBBBBBBMMMMMMB......",
    ".....BMMMMMMMWWWWB......",
    "..BB.BMMMMMMMWWWWB......",
    ".BPBPBMMMMMMMBBBBB......",
    "..BPBBBB.BB.BWWWB.......",
    "...PPB..BPB.BWWWB.......",
    "....PB...BB..BBB........",
    "........................",
    "........................"
  ],

  WALK_EAST_1: [
    "........................",
    "........................",
    ".........BBBB...........",
    "........BPPPPB..BB......",
    ".......BPppppPBBGGB.....",
    ".......BPppppPBGAAGB....",
    "........BPPPPBgGGggB....",
    ".........BBBBBMMMMMB....",
    ".....BBBBBBMMMEBMMMB....",
    "....BXXXXXXBCCBPPBMB....",
    "...BXXXXXXXXBCCCCB......",
    "..BXXXXXXXXXBBSSSSB.....",
    "..BXXXXXXXXXBSSSSB......",
    "..BXXXXXXXXXBMCCCB......",
    "...BXXXXXXXBMMCCCB......",
    "....BBBBBBBMMMMMMB......",
    ".....BMMMMMMMWWWWB......",
    "..BB.BMMMMMMMWWWWB......",
    ".BPBPBMMMMMMMBBBBB......",
    "..BPBBBB.BB..BWWWB......",
    "...PPB..BPB..BWWWB......",
    "....PB...BB...BBB.......",
    "........................",
    "........................"
  ],

  WALK_EAST_2: [
    "........................",
    "........................",
    ".........BBBB...........",
    "........BPPPPB..BB......",
    ".......BPppppPBBGGB.....",
    ".......BPppppPBGAAGB....",
    "........BPPPPBgGGggB....",
    ".........BBBBBMMMMMB....",
    ".....BBBBBBMMMEBMMMB....",
    "....BXXXXXXBCCBPPBMB....",
    "...BXXXXXXXXBCCCCB......",
    "..BXXXXXXXXXBBSSSSB.....",
    "..BXXXXXXXXXBSSSSB......",
    "..BXXXXXXXXXBMCCCB......",
    "...BXXXXXXXBMMCCCB......",
    "....BBBBBBBMMMMMMB......",
    ".....BMMMMMMMWWWWB......",
    "..BB.BMMMMMMMWWWWB......",
    ".BPBPBMMMMMMMBBBBB......",
    "..BPBBBB.BB.BWWWB.......",
    "...PPB..BPB.BWWWB.......",
    "....PB...BB..BBB........",
    "........................",
    "........................"
  ],

  WALK_EAST_3: [
    "........................",
    "........................",
    ".........BBBB...........",
    "........BPPPPB..BB......",
    ".......BPppppPBBGGB.....",
    ".......BPppppPBGAAGB....",
    "........BPPPPBgGGggB....",
    ".........BBBBBMMMMMB....",
    ".....BBBBBBMMMEBMMMB....",
    "....BXXXXXXBCCBPPBMB....",
    "...BXXXXXXXXBCCCCB......",
    "..BXXXXXXXXXBBSSSSB.....",
    "..BXXXXXXXXXBSSSSB......",
    "..BXXXXXXXXXBMCCCB......",
    "...BXXXXXXXBMMCCCB......",
    "....BBBBBBBMMMMMMB......",
    ".....BMMMMMMMWWWWB......",
    "..BB.BMMMMMMMWWWWB......",
    ".BPBPBMMMMMMMBBBBB......",
    "..BPBBBB.BB..BWWWB......",
    "...PPB..BPB..BWWWB......",
    "....PB...BB...BBB.......",
    "........................",
    "........................"
  ],

  // 5. Coding on laptop with glowing GitHub logo
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

  // 6. Collecting & carrying golden cheese / gear proudly
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

  // 7. Cheerful celebration jump with sparkles
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

  // 8. Sleeping curled lavender bean
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

  // 9. Peeking from dark ground burrow hole
  HIDING: [
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    ".........BBBBBB.........",
    "........BLLLLLLB........",
    ".......BLBB..BBLB.......",
    "......BLBPP..PPBLB......",
    ".....BLBPpp..ppPBLB.....",
    ".....BLBPPPPPPPBLB......",
    ".....BLBBGGBBGGBBLB.....",
    "....BLBGGAAGAAGGABLb....",
    "....BLBgGGggGGggBLB.....",
    "....BLBMMMEEEMMMBLB.....",
    ".....BLBCCCCCCCCBLB.....",
    "......BLBBSSSSBBLB......",
    ".......BLBBBBBBBLB......",
    "........BLLLLLLLB.......",
    ".........BBBBBBB........"
  ],

  // 10. Observing Cat perked up alertly
  OBSERVING: [
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
  ]
};

// Seamless Backward-Compatibility Aliases
MOUSE_SPRITES.IDLE = MOUSE_SPRITES.IDLE_SOUTH;
MOUSE_SPRITES.WALK_0 = MOUSE_SPRITES.WALK_SOUTH_0;
MOUSE_SPRITES.WALK_1 = MOUSE_SPRITES.WALK_SOUTH_1;
MOUSE_SPRITES.WALK_2 = MOUSE_SPRITES.WALK_SOUTH_2;
MOUSE_SPRITES.WALK_3 = MOUSE_SPRITES.WALK_SOUTH_3;
MOUSE_SPRITES.FORAGING = MOUSE_SPRITES.IDLE_SOUTH;
MOUSE_SPRITES.DARTING_0 = MOUSE_SPRITES.WALK_0;
MOUSE_SPRITES.DARTING_1 = MOUSE_SPRITES.WALK_1;
MOUSE_SPRITES.OBSERVING_CAT = MOUSE_SPRITES.OBSERVING;
MOUSE_SPRITES.COLLECTING_CHEESE = MOUSE_SPRITES.COLLECT;
MOUSE_SPRITES.TAUNTING = MOUSE_SPRITES.CHEER;
MOUSE_SPRITES.RUNNING_0 = MOUSE_SPRITES.WALK_0;
MOUSE_SPRITES.RUNNING_1 = MOUSE_SPRITES.WALK_1;
MOUSE_SPRITES.SLEEPING = MOUSE_SPRITES.SLEEP;

/**
 * Resolves color palette mapping for mouse tier and variant.
 *
 * @param {string} tier - "NEWBIE" | "REGULAR" | "CONSISTENT" | "DEDICATED" | "STREAKER".
 * @param {string} variant - "companion" | "field_mouse" | "dormouse".
 * @param {Record<string, [number, number, number, number]>} palette
 * @returns {Record<string, [number, number, number, number]>}
 */
export function getMouseColorMap(tier, variant, palette) {
  let body = [168, 162, 198, 255]; // Soft lavender-grey
  let highlight = [202, 196, 228, 255];
  let belly = [250, 246, 242, 255];
  let outline = [45, 38, 55, 255];
  let eyes = [45, 38, 55, 255];
  let goggles = [224, 168, 48, 255]; // Brass
  let gogglesGlass = [142, 228, 245, 255]; // Cyan reflection

  if (tier === "NINJA" || tier === "STREAKER") {
    body = [120, 114, 156, 255]; // Royal shadow lavender
    highlight = [165, 158, 202, 255];
    goggles = [249, 199, 79, 255]; // Golden goggles
  } else if (variant === "field_mouse") {
    body = [184, 152, 128, 255]; // Warm field-mouse brown
    highlight = [214, 185, 162, 255];
  }

  const scarf = palette.primaryAccent || [165, 42, 58, 255];
  const scarfShadow = [116, 24, 37, 255];

  return {
    ".": palette.transparent || [0, 0, 0, 0],
    B: outline,
    M: body,
    m: highlight,
    C: belly,
    W: [255, 255, 255, 255],
    P: [247, 163, 181, 255],
    p: [218, 126, 148, 255],
    G: goggles,
    g: [148, 102, 24, 255],
    A: gogglesGlass,
    S: scarf,
    s: scarfShadow,
    X: [140, 80, 40, 255], // Leather backpack
    L: [42, 46, 56, 255], // Laptop slate body
    l: [255, 255, 255, 255], // Glowing white GitHub logo
    Y: [255, 205, 45, 255], // Golden cheese / gear
    E: eyes
  };
}
