/**
 * @file System-wide progression and game constants.
 * Pure constants without side effects.
 */

export const CAT_STAGES = Object.freeze({
  KITTEN: "KITTEN",
  ADULT: "ADULT",
  ELDER: "ELDER"
});

export const MOUSE_TIERS = Object.freeze({
  LOCKED: "LOCKED",
  SCOUT: "SCOUT",
  RUNNER: "RUNNER",
  NINJA: "NINJA"
});

export const MILESTONE_IDS = Object.freeze({
  FIRST_COMMIT: "FIRST_COMMIT",
  CENTURY_CLUB: "CENTURY_CLUB", // 100+
  KILO_CODER: "KILO_CODER", // 1000+
  LEGENDARY_DEV: "LEGENDARY_DEV", // 5000+
  STREAK_BRONZE: "STREAK_BRONZE", // 7+ days
  STREAK_SILVER: "STREAK_SILVER", // 30+ days
  STREAK_GOLD: "STREAK_GOLD", // 100+ days
  POLYGLOT: "POLYGLOT", // 3+ languages
  MASTER_POLYGLOT: "MASTER_POLYGLOT" // 5+ languages
});

export const DEFAULT_THEME_PALETTE = Object.freeze({
  background: "#0d1117",
  surface: "#161b22",
  primaryAccent: "#58a6ff",
  secondaryAccent: "#3fb950"
});
