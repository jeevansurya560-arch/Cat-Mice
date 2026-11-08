/**
 * @file Rendering & Animation Engine Orchestrator.
 * Transforms a SimulationTimelineDTO into a sequence of raw 2D RGBA frame buffers (RenderedPixelBuffersDTO).
 */

import { createBuffer, blitSprite } from "./canvas.js";
import { createPalette } from "./palette.js";
import { renderBackdrop, renderProps } from "./environment.js";
import { CAT_SPRITES, getCatColorMap } from "./cat.js";
import { MOUSE_SPRITES, getMouseColorMap } from "./mouse.js";

/**
 * Renders all frames of a simulation timeline into 2D RGBA pixel buffers.
 *
 * @param {import("../simulation/state.js").simulateWorld} timeline
 * @param {object} [themeSpec] - Palette theme from progression.
 * @param {object} [options]
 * @param {number} [options.fps=10]
 * @returns {Readonly<{
 *   width: number,
 *   height: number,
 *   fps: number,
 *   frameCount: number,
 *   frames: Uint8ClampedArray[]
 * }>}
 */
export function renderTimeline(timeline, themeSpec = {}, options = {}) {
  if (!timeline || !timeline.frames) {
    throw new Error("Cannot render timeline: Simulation timeline or frames are missing.");
  }

  const { width, height } = timeline.bounds;
  const fps = options.fps || 10;
  const palette = createPalette(themeSpec);

  const renderedFrames = [];

  for (const frame of timeline.frames) {
    const buffer = createBuffer(width, height);

    // 1. Render top-down garden landscape (lawn, stone path, pond, canopies, lantern)
    renderBackdrop(buffer, width, height, palette);

    // 2. Render environmental props (mouse burrow, ceramic fish dish, cheese, wool ball)
    renderProps(buffer, width, height, frame.props, palette);

    // 3. Render Cat Sprite (Top-Down 32x32 Cat)
    const cat = frame.cat;
    const catColorMap = getCatColorMap(cat.variant, palette);
    const facing = cat.facing || "south";
    let catSprite = CAT_SPRITES.IDLE_SOUTH || CAT_SPRITES.IDLE;
    let flipX = false;

    switch (cat.action) {
      case "WALK":
      case "WALKING":
      case "PROWLING": {
        const step = frame.tick % 4;
        if (facing === "north") {
          catSprite = CAT_SPRITES[`WALK_NORTH_${step}`] || CAT_SPRITES.WALK_NORTH_0;
        } else if (facing === "east" || facing === "right") {
          catSprite = CAT_SPRITES[`WALK_EAST_${step}`] || CAT_SPRITES.WALK_EAST_0;
        } else if (facing === "west" || facing === "left") {
          catSprite = CAT_SPRITES[`WALK_EAST_${step}`] || CAT_SPRITES.WALK_EAST_0;
          flipX = true;
        } else {
          catSprite = CAT_SPRITES[`WALK_SOUTH_${step}`] || CAT_SPRITES.WALK_SOUTH_0;
        }
        break;
      }
      case "EAT":
      case "EATING_FISH":
        catSprite = CAT_SPRITES.EAT;
        break;
      case "PLAY":
      case "PLAYING_WOOL":
      case "POUNCING":
        catSprite = CAT_SPRITES.PLAY;
        break;
      case "GROOM":
      case "GROOMING":
        catSprite = CAT_SPRITES.GROOM;
        break;
      case "SLEEP":
      case "SLEEPING":
        catSprite = CAT_SPRITES.SLEEP;
        break;
      case "IDLE":
      case "EXPLORING":
      case "STALKING":
      default: {
        if (facing === "north") {
          catSprite = CAT_SPRITES.IDLE_NORTH;
        } else if (facing === "east" || facing === "right") {
          catSprite = CAT_SPRITES.IDLE_EAST;
        } else if (facing === "west" || facing === "left") {
          catSprite = CAT_SPRITES.IDLE_WEST;
        } else {
          catSprite = CAT_SPRITES.IDLE_SOUTH;
        }
        break;
      }
    }

    // Center 32x32 cat sprite origin
    const catOffsetX = Math.round(cat.x - 16);
    const catOffsetY = Math.round(cat.y - 16);

    blitSprite(buffer, width, height, catSprite, catColorMap, catOffsetX, catOffsetY, {
      scale: 1,
      flipX
    });

    // 4. Render Mouse Sprite (Top-Down 24x24 Mouse with Goggles & Backpack)
    const mouse = frame.mouse;
    if (mouse.unlocked && mouse.visible) {
      const mouseColorMap = getMouseColorMap(mouse.tier, mouse.variant, palette);
      const mFacing = mouse.facing || "south";
      let mouseSprite = MOUSE_SPRITES.IDLE_SOUTH || MOUSE_SPRITES.IDLE;
      let mFlipX = false;

      switch (mouse.action) {
        case "WALK":
        case "RUNNING":
        case "DARTING": {
          const mStep = frame.tick % 4;
          if (mFacing === "north") {
            mouseSprite = MOUSE_SPRITES[`WALK_NORTH_${mStep}`] || MOUSE_SPRITES.WALK_NORTH_0;
          } else if (mFacing === "east" || mFacing === "right") {
            mouseSprite = MOUSE_SPRITES[`WALK_EAST_${mStep}`] || MOUSE_SPRITES.WALK_EAST_0;
          } else if (mFacing === "west" || mFacing === "left") {
            mouseSprite = MOUSE_SPRITES[`WALK_EAST_${mStep}`] || MOUSE_SPRITES.WALK_EAST_0;
            mFlipX = true;
          } else {
            mouseSprite = MOUSE_SPRITES[`WALK_SOUTH_${mStep}`] || MOUSE_SPRITES.WALK_SOUTH_0;
          }
          break;
        }
        case "WORK":
        case "OBSERVING_CAT":
          mouseSprite = MOUSE_SPRITES.WORK;
          break;
        case "COLLECT":
        case "COLLECTING_CHEESE":
          mouseSprite = MOUSE_SPRITES.COLLECT;
          break;
        case "CHEER":
        case "TAUNTING":
          mouseSprite = MOUSE_SPRITES.CHEER;
          break;
        case "SLEEP":
        case "SLEEPING":
          mouseSprite = MOUSE_SPRITES.SLEEP;
          break;
        case "HIDING":
          mouseSprite = MOUSE_SPRITES.HIDING;
          break;
        case "IDLE":
        case "EXPLORING":
        case "FORAGING":
        default: {
          if (mFacing === "north") {
            mouseSprite = MOUSE_SPRITES.IDLE_NORTH;
          } else if (mFacing === "east" || mFacing === "right") {
            mouseSprite = MOUSE_SPRITES.IDLE_EAST;
          } else if (mFacing === "west" || mFacing === "left") {
            mouseSprite = MOUSE_SPRITES.IDLE_WEST;
          } else {
            mouseSprite = MOUSE_SPRITES.IDLE_SOUTH;
          }
          break;
        }
      }

      const mouseOffsetX = Math.round(mouse.x - 12);
      const mouseOffsetY = Math.round(mouse.y - 12);

      blitSprite(buffer, width, height, mouseSprite, mouseColorMap, mouseOffsetX, mouseOffsetY, {
        scale: 1,
        flipX: mFlipX
      });
    }

    renderedFrames.push(buffer);
  }

  return Object.freeze({
    width,
    height,
    fps,
    frameCount: renderedFrames.length,
    frames: renderedFrames
  });
}
