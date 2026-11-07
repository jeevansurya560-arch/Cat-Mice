/**
 * @file Centralized application configuration.
 * Independent of business logic and external network integrations.
 */

export const config = {
  application: {
    name: "CAT-MICE",
    version: "0.1.0"
  },

  runtime: {
    offlineMode: true
  },

  rendering: {
    width: 240,
    height: 120,
    fps: 10,
    scale: 2
  },

  animation: {
    loop: true
  },

  progression: {
    maxCatContributions: 25000,
    growthCurve: 500,
    mouseUnlockThreshold: 0.65
  }
};

/**
 * Returns a cloned configuration object to prevent unintended mutations.
 * @returns {typeof config}
 */
export function getConfig() {
  return JSON.parse(JSON.stringify(config));
}
