/**
 * @file Offline preview runner script.
 * Loads a local snapshot and prints the preview execution state.
 */

import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { config } from "../src/core/config.js";
import { loadSnapshotFromFile } from "../src/snapshot/loader.js";

async function preview() {
  console.log("CAT-MICE: Launching Offline Preview...");

  const outputDir = resolve(process.cwd(), "output");
  await mkdir(outputDir, { recursive: true });

  const fixturePath = resolve(process.cwd(), "fixtures/sample-snapshot.json");
  const { data: snapshot } = await loadSnapshotFromFile(fixturePath);

  console.log("\n========================================");
  console.log("        OFFLINE PREVIEW SUMMARY        ");
  console.log("========================================");
  console.log(`User:             ${snapshot.user.login} (${snapshot.user.id})`);
  console.log(`Contributions:    ${snapshot.metrics.totalContributions}`);
  console.log(`Calendar Days:    ${snapshot.metrics.calendarDays.length} records`);
  console.log(`Languages:        ${snapshot.metrics.languages.map((l) => l.name).join(", ")}`);
  console.log(
    `Render Canvas:    ${config.rendering.width}x${config.rendering.height} @ ${config.rendering.fps} FPS (Scale: ${config.rendering.scale}x)`
  );
  console.log(`Offline Mode:     ${config.runtime.offlineMode ? "Enabled" : "Disabled"}`);
  console.log("========================================");
  console.log("Preview status: Ready for Phase 1 simulation engines.\n");
}

preview().catch((err) => {
  console.error("Preview failed:", err.message);
  process.exit(1);
});
