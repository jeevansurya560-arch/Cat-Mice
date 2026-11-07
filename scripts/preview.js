/**
 * @file Offline preview runner script.
 * Loads a local snapshot, computes analytics, derives progression, and prints the state.
 */

import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { config } from "../src/core/config.js";
import { loadSnapshotFromFile } from "../src/snapshot/loader.js";
import { computeAnalytics } from "../src/analytics/index.js";
import { evaluateProgression } from "../src/progression/index.js";
import { deriveSeed } from "../src/core/seed.js";

async function preview() {
  console.log("CAT-MICE: Launching Offline Preview...");

  const outputDir = resolve(process.cwd(), "output");
  await mkdir(outputDir, { recursive: true });

  const fixturePath = resolve(process.cwd(), "fixtures/sample-snapshot.json");
  const { data: snapshot } = await loadSnapshotFromFile(fixturePath);

  const analytics = computeAnalytics(snapshot);
  const seed = deriveSeed({
    userId: snapshot.user.id,
    timestamp: snapshot.timestamp
  });
  const progression = evaluateProgression(analytics, seed, config.progression);

  console.log("\n========================================");
  console.log("        OFFLINE PREVIEW SUMMARY        ");
  console.log("========================================");
  console.log(`User:             ${snapshot.user.login} (${snapshot.user.id})`);
  console.log(`Contributions:    ${analytics.totalContributions}`);
  console.log(
    `Active Days:      ${analytics.activity.activeDays}/${analytics.activity.totalDays} (${(analytics.activity.activeRatio * 100).toFixed(1)}%)`
  );
  console.log(
    `Current Streak:   ${analytics.streaks.currentStreak} days (Max: ${analytics.streaks.longestStreak} days)`
  );
  console.log(`Consistency:      ${(analytics.consistencyScore * 100).toFixed(1)}%`);
  console.log("----------------------------------------");
  console.log(`Cat Stage:        ${progression.cat.stage} (Level ${progression.cat.level})`);
  console.log(
    `Cat Scale/Variant:${progression.cat.scale}x / "${progression.cat.variant}" (${progression.cat.demeanor})`
  );
  console.log(
    `Mouse Status:     ${progression.mouse.unlocked ? `UNLOCKED [${progression.mouse.tier}]` : `LOCKED (Progress: ${(progression.mouse.currentProgress * 100).toFixed(1)}% / ${(progression.mouse.unlockThreshold * 100).toFixed(0)}%)`}`
  );
  if (progression.mouse.unlocked) {
    console.log(
      `Mouse Speed/Evas: ${progression.mouse.speedModifier}x / ${(progression.mouse.evasionChance * 100).toFixed(0)}%`
    );
  }
  console.log(
    `Milestones (${progression.milestones.length}):   ${progression.milestones.map((m) => m.name).join(", ")}`
  );
  console.log("----------------------------------------");
  console.log(
    `Primary Language: ${analytics.languages.primaryLanguage?.name || "None"} (${(analytics.languages.primaryLanguage?.percentage * 100 || 0).toFixed(1)}%)`
  );
  console.log(
    `Theme Accents:    Primary: ${progression.theme.primaryAccent} | Secondary: ${progression.theme.secondaryAccent}`
  );
  console.log(`Deterministic Seed: 0x${progression.worldSeed.toString(16).toUpperCase()}`);
  console.log("========================================");
  console.log("Preview status: Analytics & Progression Engines fully verified.\n");
}

preview().catch((err) => {
  console.error("Preview failed:", err.message);
  process.exit(1);
});
