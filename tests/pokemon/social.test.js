import { describe, it, expect } from "vitest";
import { evaluateEvolution } from "../../src/engine/evolution.js";
import {
  buildLinkedInPreviewSvg,
  buildEvolutionShowcaseSvg,
  buildLinkedInPostDraft
} from "../../src/social/linkedin.js";

describe("LinkedIn Presentation Package Engine", () => {
  it("should generate valid 1200x627 SVG markup for social preview", () => {
    const state = evaluateEvolution(750); // Charizard
    const svg = buildLinkedInPreviewSvg(state);

    expect(svg).toContain('viewBox="0 0 1200 627"');
    expect(svg).toContain("Charizard");
    expect(svg).toContain("750");
    expect(svg).toContain("47.5%");
  });

  it("should generate 5-stage Evolution Showcase SVG containing all 5 Pokémon forms", () => {
    const showcaseSvg = buildEvolutionShowcaseSvg();

    expect(showcaseSvg).toContain('viewBox="0 0 1400 500"');
    expect(showcaseSvg).toContain("Charmander");
    expect(showcaseSvg).toContain("Charmeleon");
    expect(showcaseSvg).toContain("Charizard");
    expect(showcaseSvg).toContain("Mega Charizard Y");
    expect(showcaseSvg).toContain("Mega Charizard X");
  });

  it("should build a professional LinkedIn post draft containing technical highlights and links", () => {
    const state = evaluateEvolution(1500); // Mega Charizard X
    const post = buildLinkedInPostDraft(state, {
      username: "dev",
      repoUrl: "https://github.com/dev/pokemon-evolution"
    });

    expect(post).toContain("GitHub Pokémon Evolution Companion");
    expect(post).toContain("Mega Charizard X");
    expect(post).toContain("Mathematical Progressive Colouring");
    expect(post).toContain("#opensource");
  });
});
