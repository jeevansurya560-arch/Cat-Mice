import { describe, it, expect } from "vitest";
import { encodeGif } from "../../src/export/gif.js";
import { createBuffer, fillRect } from "../../src/rendering/canvas.js";

describe("Export: GIF Encoding", () => {
  it("should encode animated GIF bytes with valid GIF89a header", () => {
    const frame1 = createBuffer(16, 16);
    fillRect(frame1, 16, 16, 0, 0, 8, 8, [255, 0, 0, 255]);

    const frame2 = createBuffer(16, 16);
    fillRect(frame2, 16, 16, 8, 8, 8, 8, [0, 255, 0, 255]);

    const renderedBuffers = {
      width: 16,
      height: 16,
      fps: 10,
      frameCount: 2,
      frames: [frame1, frame2]
    };

    const gifBytes = encodeGif(renderedBuffers, { maxColors: 16, loop: true });

    expect(gifBytes).toBeInstanceOf(Uint8Array);
    expect(gifBytes.length).toBeGreaterThan(50);

    // Verify GIF header "GIF89a"
    const header = String.fromCharCode(...gifBytes.slice(0, 6));
    expect(header).toBe("GIF89a");
  });
});
