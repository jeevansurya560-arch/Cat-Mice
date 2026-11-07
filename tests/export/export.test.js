import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { stat, rm } from "node:fs/promises";
import { exportArtifacts } from "../../src/export/index.js";
import { createBuffer, fillRect } from "../../src/rendering/canvas.js";

describe("Export: Full Artifact Generation", () => {
  const testOutputDir = "output/test-export";

  it("should encode, write, and validate both GIF and PNG artifacts", async () => {
    const frame1 = createBuffer(32, 32);
    fillRect(frame1, 32, 32, 0, 0, 32, 32, [13, 17, 23, 255]);
    fillRect(frame1, 32, 32, 8, 8, 16, 16, [240, 150, 60, 255]);

    const frame2 = createBuffer(32, 32);
    fillRect(frame2, 32, 32, 0, 0, 32, 32, [13, 17, 23, 255]);
    fillRect(frame2, 32, 32, 10, 10, 16, 16, [240, 150, 60, 255]);

    const mockRendered = {
      width: 32,
      height: 32,
      fps: 12,
      frameCount: 2,
      frames: [frame1, frame2]
    };

    const summary = await exportArtifacts(mockRendered, {
      outputDir: testOutputDir,
      filenamePrefix: "test-run"
    });

    expect(summary.width).toBe(32);
    expect(summary.height).toBe(32);
    expect(summary.frameCount).toBe(2);
    expect(summary.gifSize).toBeGreaterThan(0);
    expect(summary.pngSize).toBeGreaterThan(0);

    // Verify files physically exist on disk
    const gifStat = await stat(summary.gifPath);
    const pngStat = await stat(summary.pngPath);
    expect(gifStat.isFile()).toBe(true);
    expect(pngStat.isFile()).toBe(true);

    // Cleanup test folder
    await rm(resolve(process.cwd(), testOutputDir), { recursive: true, force: true });
  });
});
