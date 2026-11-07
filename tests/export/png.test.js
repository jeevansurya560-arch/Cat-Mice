import { describe, it, expect } from "vitest";
import { encodePng } from "../../src/export/png.js";
import { createBuffer, fillRect } from "../../src/rendering/canvas.js";

describe("Export: PNG Encoding", () => {
  it("should compress RGBA buffer to valid PNG format", async () => {
    const frame = createBuffer(16, 16);
    fillRect(frame, 16, 16, 2, 2, 12, 12, [50, 100, 200, 255]);

    const pngBuffer = await encodePng(frame, 16, 16);

    expect(Buffer.isBuffer(pngBuffer)).toBe(true);
    expect(pngBuffer.length).toBeGreaterThan(50);

    // Verify PNG magic numbers: 0x89 0x50 0x4E 0x47 (PNG)
    expect(pngBuffer[0]).toBe(0x89);
    expect(pngBuffer[1]).toBe(0x50); // P
    expect(pngBuffer[2]).toBe(0x4e); // N
    expect(pngBuffer[3]).toBe(0x47); // G
  });

  it("should reject buffers of mismatched size", async () => {
    const frame = createBuffer(10, 10);
    await expect(encodePng(frame, 20, 20)).rejects.toThrow(/Invalid buffer size for PNG encoding/);
  });
});
