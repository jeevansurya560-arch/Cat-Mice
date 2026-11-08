import { describe, it, expect } from "vitest";
import { updateReadmeContent, MARKER_START, MARKER_END } from "../../src/readme/updater.js";
import { evaluateEvolution } from "../../src/engine/evolution.js";

describe("Universal README Integration Engine", () => {
  it("should insert managed markers into an existing markdown file without duplicate sections", () => {
    const originalReadme = `# My Portfolio\n\nWelcome to my open source projects.\n\n## Contact\nFind me on GitHub.`;
    const state = evaluateEvolution(750); // Charizard

    const result = updateReadmeContent(originalReadme, state, { assetMode: "relative" });
    expect(result.inserted).toBe(true);
    expect(result.updated).toBe(false);
    expect(result.content).toContain(MARKER_START);
    expect(result.content).toContain(MARKER_END);
    expect(result.content).toContain("Charizard");
    expect(result.content).toContain("750 contributions");
    expect(result.content).toContain("## Contact"); // preserved!
  });

  it("should update only within managed markers when markers already exist", () => {
    const existingReadme = `# Profile\n\n${MARKER_START}\nOld Content\n${MARKER_END}\n\n## Footer Notes\nKeep this intact.`;
    const state = evaluateEvolution(1250); // Mega Charizard Y

    const result = updateReadmeContent(existingReadme, state, { assetMode: "relative" });
    expect(result.updated).toBe(true);
    expect(result.inserted).toBe(false);
    expect(result.content).not.toContain("Old Content");
    expect(result.content).toContain("Mega Charizard Y");
    expect(result.content).toContain("## Footer Notes\nKeep this intact.");
  });

  it("should generate profile-relative URL when assetMode is profile", () => {
    const content = `# My Profile\n`;
    const state = evaluateEvolution(350); // Charmeleon
    const result = updateReadmeContent(content, state, {
      assetMode: "profile",
      username: "ash-ketchum"
    });

    expect(result.content).toContain(
      "https://raw.githubusercontent.com/ash-ketchum/ash-ketchum/main/assets/generated/pokemon-evolution.gif"
    );
  });
});
