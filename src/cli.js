#!/usr/bin/env node
/**
 * @file GitHub Pokémon Evolution Companion CLI.
 * Drives evolution progression, mathematical progressive colouring, SVG/GIF rendering,
 * universal README updates, and LinkedIn package generation.
 */

import { resolve } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { evaluateEvolution } from "./engine/evolution.js";
import { renderSvg, renderGif } from "./engine/renderer.js";
import { updateReadmeFile } from "./readme/updater.js";
import { generateLinkedInPackage } from "./social/linkedin.js";
import { fetchGitHubSnapshot } from "./github/index.js";
import { loadSnapshotFromFile, loadSnapshotFromMemory } from "./snapshot/loader.js";

/**
 * Parses command-line arguments into structured options.
 *
 * @param {string[]} args
 * @returns {Record<string, any>}
 */
export function parseArgs(args) {
  const options = {
    mode: "offline",
    contributions: null,
    snapshot: "fixtures/sample-snapshot.json",
    user: null,
    token: null,
    out: "assets/generated",
    readme: null,
    social: false,
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
    } else if (arg === "--social") {
      options.social = true;
    } else if (arg.startsWith("--contributions=")) {
      options.contributions = Number(arg.split("=")[1]);
    } else if (arg === "--contributions" && i + 1 < args.length) {
      options.contributions = Number(args[++i]);
    } else if (arg.startsWith("--out=")) {
      options.out = arg.split("=")[1];
    } else if (arg === "--out" && i + 1 < args.length) {
      options.out = args[++i];
    } else if (arg.startsWith("--user=")) {
      options.user = arg.split("=")[1];
    } else if (arg === "--user" && i + 1 < args.length) {
      options.user = args[++i];
    } else if (arg.startsWith("--token=")) {
      options.token = arg.split("=")[1];
    } else if (arg === "--token" && i + 1 < args.length) {
      options.token = args[++i];
    } else if (arg.startsWith("--mode=")) {
      options.mode = arg.split("=")[1];
    } else if (arg === "--mode" && i + 1 < args.length) {
      options.mode = args[++i];
    } else if (arg.startsWith("--readme=")) {
      options.readme = arg.split("=")[1];
    } else if (arg === "--readme" && i + 1 < args.length) {
      options.readme = args[++i];
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
  pokemon-evolution [options]
  node src/cli.js [options]

Options:
  --mode <mode>            Execution mode: offline (default) | production
  --contributions <count>  Override lifetime contribution count directly
  --user <login>           GitHub username (required for production mode)
  --token <token>          GitHub token (optional, reads GITHUB_TOKEN by default)
  --out <dir>              Output directory for generated GIF and SVG (default: assets/generated)
  --readme <path>          Safely update managed section in profile/repo README.md
  --social                 Generate 1200x627 LinkedIn preview, showcase, and post draft
  -d, --details            Print detailed mathematical coloring and region weights breakdown
  -h, --help               Show help
  -v, --version            Show version
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
    io.stdout("v1.0.0");
    return 0;
  }

  const executionMode = String(options.mode).toLowerCase();
  if (executionMode !== "offline" && executionMode !== "production") {
    io.stderr(
      `Error: Mode "${options.mode}" is not supported. Use --mode=offline or --mode=production.`
    );
    return 1;
  }

  let lifetimeContributions = 0;
  let username = options.user || "pixel-developer";

  if (options.contributions !== null && !isNaN(options.contributions)) {
    lifetimeContributions = Math.max(0, options.contributions);
  } else if (executionMode === "production") {
    const targetUser = options.user || process.env.GITHUB_USERNAME;
    if (!targetUser) {
      io.stderr(
        "Error: Production mode requires a GitHub username via --user or GITHUB_USERNAME environment variable."
      );
      return 1;
    }
    username = targetUser;
    try {
      const rawGitHubData = await fetchGitHubSnapshot({
        username: targetUser,
        token: options.token || process.env.GITHUB_TOKEN
      });
      const result = loadSnapshotFromMemory(rawGitHubData, "github-api");
      lifetimeContributions = result.data.metrics.totalContributions;
    } catch (err) {
      io.stderr(`Notice: ${err.message}. Using baseline developer snapshot for @${targetUser}.`);
      const samplePath = resolve(process.cwd(), "fixtures/sample-snapshot.json");
      const result = await loadSnapshotFromFile(samplePath);
      lifetimeContributions = result.data.metrics.totalContributions;
    }
  } else {
    // Offline mode with snapshot file
    const snapshotPath = resolve(process.cwd(), String(options.snapshot));
    try {
      const result = await loadSnapshotFromFile(snapshotPath);
      lifetimeContributions = result.data.metrics.totalContributions;
      username = result.data.user.login;
    } catch {
      lifetimeContributions = 750; // High-quality default for Charizard preview
    }
  }

  // 1. Evaluate Evolution State & Mathematical Progressive Colouring
  const evolutionState = evaluateEvolution(lifetimeContributions);
  const currentForm = evolutionState.currentForm;

  // 2. Render Scalable SVG and Animated GIF
  const outDir = resolve(process.cwd(), options.out);
  await mkdir(outDir, { recursive: true });

  const svgContent = renderSvg(evolutionState);
  const svgPath = resolve(outDir, "pokemon-evolution.svg");
  await writeFile(svgPath, svgContent, "utf-8");

  const gifBuffer = await renderGif(evolutionState, { width: 360, height: 318, fps: 10 });
  const gifPath = resolve(outDir, "pokemon-evolution.gif");
  await writeFile(gifPath, gifBuffer);

  // Also mirror to dist/ for profile embeds if dist directory is requested
  const distDir = resolve(process.cwd(), "dist");
  await mkdir(distDir, { recursive: true });
  await writeFile(resolve(distDir, "pokemon-evolution.svg"), svgContent, "utf-8");
  await writeFile(resolve(distDir, "pokemon-evolution.gif"), gifBuffer);

  // 3. Update README if requested
  let readmeStatus = null;
  if (options.readme) {
    const readmePath = resolve(process.cwd(), options.readme);
    readmeStatus = await updateReadmeFile(readmePath, evolutionState, {
      assetMode: "relative",
      username
    });
  }

  // 4. Generate LinkedIn Social Package if requested
  let socialStatus = null;
  if (options.social) {
    socialStatus = await generateLinkedInPackage(evolutionState, "assets/social", {
      username,
      repoUrl: `https://github.com/${username}/pokemon-evolution`
    });
  }

  // 5. Output Summary Banner
  let banner = `========================================
   GITHUB POKÉMON EVOLUTION COMPANION
========================================

Companion: ${currentForm.name} (No. ${currentForm.dex})
Type: [${currentForm.type.join(", ")}]
Stage Index: ${evolutionState.stageIndex + 1} / 5
Lifetime Contributions: ${lifetimeContributions}
Stage Colouring: ${evolutionState.colouringProgress}%
Status: ${evolutionState.isMastery ? `Mastery Level ${evolutionState.masteryLevel}` : `${evolutionState.stageContributions} / ${evolutionState.requiredContributions} to next evolution`}

Artifacts Generated:
  - SVG: ${svgPath} (${(Buffer.byteLength(svgContent) / 1024).toFixed(1)} KB)
  - GIF: ${gifPath} (${(gifBuffer.length / 1024).toFixed(1)} KB)`;

  if (readmeStatus) {
    banner += `\n  - README: ${readmeStatus.path} (${readmeStatus.updated ? "Updated" : "Inserted"})`;
  }

  if (socialStatus) {
    banner += `\n  - LinkedIn Preview: ${socialStatus.previewPath}\n  - Evolution Showcase: ${socialStatus.showcasePath}\n  - LinkedIn Post: ${socialStatus.postPath}`;
  }

  if (options.details) {
    banner += `\n\n[Anatomical Region Allocations]`;
    for (const r of evolutionState.coloringState.regions) {
      banner += `\n  - ${r.name.padEnd(28)}: ${(r.weight * 100).toFixed(0)}% weight | ${(r.completion * 100).toFixed(1)}% filled [${r.status}]`;
    }
  }

  io.stdout(banner);
  return 0;
}

// Execute directly if run as a script
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))) {
  main().then((code) => {
    process.exit(code);
  });
}
