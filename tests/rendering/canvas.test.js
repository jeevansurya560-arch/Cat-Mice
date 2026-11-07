import { describe, it, expect } from "vitest";
import {
  createBuffer,
  setPixel,
  fillRect,
  clearBuffer,
  blitSprite
} from "../../src/rendering/canvas.js";

describe("Rendering: Canvas Pixel Buffer Operations", () => {
  it("should create correct size RGBA buffer", () => {
    const buffer = createBuffer(10, 10);
    expect(buffer).toBeInstanceOf(Uint8ClampedArray);
    expect(buffer.length).toBe(10 * 10 * 4);
  });

  it("should set and clamp pixel boundaries safely", () => {
    const buffer = createBuffer(10, 10);
    setPixel(buffer, 10, 10, 2, 3, [255, 128, 64, 255]);

    const idx = (3 * 10 + 2) * 4;
    expect(buffer[idx]).toBe(255);
    expect(buffer[idx + 1]).toBe(128);
    expect(buffer[idx + 2]).toBe(64);
    expect(buffer[idx + 3]).toBe(255);

    // Out of bounds should not throw
    expect(() => setPixel(buffer, 10, 10, -5, 100, [0, 0, 0, 255])).not.toThrow();
  });

  it("should fill rectangles accurately", () => {
    const buffer = createBuffer(8, 8);
    fillRect(buffer, 8, 8, 2, 2, 3, 3, [100, 150, 200, 255]);

    // Check pixel at (3, 3) inside rect
    const idxIn = (3 * 8 + 3) * 4;
    expect(buffer[idxIn]).toBe(100);

    // Check pixel at (0, 0) outside rect
    const idxOut = 0;
    expect(buffer[idxOut]).toBe(0);
  });

  it("should clear the entire buffer with a solid color", () => {
    const buffer = createBuffer(4, 4);
    clearBuffer(buffer, [50, 60, 70, 255]);

    expect(buffer[0]).toBe(50);
    expect(buffer[1]).toBe(60);
    expect(buffer[2]).toBe(70);
    expect(buffer[3]).toBe(255);
  });

  it("should blit sprite matrix with scale and transparency", () => {
    const buffer = createBuffer(10, 10);
    const sprite = ["X.", ".X"];
    const colorMap = {
      X: [255, 0, 0, 255],
      ".": [0, 0, 0, 0]
    };

    blitSprite(buffer, 10, 10, sprite, colorMap, 0, 0, { scale: 1 });

    // (0,0) is X
    expect(buffer[0]).toBe(255);
    // (1,0) is transparent
    expect(buffer[4 + 3]).toBe(0);
  });
});
