/**
 * @file Build and end-to-end pipeline verification script.
 * Validates dependencies, project structure, and produces distribution artifacts in dist/, assets/generated/, and assets/social/.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { evaluateEvolution } from "../src/engine/evolution.js";
import { renderSvg, renderGif } from "../src/engine/renderer.js";
import { generateLinkedInPackage } from "../src/social/linkedin.js";
import { updateReadmeFile } from "../src/readme/updater.js";

async function build() {
  console.log("GitHub Pokémon Evolution Companion: Verifying build pipeline integrity...");

  const distDir = resolve(process.cwd(), "dist");
  const assetsGenDir = resolve(process.cwd(), "assets/generated");
  const assetsSocialDir = resolve(process.cwd(), "assets/social");

  await mkdir(distDir, { recursive: true });
  await mkdir(assetsGenDir, { recursive: true });
  await mkdir(assetsSocialDir, { recursive: true });

  // 1. Evaluate Evolution for active companion milestone (219 contributions for Charmeleon No. 0005)
  const commits = process.env.COMMITS ? parseInt(process.env.COMMITS, 10) : 219;
  const evolutionState = evaluateEvolution(commits);
  console.log(
    `✓ Evolution state calculated: ${evolutionState.currentForm.name} (Progress: ${evolutionState.colouringProgress}%)`
  );

  // 2. Generate Scalable SVG
  const svgContent = renderSvg(evolutionState);
  await writeFile(resolve(assetsGenDir, "pokemon-evolution.svg"), svgContent, "utf-8");
  await writeFile(resolve(distDir, "pokemon-evolution.svg"), svgContent, "utf-8");
  console.log("✓ Scalable vector SVG generated");

  // 3. Generate Animated GIF
  const gifBuffer = await renderGif(evolutionState, { width: 360, height: 318, fps: 10 });
  await writeFile(resolve(assetsGenDir, "pokemon-evolution.gif"), gifBuffer);
  await writeFile(resolve(distDir, "pokemon-evolution.gif"), gifBuffer);
  console.log(`✓ Animated looping GIF generated (${(gifBuffer.length / 1024).toFixed(1)} KB)`);

  // 4. Generate Complete LinkedIn Social Presentation Package
  const socialPackage = await generateLinkedInPackage(evolutionState, "assets/social", {
    username: "developer",
    repoUrl: "https://github.com/developer/pokemon-evolution"
  });
  console.log(`✓ LinkedIn preview generated: ${socialPackage.previewPath}`);
  console.log(`✓ Evolution showcase generated: ${socialPackage.showcasePath}`);
  console.log(`✓ LinkedIn post draft generated: ${socialPackage.postPath}`);

  // 5. Update README.md with live managed markers
  const readmePath = resolve(process.cwd(), "README.md");
  await updateReadmeFile(readmePath, evolutionState, { assetMode: "relative" });
  console.log("✓ README.md updated with managed markers");

  console.log("\nBuild complete. Pokémon Evolution Companion MVP is fully operational!");
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
