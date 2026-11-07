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

    // 1. Render room backdrop, skirting board, and floorboards
    renderBackdrop(buffer, width, height, palette);

    // 2. Render environmental props (mouse hole, fish, fish bones, cheese, wool ball, bowls)
    renderProps(buffer, width, height, frame.props, palette);

    // 3. Render Cat Sprite
    const cat = frame.cat;
    const catColorMap = getCatColorMap(cat.variant, palette);
    let catSprite = CAT_SPRITES.SLEEPING;

    switch (cat.action) {
      case "WALKING":
      case "PROWLING":
        catSprite = frame.tick % 2 === 0 ? CAT_SPRITES.WALKING_0 : CAT_SPRITES.WALKING_1;
        break;
      case "EXPLORING":
      case "STALKING":
        catSprite = CAT_SPRITES.EXPLORING;
        break;
      case "EATING_FISH":
        catSprite = CAT_SPRITES.EATING_FISH;
        break;
      case "PLAYING_WOOL":
      case "POUNCING":
        catSprite = CAT_SPRITES.PLAYING_WOOL;
        break;
      case "GROOMING":
        catSprite = CAT_SPRITES.GROOMING;
        break;
      case "SLEEPING":
      default:
        catSprite = CAT_SPRITES.SLEEPING;
        break;
    }

    // Center sprite origin
    const catOffsetX = Math.round(cat.x - 8 * cat.scale);
    const catOffsetY = Math.round(cat.y - 8 * cat.scale);

    blitSprite(buffer, width, height, catSprite, catColorMap, catOffsetX, catOffsetY, {
      scale: cat.scale,
      flipX: cat.facing === "left"
    });

    // 4. Render Mouse Sprite (if unlocked and visible)
    const mouse = frame.mouse;
    if (mouse.unlocked && mouse.visible) {
      const mouseColorMap = getMouseColorMap(mouse.tier, mouse.variant, palette);
      let mouseSprite = MOUSE_SPRITES.EXPLORING;

      switch (mouse.action) {
        case "RUNNING":
        case "DARTING":
          mouseSprite = frame.tick % 2 === 0 ? MOUSE_SPRITES.RUNNING_0 : MOUSE_SPRITES.RUNNING_1;
          break;
        case "COLLECTING_CHEESE":
          mouseSprite = MOUSE_SPRITES.COLLECTING_CHEESE;
          break;
        case "OBSERVING_CAT":
        case "TAUNTING":
          mouseSprite = MOUSE_SPRITES.OBSERVING_CAT;
          break;
        case "SLEEPING":
          mouseSprite = MOUSE_SPRITES.SLEEPING;
          break;
        case "HIDING":
          mouseSprite = MOUSE_SPRITES.HIDING;
          break;
        case "EXPLORING":
        case "FORAGING":
        default:
          mouseSprite = MOUSE_SPRITES.EXPLORING;
          break;
      }

      const mouseOffsetX = Math.round(mouse.x - 5);
      const mouseOffsetY = Math.round(mouse.y - 4);

      blitSprite(buffer, width, height, mouseSprite, mouseColorMap, mouseOffsetX, mouseOffsetY, {
        scale: 1,
        flipX: mouse.facing === "left"
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
