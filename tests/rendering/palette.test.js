import { describe, it, expect } from "vitest";
import { hexToRgba, createPalette } from "../../src/rendering/palette.js";

describe("Rendering: Palette & Color Generation", () => {
  it("should convert hex codes to RGBA correctly", () => {
    expect(hexToRgba("#ffffff")).toEqual([255, 255, 255, 255]);
    expect(hexToRgba("#000000")).toEqual([0, 0, 0, 255]);
    expect(hexToRgba("#ff0000", 128)).toEqual([255, 0, 0, 128]);
    expect(hexToRgba("#3178c6")).toEqual([49, 120, 198, 255]);
  });

  it("should fall back gracefully on invalid hex strings", () => {
    expect(hexToRgba("not-a-color")).toEqual([0, 0, 0, 255]);
  });

  it("should create full 16-color palette incorporating primary and secondary accents", () => {
    const palette = createPalette({
      primaryAccent: "#dea584", // Rust terracotta
      secondaryAccent: "#3178c6" // TypeScript azure
    });

    expect(palette.primaryAccent).toEqual([222, 165, 132, 255]);
    expect(palette.secondaryAccent).toEqual([49, 120, 198, 255]);
    expect(palette.background).toBeDefined();
    expect(palette.catTabbyLight).toBeDefined();
    expect(palette.mouseFurGrey).toBeDefined();
  });
});
