/**
 * @file Modern 2.5D Anime Vector Geometry for Pokémon Evolutions.
 * True scalable vector paths with cel-shaded lighting, anatomical regions, and flame dynamics.
 */

/**
 * Generates an SVG path string for Charmander.
 * ViewBox: 0 0 400 400
 * @param {Record<string, string>} palette - Dynamic coloring palette
 * @param {object} [animationState] - Subtle breathing & flame flicker offsets
 * @returns {string} Inner SVG markup
 */
export function renderCharmanderVector(palette, animationState = {}) {
  const breathY = (animationState.breath || 0) * 3;
  const flamePhase = animationState.flamePhase || 0;
  const flameFlickerX = Math.sin(flamePhase * 1.5) * 4;
  const flameFlickerY = Math.cos(flamePhase * 2.0) * 5;

  return `
    <g id="charmander" class="pokemon-2d-anime" transform="translate(0, ${breathY})">
      <!-- Tail & Tail Flame (Region: tail & tail_flame) -->
      <g id="region-tail">
        <path d="M 180 280 C 140 290 100 270 80 230 C 70 210 75 190 85 175 C 92 185 105 210 130 230 C 150 245 170 255 190 260 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M 182 275 C 145 285 110 265 92 230 C 85 215 88 200 95 188 C 102 200 115 220 138 238 C 155 250 172 258 190 262 Z"
              fill="${palette.base}"/>
        <path d="M 98 195 C 110 215 130 235 155 248"
              stroke="${palette.highlight}" stroke-width="3" stroke-linecap="round" fill="none"/>
      </g>

      <!-- Tail Flame Core & Outer Fire (Region: tail_flame) -->
      <g id="region-tail_flame" transform="translate(${flameFlickerX}, ${flameFlickerY})">
        <!-- Outer Fire -->
        <path d="M 85 180 C 60 160 40 120 65 90 C 80 115 85 130 100 120 C 115 110 110 80 125 70 C 135 100 130 130 115 150 C 105 165 95 175 85 180 Z"
              fill="${palette.flameOuter}" filter="drop-shadow(0 0 8px ${palette.flameOuter})"/>
        <!-- Mid Fire -->
        <path d="M 85 175 C 68 158 55 130 72 105 C 84 122 88 132 102 125 C 112 118 108 95 120 88 C 128 110 122 132 110 148 C 102 160 92 170 85 175 Z"
              fill="${palette.base}"/>
        <!-- Inner Core Bright Flame -->
        <path d="M 87 170 C 76 155 68 135 80 118 C 90 130 95 135 104 130 C 112 125 110 110 116 102 C 122 120 116 135 106 148 Z"
              fill="${palette.flameInner}"/>
      </g>

      <!-- Left Leg & Foot (Region: legs) -->
      <g id="region-legs-left">
        <ellipse cx="160" cy="305" rx="30" ry="22" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4"/>
        <path d="M 135 320 Q 145 328 155 322 Q 165 328 175 322 Q 185 328 190 320"
              fill="${palette.belly}" stroke="${palette.outline}" stroke-width="3"/>
      </g>

      <!-- Main Torso & Belly (Region: torso) -->
      <g id="region-torso">
        <!-- Torso Back Shadow -->
        <path d="M 170 200 C 160 250 170 300 210 315 C 260 320 280 280 270 220 C 265 190 230 185 195 190 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4" stroke-linejoin="round"/>
        <!-- Torso Base -->
        <path d="M 176 198 C 168 245 178 295 215 310 C 258 315 276 278 266 222 C 260 192 228 188 195 192 Z"
              fill="${palette.base}"/>
        <!-- Cream Belly (Cel Shading) -->
        <path d="M 195 195 C 185 235 190 280 218 305 C 248 305 260 275 255 230 C 250 200 225 190 195 195 Z"
              fill="${palette.bellyShadow}"/>
        <path d="M 200 198 C 192 235 196 275 220 300 C 245 300 254 272 250 232 C 245 205 225 195 200 198 Z"
              fill="${palette.belly}"/>
      </g>

      <!-- Right Leg & Foot (Region: legs) -->
      <g id="region-legs-right">
        <ellipse cx="245" cy="305" rx="32" ry="24" fill="${palette.base}" stroke="${palette.outline}" stroke-width="4"/>
        <ellipse cx="245" cy="302" rx="28" ry="18" fill="${palette.highlight}" opacity="0.4"/>
        <!-- Claws -->
        <path d="M 230 322 L 233 328 L 238 322 M 245 324 L 248 330 L 253 324 M 260 322 L 263 328 L 268 322"
              stroke="${palette.outline}" stroke-width="3" fill="#ffffff"/>
      </g>

      <!-- Arms & Paws (Region: arms) -->
      <g id="region-arms">
        <!-- Left Arm -->
        <path d="M 185 220 C 165 225 155 240 162 252 C 168 260 180 258 190 248 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4"/>
        <!-- Right Arm -->
        <path d="M 245 220 C 265 225 278 240 272 255 C 265 265 252 260 240 248 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="4"/>
        <path d="M 248 224 C 262 228 272 240 268 250"
              stroke="${palette.highlight}" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- Right Claws -->
        <circle cx="270" cy="254" r="2.5" fill="#ffffff"/>
        <circle cx="274" cy="250" r="2.5" fill="#ffffff"/>
        <circle cx="272" cy="245" r="2.5" fill="#ffffff"/>
      </g>

      <!-- Head & Facial Anatomy (Region: head & details) -->
      <g id="region-head">
        <!-- Head Base & Contour -->
        <path d="M 175 140 C 165 95 210 70 250 80 C 290 90 305 130 290 165 C 275 195 225 200 190 185 C 175 175 170 155 175 140 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M 180 138 C 172 98 212 75 248 84 C 285 93 298 128 285 160 C 270 188 225 194 192 180 C 180 170 175 152 180 138 Z"
              fill="${palette.base}"/>
        <!-- Forehead Highlight -->
        <path d="M 200 95 C 225 85 255 90 270 105"
              stroke="${palette.highlight}" stroke-width="5" stroke-linecap="round" fill="none"/>

        <!-- Snout & Nostril -->
        <ellipse cx="275" cy="148" rx="2" ry="3" fill="${palette.outline}"/>

        <!-- Big Expressive Anime Eye -->
        <g id="region-details-eye">
          <ellipse cx="245" cy="125" rx="14" ry="20" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
          <ellipse cx="247" cy="125" rx="10" ry="16" fill="${palette.eye}"/>
          <ellipse cx="249" cy="125" rx="6" ry="12" fill="#0d1f3c"/>
          <circle cx="244" cy="116" r="4.5" fill="#ffffff"/>
          <circle cx="251" cy="132" r="2.5" fill="#ffffff"/>
        </g>

        <!-- Cute Smile & Tooth (Region: details) -->
        <path d="M 235 160 Q 255 172 278 155" stroke="${palette.outline}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M 265 159 L 268 166 L 272 161 Z" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
      </g>
    </g>
  `;
}

/**
 * Generates an SVG path string for Charmeleon.
 * ViewBox: 0 0 400 400
 * @param {Record<string, string>} palette
 * @param {object} [animationState]
 * @returns {string} Inner SVG markup
 */
export function renderCharmeleonVector(palette, animationState = {}) {
  const breathY = (animationState.breath || 0) * 3.5;
  const flamePhase = animationState.flamePhase || 0;
  const flameFlickerX = Math.sin(flamePhase * 1.8) * 5;
  const flameFlickerY = Math.cos(flamePhase * 2.2) * 6;

  return `
    <g id="charmeleon" class="pokemon-2d-anime" transform="translate(0, ${breathY})">
      <!-- Tail & Flame (Region: tail_flame) -->
      <g id="region-tail">
        <path d="M 170 270 C 120 280 80 255 60 210 C 48 185 55 160 68 140 C 76 155 88 185 118 215 C 140 235 165 248 185 252 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M 172 265 C 125 275 88 250 70 210 C 58 188 65 168 74 150 C 82 165 95 192 122 220 C 145 238 168 250 185 254 Z"
              fill="${palette.base}"/>
      </g>

      <!-- Fierce Tail Flame -->
      <g id="region-tail_flame" transform="translate(${flameFlickerX}, ${flameFlickerY})">
        <path d="M 68 145 C 35 125 15 75 45 40 C 65 70 70 90 90 75 C 110 60 105 30 125 15 C 135 55 130 95 110 120 C 95 138 82 145 68 145 Z"
              fill="${palette.flameOuter}" filter="drop-shadow(0 0 10px ${palette.flameOuter})"/>
        <path d="M 68 140 C 45 120 30 85 52 55 C 68 78 74 92 92 82 C 105 72 102 48 116 38 C 125 68 118 95 102 118 Z"
              fill="${palette.base}"/>
        <path d="M 70 135 C 55 115 45 92 60 70 C 72 88 78 95 90 88 C 102 80 100 62 108 52 C 115 75 108 95 96 114 Z"
              fill="${palette.flameInner}"/>
      </g>

      <!-- Strong Legs & Stance (Region: legs) -->
      <g id="region-legs-left">
        <ellipse cx="150" cy="310" rx="32" ry="24" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5"/>
        <path d="M 125 328 L 120 336 L 130 330 M 135 330 L 132 340 L 142 332 M 147 330 L 146 339 L 155 331"
              stroke="${palette.outline}" stroke-width="3" fill="#ffffff"/>
      </g>

      <!-- Torso & Muscular Chest (Region: torso) -->
      <g id="region-torso">
        <path d="M 160 190 C 150 245 160 305 205 320 C 260 325 285 280 275 210 C 270 175 230 170 190 178 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M 166 188 C 158 240 168 298 210 314 C 255 318 278 276 268 212 C 264 180 228 174 190 180 Z"
              fill="${palette.base}"/>
        <!-- Golden Cream Belly -->
        <path d="M 190 185 C 178 230 185 285 215 310 C 248 310 262 275 256 225 C 250 190 220 180 190 185 Z"
              fill="${palette.belly}"/>
      </g>

      <!-- Right Leg (Region: legs) -->
      <g id="region-legs-right">
        <ellipse cx="245" cy="310" rx="34" ry="26" fill="${palette.base}" stroke="${palette.outline}" stroke-width="4.5"/>
        <ellipse cx="245" cy="306" rx="28" ry="18" fill="${palette.highlight}" opacity="0.35"/>
        <!-- Razor Claws -->
        <path d="M 230 328 L 226 338 L 236 331 M 242 330 L 242 342 L 250 332 M 256 328 L 258 338 L 265 330"
              stroke="${palette.outline}" stroke-width="3.5" fill="#ffffff"/>
      </g>

      <!-- Arms & Predatory Claws (Region: arms & claws_details) -->
      <g id="region-arms">
        <!-- Right Forearm -->
        <path d="M 245 210 C 275 218 295 235 288 255 C 280 268 262 260 245 242 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="4.5"/>
        <!-- Triple White Claws -->
        <path d="M 285 248 L 298 250 L 288 256 M 283 255 L 294 262 L 282 264 M 276 260 L 285 270 L 274 268"
              stroke="${palette.outline}" stroke-width="3" fill="#ffffff"/>
      </g>

      <!-- Head with Prominent Horn Crest (Region: head) -->
      <g id="region-head">
        <!-- Head Profile & Rear Horn -->
        <path d="M 160 120 C 130 90 115 80 100 85 C 120 105 145 118 160 125 C 160 85 205 60 250 70 C 295 80 315 125 300 160 C 285 190 230 195 190 180 C 170 168 160 145 160 120 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M 164 118 C 136 92 122 84 108 88 C 126 106 148 118 164 124 C 164 88 206 65 248 74 C 290 84 308 124 294 156 C 280 184 228 190 190 176 C 172 164 164 142 164 118 Z"
              fill="${palette.base}"/>
        <!-- Horn Highlight -->
        <path d="M 112 90 C 130 105 150 115 170 120"
              stroke="${palette.highlight}" stroke-width="4" stroke-linecap="round" fill="none"/>

        <!-- Piercing Green Eye -->
        <g id="region-eye">
          <polygon points="235,110 265,115 255,135 230,128" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
          <polygon points="240,113 260,117 252,132 235,126" fill="${palette.eye}"/>
          <ellipse cx="248" cy="122" rx="3.5" ry="7" fill="#0b1710"/>
          <circle cx="245" cy="116" r="2.5" fill="#ffffff"/>
        </g>

        <!-- Fierce Snout & Grin -->
        <ellipse cx="285" cy="138" rx="2.5" ry="3.5" fill="${palette.outline}"/>
        <path d="M 230 152 Q 260 162 288 142" stroke="${palette.outline}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <polygon points="270,148 274,158 278,150" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
      </g>
    </g>
  `;
}

/**
 * Generates an SVG path string for Charizard.
 * ViewBox: 0 0 500 450
 * @param {Record<string, string>} palette
 * @param {object} [animationState]
 * @returns {string} Inner SVG markup
 */
export function renderCharizardVector(palette, animationState = {}) {
  const breathY = (animationState.breath || 0) * 4;
  const wingAngle = Math.sin((animationState.wingFlap || 0) * 2) * 5;
  const flamePhase = animationState.flamePhase || 0;
  const flameFlickerX = Math.sin(flamePhase * 2.0) * 6;
  const flameFlickerY = Math.cos(flamePhase * 2.4) * 8;

  return `
    <g id="charizard" class="pokemon-2d-anime" transform="translate(0, ${breathY})">
      <!-- Massive Dragon Wings (Region: wings) -->
      <g id="region-wings" transform="rotate(${wingAngle}, 250, 200)">
        <!-- Left Wing Outer Bone -->
        <path d="M 220 180 C 160 100 80 80 40 100 C 30 140 70 210 170 230 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5" stroke-linejoin="round"/>
        <!-- Left Wing Teal Membrane -->
        <path d="M 210 185 C 160 115 90 98 52 112 C 45 145 78 205 168 222 C 150 200 160 190 210 185 Z"
              fill="${palette.wingInner || "#2a8f85"}"/>

        <!-- Right Wing (Expansive) -->
        <path d="M 270 170 C 340 70 430 50 480 80 C 490 130 430 220 310 235 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5" stroke-linejoin="round"/>
        <!-- Wing Bone Ridge & Thumb Claw -->
        <path d="M 270 170 C 335 80 415 65 470 82"
              stroke="${palette.highlight}" stroke-width="7" stroke-linecap="round" fill="none"/>
        <polygon points="468,76 485,78 474,88" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <!-- Right Wing Inner Teal Membrane -->
        <path d="M 280 180 C 335 95 410 82 462 95 C 472 135 418 210 315 225 C 340 200 325 190 280 180 Z"
              fill="${palette.wingInner || "#2a8f85"}"/>
        <!-- Wing Shadow Ribs -->
        <path d="M 360 120 C 375 160 370 195 365 218 M 410 110 C 420 145 415 180 410 205"
              stroke="${palette.wingShadow || "#1a6058"}" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>

      <!-- Tail with Blazing Inferno (Region: tail & tail_flame) -->
      <g id="region-tail">
        <path d="M 200 310 C 140 330 80 300 50 240 C 30 200 40 160 60 130 C 70 150 85 190 125 230 C 160 260 195 285 220 295 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5" stroke-linejoin="round"/>
        <path d="M 202 305 C 145 325 90 295 62 240 C 44 205 52 170 68 142 C 78 160 92 198 130 235 C 165 264 198 288 222 298 Z"
              fill="${palette.base}"/>
      </g>

      <!-- Roaring Tail Fire -->
      <g id="region-tail_flame" transform="translate(${flameFlickerX}, ${flameFlickerY})">
        <path d="M 60 135 C 15 110 -10 50 25 10 C 50 50 60 70 85 55 C 110 40 105 5 130 -15 C 145 35 140 85 115 115 C 95 135 78 140 60 135 Z"
              fill="${palette.flameOuter}" filter="drop-shadow(0 0 14px ${palette.flameOuter})"/>
        <path d="M 60 130 C 25 105 8 60 38 25 C 58 58 66 75 88 62 C 105 50 102 22 118 10 C 130 45 124 82 105 110 Z"
              fill="${palette.base}"/>
        <path d="M 62 122 C 38 100 25 70 48 40 C 64 66 72 78 88 68 C 102 58 100 38 110 28 C 118 55 112 85 98 105 Z"
              fill="${palette.flameInner}"/>
      </g>

      <!-- Massive Dragon Legs (Region: legs) -->
      <g id="region-legs-left">
        <ellipse cx="190" cy="350" rx="38" ry="30" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
        <!-- Talons -->
        <polygon points="155,370 145,382 162,374" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
        <polygon points="170,372 165,386 178,375" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
        <polygon points="185,370 185,384 195,372" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
      </g>

      <!-- Dragon Torso & Belly (Region: torso) -->
      <g id="region-torso">
        <path d="M 210 210 C 195 270 205 345 255 365 C 320 370 350 315 340 230 C 330 190 280 180 235 195 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5" stroke-linejoin="round"/>
        <path d="M 218 208 C 205 265 215 338 260 358 C 315 362 342 310 332 232 C 324 195 278 186 235 198 Z"
              fill="${palette.base}"/>
        <!-- Cream Belly Plates -->
        <path d="M 235 205 C 220 255 228 325 265 352 C 305 352 322 310 315 250 C 308 208 270 195 235 205 Z"
              fill="${palette.belly}"/>
        <!-- Belly Segment Lines -->
        <path d="M 230 255 Q 265 268 308 252 M 235 295 Q 268 308 305 292"
              stroke="${palette.bellyShadow}" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>

      <!-- Right Leg & Talons (Region: legs) -->
      <g id="region-legs-right">
        <ellipse cx="295" cy="350" rx="42" ry="32" fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>
        <ellipse cx="295" cy="345" rx="34" ry="22" fill="${palette.highlight}" opacity="0.35"/>
        <!-- Talons -->
        <polygon points="275,372 268,386 282,376" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
        <polygon points="295,374 294,390 304,377" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
        <polygon points="315,372 320,386 326,373" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
      </g>

      <!-- Muscular Arms & Claws (Region: arms) -->
      <g id="region-arms">
        <path d="M 300 230 C 335 240 360 260 350 282 C 340 295 320 285 300 265 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>
        <polygon points="348,275 362,280 350,287" fill="#ffffff" stroke="${palette.outline}" stroke-width="2.5"/>
        <polygon points="344,284 356,293 342,295" fill="#ffffff" stroke="${palette.outline}" stroke-width="2.5"/>
      </g>

      <!-- Head with Twin Dragon Horns (Region: head) -->
      <g id="region-head">
        <!-- Neck -->
        <path d="M 235 195 C 240 160 250 145 260 135 C 275 145 285 165 290 195 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>
        <!-- Horns (Twin Curved Dragon Horns) -->
        <path d="M 255 125 C 225 80 195 70 175 75 C 205 95 235 110 255 125 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5"/>
        <path d="M 268 120 C 245 70 220 58 200 62 C 228 85 252 105 268 120 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="4.5"/>
        <path d="M 205 66 C 230 88 252 106 268 120"
              stroke="${palette.highlight}" stroke-width="4" stroke-linecap="round" fill="none"/>

        <!-- Head Base & Jaws -->
        <path d="M 255 120 C 265 95 305 85 340 98 C 375 110 385 140 365 168 C 345 190 295 185 265 170 C 250 155 248 135 255 120 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>

        <!-- Cyan Dragon Eye -->
        <polygon points="305,115 335,120 325,138 300,132" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
        <polygon points="310,118 330,122 322,135 305,130" fill="${palette.eye}"/>
        <polygon points="316,119 324,121 320,134 313,131" fill="#002830"/>
        <circle cx="314" cy="122" r="2.5" fill="#ffffff"/>

        <!-- Snout Nostril & Fangs -->
        <ellipse cx="360" cy="132" rx="3" ry="4" fill="${palette.outline}"/>
        <path d="M 295 152 Q 335 164 365 142" stroke="${palette.outline}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <polygon points="340,146 345,158 350,148" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <polygon points="352,142 356,152 360,144" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
      </g>
    </g>
  `;
}

/**
 * Generates an SVG path string for Mega Charizard Y.
 * ViewBox: 0 0 520 460
 * @param {Record<string, string>} palette
 * @param {object} [animationState]
 * @returns {string} Inner SVG markup
 */
export function renderMegaCharizardYVector(palette, animationState = {}) {
  const breathY = (animationState.breath || 0) * 4;
  const wingAngle = Math.sin((animationState.wingFlap || 0) * 2.2) * 6;
  const flamePhase = animationState.flamePhase || 0;
  const flameFlickerX = Math.sin(flamePhase * 2.2) * 7;
  const flameFlickerY = Math.cos(flamePhase * 2.6) * 9;

  return `
    <g id="mega-charizard-y" class="pokemon-2d-anime" transform="translate(0, ${breathY})">
      <!-- Massive Sharp Jagged Wings (Region: wings) -->
      <g id="region-wings" transform="rotate(${wingAngle}, 260, 210)">
        <!-- Left Aerodynamic Wing -->
        <path d="M 220 180 C 150 90 60 70 20 90 C 10 135 50 215 160 240 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
        <path d="M 210 185 C 150 105 70 88 32 102 C 25 140 60 210 158 232 Z"
              fill="${palette.wingInner || "#227e77"}"/>

        <!-- Right Grand Jagged Wing -->
        <path d="M 280 170 C 360 55 455 35 505 65 C 518 120 450 225 320 245 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>
        <path d="M 280 170 C 355 65 440 50 495 68"
              stroke="${palette.highlight}" stroke-width="8" stroke-linecap="round" fill="none"/>
        <polygon points="492,62 512,65 498,76" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <path d="M 290 180 C 355 80 435 68 488 82 C 500 128 440 215 325 235 Z"
              fill="${palette.wingInner || "#227e77"}"/>
      </g>

      <!-- Tail with Mega Blazing Inferno (Region: tail & tail_flame) -->
      <g id="region-tail">
        <path d="M 200 320 C 130 340 70 305 40 240 C 20 195 30 150 50 115 C 62 138 78 185 120 230 C 158 265 195 295 220 305 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
        <path d="M 202 315 C 135 335 78 300 50 240 C 32 198 42 160 58 128 C 70 148 85 192 125 235 C 162 268 198 298 222 308 Z"
              fill="${palette.base}"/>
      </g>

      <!-- Colossal Tail Flame -->
      <g id="region-tail_flame" transform="translate(${flameFlickerX}, ${flameFlickerY})">
        <path d="M 50 120 C 5 95 -20 35 15 -10 C 45 35 55 55 80 40 C 105 25 100 -10 125 -30 C 145 25 140 80 110 110 Z"
              fill="${palette.flameOuter}" filter="drop-shadow(0 0 16px ${palette.flameOuter})"/>
        <path d="M 50 115 C 15 90 -2 45 28 8 C 50 42 60 60 82 48 C 100 35 98 5 114 -8 C 128 32 122 75 102 105 Z"
              fill="${palette.base}"/>
        <path d="M 52 108 C 28 85 15 52 38 22 C 56 50 65 62 82 52 C 98 42 95 20 106 10 C 115 40 108 72 94 98 Z"
              fill="${palette.flameInner}"/>
      </g>

      <!-- Torso & Aerodynamic Ribs (Region: torso) -->
      <g id="region-torso">
        <path d="M 215 210 C 200 270 210 350 260 370 C 330 375 360 320 350 230 C 338 185 285 175 238 192 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
        <path d="M 222 208 C 210 265 220 342 265 362 C 322 368 350 315 342 232 C 332 190 282 180 238 195 Z"
              fill="${palette.base}"/>
        <path d="M 240 205 C 225 255 232 330 270 355 C 315 355 330 310 322 248 C 315 205 275 190 240 205 Z"
              fill="${palette.belly}"/>
      </g>

      <!-- Heavy Claws & Legs (Region: legs) -->
      <g id="region-legs">
        <ellipse cx="305" cy="355" rx="44" ry="34" fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>
        <polygon points="285,378 278,394 294,384" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
        <polygon points="305,380 304,398 316,384" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
        <polygon points="325,378 332,394 338,380" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
      </g>

      <!-- Arms with Wrist Wings (Region: arms) -->
      <g id="region-arms">
        <path d="M 310 230 C 345 240 375 260 365 285 C 352 298 332 288 310 265 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>
        <!-- Wrist Fin / Winglet -->
        <path d="M 345 250 C 375 252 395 265 385 280 C 370 285 355 275 345 265 Z"
              fill="${palette.wingInner || "#227e77"}" stroke="${palette.outline}" stroke-width="3"/>
      </g>

      <!-- Head with Triple Horns (Region: head) -->
      <g id="region-head">
        <!-- Center Long Horn -->
        <path d="M 265 110 C 235 50 195 30 165 35 C 205 65 240 90 265 110 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>
        <!-- Side Horns -->
        <path d="M 252 118 C 220 75 185 62 165 68 C 195 90 228 108 252 118 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5"/>
        <path d="M 275 112 C 248 65 215 50 195 55 C 225 78 255 100 275 112 Z"
              fill="${palette.highlight}" stroke="${palette.outline}" stroke-width="4.5"/>

        <!-- Sleek Sharp Snout -->
        <path d="M 260 115 C 275 90 318 80 355 92 C 392 105 405 135 385 165 C 360 190 305 182 270 168 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>

        <!-- Electric Cyan Eye -->
        <polygon points="315,110 348,115 338,135 310,128" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
        <polygon points="320,113 342,117 334,132 315,126" fill="${palette.eye}"/>
        <polygon points="326,114 336,116 330,131 322,128" fill="#002830"/>
        <circle cx="324" cy="118" r="2.5" fill="#ffffff"/>

        <!-- Nostril & Sharp Dragon Teeth -->
        <ellipse cx="375" cy="128" rx="3.5" ry="4.5" fill="${palette.outline}"/>
        <path d="M 305 150 Q 345 162 380 138" stroke="${palette.outline}" stroke-width="4.5" fill="none"/>
        <polygon points="350,144 356,156 362,146" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <polygon points="364,140 370,150 375,142" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
      </g>
    </g>
  `;
}

/**
 * Generates an SVG path string for Mega Charizard X.
 * ViewBox: 0 0 520 460
 * @param {Record<string, string>} palette
 * @param {object} [animationState]
 * @returns {string} Inner SVG markup
 */
export function renderMegaCharizardXVector(palette, animationState = {}) {
  const breathY = (animationState.breath || 0) * 4;
  const wingAngle = Math.sin((animationState.wingFlap || 0) * 2.2) * 6;
  const flamePhase = animationState.flamePhase || 0;
  const flameFlickerX = Math.sin(flamePhase * 2.5) * 8;
  const flameFlickerY = Math.cos(flamePhase * 3.0) * 10;

  return `
    <g id="mega-charizard-x" class="pokemon-2d-anime" transform="translate(0, ${breathY})">
      <!-- Spiked Obsidian Bat Wings (Region: wings) -->
      <g id="region-wings" transform="rotate(${wingAngle}, 260, 210)">
        <path d="M 220 180 C 150 90 60 70 20 90 C 10 135 50 215 160 240 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
        <path d="M 280 170 C 360 55 455 35 505 65 C 518 120 450 225 320 245 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>
        <!-- Cyan Spikes on Wings -->
        <polygon points="460,50 475,30 480,58" fill="${palette.belly}" stroke="${palette.outline}" stroke-width="2"/>
        <polygon points="390,65 405,45 410,75" fill="${palette.belly}" stroke="${palette.outline}" stroke-width="2"/>
      </g>

      <!-- Tail with Blazing Cyan Plasma Fire (Region: tail & blue_flame) -->
      <g id="region-tail">
        <path d="M 200 320 C 130 340 70 305 40 240 C 20 195 30 150 50 115 C 62 138 78 185 120 230 C 158 265 195 295 220 305 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
        <path d="M 202 315 C 135 335 78 300 50 240 C 32 198 42 160 58 128 C 70 148 85 192 125 235 C 162 268 198 298 222 308 Z"
              fill="${palette.base}"/>
      </g>

      <!-- Blazing Cyan Blue Tail Flame -->
      <g id="region-blue_flame" transform="translate(${flameFlickerX}, ${flameFlickerY})">
        <path d="M 50 120 C 5 95 -20 35 15 -10 C 45 35 55 55 80 40 C 105 25 100 -10 125 -30 C 145 25 140 80 110 110 Z"
              fill="${palette.flameOuter}" filter="drop-shadow(0 0 18px ${palette.flameOuter})"/>
        <path d="M 50 115 C 15 90 -2 45 28 8 C 50 42 60 60 82 48 C 100 35 98 5 114 -8 C 128 32 122 75 102 105 Z"
              fill="${palette.flameMid || palette.belly}"/>
        <path d="M 52 108 C 28 85 15 52 38 22 C 56 50 65 62 82 52 C 98 42 95 20 106 10 C 115 40 108 72 94 98 Z"
              fill="${palette.flameInner}"/>
      </g>

      <!-- Obsidian Torso & Sky-Blue Belly (Region: torso) -->
      <g id="region-torso">
        <path d="M 215 210 C 200 270 210 350 260 370 C 330 375 360 320 350 230 C 338 185 285 175 238 192 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
        <path d="M 222 208 C 210 265 220 342 265 362 C 322 368 350 315 342 232 C 332 190 282 180 238 195 Z"
              fill="${palette.base}"/>
        <!-- Brilliant Sky-Blue Belly -->
        <path d="M 240 205 C 225 255 232 330 270 355 C 315 355 330 310 322 248 C 315 205 275 190 240 205 Z"
              fill="${palette.belly}" filter="drop-shadow(0 0 6px ${palette.belly})"/>
      </g>

      <!-- Powerful Talons & Legs (Region: legs) -->
      <g id="region-legs">
        <ellipse cx="305" cy="355" rx="44" ry="34" fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>
        <polygon points="285,378 278,394 294,384" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
        <polygon points="305,380 304,398 316,384" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
        <polygon points="325,378 332,394 338,380" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
      </g>

      <!-- Arms with Sharp Claws (Region: arms) -->
      <g id="region-arms">
        <path d="M 310 230 C 345 240 375 260 365 285 C 352 298 332 288 310 265 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>
        <polygon points="360,278 375,282 362,290" fill="#ffffff" stroke="${palette.outline}" stroke-width="2.5"/>
      </g>

      <!-- Head with Blue Curved Horns & Mouth Flames (Region: head & blue_flame) -->
      <g id="region-head">
        <!-- Cyan Curved Horns -->
        <path d="M 265 110 C 235 50 195 30 165 35 C 205 65 240 90 265 110 Z"
              fill="${palette.belly}" stroke="${palette.outline}" stroke-width="5"/>
        <path d="M 252 118 C 220 75 185 62 165 68 C 195 90 228 108 252 118 Z"
              fill="${palette.bellyShadow || palette.shadow}" stroke="${palette.outline}" stroke-width="4.5"/>

        <!-- Head Contour -->
        <path d="M 260 115 C 275 90 318 80 355 92 C 392 105 405 135 385 165 C 360 190 305 182 270 168 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>

        <!-- Piercing Ruby Red Eye -->
        <polygon points="315,110 348,115 338,135 310,128" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
        <polygon points="320,113 342,117 334,132 315,126" fill="${palette.eye}"/>
        <polygon points="326,114 336,116 330,131 322,128" fill="#5c0000"/>
        <circle cx="324" cy="118" r="2.5" fill="#ffffff"/>

        <!-- Iconic Cyan Flames Erupting from Jaw/Mouth -->
        <g id="region-mouth-flame">
          <path d="M 330 155 C 355 170 380 185 410 180 C 400 165 390 155 365 150 Z"
                fill="${palette.flameMid || palette.belly}" filter="drop-shadow(0 0 8px ${palette.flameMid || palette.belly})"/>
          <path d="M 340 153 C 360 165 385 172 400 170 C 392 160 382 153 365 148 Z"
                fill="${palette.flameInner}"/>
        </g>
      </g>
    </g>
  `;
}
