#!/usr/bin/env node
/**
 * @file CAT-MICE CLI Entry Point.
 * Orchestrates application modes, snapshot loading, and pipeline initialization.
 */

import { resolve } from "node:path";
import { config } from "./core/config.js";
import { loadSnapshotFromFile } from "./snapshot/loader.js";
import { computeAnalytics } from "./analytics/index.js";
import { evaluateProgression } from "./progression/index.js";
import { simulateWorld } from "./simulation/state.js";
import { deriveSeed } from "./core/seed.js";

/**
 * Parses command-line arguments into structured options.
 *
 * @param {string[]} args
 * @returns {Record<string, string | boolean>}
 */
export function parseArgs(args) {
  const options = {
    mode: "offline",
    snapshot: "fixtures/sample-snapshot.json",
    details: false,
    help: false,
    version: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--version" || arg === "-v") {
      options.version = true;
    } else if (arg === "--details" || arg === "-d") {
      options.details = true;
    } else if (arg.startsWith("--mode=")) {
      options.mode = arg.split("=")[1];
    } else if (arg === "--mode" && i + 1 < args.length) {
      options.mode = args[++i];
    } else if (arg.startsWith("--snapshot=")) {
      options.snapshot = arg.split("=")[1];
    } else if (arg === "--snapshot" && i + 1 < args.length) {
      options.snapshot = args[++i];
    }
  }

  return options;
}

/**
 * Prints CLI usage information.
 */
export function printHelp() {
  console.log(`
Usage:
  cat-mice [options]
  node src/cli.js [options]

Options:
  --mode <mode>        Execution mode: offline (default) | production
  --snapshot <path>    Path to snapshot JSON (default: fixtures/sample-snapshot.json)
  -d, --details        Print analytics and character progression details
  -h, --help           Show help
  -v, --version        Show version
`);
}

/**
 * Main CLI execution function.
 *
 * @param {string[]} [rawArgs=process.argv.slice(2)]
 * @param {object} [io={ stdout: console.log, stderr: console.error }]
 * @returns {Promise<number>} Exit code (0 for success, 1 for failure)
 */
export async function main(
  rawArgs = process.argv.slice(2),
  io = { stdout: console.log, stderr: console.error }
) {
  const options = parseArgs(rawArgs);

  if (options.help) {
    printHelp();
    return 0;
  }

  if (options.version) {
    io.stdout(`v${config.application.version}`);
    return 0;
  }

  const executionMode = String(options.mode).toLowerCase();

  if (executionMode !== "offline") {
    io.stderr(`Error: Mode "${options.mode}" is not supported in Phase 0/1. Use --mode=offline.`);
    return 1;
  }

  // 1. Verify Configuration
  if (!config || !config.application || !config.runtime) {
    io.stderr("Error: Configuration failed to load.");
    return 1;
  }

  // 2. Load and validate snapshot
  const snapshotPath = resolve(process.cwd(), String(options.snapshot));
  let loadedSnapshot;

  try {
    const result = await loadSnapshotFromFile(snapshotPath);
    loadedSnapshot = result.data;
  } catch (err) {
    io.stderr(`Snapshot Loading Error: ${err.message}`);
    return 1;
  }

  if (!loadedSnapshot) {
    io.stderr("Error: Snapshot validation yielded empty data.");
    return 1;
  }

  // 3. Compute Analytics, Progression, and Simulation Timeline
  const analytics = computeAnalytics(loadedSnapshot);
  const seed = deriveSeed({
    userId: loadedSnapshot.user.id,
    timestamp: loadedSnapshot.timestamp
  });
  const progression = evaluateProgression(analytics, seed, config.progression);
  const timeline = simulateWorld(progression, { totalTicks: 60 });

  // 4. Print Foundation Banner
  let output = `========================================
                 CAT-MICE
========================================

Version: ${config.application.version}
Runtime: Node.js 22
Language: JavaScript ES Modules

Execution Mode: Offline

Configuration: Loaded
Snapshot: Validated
Application: Initialized

========================================
       FOUNDATION READY
========================================`;

  if (options.details) {
    output += `\n
[Progression Summary]
- User: ${loadedSnapshot.user.login} (${analytics.totalContributions} contributions)
- Cat: ${progression.cat.stage} (Lv. ${progression.cat.level}, ${progression.cat.variant}, ${progression.cat.demeanor})
- Mouse: ${progression.mouse.unlocked ? `UNLOCKED (${progression.mouse.tier})` : "LOCKED"}
- Consistency: ${(analytics.consistencyScore * 100).toFixed(1)}% | Streak: ${analytics.streaks.currentStreak}d (Max: ${analytics.streaks.longestStreak}d)
- Milestones: ${progression.milestones.map((m) => m.name).join(", ") || "None"}
- Primary Language: ${analytics.languages.primaryLanguage?.name || "None"} (${analytics.languages.primaryAccentColor})
- Simulation: ${timeline.totalTicks} frames generated (${timeline.events.length} interaction event(s))`;
  }

  io.stdout(output);
  return 0;
}

// Execute directly if run as a script
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))) {
  main().then((code) => {
    if (code !== 0) {
      process.exit(code);
    }
  });
}
