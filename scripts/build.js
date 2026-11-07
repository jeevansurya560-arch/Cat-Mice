/**
 * @file Build and end-to-end pipeline verification script.
 * Validates dependencies, project structure, and produces distribution artifacts in dist/.
 */

import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { config } from "../src/core/config.js";
import { loadSnapshotFromFile } from "../src/snapshot/loader.js";
import { computeAnalytics } from "../src/analytics/index.js";
import { evaluateProgression } from "../src/progression/index.js";
import { simulateWorld } from "../src/simulation/state.js";
import { renderTimeline } from "../src/rendering/index.js";
import { exportArtifacts } from "../src/export/index.js";
import { deriveIdentitySeed, deriveSimulationSeed } from "../src/core/seed.js";

async function build() {
  console.log("CAT-MICE: Verifying project build integrity...");

  const outputDir = resolve(process.cwd(), "output");
  const distDir = resolve(process.cwd(), "dist");
  await mkdir(outputDir, { recursive: true });
  await mkdir(distDir, { recursive: true });

  // 1. Verify configuration
  if (!config.application.name) {
    throw new Error("Build validation failed: Missing application name in config.");
  }

  // 2. Load and validate sample snapshot
  const samplePath = resolve(process.cwd(), "fixtures/sample-snapshot.json");
  const { data: snapshot } = await loadSnapshotFromFile(samplePath);

  // 3. Execute End-to-End Pipeline
  const analytics = computeAnalytics(snapshot);
  const identitySeed = deriveIdentitySeed({
    userId: snapshot.user.id,
    languages: snapshot.metrics.languages
  });
  const simulationSeed = deriveSimulationSeed({
    userId: snapshot.user.id,
    timestamp: snapshot.timestamp
  });
  const progression = evaluateProgression(
    analytics,
    { identitySeed, simulationSeed },
    config.progression
  );
  const timeline = simulateWorld(progression, { totalTicks: 60 });
  const rendered = renderTimeline(timeline, progression.theme, { fps: config.rendering.fps });

  // 4. Export Production Artifacts to dist/
  const exportSummary = await exportArtifacts(rendered, {
    outputDir: "dist",
    filenamePrefix: "cat-mice"
  });

  console.log(`✓ Configuration valid: ${config.application.name} v${config.application.version}`);
  console.log(
    `✓ Pipeline verified: ${snapshot.user.login} (${analytics.totalContributions} contributions)`
  );
  console.log(
    `✓ Distribution artifacts built: GIF (${(exportSummary.gifSize / 1024).toFixed(1)} KB) | PNG (${(exportSummary.pngSize / 1024).toFixed(1)} KB)`
  );
  console.log("✓ Build complete. Application is fully operational.");
}

build().catch((err) => {
  console.error("Build failed:", err.message);
  process.exit(1);
});
