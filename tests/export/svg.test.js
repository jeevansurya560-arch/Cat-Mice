import { describe, it, expect } from "vitest";
import { spriteToSvg } from "../../src/svg/character.js";
import { generateWorldSvg } from "../../src/svg/world.js";
import { CAT_SPRITES, getCatColorMap } from "../../src/rendering/cat.js";
import { MOUSE_SPRITES, getMouseColorMap } from "../../src/rendering/mouse.js";
import { createPalette } from "../../src/rendering/palette.js";

describe("Export: Scalable Vector Graphics (SVG) Engine", () => {
  const palette = createPalette();

  it("should generate valid standalone Cat SVG with 128x128 viewBox and crispEdges", () => {
    const colorMap = getCatColorMap("ginger", palette);
    const svg = spriteToSvg(CAT_SPRITES.IDLE_SOUTH, colorMap, {
      title: "CAT-MICE Cat Top-Down",
      viewBoxSize: 128
    });

    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('viewBox="0 0 128 128"');
    expect(svg).toContain('shape-rendering="crispEdges"');
    expect(svg).toContain("<title>CAT-MICE Cat Top-Down</title>");
    expect(svg).toContain("</svg>");
    expect(svg).not.toContain("<script");
    expect(svg).not.toContain("javascript:");
  });

  it("should generate valid standalone Mouse SVG with 128x128 viewBox", () => {
    const colorMap = getMouseColorMap("CONSISTENT", "companion", palette);
    const svg = spriteToSvg(MOUSE_SPRITES.IDLE_SOUTH, colorMap, {
      title: "CAT-MICE Mouse Top-Down",
      viewBoxSize: 128
    });

    expect(svg).toContain('viewBox="0 0 128 128"');
    expect(svg).toContain('shape-rendering="crispEdges"');
    expect(svg).not.toContain("<script");
  });

  it("should generate valid full ecosystem SVG with layered groups", () => {
    const mockFrame = {
      tick: 0,
      cat: { x: 120, y: 60, action: "IDLE", variant: "ginger", facing: "south" },
      mouse: {
        unlocked: true,
        visible: true,
        x: 160,
        y: 70,
        action: "WORK",
        tier: "CONSISTENT",
        variant: "companion",
        facing: "south"
      },
      props: {
        mouseHole: { x: 210, y: 75 },
        fish: { x: 50, y: 75, consumed: false },
        cheese: { x: 165, y: 50, collected: false },
        woolBall: { x: 105, y: 55 }
      }
    };

    const svg = generateWorldSvg(mockFrame, { primaryLanguage: "JavaScript" });

    expect(svg).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(svg).toContain('viewBox="0 0 240 120"');
    expect(svg).toContain('id="environment"');
    expect(svg).toContain('id="props"');
    expect(svg).toContain('id="cat"');
    expect(svg).toContain('id="mouse"');
    expect(svg).toContain("</svg>");
    expect(svg).not.toContain("<script");
  });
});
