/**
 * @file Offline preview runner script.
 * Displays interactive console preview of all 5 Pokémon evolution stages and their mathematical coloring.
 */

import { evaluateEvolution } from "../src/engine/evolution.js";

async function preview() {
  console.log("========================================");
  console.log("   POKÉMON EVOLUTION COMPANION PREVIEW  ");
  console.log("========================================\n");

  const samplePoints = [
    { title: "Stage 1 — Charmander (Early)", commits: 50 },
    { title: "Stage 2 — Charmeleon (Mid)", commits: 350 },
    { title: "Stage 3 — Charizard (Halfway)", commits: 750 },
    { title: "Stage 4 — Mega Charizard Y (Late)", commits: 1250 },
    { title: "Stage 5 — Mega Charizard X (Mastery)", commits: 1800 }
  ];

  for (const sample of samplePoints) {
    const state = evaluateEvolution(sample.commits);
    const form = state.currentForm;
    console.log(`▶ ${sample.title}`);
    console.log(`  Pokémon: ${form.name} (No. ${form.dex}) | Type: [${form.type.join(", ")}]`);
    console.log(`  Lifetime Contributions: ${state.lifetimeContributions}`);
    console.log(`  Stage Colouring: ${state.colouringProgress}%`);
    console.log(`  Stage Progress: ${state.stageContributions} / ${state.requiredContributions}`);
    console.log(
      `  Active Region: ${state.coloringState.regions.find((r) => r.status === "coloring")?.name || "All Mastered"}`
    );
    console.log("");
  }

  console.log("========================================");
  console.log("Preview complete. Run 'pnpm build' to generate SVG/GIF and social assets.");
}

preview().catch(console.error);
