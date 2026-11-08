/**
 * @file Mathematical Progressive Colouring Engine.
 * Implements area-weighted, anatomically sequenced, mathematically deterministic progressive colouring.
 */

import { MONOCHROME_PALETTE } from "../pokemon/definitions.js";

/**
 * Clamps a number between min and max.
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Cubic Hermite smoothstep curve for natural progressive filling.
 * @param {number} t - Normalized value [0, 1]
 * @returns {number}
 */
export function smoothstep(t) {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

/**
 * Converts a hex string (#rrggbb) to [r, g, b].
 * @param {string} hex
 * @returns {[number, number, number]}
 */
export function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Blends two hex colors according to factor t in [0, 1].
 * @param {string} hexA - Start color (e.g. monochrome)
 * @param {string} hexB - Target color (e.g. vibrant colored)
 * @param {number} t - Blend ratio [0, 1]
 * @returns {string} Interpolated hex string #rrggbb
 */
export function blendHex(hexA, hexB, t) {
  const factor = clamp(t, 0, 1);
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Calculates progressive region coloring completions and global percentage.
 *
 * @param {typeof import("../pokemon/definitions.js").EVOLUTION_TIERS[0]} form
 * @param {number} stageProgress - Normalized progress [0, 1] within the current evolution stage
 * @returns {{
 *   stageProgress: number,
 *   overallPercentage: number,
 *   regions: Array<{
 *     id: string,
 *     name: string,
 *     weight: number,
 *     priority: number,
 *     start: number,
 *     end: number,
 *     completion: number,
 *     status: "monochrome" | "coloring" | "complete"
 *   }>,
 *   palette: Record<string, string>
 * }}
 */
export function calculateProgressiveColoring(form, stageProgress) {
  const safeProgress = clamp(stageProgress, 0, 1);
  const sortedRegions = [...form.regions].sort((a, b) => a.priority - b.priority);

  let accumulated = 0;
  let weightedSum = 0;

  const evaluatedRegions = sortedRegions.map((region) => {
    const start = accumulated;
    const end = accumulated + region.weight;
    accumulated = end;

    let completion = 0;
    let status = "monochrome";

    if (safeProgress <= start) {
      completion = 0;
      status = "monochrome";
    } else if (safeProgress >= end) {
      completion = 1.0;
      status = "complete";
    } else {
      const rawT = (safeProgress - start) / (end - start);
      completion = smoothstep(rawT);
      status = "coloring";
    }

    weightedSum += region.weight * completion;

    return {
      id: region.id,
      name: region.name,
      weight: region.weight,
      priority: region.priority,
      start,
      end,
      completion: Number(completion.toFixed(4)),
      status
    };
  });

  const overallPercentage = Number((weightedSum * 100).toFixed(1));

  // Compute active dynamic palette blending monochrome and target colors
  const dynamicPalette = {};
  for (const key of Object.keys(form.colors)) {
    const monoColor = MONOCHROME_PALETTE[key] || MONOCHROME_PALETTE.base;
    const targetColor = form.colors[key];
    // Blend according to safeProgress with smoothstep
    dynamicPalette[key] = blendHex(monoColor, targetColor, smoothstep(safeProgress));
  }

  return {
    stageProgress: safeProgress,
    overallPercentage,
    regions: evaluatedRegions,
    palette: dynamicPalette
  };
}
