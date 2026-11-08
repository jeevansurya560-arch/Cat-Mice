/**
 * @file LinkedIn Presentation Package Generator.
 * Generates high-resolution social preview image (1200x627), evolution showcase image, and post draft.
 */

import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { EVOLUTION_TIERS } from "../pokemon/definitions.js";
import { calculateProgressiveColoring } from "../engine/coloring.js";
import {
  renderCharmanderVector,
  renderCharmeleonVector,
  renderCharizardVector,
  renderMegaCharizardYVector,
  renderMegaCharizardXVector
} from "../pokemon/geometry.js";

const FORM_RENDERERS = {
  charmander: renderCharmanderVector,
  charmeleon: renderCharmeleonVector,
  charizard: renderCharizardVector,
  "mega-charizard-y": renderMegaCharizardYVector,
  "mega-charizard-x": renderMegaCharizardXVector
};

/**
 * Builds the SVG markup for the 1200 x 627 LinkedIn Social Preview card.
 *
 * @param {import("../engine/evolution.js").evaluateEvolution} evolutionState
 * @returns {string} Standalone SVG string
 */
export function buildLinkedInPreviewSvg(evolutionState) {
  const currentForm = evolutionState.currentForm;
  const renderer = FORM_RENDERERS[currentForm.id] || renderCharizardVector;
  const palette = evolutionState.coloringState.palette;
  const characterMarkup = renderer(palette, { breath: 0, flamePhase: 1 });

  // Evolution stage badges across bottom
  const stagesMarkup = EVOLUTION_TIERS.map((tier, idx) => {
    const isCurrent = tier.id === currentForm.id;
    const isPast = tier.stageIndex < currentForm.stageIndex;
    const x = 70 + idx * 215;
    const badgeColor = isCurrent ? "#ff7a29" : isPast ? "#38ef7d" : "#484f58";
    const statusText = isCurrent ? "ACTIVE" : isPast ? "MASTERED" : `${tier.stageStart}+`;

    return `
      <g transform="translate(${x}, 525)">
        <rect width="195" height="54" rx="8" fill="#161b22" stroke="${badgeColor}" stroke-width="${isCurrent ? "2" : "1"}"/>
        <text x="14" y="24" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#f0f6fc">${tier.name}</text>
        <text x="14" y="42" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="${badgeColor}">● ${statusText}</text>
        <text x="180" y="34" text-anchor="end" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#8b949e">#${tier.dex}</text>
      </g>
    `;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 627" width="1200" height="627">
  <defs>
    <radialGradient id="heroAura" cx="70%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#ff5722" stop-opacity="0.25"/>
      <stop offset="60%" stop-color="#ff7a29" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#0d1117" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#ff7a29"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="627" fill="#0d1117"/>
  <rect x="0" y="0" width="1200" height="627" fill="url(#heroAura)"/>

  <!-- Left Column: Branding, Title, Technical Highlights -->
  <g transform="translate(70, 75)" font-family="system-ui, -apple-system, sans-serif">
    <!-- Superheader Badge -->
    <rect width="210" height="28" rx="14" fill="#21262d" stroke="#30363d"/>
    <text x="14" y="18" font-size="11" font-weight="700" fill="#ff7a29" letter-spacing="1px">🔥 OPEN SOURCE SHOWCASE</text>

    <!-- Main Title -->
    <text x="0" y="78" font-size="44" font-weight="900" fill="url(#textGrad)" letter-spacing="-0.5px">GitHub Pokémon</text>
    <text x="0" y="126" font-size="44" font-weight="900" fill="#f0f6fc" letter-spacing="-0.5px">Evolution Companion</text>

    <!-- Subtitle / Concept -->
    <text x="0" y="165" font-size="16" font-weight="500" fill="#8b949e">
      A mathematical, contribution-powered virtual pet in modern 2.5D anime aesthetic.
    </text>
    <text x="0" y="190" font-size="16" font-weight="500" fill="#8b949e">
      Daily commits progressively colour your companion and trigger cinematic evolutions.
    </text>

    <!-- Metric Pill Box -->
    <g transform="translate(0, 220)">
      <rect width="460" height="84" rx="12" fill="#161b22" stroke="#30363d"/>
      <text x="24" y="32" font-size="11" font-weight="700" fill="#8b949e" letter-spacing="0.5px">CURRENT FORM</text>
      <text x="24" y="60" font-size="22" font-weight="800" fill="#f0f6fc">${currentForm.name}</text>
      <text x="240" y="32" font-size="11" font-weight="700" fill="#8b949e" letter-spacing="0.5px">LIFETIME COMMITS</text>
      <text x="240" y="60" font-size="22" font-weight="800" fill="#38ef7d">${evolutionState.lifetimeContributions}</text>
      <text x="375" y="32" font-size="11" font-weight="700" fill="#8b949e" letter-spacing="0.5px">COLOURING</text>
      <text x="375" y="60" font-size="22" font-weight="800" fill="#ff7a29">${evolutionState.colouringProgress}%</text>
    </g>

    <!-- Tech Badges -->
    <g transform="translate(0, 325)">
      <rect x="0" width="130" height="26" rx="6" fill="#1f242c"/><text x="12" y="17" font-size="11" font-weight="600" fill="#f0f6fc">Pure ES Modules</text>
      <rect x="140" width="135" height="26" rx="6" fill="#1f242c"/><text x="152" y="17" font-size="11" font-weight="600" fill="#f0f6fc">Area-Weighted Fill</text>
      <rect x="285" width="120" height="26" rx="6" fill="#1f242c"/><text x="297" y="17" font-size="11" font-weight="600" fill="#f0f6fc">Profile README</text>
    </g>
  </g>

  <!-- Right Column: Featured Character Vector Artwork -->
  <g transform="translate(680, 45) scale(0.92)">
    ${characterMarkup}
  </g>

  <!-- Bottom Evolution Progression Timeline -->
  ${stagesMarkup}
</svg>`;
}

/**
 * Builds the SVG markup for the Evolution Showcase reference board (1400x500).
 * Shows all 5 forms side by side.
 *
 * @returns {string} Standalone SVG string
 */
export function buildEvolutionShowcaseSvg() {
  const formsMarkup = EVOLUTION_TIERS.map((tier, idx) => {
    const renderer = FORM_RENDERERS[tier.id];
    const fullColorState = calculateProgressiveColoring(tier, 1.0);
    const charSvg = renderer(fullColorState.palette, { breath: 0, flamePhase: idx });
    const x = 30 + idx * 270;

    return `
      <g transform="translate(${x}, 40)">
        <!-- Card Background -->
        <rect width="255" height="420" rx="12" fill="#161b22" stroke="#30363d" stroke-width="1.5"/>

        <!-- Header -->
        <text x="20" y="32" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#8b949e">#${tier.dex}</text>
        <text x="20" y="54" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="#ffffff">${tier.name}</text>
        <text x="20" y="74" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#ff7a29">${tier.stageStart}–${tier.stageEnd === 2000 ? "1500+" : tier.stageEnd} commits</text>

        <!-- Scaled Character Vector -->
        <g transform="translate(15, 80) scale(0.44)">
          ${charSvg}
        </g>

        <!-- Footer Tag -->
        <rect x="20" y="375" width="215" height="26" rx="6" fill="#21262d"/>
        <text x="127" y="392" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#f0f6fc">STAGE ${idx + 1}: ${tier.title.toUpperCase()}</text>
      </g>
    `;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 500" width="1400" height="500">
  <rect width="1400" height="500" fill="#0d1117"/>
  ${formsMarkup}
</svg>`;
}

/**
 * Builds the Markdown draft for a professional LinkedIn post.
 *
 * @param {import("../engine/evolution.js").evaluateEvolution} evolutionState
 * @param {object} [options]
 * @returns {string} Markdown post text
 */
export function buildLinkedInPostDraft(evolutionState, options = {}) {
  const currentForm = evolutionState.currentForm;
  const username = options.username || "developer";
  const repoUrl = options.repoUrl || `https://github.com/${username}/pokemon-evolution`;

  return `🚀 Excited to share my latest open-source project: GitHub Pokémon Evolution Companion!

Tired of static contribution grids? I wanted to turn daily engineering consistency into an interactive game companion that visually evolves alongside my developer journey (currently evolving ${currentForm.name}!).

✨ How It Works:
Instead of a simple contribution graph, your GitHub activity powers an animated 2.5D Pokémon companion on your Profile README:

1️⃣ Charmander (0–199 commits) — starts small, flame burning brighter with each commit.
2️⃣ Charmeleon (200–499 commits) — razor claws and fiery intensity.
3️⃣ Charizard (500–999 commits) — full majestic dragon wings and roaring inferno.
4️⃣ Mega Charizard Y (1,000–1,499 commits) — drought power, streamlined aerodynamics, and triple horn crest.
5️⃣ Mega Charizard X (1,500+ commits) — obsidian dragon armor, cyan plasma flames, and repeatable mastery tiers!

📐 Mathematical Progressive Colouring:
Every new form starts 100% monochrome. As you push code, an area-weighted mathematical engine calculates P = 100 × Σ(weight_i × completion_i), smoothly propagating cel-shaded colors, shadows, and specular highlights through anatomically sequenced regions (Tail Flame ➔ Head ➔ Torso ➔ Wings ➔ Claws).

🛠 Tech Highlights:
• Pure Node.js 22 LTS & ES Modules (zero TypeScript / Rust compilation overhead)
• Vector SVG + Optimized Animated GIF generation
• Octokit GraphQL & REST fallback with 100% offline snapshot support
• Safe Markdown updating via managed markers (<!-- POKEMON-EVOLUTION:START/END -->)
• Deterministic cubic Hermite smoothstep color transitions

Check out the code, star the repo, or embed it on your own GitHub Profile:
🔗 Repository: ${repoUrl}

What does your current contribution count evolve to? Let me know in the comments! 👇

#opensource #developer #pokemon #github #javascript #webdev #gamedev #softwareengineering #coding
`;
}

/**
 * Generates all LinkedIn package assets to the target output directory.
 *
 * @param {import("../engine/evolution.js").evaluateEvolution} evolutionState
 * @param {string} [outputDir="assets/social"]
 * @param {object} [options]
 * @returns {Promise<{ previewPath: string, showcasePath: string, postPath: string }>}
 */
export async function generateLinkedInPackage(
  evolutionState,
  outputDir = "assets/social",
  options = {}
) {
  const fullOutputDir = resolve(process.cwd(), outputDir);
  await mkdir(fullOutputDir, { recursive: true });

  // 1. Generate 1200x627 LinkedIn Preview Image
  const previewSvg = buildLinkedInPreviewSvg(evolutionState);
  const previewPngPath = resolve(fullOutputDir, "linkedin-preview.png");
  await sharp(Buffer.from(previewSvg))
    .resize(1200, 627)
    .png({ quality: 95 })
    .toFile(previewPngPath);

  // 2. Generate 5-Stage Evolution Showcase Image
  const showcaseSvg = buildEvolutionShowcaseSvg();
  const showcasePngPath = resolve(fullOutputDir, "evolution-showcase.png");
  await sharp(Buffer.from(showcaseSvg))
    .resize(1400, 500)
    .png({ quality: 95 })
    .toFile(showcasePngPath);

  // 3. Generate LinkedIn Post Draft
  const postDraft = buildLinkedInPostDraft(evolutionState, options);
  const postMdPath = resolve(fullOutputDir, "linkedin-post.md");
  await writeFile(postMdPath, postDraft, "utf-8");

  return {
    previewPath: previewPngPath,
    showcasePath: showcasePngPath,
    postPath: postMdPath
  };
}
