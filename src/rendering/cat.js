/**
 * @file Modern pixel-art Cat sprites and coat color resolution.
 * Provides high-fidelity 32x32 chibi cat animations with signature scarf,
 * expressive face, cream belly, white socks, and striped tail.
 */

/*
  Legend:
  . = transparent
  B = dark warm outline [50, 26, 20, 255]
  O = primary ginger fur [242, 141, 53, 255]
  D = deep ginger shadow / stripes [210, 102, 32, 255]
  H = warm honey highlight [250, 175, 95, 255]
  C = cream cheeks & belly [255, 241, 214, 255]
  W = white paws & chest [254, 252, 248, 255]
  S = burgundy scarf [165, 42, 58, 255]
  s = scarf shadow [116, 24, 37, 255]
  L = white Octocat logo on scarf [255, 255, 255, 255]
  P = soft pink inner ear & nose [247, 163, 181, 255]
  E = cute smiling eyes [50, 26, 20, 255]
  G = golden crown [249, 199, 79, 255]
  g = crown gem [217, 119, 6, 255]
*/

export const CAT_SPRITES = {
  // Sitting Idle with signature scarf & curled tail
  IDLE: [
    "................................",
    "................................",
    ".......BB.............BB........",
    "......BOOB...........BOOB.......",
    ".....BOOPPB.........BOOPPB......",
    ".....BOOPPB.........BOOPPB......",
    "....BOOOPPB.........BOOOPPB.....",
    "....BOOOOBBBBBBBBBBBBOOOOB......",
    "...BOOOOOHHHHHHHHHHHHOOOOOB.....",
    "...BOOOOHHHDDDDDDHHHHHOOOOB.....",
    "..BOOOOHHDDDDDDDDDDHHHOOOOB.....",
    "..BOOOOHDDDDDDDDDDDDHHOOOOB.....",
    "..BOOOHHDDDDDDDDDDDDHHOOOOB.....",
    "..BCCCHHDDDEECCCCEEDDDHHCCCB....",
    ".BCCCCCHDDDEECCCCEEDDDHCCCCCB...",
    ".BCCCCCCCCHHCBPPBCHHCCCCCCCCB...",
    ".BCCCCCCCCCCHBBBBHCCCCCCCCCCB...",
    "..BCCCCCCCCCCCCCCCCCCCCCCCCB....",
    "...BBSSSSSSSSSSSSSSSSSSBB.......",
    "....BSSSSSSSSSSSSSSSSSSB........",
    "....BsSSSSSSLWLLSSSSSSsB........",
    "....BssSSSSSWLLWSSSSSSsB..BB....",
    "....BOOBSSSSWLLWSSSSBOOB.BODB...",
    "...BOOOBssssSSSSssssBOOOBBODOB..",
    "...BOOODBBBBWWWWBBBBDOOOBBODOB..",
    "..BOOOODDDDDWWWWDDDDDOOOBBODOB..",
    "..BOOOOOOOODWWWWDOOOOOOOBBODOB..",
    "..BOOOOODDODWWWWDOODDOOOBBODOB..",
    "..BOOOOOODDOWWWWDOODDOOOBBWWOB..",
    "...BOOOBBBBBWWWWBBBBBOOOBBWWOB..",
    "....BBB....BWWWWb...BBBBB.BBB...",
    "............BBBB................"
  ],

  // Walking cycle frame 0: stepping forward
  WALK_0: [
    "................................",
    "................................",
    ".......BB.............BB........",
    "......BOOB...........BOOB.......",
    ".....BOOPPB.........BOOPPB......",
    ".....BOOPPB.........BOOPPB......",
    "....BOOOPPB.........BOOOPPB.....",
    "....BOOOOBBBBBBBBBBBBOOOOB......",
    "...BOOOOOHHHHHHHHHHHHOOOOOB.....",
    "...BOOOOHHHDDDDDDHHHHHOOOOB.....",
    "..BOOOOHHDDDDDDDDDDHHHOOOOB.....",
    "..BOOOOHDDDDDDDDDDDDHHOOOOB.....",
    "..BOOOHHDDDDDDDDDDDDHHOOOOB.....",
    "..BCCCHHDDDEECCCCEEDDDHHCCCB....",
    ".BCCCCCHDDDEECCCCEEDDDHCCCCCB...",
    ".BCCCCCCCCHHCBPPBCHHCCCCCCCCB...",
    ".BCCCCCCCCCCHBBBBHCCCCCCCCCCB...",
    "..BCCCCCCCCCCCCCCCCCCCCCCCCB....",
    "...BBSSSSSSSSSSSSSSSSSSBB.......",
    "....BSSSSSSSSSSSSSSSSSSB........",
    "....BsSSSSSSLWLLSSSSSSsB........",
    "....BssSSSSSWLLWSSSSSSsB........",
    "....BOOBSSSSWLLWSSSSBOOB..BBB...",
    "...BOOOBssssSSSSssssBOOOBBODDB..",
    "..BOOOODBBBBWWWWBBBBDOOOBBODOB..",
    ".BOOOOODDDDDWWWWDDDDDOOOBBODOB..",
    ".BWWBBBOOOODWWWWDOOOOOOOBBODOB..",
    ".BWWWB.BOOODWWWWDOODDOOOBBWWOB..",
    "..BBB..BOOODWWWWDOODDOOOBBWWOB..",
    "........BBBBWWWWBBBBBOOOB.BBB...",
    "...........BWWWWb...BBBB........",
    "............BBBB................"
  ],

  // Walking cycle frame 1: passing stance
  WALK_1: [
    "................................",
    "................................",
    ".......BB.............BB........",
    "......BOOB...........BOOB.......",
    ".....BOOPPB.........BOOPPB......",
    ".....BOOPPB.........BOOPPB......",
    "....BOOOPPB.........BOOOPPB.....",
    "....BOOOOBBBBBBBBBBBBOOOOB......",
    "...BOOOOOHHHHHHHHHHHHOOOOOB.....",
    "...BOOOOHHHDDDDDDHHHHHOOOOB.....",
    "..BOOOOHHDDDDDDDDDDHHHOOOOB.....",
    "..BOOOOHDDDDDDDDDDDDHHOOOOB.....",
    "..BOOOHHDDDDDDDDDDDDHHOOOOB.....",
    "..BCCCHHDDDEECCCCEEDDDHHCCCB....",
    ".BCCCCCHDDDEECCCCEEDDDHCCCCCB...",
    ".BCCCCCCCCHHCBPPBCHHCCCCCCCCB...",
    ".BCCCCCCCCCCHBBBBHCCCCCCCCCCB...",
    "..BCCCCCCCCCCCCCCCCCCCCCCCCB....",
    "...BBSSSSSSSSSSSSSSSSSSBB.......",
    "....BSSSSSSSSSSSSSSSSSSB........",
    "....BsSSSSSSLWLLSSSSSSsB........",
    "....BssSSSSSWLLWSSSSSSsB...BB...",
    "....BOOBSSSSWLLWSSSSBOOB..BODB..",
    "...BOOOBssssSSSSssssBOOOBBODOB..",
    "...BOOODBBBBWWWWBBBBDOOOBBODOB..",
    "..BOOOODDDDDWWWWDDDDDOOOBBODOB..",
    "..BOOOOOOOODWWWWDOOOOOOOBBODOB..",
    "..BOOOOODDODWWWWDOODDOOOBBODOB..",
    "...BOOOODDOWWWWDOODDOOOBBWWOB...",
    "...BOOOBBBBBWWWWBBBBBOOOBBWWOB..",
    "....BBB....BWWWWb...BBBBB.BBB...",
    "............BBBB................"
  ],

  // Walking cycle frame 2: opposite stride
  WALK_2: [
    "................................",
    "................................",
    ".......BB.............BB........",
    "......BOOB...........BOOB.......",
    ".....BOOPPB.........BOOPPB......",
    ".....BOOPPB.........BOOPPB......",
    "....BOOOPPB.........BOOOPPB.....",
    "....BOOOOBBBBBBBBBBBBOOOOB......",
    "...BOOOOOHHHHHHHHHHHHOOOOOB.....",
    "...BOOOOHHHDDDDDDHHHHHOOOOB.....",
    "..BOOOOHHDDDDDDDDDDHHHOOOOB.....",
    "..BOOOOHDDDDDDDDDDDDHHOOOOB.....",
    "..BOOOHHDDDDDDDDDDDDHHOOOOB.....",
    "..BCCCHHDDDEECCCCEEDDDHHCCCB....",
    ".BCCCCCHDDDEECCCCEEDDDHCCCCCB...",
    ".BCCCCCCCCHHCBPPBCHHCCCCCCCCB...",
    ".BCCCCCCCCCCHBBBBHCCCCCCCCCCB...",
    "..BCCCCCCCCCCCCCCCCCCCCCCCCB....",
    "...BBSSSSSSSSSSSSSSSSSSBB.......",
    "....BSSSSSSSSSSSSSSSSSSB........",
    "....BsSSSSSSLWLLSSSSSSsB........",
    "....BssSSSSSWLLWSSSSSSsB..BB....",
    "....BOOBSSSSWLLWSSSSBOOB.BODB...",
    "...BOOOBssssSSSSssssBOOOBBODOB..",
    "...BOOODBBBBWWWWBBBBDOOOBBODOB..",
    "..BOOOODDDDDWWWWDDDDDOOOBBODOB..",
    "..BOOOOOOOODWWWWDOOOOOOOBBODOB..",
    "..BOOOOODDODWWWWDOODDOOOBBWWOB..",
    "..BWWBBBDDOWWWWDOODDOOOBBWWOB...",
    "..BWWWB.BBBBWWWWBBBBBOOOB.BBB...",
    "...BBB.....BWWWWb...BBBB........",
    "............BBBB................"
  ],

  // Eating fresh fish happily
  EAT: [
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    ".......BB.............BB........",
    "......BOOB...........BOOB.......",
    ".....BOOPPB.........BOOPPB......",
    "....BOOOPPB.........BOOOPPB.....",
    "....BOOOOBBBBBBBBBBBBOOOOB......",
    "...BOOOOOHHHHHHHHHHHHOOOOOB.....",
    "..BOOOOHHDDDDDDDDDDHHHOOOOB.....",
    "..BOOOOHDDDDDDDDDDDDHHOOOOB.....",
    "..BOOOHHDDDDDDDDDDDDHHOOOOB.....",
    "..BCCCHHDDDEECCCCEEDDDHHCCCB....",
    ".BCCCCCHDDDEECCCCEEDDDHCCCCCB...",
    ".BCCCCCCCCHHCBPPBCHHCCCCCCCCB...",
    ".BCCCCCCCCCCHBBBBHCCCCCCCCCCB...",
    "..BCCCCCCCCCCCCCCCCCCCCCCCCB....",
    "...BBSSSSSSSSSSSSSSSSSSBB.......",
    "....BSSSSSSSSSSSSSSSSSSB........",
    "....BsSSSSSSLWLLSSSSSSsB..BBB...",
    "....BssSSSSSWLLWSSSSSSsB.BODDB..",
    "...BBOOBSSSSWLLWSSSSBOOBBODOB...",
    "..BOOOOBssssSSSSssssBOOOBODOB...",
    ".BCCBBBBBBBBWWWWBBBBDOOOBODOB...",
    "BCWWCBBBBBBBWWWWDDDDDOOOBODOB...",
    "BCWWCBBFFFBBWWWWDOOOOOOOBWWOB...",
    ".BCCB.BFFFFBWWWWDOODDOOOBWWOB...",
    "..BBB.BFFFFBBBBBDOODDOOOB.BBB...",
    ".......BBBB......BBBBOOOB.......",
    "....................BBBB........"
  ],

  // Grooming paw
  GROOM: [
    "................................",
    "................................",
    ".......BB.............BB........",
    "......BOOB...........BOOB.......",
    ".....BOOPPB.........BOOPPB......",
    ".....BOOPPB.........BOOPPB......",
    "....BOOOPPB.........BOOOPPB.....",
    "....BOOOOBBBBBBBBBBBBOOOOB......",
    "...BOOOOOHHHHHHHHHHHHOOOOOB.....",
    "...BOOOOHHHDDDDDDHHHHHOOOOB.....",
    "..BOOOOHHDDDDDDDDDDHHHOOOOB.....",
    "..BOOOOHDDDDDDDDDDDDHHOOOOB.....",
    "..BOOOHHDDDDDDDDDDDDHHOOOOB.....",
    "..BCCCHHDDDEECCCCEEDDDHHCCCB....",
    ".BCCCCCHDDDEECCCCEEDDDHCCCCCB...",
    ".BCCCCCCCCHHCBPPBCHHCCCCCCCCB...",
    ".BCCCCCCCCCCHBBBBHCCCCCCCCCCB...",
    "..BCCCCCCCCCCCCCCCCCCCCCCCCB....",
    "...BBSSSSSSSSSSSSSSSSSSBB.......",
    "....BSSSSSSSSSSSSSSSSSSB........",
    "....BsSSSSSSLWLLSSSSSSsB..BB....",
    "....BssSSSSSWLLWSSSSSSsB.BODB...",
    "....BOOBSSSSWLLWSSSSBOOBBODOB...",
    "...BOOOBssssSSSSssssBOOOBODOB...",
    "..BWWBBBBBBBWWWWBBBBDOOOBODOB...",
    ".BWWWB.DDDDDWWWWDDDDDOOOBODOB...",
    "..BBB..OOOOODWWWWDOOOOOOOBODOB..",
    ".......OOOODWWWWDOODDOOOBBWWOB..",
    ".......OOOOODWWWWDOODDOOOBBWWOB.",
    ".......BOOOBBBBBWWWWBBBBB.BBB...",
    "........BBB....BWWWWb...........",
    "................BBBB............"
  ],

  // Playing with wool ball (batting paw)
  PLAY: [
    "................................",
    "................................",
    "................................",
    ".......BB.............BB........",
    "......BOOB...........BOOB.......",
    ".....BOOPPB.........BOOPPB......",
    "....BOOOPPB.........BOOOPPB.....",
    "....BOOOOBBBBBBBBBBBBOOOOB......",
    "...BOOOOOHHHHHHHHHHHHOOOOOB.....",
    "...BOOOOHHHDDDDDDHHHHHOOOOB.....",
    "..BOOOOHHDDDDDDDDDDHHHOOOOB.....",
    "..BOOOOHDDDDDDDDDDDDHHOOOOB.....",
    "..BOOOHHDDDDDDDDDDDDHHOOOOB.....",
    "..BCCCHHDDDEECCCCEEDDDHHCCCB....",
    ".BCCCCCHDDDEECCCCEEDDDHCCCCCB...",
    ".BCCCCCCCCHHCBPPBCHHCCCCCCCCB...",
    ".BCCCCCCCCCCHBBBBHCCCCCCCCCCB...",
    "..BCCCCCCCCCCCCCCCCCCCCCCCCB....",
    "...BBSSSSSSSSSSSSSSSSSSBB.......",
    "....BSSSSSSSSSSSSSSSSSSB...BB...",
    "....BsSSSSSSLWLLSSSSSSsB..BODB..",
    "....BssSSSSSWLLWSSSSSSsB.BODOB..",
    "....BOOBSSSSWLLWSSSSBOOBBODOB...",
    "...BOOOBssssSSSSssssBOOOBODOB...",
    "...BWWBBBBBBWWWWBBBBDOOOBODOB...",
    "..BWWWB.DDDDWWWWDDDDDOOOBODOB...",
    "...BBB.OOOOODWWWWDOOOOOOOBWWOB..",
    "......BOOOODWWWWDOODDOOOBBWWOB..",
    "......BOOOODWWWWDOODDOOOB.BBB...",
    ".......BOOOBBBBBWWWWBBBBB.......",
    "........BBB....BWWWWb...........",
    "................BBBB............"
  ],

  // Sleeping curled loaf
  SLEEP: [
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "............BBBBBBBBBB..........",
    "..........BBOOOOOOOOOOBB........",
    ".........BOOPPBOOBOOPPBOB.......",
    "........BOOPPBOOOOBOOPPBOB......",
    ".......BOOBBBBOOOOBBBBBOOB......",
    "......BOOOOOOOOOOOOOOOOOOOB.....",
    ".....BOOOOOOOOOOOOOOOOOOOOOOB...",
    "....BOOODDDDDDDDDDDDDDDDOOOOB...",
    "...BOOODDEEEEDDDDDEEEEDDDOOOOB..",
    "..BOOODDDDDDEDDDDDEDDDDDDDOOOB..",
    "..BCCCCDDDDDDDDDDDDDDDDDDCCCCB..",
    "..BCCCCCCCCCCHBPPBHCCCCCCCCCCB..",
    "..BCCCCCCCCCCCHBBHCCCCCCCCCCCB..",
    "..BBSSSSSSSSSSSSSSSSSSSSSSBB....",
    "...BSSSSSSSSSSSSSSSSSSSSSSB.....",
    "...BsSSSSSWWWWWWWWWWWSSSSsB.....",
    "....BssSSSWWWWWWWWWWWSSssB......",
    ".....BBBBBBBBBBBBBBBBBBBB.......",
    "................................",
    "................................"
  ]
};

// Aliases for seamless backward compatibility
CAT_SPRITES.SLEEPING = CAT_SPRITES.SLEEP;
CAT_SPRITES.WALKING_0 = CAT_SPRITES.WALK_0;
CAT_SPRITES.WALKING_1 = CAT_SPRITES.WALK_1;
CAT_SPRITES.WALKING_2 = CAT_SPRITES.WALK_2;
CAT_SPRITES.PROWLING_0 = CAT_SPRITES.WALK_0;
CAT_SPRITES.PROWLING_1 = CAT_SPRITES.WALK_1;
CAT_SPRITES.EATING_FISH = CAT_SPRITES.EAT;
CAT_SPRITES.GROOMING = CAT_SPRITES.GROOM;
CAT_SPRITES.PLAYING_WOOL = CAT_SPRITES.PLAY;
CAT_SPRITES.EXPLORING = CAT_SPRITES.IDLE;
CAT_SPRITES.STALKING = CAT_SPRITES.PLAY;
CAT_SPRITES.POUNCING = CAT_SPRITES.PLAY;

/**
 * Resolves color palette mapping for cat coat variant.
 *
 * @param {string} variant - "tabby" | "calico" | "tuxedo" | "ginger" | "midnight".
 * @param {Record<string, [number, number, number, number]>} palette
 * @returns {Record<string, [number, number, number, number]>}
 */
export function getCatColorMap(variant, palette) {
  let primary = [242, 141, 53, 255]; // Warm ginger
  let shadow = [210, 102, 32, 255]; // Deep orange stripe
  let highlight = [250, 175, 95, 255];
  let cream = [255, 241, 214, 255];
  let white = [254, 252, 248, 255];
  let outline = [50, 26, 20, 255];
  let eyes = [50, 26, 20, 255];

  switch (variant) {
    case "calico":
      primary = [238, 126, 42, 255];
      shadow = [65, 45, 38, 255]; // Dark brown calico patch
      highlight = [248, 168, 92, 255];
      break;
    case "tuxedo":
      primary = [35, 38, 48, 255];
      shadow = [22, 24, 32, 255];
      highlight = [52, 58, 72, 255];
      outline = [18, 18, 24, 255];
      eyes = [75, 205, 110, 255]; // Emerald eyes
      break;
    case "ginger":
      primary = [246, 128, 38, 255];
      shadow = [215, 90, 20, 255];
      highlight = [252, 168, 78, 255];
      break;
    case "midnight":
      primary = [32, 34, 44, 255];
      shadow = [20, 22, 30, 255];
      highlight = [50, 54, 70, 255];
      outline = [12, 14, 18, 255];
      eyes = [245, 200, 40, 255]; // Gold eyes
      break;
    default: // tabby
      primary = [242, 141, 53, 255];
      shadow = [210, 102, 32, 255];
      highlight = [250, 175, 95, 255];
      break;
  }

  const scarf = palette.catScarf || [165, 42, 58, 255];
  const scarfShadow = [116, 24, 37, 255];

  return {
    ".": palette.transparent || [0, 0, 0, 0],
    B: outline,
    O: primary,
    D: shadow,
    H: highlight,
    C: cream,
    W: white,
    S: scarf,
    s: scarfShadow,
    L: [255, 255, 255, 255],
    P: [247, 163, 181, 255],
    E: eyes,
    G: [249, 199, 79, 255],
    g: [217, 119, 6, 255],
    F: [75, 160, 225, 255], // fish dish in eating pose
    b: [180, 180, 185, 255]
  };
}
