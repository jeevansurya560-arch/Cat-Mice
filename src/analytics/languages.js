/**
 * @file Language distribution calculus module.
 * Analyzes repository language bytes, distributions, and palette cues.
 */

import { DEFAULT_THEME_PALETTE } from "../core/constants.js";

/**
 * Calculates language distributions and primary aesthetic palette accents.
 *
 * @param {Array<{ name: string, bytes: number, color?: string }>} sortedLanguages
 * @returns {{
 *   totalBytes: number,
 *   languageCount: number,
 *   primaryLanguage: { name: string, bytes: number, percentage: number, color: string } | null,
 *   secondaryLanguage: { name: string, bytes: number, percentage: number, color: string } | null,
 *   distributions: Array<{ name: string, bytes: number, percentage: number, color: string }>,
 *   primaryAccentColor: string
 * }}
 */
export function calculateLanguages(sortedLanguages = []) {
  if (!sortedLanguages || sortedLanguages.length === 0) {
    return {
      totalBytes: 0,
      languageCount: 0,
      primaryLanguage: null,
      secondaryLanguage: null,
      distributions: [],
      primaryAccentColor: DEFAULT_THEME_PALETTE.primaryAccent
    };
  }

  const totalBytes = sortedLanguages.reduce((sum, lang) => sum + (lang.bytes || 0), 0);

  const distributions = sortedLanguages.map((lang) => {
    const bytes = lang.bytes || 0;
    const percentage = totalBytes > 0 ? Number((bytes / totalBytes).toFixed(4)) : 0;
    const color = lang.color || DEFAULT_THEME_PALETTE.primaryAccent;
    return {
      name: lang.name,
      bytes,
      percentage,
      color
    };
  });

  const primaryLanguage = distributions[0] || null;
  const secondaryLanguage = distributions[1] || null;
  const primaryAccentColor = primaryLanguage
    ? primaryLanguage.color
    : DEFAULT_THEME_PALETTE.primaryAccent;

  return {
    totalBytes,
    languageCount: distributions.length,
    primaryLanguage,
    secondaryLanguage,
    distributions,
    primaryAccentColor
  };
}
