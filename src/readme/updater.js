/**
 * @file Universal GitHub Profile & Repository README Integration Engine.
 * Safely updates markdown files within <!-- POKEMON-EVOLUTION:START --> and <!-- POKEMON-EVOLUTION:END -->.
 */

import { readFile, writeFile } from "node:fs/promises";

export const MARKER_START = "<!-- POKEMON-EVOLUTION:START -->";
export const MARKER_END = "<!-- POKEMON-EVOLUTION:END -->";

/**
 * Builds the standard Markdown block for the Pokémon evolution companion.
 *
 * @param {import("../engine/evolution.js").evaluateEvolution} evolutionState
 * @param {object} [options]
 * @param {string} [options.assetMode="relative"] - "relative" | "profile" | "external"
 * @param {string} [options.username=""]
 * @param {string} [options.repo=""]
 * @param {string} [options.assetPath="./assets/generated/pokemon-evolution.gif"]
 * @returns {string} Markdown text to place between markers
 */
export function buildMarkdownBlock(evolutionState, options = {}) {
  const form = evolutionState.currentForm;
  const assetPath = options.assetPath || "./assets/generated/pokemon-evolution.gif";

  let assetUrl = assetPath;
  if (options.assetMode === "profile" && options.username) {
    const repo = options.repo || options.username;
    assetUrl = `https://raw.githubusercontent.com/${options.username}/${repo}/main/assets/generated/pokemon-evolution.gif`;
  } else if (options.assetMode === "external" && options.externalUrl) {
    assetUrl = options.externalUrl;
  }

  const stageGoal = evolutionState.isMastery
    ? `Mastery Level ${evolutionState.masteryLevel}`
    : `${evolutionState.stageContributions} / ${evolutionState.requiredContributions} contributions to evolve`;

  return `
<p align="center">
  <img src="${assetUrl}" alt="${form.name} — Pokémon Evolution Companion" width="480" />
</p>

<p align="center">
  <strong>Current Form:</strong> ${form.name} (No. ${form.dex}) &nbsp;|&nbsp;
  <strong>Lifetime Activity:</strong> ${evolutionState.lifetimeContributions} contributions &nbsp;|&nbsp;
  <strong>Stage Colouring:</strong> ${evolutionState.colouringProgress}%
</p>
<p align="center">
  <em>${stageGoal}</em>
</p>
`;
}

/**
 * Safely updates a README file in-place, modifying only content within managed markers.
 *
 * @param {string} filePath - Path to README.md
 * @param {import("../engine/evolution.js").evaluateEvolution} evolutionState
 * @param {object} [options]
 * @returns {Promise<{ updated: boolean, inserted: boolean, path: string }>}
 */
export function updateReadmeContent(currentContent, evolutionState, options = {}) {
  const block = buildMarkdownBlock(evolutionState, options);
  const newSection = `${MARKER_START}\n${block.trim()}\n${MARKER_END}`;

  const startIndex = currentContent.indexOf(MARKER_START);
  const endIndex = currentContent.indexOf(MARKER_END);

  if (startIndex !== -1 && endIndex !== -1 && endIndex >= startIndex) {
    // Replace existing managed section
    const updated =
      currentContent.slice(0, startIndex) +
      newSection +
      currentContent.slice(endIndex + MARKER_END.length);
    return { content: updated, updated: true, inserted: false };
  }

  // Markers not found: append cleanly to the top or after header
  const headerMatch = currentContent.match(/^#\s+[^\n]+\n/);
  if (headerMatch) {
    const splitIndex = headerMatch[0].length;
    const updated =
      currentContent.slice(0, splitIndex) + `\n${newSection}\n` + currentContent.slice(splitIndex);
    return { content: updated, updated: false, inserted: true };
  }

  const updated = `${newSection}\n\n${currentContent}`;
  return { content: updated, updated: false, inserted: true };
}

/**
 * Reads, safely updates, and writes a README file.
 *
 * @param {string} filePath
 * @param {import("../engine/evolution.js").evaluateEvolution} evolutionState
 * @param {object} [options]
 * @returns {Promise<{ updated: boolean, inserted: boolean, path: string }>}
 */
export async function updateReadmeFile(filePath, evolutionState, options = {}) {
  let content = "";
  try {
    content = await readFile(filePath, "utf-8");
  } catch {
    content = `# Pokémon Evolution Companion\n\n`;
  }

  const result = updateReadmeContent(content, evolutionState, options);
  await writeFile(filePath, result.content, "utf-8");
  return { updated: result.updated, inserted: result.inserted, path: filePath };
}
