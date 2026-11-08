import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";

// 1. Define color palettes
const COLOR_PALETTES = {
  charmander: {
    base: "#e86524",
    shadow: "#a83e12",
    highlight: "#f48b4e",
    belly: "#f2d68e",
    bellyShadow: "#c8aa62",
    eye: "#3a92b8",
    flameOuter: "#f03d1c",
    flameMid: "#ff8f00",
    flameInner: "#ffea3b",
    outline: "#231008"
  },
  charmeleon: {
    base: "#dc4e42",
    shadow: "#9a3528",
    highlight: "#ea6c65",
    belly: "#e8d5be",
    bellyShadow: "#bfa792",
    eye: "#1a7c73",
    flameOuter: "#f14c24",
    flameMid: "#f89e22",
    flameInner: "#fbed57",
    outline: "#2b100c"
  },
  charizard: {
    base: "#e66a22",
    shadow: "#a2380d",
    highlight: "#f69450",
    belly: "#e4ce8e",
    bellyShadow: "#bca05c",
    wingMembrane: "#1e7a78",
    wingMembraneShadow: "#104a48",
    eye: "#2488a0",
    flameOuter: "#f03d1c",
    flameMid: "#ff8f00",
    flameInner: "#ffea3b",
    outline: "#26100a"
  }
};

const GRAY_PALETTE = {
  base: "#999999",
  shadow: "#404040",
  deepShadow: "#1c1c1c",
  highlight: "#cccccc",
  specular: "#f0f0f0",
  belly: "#d4d4d4",
  bellyShadow: "#707070",
  wingMembrane: "#585858",
  wingMembraneShadow: "#303030",
  eye: "#505050",
  flameOuter: "#585858",
  flameMid: "#8c8c8c",
  flameInner: "#f0f0f0",
  outline: "#161616"
};

function blendHex(c1, c2, t) {
  // Simple sRGB linear interpolation for research visualization preview
  const r1 = parseInt(c1.slice(1, 3), 16), g1 = parseInt(c1.slice(3, 5), 16), b1 = parseInt(c1.slice(5, 7), 16);
  const r2 = parseInt(c2.slice(1, 3), 16), g2 = parseInt(c2.slice(3, 5), 16), b2 = parseInt(c2.slice(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function getInterpolatedPalette(charKey, t) {
  const full = COLOR_PALETTES[charKey];
  const res = {};
  for (const k of Object.keys(full)) {
    const grayVal = GRAY_PALETTE[k] || GRAY_PALETTE.base;
    res[k] = blendHex(grayVal, full[k], t);
  }
  return res;
}

// Pixel-accurate SVG vectors on a 160x160 canvas
function renderCharmanderSprite(palette) {
  return `
    <g id="charmander-sprite" shape-rendering="crispEdges">
      <!-- Tail & Flame -->
      <path d="M 88 116 C 104 120 120 114 128 98 C 132 90 128 82 122 84 C 118 86 112 100 96 108 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>
      <ellipse cx="132" cy="78" rx="10" ry="14" fill="${palette.flameOuter}"/>
      <ellipse cx="132" cy="80" rx="6" ry="10" fill="${palette.flameMid}"/>
      <ellipse cx="132" cy="82" rx="3" ry="5" fill="${palette.flameInner}"/>
      
      <!-- Feet & Legs -->
      <path d="M 52 116 C 46 122 44 134 50 140 C 58 144 68 142 72 136 C 74 130 70 122 64 118 Z" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="2"/>
      <path d="M 90 116 C 86 122 86 134 92 140 C 98 144 108 142 110 134 C 112 126 106 120 100 116 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>
      <!-- Claws -->
      <rect x="48" y="138" width="3" height="4" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <rect x="54" y="140" width="3" height="4" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <rect x="60" y="139" width="3" height="4" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <rect x="94" y="139" width="3" height="4" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <rect x="100" y="140" width="3" height="4" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <rect x="106" y="138" width="3" height="4" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>

      <!-- Torso & Belly -->
      <path d="M 60 76 C 52 86 52 108 58 124 C 64 134 88 136 96 124 C 104 112 104 90 94 76 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>
      <path d="M 64 82 C 58 92 58 112 64 122 C 72 128 86 126 90 118 C 94 108 92 92 84 82 Z" fill="${palette.belly}"/>

      <!-- Arms -->
      <path d="M 52 92 C 44 96 42 104 46 110 C 50 112 56 110 60 104 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>
      <path d="M 94 92 C 102 96 104 104 100 110 C 96 112 90 110 86 104 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>

      <!-- Head & Snout -->
      <path d="M 54 44 C 44 54 46 72 60 80 C 76 86 96 84 104 72 C 110 60 106 44 94 36 C 80 30 64 34 54 44 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>
      <path d="M 66 38 C 76 34 88 36 94 44" stroke="${palette.highlight}" stroke-width="2" fill="none"/>
      
      <!-- Eyes -->
      <rect x="62" y="50" width="8" height="14" rx="3" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
      <rect x="64" y="54" width="5" height="9" rx="2" fill="${palette.eye}"/>
      <circle cx="66" cy="56" r="1.5" fill="#ffffff"/>

      <rect x="88" y="50" width="8" height="14" rx="3" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
      <rect x="89" y="54" width="5" height="9" rx="2" fill="${palette.eye}"/>
      <circle cx="91" cy="56" r="1.5" fill="#ffffff"/>

      <!-- Mouth & Nostrils -->
      <circle cx="72" cy="66" r="1" fill="${palette.outline}"/>
      <circle cx="82" cy="66" r="1" fill="${palette.outline}"/>
      <path d="M 70 72 Q 77 76 84 72" stroke="${palette.outline}" stroke-width="2" fill="none"/>
    </g>
  `;
}

function renderCharmeleonSprite(palette) {
  return `
    <g id="charmeleon-sprite" shape-rendering="crispEdges">
      <!-- Tail & Torch Flame -->
      <path d="M 96 112 C 118 122 136 114 142 96 C 146 84 140 76 134 80 C 128 84 122 102 104 104 Z" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="2"/>
      <path d="M 98 108 C 118 118 134 110 140 94 C 144 84 138 78 134 82 C 128 86 122 100 104 102 Z" fill="${palette.base}"/>
      <path d="M 140 82 C 132 68 134 54 144 42 C 150 54 154 58 152 50 C 160 62 156 80 146 88 Z" fill="${palette.flameOuter}"/>
      <path d="M 140 80 C 134 70 136 58 144 48 C 148 56 150 60 148 54 C 154 64 152 76 144 82 Z" fill="${palette.flameMid}"/>
      <ellipse cx="144" cy="70" rx="4" ry="7" fill="${palette.flameInner}"/>

      <!-- Right Foot (Back) -->
      <path d="M 94 110 C 104 116 112 128 108 138 C 102 142 94 140 90 132 Z" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="2"/>
      <rect x="98" y="138" width="4" height="4" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <rect x="104" y="139" width="4" height="4" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <rect x="110" y="137" width="4" height="4" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>

      <!-- Torso & Cream Belly -->
      <path d="M 68 76 C 58 90 56 112 66 128 C 76 138 98 134 102 120 C 108 106 106 88 94 74 Z" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="2"/>
      <path d="M 70 76 C 62 90 60 112 68 126 C 76 136 96 132 100 120 C 106 106 104 88 92 74 Z" fill="${palette.base}"/>
      <path d="M 72 82 C 66 94 66 114 74 124 C 80 130 92 128 94 116 C 96 104 92 90 84 80 Z" fill="${palette.belly}"/>

      <!-- Left Foot (Foreground) -->
      <path d="M 58 108 C 48 116 46 130 52 138 C 58 144 70 142 74 134 C 76 126 72 114 66 108 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>
      <rect x="50" y="138" width="4" height="5" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <rect x="56" y="140" width="4" height="5" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <rect x="62" y="139" width="4" height="5" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>

      <!-- Arms & Razor Claws -->
      <path d="M 64 88 C 54 94 50 106 56 116 C 60 120 66 116 70 108 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>
      <polygon points="46,116 52,112 50,118" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <polygon points="48,122 54,116 54,124" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <polygon points="56,124 60,118 62,125" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>

      <path d="M 94 88 C 104 94 108 104 104 114 C 100 118 94 116 90 108 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>
      <polygon points="106,114 102,110 104,116" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <polygon points="110,118 106,114 108,120" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <polygon points="112,112 108,110 112,116" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>

      <!-- Head & Single Cranial Horn Crest -->
      <path d="M 76 46 C 88 32 104 22 114 18 C 118 20 116 26 110 32 C 102 42 94 52 88 64 Z" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="2"/>
      <path d="M 78 46 C 88 34 102 24 112 20 C 116 22 114 26 108 32 C 102 42 94 52 88 62 Z" fill="${palette.base}"/>
      
      <!-- Skull & Beak Snout -->
      <path d="M 76 46 C 64 48 50 56 42 66 C 38 72 42 76 48 76 C 58 78 72 76 80 70 C 86 64 88 54 84 46 Z" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="2"/>
      <path d="M 76 44 C 64 46 50 54 44 64 C 40 70 44 74 50 74 C 60 76 72 74 80 68 C 86 62 86 52 82 44 Z" fill="${palette.base}"/>
      <circle cx="48" cy="66" r="1" fill="${palette.outline}"/>
      
      <!-- Sharp Teal Eye -->
      <polygon points="56,54 68,56 64,64 58,62" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.2"/>
      <polygon points="60,55 67,56 65,63 61,61" fill="${palette.eye}"/>
      <ellipse cx="63" cy="58" rx="1.5" ry="2.5" fill="#0b1710"/>
      <circle cx="62" cy="57" r="0.8" fill="#ffffff"/>

      <!-- Smirk Tooth -->
      <path d="M 48 72 Q 58 76 68 70" stroke="${palette.outline}" stroke-width="1.8" fill="none"/>
      <polygon points="62,70 64,74 66,71" fill="#ffffff" stroke="${palette.outline}" stroke-width="0.8"/>
    </g>
  `;
}

function renderCharizardSprite(palette) {
  return `
    <g id="charizard-sprite" shape-rendering="crispEdges">
      <!-- Massive Wings (Backdrop) -->
      <path d="M 70 54 C 54 32 30 18 16 14 C 18 26 26 44 38 60 C 26 62 16 70 20 78 C 30 80 44 78 56 70 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>
      <path d="M 28 34 C 36 48 48 64 54 68 C 42 74 30 76 24 74 C 20 68 22 52 28 34 Z" fill="${palette.wingMembrane}"/>

      <path d="M 94 54 C 110 32 134 18 148 14 C 146 26 138 44 126 60 C 138 62 148 70 144 78 C 134 80 120 78 108 70 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>
      <path d="M 136 34 C 128 48 116 64 110 68 C 122 74 134 76 140 74 C 144 68 142 52 136 34 Z" fill="${palette.wingMembrane}"/>

      <!-- Sinuous Tail & Blazing Inferno -->
      <path d="M 96 118 C 118 128 140 124 150 108 C 156 94 150 84 142 88 C 134 92 128 110 102 110 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>
      <ellipse cx="150" cy="84" rx="14" ry="18" fill="${palette.flameOuter}"/>
      <ellipse cx="150" cy="86" rx="9" ry="13" fill="${palette.flameMid}"/>
      <ellipse cx="150" cy="88" rx="4" ry="7" fill="${palette.flameInner}"/>

      <!-- Legs & Heavy Talons -->
      <path d="M 54 112 C 44 120 42 134 48 142 C 56 146 68 144 72 136 C 76 128 72 116 66 112 Z" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="2"/>
      <path d="M 98 112 C 92 120 90 134 96 142 C 104 146 116 144 120 136 C 124 128 120 116 114 112 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>
      <rect x="46" y="142" width="4" height="5" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <rect x="52" y="144" width="4" height="5" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <rect x="58" y="143" width="4" height="5" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <rect x="98" y="143" width="4" height="5" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <rect x="104" y="144" width="4" height="5" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <rect x="110" y="142" width="4" height="5" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>

      <!-- Dragon Torso & Belly Plates -->
      <path d="M 64 68 C 54 84 54 112 64 128 C 76 138 98 136 106 124 C 114 108 112 84 100 68 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>
      <path d="M 68 74 C 60 88 60 112 68 124 C 76 132 94 130 98 120 C 104 108 102 88 92 74 Z" fill="${palette.belly}"/>

      <!-- Forelimbs -->
      <path d="M 58 84 C 48 90 46 102 52 110 C 56 112 62 108 66 100 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>
      <polygon points="46,110 52,106 50,112" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <polygon points="50,114 56,110 54,116" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <polygon points="56,116 60,112 60,118" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>

      <path d="M 106 84 C 116 90 118 102 112 110 C 108 112 102 108 98 100 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>
      <polygon points="118,110 112,106 114,112" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <polygon points="114,114 108,110 110,116" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <polygon points="108,116 104,112 104,118" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>

      <!-- Dragon Head & Dual Cranial Horns -->
      <path d="M 72 44 C 64 30 52 18 42 14 C 40 18 44 24 50 30 C 58 38 66 44 72 48 Z" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="2"/>
      <path d="M 92 44 C 100 30 112 18 122 14 C 124 18 120 24 114 30 C 106 38 98 44 92 48 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>

      <path d="M 66 42 C 54 46 44 56 40 68 C 42 72 50 74 62 74 C 76 74 94 72 98 64 C 102 54 96 44 88 42 Z" fill="${palette.base}" stroke="${palette.outline}" stroke-width="2"/>
      <!-- Eye -->
      <polygon points="62,50 72,52 68,58 64,56" fill="#ffffff" stroke="${palette.outline}" stroke-width="1"/>
      <polygon points="65,51 71,52 69,57 66,56" fill="${palette.eye}"/>
      <circle cx="68" cy="54" r="1" fill="#0b1710"/>
      <!-- Fangs -->
      <polygon points="46,70 48,76 52,71" fill="#ffffff" stroke="${palette.outline}" stroke-width="0.8"/>
      <polygon points="56,71 58,76 62,72" fill="#ffffff" stroke="${palette.outline}" stroke-width="0.8"/>
    </g>
  `;
}

async function generateVisualBoards() {
  const outDir = resolve("research/references/generated");
  mkdirSync(outDir, { recursive: true });

  const stages = [
    { key: "charmander", name: "004 Charmander", renderer: renderCharmanderSprite },
    { key: "charmeleon", name: "005 Charmeleon", renderer: renderCharmeleonSprite },
    { key: "charizard", name: "006 Charizard", renderer: renderCharizardSprite }
  ];

  const milestones = [
    { t: 0.0, label: "0% Grayscale Baseline" },
    { t: 0.25, label: "25% Early Awakening" },
    { t: 0.50, label: "50% Harmonic Balance" },
    { t: 0.75, label: "75% Near Saturation" },
    { t: 1.0, label: "100% Full Mastery" }
  ];

  // Render individual milestone boards
  // Canvas: Width = 5 milestones * 170 + 40 = 890; Height = 3 stages * 190 + 100 = 670
  let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 700" width="940" height="700">
  <rect width="940" height="700" fill="#0d1117"/>
  
  <!-- Header -->
  <text x="40" y="44" font-family="-apple-system, sans-serif" font-size="22" font-weight="900" fill="#ffffff">NEO-POKÉDEX &#8212; Mathematical Progression &amp; Artwork Invariance Board</text>
  <text x="40" y="66" font-family="-apple-system, sans-serif" font-size="12" font-weight="600" fill="#8b949e">Proof of Geometric Invariance: Master Sprite Coordinates remain 100% Identical from 0% Grayscale to 100% Color</text>
`;

  // Milestone Column Headers
  milestones.forEach((m, colIdx) => {
    const x = 140 + colIdx * 155;
    svgContent += `
      <text x="${x + 75}" y="95" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#ff7a29">${m.label.toUpperCase()}</text>
    `;
  });

  // Stage Rows
  stages.forEach((st, rowIdx) => {
    const y = 110 + rowIdx * 185;
    // Row Label
    svgContent += `
      <g transform="translate(30, ${y + 60})">
        <rect width="90" height="40" rx="6" fill="#161b22" stroke="#30363d"/>
        <text x="45" y="24" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="11" font-weight="800" fill="#f0f6fc">${st.name.toUpperCase()}</text>
      </g>
    `;

    milestones.forEach((m, colIdx) => {
      const x = 140 + colIdx * 155;
      const palette = getInterpolatedPalette(st.key, m.t);
      const sprite = st.renderer(palette);

      svgContent += `
        <g transform="translate(${x}, ${y})">
          <rect width="150" height="170" rx="10" fill="#161b22" stroke="#21262d"/>
          <!-- Sub-pixel check grid to prove invariant pixel alignment -->
          <line x1="15" y1="150" x2="135" y2="150" stroke="#30363d" stroke-dasharray="3,3"/>
          <g transform="translate(-5, 0) scale(0.95)">
            ${sprite}
          </g>
          <text x="75" y="162" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="${m.t === 0 ? "#8b949e" : m.t === 1 ? "#38ef7d" : "#ffa059"}">T = ${(m.t * 100).toFixed(0)}%</text>
        </g>
      `;
    });
  });

  svgContent += `</svg>`;

  const svgPath = resolve(outDir, "evolution-style-reference.svg");
  const pngPath = resolve(outDir, "evolution-style-reference.png");

  writeFileSync(svgPath, svgContent, "utf-8");
  console.log("Wrote SVG visual reference board:", svgPath);

  await sharp(Buffer.from(svgContent))
    .png()
    .toFile(pngPath);
  console.log("Rendered high-resolution PNG comparison board:", pngPath);
}

generateVisualBoards().catch(console.error);
