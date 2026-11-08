/**
 * @file Modern 2.5D Anime SVG & GIF Rendering Engine.
 * Generates true scalable resolution-independent vector SVGs and animated looping GIFs.
 */

import sharp from "sharp";
import { GIFEncoder, quantize, applyPalette } from "gifenc/dist/gifenc.esm.js";
import {
  renderCharmanderVector,
  renderCharmeleonVector,
  renderCharizardVector,
  renderMegaCharizardYVector,
  renderMegaCharizardXVector
} from "../pokemon/geometry.js";
import { generateAnimationFrames } from "./animation.js";

/**
 * Maps form ID to its vector rendering function.
 */
const FORM_RENDERERS = {
  charmander: renderCharmanderVector,
  charmeleon: renderCharmeleonVector,
  charizard: renderCharizardVector,
  "mega-charizard-y": renderMegaCharizardYVector,
  "mega-charizard-x": renderMegaCharizardXVector
};

/**
 * Renders a complete standalone SVG document for an evolution state.
 *
 * @param {import("./evolution.js").evaluateEvolution} evolutionState
 * @param {object} [options]
 * @param {object} [options.animationState]
 * @param {boolean} [options.transparent=false]
 * @returns {string} XML SVG string
 */
export function renderSvg(evolutionState, options = {}) {
  const form = evolutionState.currentForm;
  const palette = evolutionState.coloringState.palette;
  const renderer = FORM_RENDERERS[form.id] || renderCharmanderVector;
  const anim = options.animationState || { breath: 0, flamePhase: 0, embers: [] };
  const transparent = options.transparent ?? false;

  const width = options.width || 520;
  const height = options.height || 460;
  const progressPct = evolutionState.colouringProgress;
  const progressBarWidth = Math.round((progressPct / 100) * 440);

  // Character specific aura color
  const auraColor = form.id === "mega-charizard-x" ? "#00f2fe" : palette.flameOuter || "#ff5722";
  const typeBadges = form.type
    .map(
      (t) =>
        `<tspan dx="8" font-size="11" font-weight="700" fill="${t === "Dragon" ? "#00f2fe" : "#ffa059"}">● ${t.toUpperCase()}</tspan>`
    )
    .join("");

  const embersMarkup = (anim.embers || [])
    .map(
      (e) =>
        `<circle cx="${e.x}" cy="${e.y}" r="${e.r}" fill="${auraColor}" opacity="${e.opacity}" filter="drop-shadow(0 0 4px ${auraColor})"/>`
    )
    .join("\n");

  const characterMarkup = renderer(palette, anim);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Cinematic Character Radial Backlight -->
    <radialGradient id="charAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${auraColor}" stop-opacity="0.18"/>
      <stop offset="50%" stop-color="${auraColor}" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#0d1117" stop-opacity="0"/>
    </radialGradient>

    <!-- Progress Bar Glow -->
    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${palette.flameOuter || "#ff3d00"}"/>
      <stop offset="50%" stop-color="${palette.base || "#ff7a29"}"/>
      <stop offset="100%" stop-color="${palette.flameInner || "#fff785"}"/>
    </linearGradient>

    <filter id="bloom" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <style>
    .font-hud { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .title-text { font-size: 20px; font-weight: 800; fill: #ffffff; letter-spacing: 0.5px; }
    .dex-text { font-size: 13px; font-weight: 700; fill: #8b949e; letter-spacing: 1px; }
    .stat-label { font-size: 11px; font-weight: 600; fill: #8b949e; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-val { font-size: 14px; font-weight: 800; fill: #f0f6fc; }
  </style>

  ${transparent ? "" : `<rect width="${width}" height="${height}" fill="#0d1117" rx="14"/>`}

  <!-- Subtle Radial Glow Behind Character -->
  <ellipse cx="260" cy="230" rx="190" ry="170" fill="url(#charAura)"/>

  <!-- Minimal Anime Ground Platform -->
  <ellipse cx="260" cy="390" rx="140" ry="16" fill="#161b22" stroke="#30363d" stroke-width="1.5"/>
  <ellipse cx="260" cy="389" rx="100" ry="10" fill="#21262d" opacity="0.6"/>

  <!-- Floating Embers Layer -->
  <g id="embers">
    ${embersMarkup}
  </g>

  <!-- Render 2.5D Anime Character -->
  ${characterMarkup}

  <!-- Modern HUD Header -->
  <g class="font-hud" transform="translate(36, 36)">
    <!-- Dex & Name -->
    <text x="0" y="0" class="dex-text">No. ${form.dex}${typeBadges}</text>
    <text x="0" y="22" class="title-text">${form.name.toUpperCase()}</text>

    <!-- Contribution & Stage Progress Metric -->
    <text x="448" y="0" text-anchor="end" class="stat-label">Lifetime Activity</text>
    <text x="448" y="20" text-anchor="end" class="stat-val">${evolutionState.lifetimeContributions} Commits</text>
  </g>

  <!-- Progress Bar Footer -->
  <g class="font-hud" transform="translate(40, 412)">
    <!-- Background Track -->
    <rect x="0" y="0" width="440" height="8" rx="4" fill="#21262d"/>
    <!-- Animated Color Fill -->
    <rect x="0" y="0" width="${Math.max(6, progressBarWidth)}" height="8" rx="4" fill="url(#progressGrad)"/>
    <!-- Stats Row -->
    <text x="0" y="24" class="stat-label">Stage Colouring Progress</text>
    <text x="440" y="24" text-anchor="end" class="stat-val">${progressPct}%</text>
  </g>
</svg>`;
}

/**
 * Renders an animated GIF sequence from evolution state using sharp and gifenc.
 *
 * @param {import("./evolution.js").evaluateEvolution} evolutionState
 * @param {object} [options]
 * @param {number} [options.width=360]
 * @param {number} [options.height=318]
 * @param {number} [options.fps=10]
 * @returns {Promise<Uint8Array>}
 */
export async function renderGif(evolutionState, options = {}) {
  const width = options.width || 360;
  const height = options.height || 318;
  const fps = options.fps || 10;
  const frameCount = 12; // 12 frames = 1.2s smooth breathing loop

  const frames = generateAnimationFrames(frameCount);
  const gif = GIFEncoder();

  for (const animState of frames) {
    const svgStr = renderSvg(evolutionState, {
      animationState: animState,
      transparent: false
    });

    // Rasterize SVG frame into 32-bit RGBA pixel buffer via sharp
    const { data } = await sharp(Buffer.from(svgStr))
      .resize(width, height)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Quantize 32-bit RGBA pixels into 256-color indexed palette
    const palette = quantize(data, 256, { format: "rgba4444" });
    const index = applyPalette(data, palette, "rgba4444");

    gif.writeFrame(index, width, height, {
      palette,
      delay: Math.round(1000 / fps),
      repeat: 0
    });
  }

  gif.finish();
  return gif.bytes();
}
