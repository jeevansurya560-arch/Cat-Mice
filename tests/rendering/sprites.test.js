import { describe, it, expect } from "vitest";
import { CAT_SPRITES, getCatColorMap } from "../../src/rendering/cat.js";
import { MOUSE_SPRITES, getMouseColorMap } from "../../src/rendering/mouse.js";
import { createPalette } from "../../src/rendering/palette.js";

describe("Rendering: Character Sprites & Color Maps", () => {
  const palette = createPalette();

  it("should have consistent 16x16 dimensions across all cat sprites", () => {
    for (const [name, sprite] of Object.entries(CAT_SPRITES)) {
      expect(sprite, `Cat sprite ${name} row count`).toHaveLength(16);
      for (const row of sprite) {
        expect(row.length, `Cat sprite ${name} row width`).toBe(16);
      }
    }
  });

  it("should have consistent 10x8 dimensions across all mouse sprites", () => {
    for (const [name, sprite] of Object.entries(MOUSE_SPRITES)) {
      expect(sprite, `Mouse sprite ${name} row count`).toHaveLength(8);
      for (const row of sprite) {
        expect(row.length, `Mouse sprite ${name} row width`).toBe(10);
      }
    }
  });

  it("should resolve valid color maps for all cat variants", () => {
    const variants = ["tabby", "calico", "tuxedo", "ginger", "midnight"];
    for (const v of variants) {
      const map = getCatColorMap(v, palette);
      expect(map["O"]).toBeDefined();
      expect(map["B"]).toBeDefined();
      expect(map["."][3]).toBe(0); // Transparent
    }
  });

  it("should resolve valid color maps for mouse agility tiers", () => {
    const tiers = ["SCOUT", "RUNNER", "NINJA"];
    for (const t of tiers) {
      const map = getMouseColorMap(t, "field_mouse", palette);
      expect(map["M"]).toBeDefined();
      expect(map["P"]).toBeDefined();
    }
  });
});
