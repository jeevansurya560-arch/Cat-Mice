/**
 * @file Generates standalone transparent character SVGs in assets/characters/
 */

import fs from "node:fs";
import path from "node:path";
import { spriteToSvg } from "../src/svg/character.js";
import { CAT_SPRITES, getCatColorMap } from "../src/rendering/cat.js";
import { MOUSE_SPRITES, getMouseColorMap } from "../src/rendering/mouse.js";
import { createPalette } from "../src/rendering/palette.js";

export function generateAllCharacterSvgs(baseDir = "assets/characters") {
  const palette = createPalette();
  const catColorMap = getCatColorMap("ginger", palette);
  const mouseColorMap = getMouseColorMap("CONSISTENT", "companion", palette);

  const writeSvg = (relPath, matrix, colorMap, title, flipX = false) => {
    const fullPath = path.resolve(process.cwd(), baseDir, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    const svg = spriteToSvg(matrix, colorMap, { viewBoxSize: 128, title, flipX });
    fs.writeFileSync(fullPath, svg, "utf-8");
  };

  // Cat directional idles
  writeSvg("cat/cat-idle-down.svg", CAT_SPRITES.IDLE_SOUTH, catColorMap, "CAT-MICE Cat Idle South");
  writeSvg("cat/cat-idle-up.svg", CAT_SPRITES.IDLE_NORTH, catColorMap, "CAT-MICE Cat Idle North");
  writeSvg("cat/cat-idle-right.svg", CAT_SPRITES.IDLE_EAST, catColorMap, "CAT-MICE Cat Idle East");
  writeSvg("cat/cat-idle-left.svg", CAT_SPRITES.IDLE_WEST, catColorMap, "CAT-MICE Cat Idle West");

  // Cat walk cycles
  for (let i = 0; i < 4; i++) {
    writeSvg(
      `cat/cat-walk/south/cat-walk-south-${i}.svg`,
      CAT_SPRITES[`WALK_SOUTH_${i}`],
      catColorMap,
      `Cat Walk South Frame ${i}`
    );
    writeSvg(
      `cat/cat-walk/north/cat-walk-north-${i}.svg`,
      CAT_SPRITES[`WALK_NORTH_${i}`],
      catColorMap,
      `Cat Walk North Frame ${i}`
    );
    writeSvg(
      `cat/cat-walk/east/cat-walk-east-${i}.svg`,
      CAT_SPRITES[`WALK_EAST_${i}`],
      catColorMap,
      `Cat Walk East Frame ${i}`
    );
    writeSvg(
      `cat/cat-walk/west/cat-walk-west-${i}.svg`,
      CAT_SPRITES[`WALK_EAST_${i}`],
      catColorMap,
      `Cat Walk West Frame ${i}`,
      true
    );
  }

  // Cat activities
  writeSvg("cat/activities/cat-eat.svg", CAT_SPRITES.EAT, catColorMap, "Cat Eating Fish");
  writeSvg("cat/activities/cat-groom.svg", CAT_SPRITES.GROOM, catColorMap, "Cat Grooming Paw");
  writeSvg("cat/activities/cat-play.svg", CAT_SPRITES.PLAY, catColorMap, "Cat Playing with Wool");
  writeSvg("cat/activities/cat-sleep.svg", CAT_SPRITES.SLEEP, catColorMap, "Cat Sleeping Loaf");

  // Mouse directional idles
  writeSvg(
    "mouse/mouse-idle-down.svg",
    MOUSE_SPRITES.IDLE_SOUTH,
    mouseColorMap,
    "CAT-MICE Mouse Idle South"
  );
  writeSvg(
    "mouse/mouse-idle-up.svg",
    MOUSE_SPRITES.IDLE_NORTH,
    mouseColorMap,
    "CAT-MICE Mouse Idle North"
  );
  writeSvg(
    "mouse/mouse-idle-right.svg",
    MOUSE_SPRITES.IDLE_EAST,
    mouseColorMap,
    "CAT-MICE Mouse Idle East"
  );
  writeSvg(
    "mouse/mouse-idle-left.svg",
    MOUSE_SPRITES.IDLE_WEST,
    mouseColorMap,
    "CAT-MICE Mouse Idle West"
  );

  // Mouse walk cycles
  for (let i = 0; i < 4; i++) {
    writeSvg(
      `mouse/mouse-walk/south/mouse-walk-south-${i}.svg`,
      MOUSE_SPRITES[`WALK_SOUTH_${i}`],
      mouseColorMap,
      `Mouse Walk South Frame ${i}`
    );
    writeSvg(
      `mouse/mouse-walk/north/mouse-walk-north-${i}.svg`,
      MOUSE_SPRITES[`WALK_NORTH_${i}`],
      mouseColorMap,
      `Mouse Walk North Frame ${i}`
    );
    writeSvg(
      `mouse/mouse-walk/east/mouse-walk-east-${i}.svg`,
      MOUSE_SPRITES[`WALK_EAST_${i}`],
      mouseColorMap,
      `Mouse Walk East Frame ${i}`
    );
    writeSvg(
      `mouse/mouse-walk/west/mouse-walk-west-${i}.svg`,
      MOUSE_SPRITES[`WALK_EAST_${i}`],
      mouseColorMap,
      `Mouse Walk West Frame ${i}`,
      true
    );
  }

  // Mouse activities
  writeSvg(
    "mouse/activities/mouse-work.svg",
    MOUSE_SPRITES.WORK,
    mouseColorMap,
    "Mouse Coding on Laptop"
  );
  writeSvg(
    "mouse/activities/mouse-collect.svg",
    MOUSE_SPRITES.COLLECT,
    mouseColorMap,
    "Mouse Collecting Golden Cheese"
  );
  writeSvg(
    "mouse/activities/mouse-cheer.svg",
    MOUSE_SPRITES.CHEER,
    mouseColorMap,
    "Mouse Cheering with Sparkles"
  );
  writeSvg(
    "mouse/activities/mouse-sleep.svg",
    MOUSE_SPRITES.SLEEP,
    mouseColorMap,
    "Mouse Sleeping Bean"
  );
  writeSvg(
    "mouse/activities/mouse-hide.svg",
    MOUSE_SPRITES.HIDING,
    mouseColorMap,
    "Mouse Hiding in Burrow"
  );

  console.log("✓ Generated standalone transparent character SVGs in", baseDir);
}

if (process.argv[1]?.endsWith("generate-character-svgs.js")) {
  generateAllCharacterSvgs();
}
