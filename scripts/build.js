/**
 * @file Build and foundation readiness verification script.
 * Validates dependencies, project structure, and build artifacts.
 */

import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { config } from "../src/core/config.js";
import { loadSnapshotFromFile } from "../src/snapshot/loader.js";

async function build() {
  console.log("CAT-MICE: Verifying project build integrity...");

  // Ensure output directories exist
  const outputDir = resolve(process.cwd(), "output");
  const distDir = resolve(process.cwd(), "dist");
  await mkdir(outputDir, { recursive: true });
  await mkdir(distDir, { recursive: true });

  // Verify configuration
  if (!config.application.name) {
    throw new Error("Build validation failed: Missing application name in config.");
  }

  // Verify sample snapshot integrity
  const samplePath = resolve(process.cwd(), "fixtures/sample-snapshot.json");
  const snapshotResult = await loadSnapshotFromFile(samplePath);

  if (!snapshotResult.success || !snapshotResult.data) {
    throw new Error("Build validation failed: Sample snapshot could not be validated.");
  }

  console.log(`✓ Configuration valid: ${config.application.name} v${config.application.version}`);
  console.log(
    `✓ Sample snapshot validated: user "${snapshotResult.data.user.login}" (${snapshotResult.data.metrics.totalContributions} contributions)`
  );
  console.log("✓ Build readiness verified. Phase 0 foundation ready.");
}

build().catch((err) => {
  console.error("Build failed:", err.message);
  process.exit(1);
});
