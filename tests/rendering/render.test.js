import { describe, it, expect } from "vitest";
import { renderTimeline } from "../../src/rendering/index.js";
import { simulateWorld } from "../../src/simulation/state.js";

describe("Rendering: Full Timeline Rasterization", () => {
  const mockProgression = {
    cat: { stage: "ADULT", scale: 2, variant: "tabby", demeanor: "alert", level: 30 },
    mouse: {
      unlocked: true,
      tier: "RUNNER",
      speedModifier: 1.25,
      evasionChance: 0.6,
      variant: "field_mouse"
    },
    worldSeed: 7777
  };

  it("should rasterize all frames of a timeline into valid RGBA buffers", () => {
    const timeline = simulateWorld(mockProgression, { totalTicks: 15, width: 64, height: 64 });
    const rendered = renderTimeline(timeline, { primaryAccent: "#f1e05a" }, { fps: 12 });

    expect(rendered.frameCount).toBe(15);
    expect(rendered.frames).toHaveLength(15);
    expect(rendered.width).toBe(64);
    expect(rendered.height).toBe(64);
    expect(rendered.fps).toBe(12);

    const firstFrame = rendered.frames[0];
    expect(firstFrame).toBeInstanceOf(Uint8ClampedArray);
    expect(firstFrame.length).toBe(64 * 64 * 4);

    // Verify buffer has non-zero pixels (is actually rendered)
    let nonZero = 0;
    for (let i = 0; i < firstFrame.length; i += 4) {
      if (firstFrame[i + 3] === 255) {
        nonZero++;
      }
    }
    expect(nonZero).toBeGreaterThan(0);
  });
});
