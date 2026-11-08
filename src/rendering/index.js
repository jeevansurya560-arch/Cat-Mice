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

    // 1. Render atmospheric storybook backdrop (twilight sky, hanging cherry blossoms, Octocat sign, brass lantern)
    renderBackdrop(buffer, width, height, palette);

    // 2. Render environmental props (arched mouse hole, ceramic fish dish, cheese, wool ball)
    renderProps(buffer, width, height, frame.props, palette);

    // 3. Render Modern Chibi Cat Sprite (32x32)
    const cat = frame.cat;
    const catColorMap = getCatColorMap(cat.variant, palette);
    const flipX = cat.facing === "west" || cat.facing === "left";
    let catSprite = CAT_SPRITES.IDLE;

    switch (cat.action) {
      case "WALK":
      case "WALKING":
      case "PROWLING":
        catSprite =
          frame.tick % 3 === 0
            ? CAT_SPRITES.WALK_0
            : frame.tick % 3 === 1
              ? CAT_SPRITES.WALK_1
              : CAT_SPRITES.WALK_2;
        break;
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
      default:
        catSprite = CAT_SPRITES.IDLE;
        break;
    }

    // Ground 32x32 cat sprite origin on mossy stone ledge
    const catOffsetX = Math.round(cat.x - 16);
    const catOffsetY = Math.round(cat.y - 31);

    blitSprite(buffer, width, height, catSprite, catColorMap, catOffsetX, catOffsetY, {
      scale: 1,
      flipX
    });

    // 4. Render Modern Chibi Mouse Sprite (24x24) with Aviator Goggles & Backpack
    const mouse = frame.mouse;
    if (mouse.unlocked && mouse.visible) {
      const mouseColorMap = getMouseColorMap(mouse.tier, mouse.variant, palette);
      const mFlipX = mouse.facing === "west" || mouse.facing === "left";
      let mouseSprite = MOUSE_SPRITES.IDLE;

      switch (mouse.action) {
        case "WALK":
        case "RUNNING":
        case "DARTING":
          mouseSprite = frame.tick % 2 === 0 ? MOUSE_SPRITES.WALK_0 : MOUSE_SPRITES.WALK_1;
          break;
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
        default:
          mouseSprite = MOUSE_SPRITES.IDLE;
          break;
      }

      const mouseOffsetX = Math.round(mouse.x - 12);
      const mouseOffsetY = Math.round(mouse.y - 23);

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
