/**
 * @file Pokémon Form Definitions, Evolution Thresholds, and Anatomical Region Allocations.
 * Pure constants and configuration for Charmander, Charmeleon, Charizard, Mega Charizard Y, and Mega Charizard X.
 */

export const EVOLUTION_TIERS = Object.freeze([
  {
    id: "charmander",
    name: "Charmander",
    dex: "0004",
    stageIndex: 0,
    stageStart: 0,
    stageEnd: 200,
    requiredContributions: 200,
    title: "Lizard Pokémon",
    type: ["Fire"],
    description: "The flame that burns at the tip of its tail is an indication of its emotions.",
    colors: {
      base: "#ff7a29",
      shadow: "#d84a15",
      highlight: "#ffa059",
      belly: "#ffea9f",
      bellyShadow: "#e8cc75",
      eye: "#1a8cff",
      flameInner: "#fff785",
      flameOuter: "#ff3d00",
      outline: "#2d1810"
    },
    regions: [
      { id: "tail_flame", name: "Tail Flame", weight: 0.15, priority: 1 },
      { id: "head", name: "Head & Horns", weight: 0.2, priority: 2 },
      { id: "torso", name: "Torso & Belly", weight: 0.25, priority: 3 },
      { id: "arms", name: "Arms & Claws", weight: 0.12, priority: 4 },
      { id: "legs", name: "Legs & Foot Claws", weight: 0.15, priority: 5 },
      { id: "tail", name: "Tail Length", weight: 0.08, priority: 6 },
      { id: "details", name: "Facial Details & Teeth", weight: 0.05, priority: 7 }
    ]
  },
  {
    id: "charmeleon",
    name: "Charmeleon",
    dex: "0005",
    stageIndex: 1,
    stageStart: 200,
    stageEnd: 500,
    requiredContributions: 300,
    title: "Flame Pokémon",
    type: ["Fire"],
    description:
      "Tough fights make it fiery. When it gets agitated, it spouts bluish-white flames.",
    colors: {
      base: "#dc4e42",
      shadow: "#a92b28",
      highlight: "#ea6c65",
      belly: "#e8d5be",
      bellyShadow: "#cca788",
      eye: "#2a8f82",
      flameInner: "#ffeb3b",
      flameOuter: "#ff4500",
      outline: "#3a1512"
    },
    regions: [
      { id: "head", name: "Head & Crest", weight: 0.2, priority: 1 },
      { id: "torso", name: "Torso & Chest", weight: 0.22, priority: 2 },
      { id: "tail_flame", name: "Tail Flame", weight: 0.18, priority: 3 },
      { id: "arms", name: "Arms & Razor Claws", weight: 0.15, priority: 4 },
      { id: "legs", name: "Muscular Legs", weight: 0.15, priority: 5 },
      { id: "claws_details", name: "Claws & Tail", weight: 0.1, priority: 6 }
    ]
  },
  {
    id: "charizard",
    name: "Charizard",
    dex: "0006",
    stageIndex: 2,
    stageStart: 500,
    stageEnd: 1000,
    requiredContributions: 500,
    title: "Flame Pokémon",
    type: ["Fire", "Flying"],
    description:
      "It spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.",
    colors: {
      base: "#ff6e1a",
      shadow: "#c44a07",
      highlight: "#ffa359",
      belly: "#ffe082",
      bellyShadow: "#d1b66b",
      wingInner: "#18a49c",
      wingShadow: "#0f6661",
      eye: "#00c4ef",
      flameInner: "#fffb99",
      flameOuter: "#ff2a00",
      outline: "#2a150c"
    },
    regions: [
      { id: "tail_flame", name: "Tail Flame", weight: 0.12, priority: 1 },
      { id: "head", name: "Head & Twin Horns", weight: 0.14, priority: 2 },
      { id: "torso", name: "Torso & Belly", weight: 0.18, priority: 3 },
      { id: "wings", name: "Dragon Wings & Membranes", weight: 0.26, priority: 4 },
      { id: "arms", name: "Arms & Claws", weight: 0.1, priority: 5 },
      { id: "legs", name: "Legs & Talons", weight: 0.12, priority: 6 },
      { id: "tail", name: "Tail", weight: 0.08, priority: 7 }
    ]
  },
  {
    id: "mega-charizard-y",
    name: "Mega Charizard Y",
    dex: "0006-MY",
    stageIndex: 3,
    stageStart: 1000,
    stageEnd: 1500,
    requiredContributions: 500,
    title: "Drought Mega Dragon",
    type: ["Fire", "Flying"],
    description:
      "Its bond with its Trainer is the source of its power. It boasts incredible speed that outclasses jet fighters.",
    colors: {
      base: "#f3621b",
      shadow: "#b53909",
      highlight: "#ff8944",
      belly: "#fbe7aa",
      bellyShadow: "#d3b875",
      wingInner: "#227e77",
      wingShadow: "#145550",
      eye: "#00c2ff",
      flameInner: "#ffffff",
      flameMid: "#ffea00",
      flameOuter: "#ff1744",
      outline: "#241108"
    },
    regions: [
      { id: "tail_flame", name: "Massive Tail Flame", weight: 0.12, priority: 1 },
      { id: "head", name: "Triple Horn Head", weight: 0.14, priority: 2 },
      { id: "torso", name: "Aerodynamic Torso", weight: 0.16, priority: 3 },
      { id: "wings", name: "Jagged Wings & Arm Fins", weight: 0.28, priority: 4 },
      { id: "arms", name: "Forearms & Claws", weight: 0.1, priority: 5 },
      { id: "legs", name: "Legs & Talons", weight: 0.12, priority: 6 },
      { id: "tail", name: "Tail", weight: 0.08, priority: 7 }
    ]
  },
  {
    id: "mega-charizard-x",
    name: "Mega Charizard X",
    dex: "0006-MX",
    stageIndex: 4,
    stageStart: 1500,
    stageEnd: 2000,
    requiredContributions: 500,
    title: "Tough Claws Dragon",
    type: ["Fire", "Dragon"],
    description:
      "The overwhelming power that fills its entire body causes it to turn black and create intense blue flames.",
    colors: {
      base: "#2b323f",
      shadow: "#181c24",
      highlight: "#485367",
      belly: "#40c4ff",
      bellyShadow: "#288ab8",
      wingInner: "#252b37",
      wingSpikes: "#8fe3ff",
      eye: "#ff2d55",
      flameInner: "#ffffff",
      flameMid: "#00f2fe",
      flameOuter: "#0984e3",
      mouthFlame: "#00f2fe",
      outline: "#13161c"
    },
    regions: [
      { id: "blue_flame", name: "Tail & Mouth Blue Flames", weight: 0.15, priority: 1 },
      { id: "head", name: "Crest & Cyan Horns", weight: 0.15, priority: 2 },
      { id: "torso", name: "Obsidian Torso & Cyan Belly", weight: 0.18, priority: 3 },
      { id: "wings", name: "Spiked Wings", weight: 0.24, priority: 4 },
      { id: "arms", name: "Arms & Claws", weight: 0.1, priority: 5 },
      { id: "legs", name: "Heavy Legs", weight: 0.12, priority: 6 },
      { id: "tail", name: "Tail", weight: 0.06, priority: 7 }
    ]
  }
]);

export const MONOCHROME_PALETTE = Object.freeze({
  base: "#646b79",
  shadow: "#3d424c",
  highlight: "#8b94a5",
  belly: "#9fa7b8",
  bellyShadow: "#707887",
  wingInner: "#4e5461",
  wingShadow: "#2e323b",
  eye: "#3d424c",
  flameInner: "#b0b8c8",
  flameMid: "#7b8496",
  flameOuter: "#49505e",
  mouthFlame: "#8b94a5",
  outline: "#1a1c22"
});

/**
 * Validates that all region weights for a form sum to 1.0 (within floating-point tolerance).
 * @param {typeof EVOLUTION_TIERS[0]} form
 * @returns {boolean}
 */
export function validateRegionWeights(form) {
  const sum = form.regions.reduce((acc, r) => acc + r.weight, 0);
  return Math.abs(sum - 1.0) < 1e-4;
}
