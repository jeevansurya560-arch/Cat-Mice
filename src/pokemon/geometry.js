/**
 * @file Modern 2.5D Anime Vector Geometry for Pokémon Evolutions.
 * FRONT-FACING ORIENTATION: Camera directly in front of the character.
 * Both eyes clearly visible, balanced anatomical silhouette, natural standing pose,
 * fully featured wings, tail flames, and cel-shaded lighting.
 */

/**
 * Generates front-facing SVG vector markup for Charmander (No. 0004).
 * ViewBox: 0 0 520 480 (Centered at X=260)
 *
 * @param {Record<string, string>} palette - Dynamic coloring palette
 * @param {object} [animationState] - Subtle breathing & flame flicker offsets
 * @returns {string} Inner SVG markup
 */
export function renderCharmanderVector(palette, animationState = {}) {
  const breathY = (animationState.breath || 0) * 3.0;
  const flamePhase = animationState.flamePhase || 0;
  const flameFlickerX = Math.sin(flamePhase * 1.5) * 4;
  const flameFlickerY = Math.cos(flamePhase * 2.0) * 5;

  return `
    <g id="charmander" class="pokemon-2d-anime front-facing" transform="translate(0, ${breathY})">
      <!-- Tail & Tail Flame (Region: tail & tail_flame) -->
      <g id="region-tail">
        <!-- Sweeping tail from lower back rightwards and curving up -->
        <path d="M 285 330 C 330 335 375 315 390 270 C 400 240 392 210 382 190 C 375 208 368 235 352 255 C 332 278 300 295 275 305 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M 283 325 C 325 330 368 310 384 268 C 392 242 386 218 378 200 C 372 216 364 238 348 258 C 330 280 298 296 276 304 Z"
              fill="${palette.base}"/>
        <path d="M 378 202 C 364 232 344 260 315 285"
              stroke="${palette.highlight}" stroke-width="3" stroke-linecap="round" fill="none"/>
      </g>

      <!-- Tail Flame Core & Outer Fire (Region: tail_flame) -->
      <g id="region-tail_flame" transform="translate(${flameFlickerX}, ${flameFlickerY})">
        <!-- Outer Fire -->
        <path d="M 382 195 C 360 170 345 130 368 95 C 385 125 392 140 410 130 C 428 118 422 85 438 72 C 450 108 442 142 425 165 C 412 182 398 192 382 195 Z"
              fill="${palette.flameOuter}" filter="drop-shadow(0 0 10px ${palette.flameOuter})"/>
        <!-- Mid Fire -->
        <path d="M 382 190 C 365 170 352 138 372 110 C 385 130 390 142 406 134 C 418 126 414 100 428 92 C 438 116 430 142 416 160 C 405 174 394 185 382 190 Z"
              fill="${palette.base}"/>
        <!-- Inner Core Bright Flame -->
        <path d="M 384 185 C 372 168 362 145 378 124 C 388 138 395 144 406 138 C 416 132 414 114 422 106 C 428 126 422 144 410 158 Z"
              fill="${palette.flameInner}"/>
      </g>

      <!-- Left Leg & Foot (Region: legs) -->
      <g id="region-legs-left">
        <ellipse cx="205" cy="350" rx="34" ry="26" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5"/>
        <ellipse cx="202" cy="348" rx="28" ry="20" fill="${palette.base}"/>
        <!-- Left Foot planted forward with 3 rounded claws -->
        <path d="M 180 376 Q 185 388 194 378 Q 202 388 212 378 Q 220 388 228 376"
              fill="${palette.belly}" stroke="${palette.outline}" stroke-width="3"/>
        <polygon points="186,378 189,386 193,380" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
        <polygon points="202,378 206,387 210,380" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
        <polygon points="218,377 222,385 226,379" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
      </g>

      <!-- Right Leg & Foot (Region: legs) -->
      <g id="region-legs-right">
        <ellipse cx="315" cy="350" rx="34" ry="26" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5"/>
        <ellipse cx="318" cy="348" rx="28" ry="20" fill="${palette.base}"/>
        <!-- Right Foot planted forward with 3 rounded claws -->
        <path d="M 292 376 Q 300 388 308 378 Q 318 388 326 378 Q 335 388 340 376"
              fill="${palette.belly}" stroke="${palette.outline}" stroke-width="3"/>
        <polygon points="294,379 298,385 302,377" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
        <polygon points="310,380 314,387 318,378" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
        <polygon points="327,380 331,386 334,378" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
      </g>

      <!-- Main Torso & Belly (Region: torso) -->
      <g id="region-torso">
        <!-- Symmetrical Front Torso Base -->
        <path d="M 195 240 C 185 285 195 345 230 365 C 260 372 290 365 325 345 C 335 285 325 240 295 225 C 260 220 225 225 195 240 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5" stroke-linejoin="round"/>
        <path d="M 198 238 C 190 280 200 340 232 360 C 260 366 288 360 322 340 C 330 280 320 238 292 225 C 260 220 226 225 198 238 Z"
              fill="${palette.base}"/>
        <!-- Cream Oval Belly Plate (Centered Front) -->
        <ellipse cx="260" cy="295" rx="46" ry="58" fill="${palette.bellyShadow}"/>
        <ellipse cx="260" cy="293" rx="42" ry="54" fill="${palette.belly}"/>
        <!-- Torso Highlight -->
        <path d="M 205 250 C 200 275 205 305 215 325"
              stroke="${palette.highlight}" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>

      <!-- Left Arm & Hand (Region: arms) -->
      <g id="region-arms-left">
        <path d="M 205 245 C 175 255 160 275 168 295 C 174 305 190 300 202 285 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5"/>
        <path d="M 204 245 C 178 255 165 272 172 290 C 176 298 188 295 198 282 Z"
              fill="${palette.base}"/>
        <!-- Left Claws -->
        <circle cx="166" cy="292" r="3" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
        <circle cx="172" cy="298" r="3" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
        <circle cx="178" cy="301" r="3" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
      </g>

      <!-- Right Arm & Hand (Region: arms) -->
      <g id="region-arms-right">
        <path d="M 315 245 C 345 255 360 275 352 295 C 346 305 330 300 318 285 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5"/>
        <path d="M 316 245 C 342 255 355 272 348 290 C 344 298 332 295 322 282 Z"
              fill="${palette.base}"/>
        <!-- Right Claws -->
        <circle cx="354" cy="292" r="3" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
        <circle cx="348" cy="298" r="3" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
        <circle cx="342" cy="301" r="3" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
      </g>

      <!-- Head & Facial Anatomy (Region: head & details) - FRONT-FACING -->
      <g id="region-head">
        <!-- Head Base & Contour (Centered, Wide Symmetrical Anime Head) -->
        <path d="M 195 155 C 185 105 220 75 260 75 C 300 75 335 105 325 155 C 320 195 285 210 260 210 C 235 210 200 195 195 155 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5" stroke-linejoin="round"/>
        <path d="M 198 152 C 188 108 222 80 260 80 C 298 80 332 108 322 152 C 318 190 284 205 260 205 C 236 205 202 190 198 152 Z"
              fill="${palette.base}"/>

        <!-- Forehead Highlight Arc -->
        <path d="M 225 96 C 245 88 275 88 295 96"
              stroke="${palette.highlight}" stroke-width="5" stroke-linecap="round" fill="none"/>

        <!-- Snout Center Highlight & Nostrils -->
        <ellipse cx="260" cy="162" rx="12" ry="7" fill="${palette.highlight}" opacity="0.4"/>
        <circle cx="254" cy="162" r="2.2" fill="${palette.outline}"/>
        <circle cx="266" cy="162" r="2.2" fill="${palette.outline}"/>

        <!-- LEFT EYE (Clearly Visible, Large Expressive Anime Eye) -->
        <g id="region-details-eye-left">
          <ellipse cx="228" cy="142" rx="15" ry="21" fill="#ffffff" stroke="${palette.outline}" stroke-width="3.5"/>
          <ellipse cx="230" cy="142" rx="11" ry="17" fill="${palette.eye}"/>
          <ellipse cx="231" cy="142" rx="7" ry="13" fill="#0d1f3c"/>
          <!-- Anime Reflections -->
          <circle cx="226" cy="133" r="5" fill="#ffffff"/>
          <circle cx="234" cy="150" r="3" fill="#ffffff"/>
        </g>

        <!-- RIGHT EYE (Clearly Visible, Large Expressive Anime Eye) -->
        <g id="region-details-eye-right">
          <ellipse cx="292" cy="142" rx="15" ry="21" fill="#ffffff" stroke="${palette.outline}" stroke-width="3.5"/>
          <ellipse cx="290" cy="142" rx="11" ry="17" fill="${palette.eye}"/>
          <ellipse cx="289" cy="142" rx="7" ry="13" fill="#0d1f3c"/>
          <!-- Anime Reflections -->
          <circle cx="286" cy="133" r="5" fill="#ffffff"/>
          <circle cx="294" cy="150" r="3" fill="#ffffff"/>
        </g>

        <!-- Eyebrows / Expression Ridges -->
        <path d="M 215 122 Q 228 116 242 122" stroke="${palette.outline}" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M 305 122 Q 292 116 278 122" stroke="${palette.outline}" stroke-width="3" stroke-linecap="round" fill="none"/>

        <!-- Cute Anime Smile & Tooth (Region: details) -->
        <path d="M 242 175 Q 260 190 278 175" stroke="${palette.outline}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- Tooth -->
        <polygon points="266,177 271,186 276,178" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
      </g>
    </g>
  `;
}

/**
 * Generates SVG vector markup for Charmeleon (No. 0005) matching the official Pokédex artwork.
 * ViewBox: 0 0 520 480
 *
 * @param {Record<string, string>} palette
 * @param {object} [animationState]
 * @returns {string} Inner SVG markup
 */
export function renderCharmeleonVector(palette, animationState = {}) {
  const breathY = (animationState.breath || 0) * 3.0;
  const flamePhase = animationState.flamePhase || 0;
  const flameFlickerX = Math.sin(flamePhase * 1.8) * 4;
  const flameFlickerY = Math.cos(flamePhase * 2.2) * 5;

  return `
    <g id="charmeleon" class="pokemon-2d-anime official-pokedex" transform="translate(0, ${breathY})">
      <!-- Ground Contact Shadow -->
      <ellipse cx="250" cy="445" rx="130" ry="14" fill="#000000" opacity="0.25"/>

      <!-- TAIL (Thick, muscular tail sweeping right and curving up) -->
      <g id="region-tail">
        <!-- Tail Shadow Layer -->
        <path d="M 270 350 C 310 365 365 375 395 350 C 410 335 412 310 398 290 C 390 305 382 322 368 335 C 342 355 305 352 272 342 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5" stroke-linejoin="round"/>
        <!-- Tail Base -->
        <path d="M 272 346 C 312 360 364 368 392 346 C 406 332 408 312 396 295 C 388 308 380 324 366 336 C 342 354 306 350 274 340 Z"
              fill="${palette.base}"/>
        <!-- Tail Top Highlight -->
        <path d="M 305 356 C 335 360 365 355 385 338"
              stroke="${palette.highlight}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      </g>

      <!-- TAIL FLAME (Torch fire at the tip) -->
      <g id="region-tail_flame" transform="translate(${flameFlickerX}, ${flameFlickerY})">
        <!-- Outer Fire -->
        <path d="M 396 295 C 380 275 368 240 382 205 C 392 230 400 240 408 228 C 420 215 415 185 432 170 C 445 205 440 245 422 270 C 412 285 404 292 396 295 Z"
              fill="${palette.flameOuter}" filter="drop-shadow(0 0 14px ${palette.flameOuter})"/>
        <!-- Mid Fire Tongues -->
        <path d="M 396 290 C 384 270 376 242 388 215 C 396 235 402 242 412 232 C 422 222 418 198 430 185 C 438 212 434 245 420 268 C 410 282 402 288 396 290 Z"
              fill="#ff9800"/>
        <!-- Inner Hot Core Flame -->
        <path d="M 398 285 C 388 268 382 248 392 228 C 398 242 404 246 412 240 C 418 232 416 215 424 205 C 430 225 426 250 416 268 Z"
              fill="${palette.flameInner}"/>
      </g>

      <!-- RIGHT LEG & FOOT (Viewer's right - midground) -->
      <g id="region-legs-right">
        <!-- Muscular Thigh -->
        <path d="M 270 325 C 295 330 325 350 322 390 C 320 415 310 435 295 442 C 285 435 278 410 272 385 C 268 360 265 340 270 325 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M 272 328 C 294 334 320 352 318 388 C 316 412 306 432 294 438 C 285 432 280 410 274 385 C 270 360 268 342 272 328 Z"
              fill="${palette.base}"/>
        <!-- 3 Right Foot Claws -->
        <path d="M 278 440 L 268 450 L 286 446 Z" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <path d="M 288 444 L 284 456 L 298 448 Z" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <path d="M 300 442 L 302 454 L 310 442 Z" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
      </g>

      <!-- TORSO & BELLY -->
      <g id="region-torso">
        <!-- Back & Torso Silhouette -->
        <path d="M 230 220 C 215 250 205 285 205 320 C 205 365 225 400 255 405 C 285 405 305 375 305 330 C 305 270 295 230 275 205 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5" stroke-linejoin="round"/>
        <path d="M 232 220 C 218 250 210 285 210 318 C 210 360 228 395 255 400 C 282 400 300 372 300 330 C 300 272 292 232 274 206 Z"
              fill="${palette.base}"/>

        <!-- PALE BEIGE/CREAM BELLY PATCH (As seen in reference) -->
        <path d="M 226 250 C 215 280 212 315 218 345 C 224 372 240 388 256 388 C 272 388 280 365 278 335 C 275 295 258 260 236 248 Z"
              fill="${palette.bellyShadow}"/>
        <path d="M 228 252 C 218 280 216 312 222 342 C 226 368 240 384 254 384 C 268 384 276 362 274 334 C 272 296 256 262 236 250 Z"
              fill="${palette.belly}"/>
        <!-- Belly subtle highlight -->
        <path d="M 232 265 C 226 290 225 320 232 345"
              stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.35"/>
      </g>

      <!-- RIGHT ARM (Viewer's right - midground) -->
      <g id="region-arms-right">
        <path d="M 288 270 C 305 280 325 300 324 328 C 322 340 314 348 304 348 C 298 340 295 325 294 308 C 292 290 286 280 288 270 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M 290 272 C 304 282 322 300 320 326 C 318 336 312 344 304 344 C 298 336 296 322 295 308 C 294 292 288 282 290 272 Z"
              fill="${palette.base}"/>
        <!-- 3 Right Hand Claws -->
        <path d="M 314 342 L 316 358 L 324 348 Z" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.8"/>
        <path d="M 322 346 L 328 362 L 334 350 Z" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.8"/>
        <path d="M 330 348 L 340 360 L 338 346 Z" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.8"/>
      </g>

      <!-- LEFT LEG & FOOT (Viewer's left - foreground) -->
      <g id="region-legs-left">
        <!-- Muscular Thigh & Calf -->
        <path d="M 210 320 C 185 330 170 355 174 385 C 178 408 190 422 188 435 C 182 435 174 425 170 410 C 165 390 175 350 200 325 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M 208 322 C 188 332 174 355 178 382 C 182 405 192 418 190 432 C 185 432 178 422 174 408 C 170 390 178 352 202 326 Z"
              fill="${palette.base}"/>
        <!-- 3 Left Foot Claws (Resting on Ground) -->
        <path d="M 172 434 L 158 442 L 176 446 Z" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <path d="M 180 442 L 174 454 L 192 448 Z" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <path d="M 194 444 L 194 456 L 204 444 Z" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
      </g>

      <!-- LEFT ARM (Viewer's left - foreground) -->
      <g id="region-arms-left">
        <!-- Shoulder, Bicep, Forearm reaching forward -->
        <path d="M 206 265 C 185 275 168 298 162 322 C 158 338 168 345 178 342 C 188 335 194 315 198 295 C 200 282 204 272 206 265 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M 206 268 C 188 276 172 298 166 320 C 162 334 170 340 178 338 C 186 332 192 314 196 295 C 198 284 202 274 206 268 Z"
              fill="${palette.base}"/>
        <!-- 3 Prominent White Curved Hand Claws -->
        <!-- Claw 1 (outer) -->
        <path d="M 152 325 L 134 334 L 148 342 Z" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <!-- Claw 2 (middle) -->
        <path d="M 154 340 L 140 354 L 158 350 Z" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <!-- Claw 3 (inner) -->
        <path d="M 164 348 L 156 364 L 172 356 Z" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
      </g>

      <!-- HEAD & HORN CREST (Exact official Pokédex head structure) -->
      <g id="region-head">
        <!-- Neck Base -->
        <path d="M 230 220 C 235 205 240 195 245 185 C 265 190 280 195 285 210 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5"/>
        <path d="M 232 218 C 236 205 241 196 246 186 C 264 191 278 196 283 208 Z"
              fill="${palette.base}"/>

        <!-- ICONIC BACKWARD-SWEEPING HORN CREST -->
        <path d="M 250 145 C 270 125 295 95 315 85 C 322 82 328 86 325 94 C 315 118 300 150 285 185 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M 252 143 C 272 124 296 95 314 86 C 320 84 324 87 322 93 C 314 116 298 148 284 182 Z"
              fill="${palette.base}"/>
        <!-- Horn Top Ridge Highlight -->
        <path d="M 262 135 C 280 115 300 95 315 88"
              stroke="${palette.highlight}" stroke-width="3" stroke-linecap="round" fill="none"/>

        <!-- REPTILIAN HEAD & SNOUT -->
        <path d="M 255 140 C 235 145 205 160 185 180 C 175 190 178 200 186 204 C 205 210 225 215 242 205 C 255 195 262 175 260 155 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M 254 138 C 236 143 206 158 186 178 C 178 188 180 198 188 202 C 206 208 224 212 240 203 C 252 193 258 174 256 154 Z"
              fill="${palette.base}"/>

        <!-- Far Brow Ridge (gives 3/4 dimensional depth) -->
        <path d="M 240 142 C 246 148 248 155 246 160"
              stroke="${palette.outline}" stroke-width="3" stroke-linecap="round" fill="none"/>

        <!-- Snout Top Highlight -->
        <path d="M 215 162 C 198 175 186 186 184 195"
              stroke="${palette.highlight}" stroke-width="3.5" stroke-linecap="round" fill="none"/>

        <!-- Nostril -->
        <ellipse cx="198" cy="186" rx="2.5" ry="1.8" fill="${palette.outline}"/>

        <!-- DETERMINED TEAL ANIME EYE (Near Side) -->
        <g id="region-eye">
          <!-- Sharp Triangular Brow Ridge -->
          <path d="M 210 162 L 235 165" stroke="${palette.outline}" stroke-width="3.5" stroke-linecap="round"/>
          <!-- Sclera -->
          <polygon points="212,165 233,167 228,185 215,182" fill="#ffffff" stroke="${palette.outline}" stroke-width="2.5"/>
          <!-- Teal Iris -->
          <polygon points="216,166 230,168 226,183 218,181" fill="${palette.eye}"/>
          <!-- Pupil -->
          <ellipse cx="223" cy="174" rx="3.5" ry="6" fill="#0b1710"/>
          <!-- Specular White Reflection Dot -->
          <circle cx="220" cy="170" r="2.2" fill="#ffffff"/>
        </g>

        <!-- Confident Smirk / Mouthline with Beak Notch -->
        <path d="M 188 202 Q 206 208 228 198" stroke="${palette.outline}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <!-- Small Tooth / Fang at corner of mouth -->
        <polygon points="220,199 223,207 226,200" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.2"/>
      </g>
    </g>
  `;
}

/**
 * Generates front-facing SVG vector markup for Charizard (No. 0006).
 * ViewBox: 0 0 520 480 (Centered at X=260)
 *
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
    <g id="charizard" class="pokemon-2d-anime front-facing" transform="translate(0, ${breathY})">
      <!-- MASSIVE DRAGON WINGS (BALANCED SYMMETRICAL EXPANSION ON BOTH SIDES) -->
      <g id="region-wings">
        <!-- LEFT WING (Expansive Teal Membrane & Bone) -->
        <g id="wing-left" transform="rotate(${-wingAngle}, 210, 180)">
          <!-- Outer Wing Bone & Thumb Claw -->
          <path d="M 210 180 C 150 90 70 80 35 105 C 25 150 65 230 170 245 Z"
                fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5" stroke-linejoin="round"/>
          <!-- Teal Inner Membrane -->
          <path d="M 200 185 C 145 105 78 95 44 115 C 38 152 75 220 168 238 C 150 215 160 195 200 185 Z"
                fill="${palette.wingInner || "#2a8f85"}"/>
          <!-- Wing Finger Ridge Ribs -->
          <path d="M 115 130 C 105 170 110 205 115 225 M 70 120 C 65 155 70 190 75 210"
                stroke="${palette.wingShadow || "#1a6058"}" stroke-width="4" stroke-linecap="round" fill="none"/>
          <!-- Left Thumb Claw -->
          <polygon points="38,98 22,102 34,112" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        </g>

        <!-- RIGHT WING (Expansive Teal Membrane & Bone) -->
        <g id="wing-right" transform="rotate(${wingAngle}, 310, 180)">
          <!-- Outer Wing Bone & Thumb Claw -->
          <path d="M 310 180 C 370 90 450 80 485 105 C 495 150 455 230 350 245 Z"
                fill="${palette.base}" stroke="${palette.outline}" stroke-width="5" stroke-linejoin="round"/>
          <!-- Teal Inner Membrane -->
          <path d="M 320 185 C 375 105 442 95 476 115 C 482 152 445 220 352 238 C 370 215 360 195 320 185 Z"
                fill="${palette.wingInner || "#2a8f85"}"/>
          <!-- Wing Finger Ridge Ribs -->
          <path d="M 405 130 C 415 170 410 205 405 225 M 450 120 C 455 155 450 190 445 210"
                stroke="${palette.wingShadow || "#1a6058"}" stroke-width="4" stroke-linecap="round" fill="none"/>
          <!-- Right Thumb Claw -->
          <polygon points="482,98 498,102 486,112" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        </g>
      </g>

      <!-- Tail with Blazing Inferno (Region: tail & tail_flame) -->
      <g id="region-tail">
        <path d="M 285 330 C 350 340 410 310 430 250 C 445 205 430 160 410 130 C 400 155 395 195 375 230 C 350 268 310 295 275 310 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5.5" stroke-linejoin="round"/>
        <path d="M 284 324 C 345 334 402 305 422 248 C 435 208 422 168 406 138 C 396 162 390 198 372 232 C 348 268 310 294 276 308 Z"
              fill="${palette.base}"/>
      </g>

      <!-- Roaring Tail Fire -->
      <g id="region-tail_flame" transform="translate(${flameFlickerX}, ${flameFlickerY})">
        <path d="M 410 135 C 375 105 350 45 390 5 C 415 45 425 65 450 50 C 475 35 470 0 495 -20 C 510 30 505 80 480 110 C 460 130 438 140 410 135 Z"
              fill="${palette.flameOuter}" filter="drop-shadow(0 0 16px ${palette.flameOuter})"/>
        <path d="M 410 130 C 380 102 360 55 395 20 C 415 52 424 70 446 58 C 465 45 460 18 480 5 C 492 40 486 78 465 105 Z"
              fill="${palette.base}"/>
        <path d="M 412 122 C 390 98 375 68 402 35 C 420 62 428 74 444 65 C 458 54 455 34 466 22 C 475 50 468 80 452 100 Z"
              fill="${palette.flameInner}"/>
      </g>

      <!-- Massive Dragon Left Leg & Talons (Region: legs) -->
      <g id="region-legs-left">
        <ellipse cx="185" cy="355" rx="42" ry="32" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
        <ellipse cx="185" cy="350" rx="34" ry="24" fill="${palette.base}"/>
        <!-- 3 Talons -->
        <polygon points="152,376 142,392 160,382" fill="#ffffff" stroke="${palette.outline}" stroke-width="2.5"/>
        <polygon points="172,378 168,396 182,384" fill="#ffffff" stroke="${palette.outline}" stroke-width="2.5"/>
        <polygon points="196,376 198,394 206,380" fill="#ffffff" stroke="${palette.outline}" stroke-width="2.5"/>
      </g>

      <!-- Massive Dragon Right Leg & Talons (Region: legs) -->
      <g id="region-legs-right">
        <ellipse cx="335" cy="355" rx="42" ry="32" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
        <ellipse cx="335" cy="350" rx="34" ry="24" fill="${palette.base}"/>
        <!-- 3 Talons -->
        <polygon points="314,376 316,394 324,380" fill="#ffffff" stroke="${palette.outline}" stroke-width="2.5"/>
        <polygon points="338,378 352,396 348,384" fill="#ffffff" stroke="${palette.outline}" stroke-width="2.5"/>
        <polygon points="358,376 378,392 368,382" fill="#ffffff" stroke="${palette.outline}" stroke-width="2.5"/>
      </g>

      <!-- Broad Dragon Torso & Segmented Belly (Region: torso) -->
      <g id="region-torso">
        <!-- Main Dragon Torso -->
        <path d="M 185 220 C 170 280 185 350 225 370 C 260 378 295 370 335 350 C 350 280 335 220 295 200 C 260 195 220 200 185 220 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5.5" stroke-linejoin="round"/>
        <path d="M 190 218 C 176 275 190 345 228 365 C 260 372 292 365 330 345 C 344 275 330 218 292 200 C 260 195 222 200 190 218 Z"
              fill="${palette.base}"/>
        <!-- Cream Segmented Belly Plates (Down Center) -->
        <path d="M 220 205 C 205 255 210 330 235 355 C 260 360 285 355 305 330 C 315 255 310 205 260 202 Z"
              fill="${palette.belly}"/>
        <!-- Segment Ridges -->
        <path d="M 222 245 Q 260 258 298 245 M 224 285 Q 260 298 296 285 M 228 322 Q 260 335 292 322"
              stroke="${palette.bellyShadow}" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>

      <!-- Muscular Arms & Claws (Region: arms) -->
      <g id="region-arms-left">
        <path d="M 195 225 C 160 235 145 260 152 280 C 160 290 180 285 195 265 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
        <path d="M 194 225 C 164 235 150 258 156 276 C 162 284 176 280 190 262 Z"
              fill="${palette.base}"/>
        <!-- Claws -->
        <polygon points="146,274 132,280 144,286" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <polygon points="148,282 136,292 150,290" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
      </g>

      <g id="region-arms-right">
        <path d="M 325 225 C 360 235 375 260 368 280 C 360 290 340 285 325 265 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
        <path d="M 326 225 C 356 235 370 258 364 276 C 358 284 344 280 330 262 Z"
              fill="${palette.base}"/>
        <!-- Claws -->
        <polygon points="374,274 388,280 376,286" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <polygon points="372,282 384,292 370,290" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
      </g>

      <!-- Head with TWIN DRAGON HORNS (Region: head) - FRONT-FACING -->
      <g id="region-head">
        <!-- Neck -->
        <path d="M 235 195 C 238 160 248 145 260 135 C 272 145 282 160 285 195 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>

        <!-- LEFT HORN (Curving back and left) -->
        <path d="M 236 115 C 205 75 165 60 145 68 C 175 88 215 105 236 115 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5"/>
        <path d="M 238 112 C 210 75 174 64 152 70 C 180 88 216 104 238 112 Z"
              fill="${palette.base}"/>
        <path d="M 154 72 C 182 90 216 105 236 114" stroke="${palette.highlight}" stroke-width="3" stroke-linecap="round" fill="none"/>

        <!-- RIGHT HORN (Curving back and right) -->
        <path d="M 284 115 C 315 75 355 60 375 68 C 345 88 305 105 284 115 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5"/>
        <path d="M 282 112 C 310 75 346 64 368 70 C 340 88 304 104 282 112 Z"
              fill="${palette.base}"/>
        <path d="M 366 72 C 338 90 304 105 284 114" stroke="${palette.highlight}" stroke-width="3" stroke-linecap="round" fill="none"/>

        <!-- Dragon Head Base & Jaws -->
        <path d="M 195 140 C 185 88 225 65 260 65 C 295 65 335 88 325 140 C 315 185 280 200 260 200 C 240 200 205 185 195 140 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5" stroke-linejoin="round"/>
        <path d="M 198 138 C 188 92 226 70 260 70 C 294 70 332 92 322 138 C 312 180 278 195 260 195 C 242 195 208 180 198 138 Z"
              fill="${palette.base}"/>

        <!-- Forehead Crest Contour -->
        <path d="M 228 88 C 248 80 272 80 292 88" stroke="${palette.highlight}" stroke-width="4.5" stroke-linecap="round" fill="none"/>

        <!-- Snout Center & Dual Nostrils -->
        <ellipse cx="260" cy="155" rx="14" ry="8" fill="${palette.highlight}" opacity="0.35"/>
        <circle cx="253" cy="155" r="2.8" fill="${palette.outline}"/>
        <circle cx="267" cy="155" r="2.8" fill="${palette.outline}"/>

        <!-- LEFT CYAN DRAGON EYE (Clearly Visible) -->
        <g id="region-eye-left">
          <polygon points="215,124 246,118 240,140 213,136" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
          <polygon points="219,125 242,120 237,137 217,134" fill="${palette.eye}"/>
          <polygon points="223,126 235,123 232,136 222,134" fill="#002830"/>
          <circle cx="224" cy="125" r="2.5" fill="#ffffff"/>
        </g>

        <!-- RIGHT CYAN DRAGON EYE (Clearly Visible) -->
        <g id="region-eye-right">
          <polygon points="305,124 274,118 280,140 307,136" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
          <polygon points="301,125 278,120 283,137 303,134" fill="${palette.eye}"/>
          <polygon points="297,126 285,123 288,136 298,134" fill="#002830"/>
          <circle cx="296" cy="125" r="2.5" fill="#ffffff"/>
        </g>

        <!-- Dragon Jaws with Sharp Dual Fangs -->
        <path d="M 230 170 Q 260 184 290 170" stroke="${palette.outline}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <!-- Upper Fangs -->
        <polygon points="242,171 247,185 252,172" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <polygon points="268,172 273,185 278,171" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <!-- Lower Teeth -->
        <polygon points="256,181 260,172 264,181" fill="#ffffff" stroke="${palette.outline}" stroke-width="1.5"/>
      </g>
    </g>
  `;
}

/**
 * Generates front-facing SVG vector markup for Mega Charizard Y.
 * ViewBox: 0 0 520 480 (Centered at X=260)
 *
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
    <g id="mega-charizard-y" class="pokemon-2d-anime front-facing" transform="translate(0, ${breathY})">
      <!-- MASSIVE SCALLOPED JAGGED WINGS (BALANCED SYMMETRICAL EXPANSION) -->
      <g id="region-wings">
        <!-- LEFT WING -->
        <g id="mega-wing-left" transform="rotate(${-wingAngle}, 210, 180)">
          <path d="M 210 180 C 140 80 50 60 15 85 C 5 135 45 225 160 250 Z"
                fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
          <path d="M 200 185 C 140 95 60 78 24 95 C 18 140 52 215 158 242 Z"
                fill="${palette.wingInner || "#227e77"}"/>
          <polygon points="18,80 2,82 14,94" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        </g>

        <!-- RIGHT WING -->
        <g id="mega-wing-right" transform="rotate(${wingAngle}, 310, 180)">
          <path d="M 310 180 C 380 80 470 60 505 85 C 515 135 475 225 360 250 Z"
                fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>
          <path d="M 320 185 C 380 95 460 78 496 95 C 502 140 468 215 362 242 Z"
                fill="${palette.wingInner || "#227e77"}"/>
          <polygon points="502,80 518,82 506,94" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        </g>
      </g>

      <!-- Tail with Colossal Inferno (Region: tail & tail_flame) -->
      <g id="region-tail">
        <path d="M 285 330 C 350 340 415 310 435 245 C 450 195 435 150 410 115 C 400 142 392 185 372 225 C 348 265 310 295 275 310 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5.5"/>
        <path d="M 284 324 C 345 334 405 305 425 242 C 438 198 425 155 406 122 C 396 148 388 188 370 226 C 346 264 310 294 276 308 Z"
              fill="${palette.base}"/>
      </g>

      <!-- Colossal Solar Inferno -->
      <g id="region-tail_flame" transform="translate(${flameFlickerX}, ${flameFlickerY})">
        <path d="M 410 120 C 365 95 340 35 385 -10 C 415 35 425 55 450 40 C 475 25 470 -10 495 -30 C 515 25 510 80 480 110 Z"
              fill="${palette.flameOuter}" filter="drop-shadow(0 0 18px ${palette.flameOuter})"/>
        <path d="M 410 115 C 375 90 358 45 388 8 C 410 42 420 60 442 48 C 460 35 458 5 474 -8 C 488 32 482 75 462 105 Z"
              fill="${palette.base}"/>
        <path d="M 412 108 C 388 85 375 52 398 22 C 416 50 425 62 442 52 C 458 42 455 20 466 10 C 475 40 468 72 454 98 Z"
              fill="${palette.flameInner}"/>
      </g>

      <!-- Legs & Talons -->
      <g id="region-legs-left">
        <ellipse cx="185" cy="355" rx="40" ry="30" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
        <polygon points="154,376 145,392 162,382" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <polygon points="172,378 168,396 182,384" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <polygon points="194,376 196,394 204,380" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
      </g>

      <g id="region-legs-right">
        <ellipse cx="335" cy="355" rx="40" ry="30" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
        <polygon points="316,376 318,394 326,380" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <polygon points="338,378 352,396 348,384" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <polygon points="356,376 375,392 366,382" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
      </g>

      <!-- Sleek Aerodynamic Torso -->
      <g id="region-torso">
        <path d="M 185 220 C 170 275 185 345 225 365 C 260 372 295 365 335 345 C 350 275 335 220 295 200 C 260 195 220 200 185 220 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5.5"/>
        <path d="M 190 218 C 176 270 190 340 228 360 C 260 366 292 360 330 340 C 344 270 330 218 292 200 C 260 195 222 200 190 218 Z"
              fill="${palette.base}"/>
        <path d="M 222 205 C 208 250 215 325 238 350 C 260 355 282 350 302 325 C 312 250 308 205 260 202 Z"
              fill="${palette.belly}"/>
      </g>

      <!-- Arm Blades / Fins (Distinctive Mega Y feature) -->
      <g id="region-arms-left">
        <path d="M 195 225 C 160 235 145 260 152 280 C 160 290 180 285 195 265 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>
        <!-- Aerodynamic Wrist Fin Blade -->
        <polygon points="148,255 125,270 146,275" fill="${palette.highlight}" stroke="${palette.outline}" stroke-width="2"/>
        <polygon points="146,274 132,280 144,286" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
      </g>

      <g id="region-arms-right">
        <path d="M 325 225 C 360 235 375 260 368 280 C 360 290 340 285 325 265 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>
        <!-- Aerodynamic Wrist Fin Blade -->
        <polygon points="372,255 395,270 374,275" fill="${palette.highlight}" stroke="${palette.outline}" stroke-width="2"/>
        <polygon points="374,274 388,280 376,286" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
      </g>

      <!-- Head with TRIPLE HORNS (Region: head) - FRONT-FACING -->
      <g id="region-head">
        <!-- CENTRAL LONG HORN (Extends straight up from crown) -->
        <path d="M 252 80 L 260 28 L 268 80 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="4.5"/>
        <path d="M 260 32 L 260 78" stroke="${palette.highlight}" stroke-width="3" stroke-linecap="round"/>

        <!-- LEFT SIDE HORN -->
        <path d="M 236 105 C 205 70 165 55 145 62 C 175 80 215 95 236 105 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="4"/>

        <!-- RIGHT SIDE HORN -->
        <path d="M 284 105 C 315 70 355 55 375 62 C 345 80 305 95 284 105 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="4"/>

        <!-- Sleek Dragon Head Base -->
        <path d="M 195 135 C 185 85 225 60 260 60 C 295 60 335 85 325 135 C 315 180 280 195 260 195 C 240 195 205 180 195 135 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>

        <!-- LEFT CYAN EYE (Fierce Emerald/Cyan) -->
        <polygon points="216,122 245,116 240,138 214,134" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
        <polygon points="220,123 241,118 237,135 218,132" fill="${palette.eye}"/>
        <circle cx="225" cy="123" r="2.5" fill="#ffffff"/>

        <!-- RIGHT CYAN EYE -->
        <polygon points="304,122 275,116 280,138 306,134" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
        <polygon points="300,123 279,118 283,135 302,132" fill="${palette.eye}"/>
        <circle cx="295" cy="123" r="2.5" fill="#ffffff"/>

        <!-- Nostrils & Jaws -->
        <circle cx="254" cy="150" r="2.5" fill="${palette.outline}"/>
        <circle cx="266" cy="150" r="2.5" fill="${palette.outline}"/>
        <path d="M 230 165 Q 260 178 290 165" stroke="${palette.outline}" stroke-width="4.5" fill="none"/>
        <polygon points="244,166 248,178 252,167" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <polygon points="268,167 272,178 276,166" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
      </g>
    </g>
  `;
}

/**
 * Generates front-facing SVG vector markup for Mega Charizard X (No. 0006-MX).
 * ViewBox: 0 0 520 480 (Centered at X=260)
 *
 * @param {Record<string, string>} palette
 * @param {object} [animationState]
 * @returns {string} Inner SVG markup
 */
export function renderMegaCharizardXVector(palette, animationState = {}) {
  const breathY = (animationState.breath || 0) * 4;
  const wingAngle = Math.sin((animationState.wingFlap || 0) * 2.2) * 6;
  const flamePhase = animationState.flamePhase || 0;
  const flameFlickerX = Math.sin(flamePhase * 2.2) * 7;
  const flameFlickerY = Math.cos(flamePhase * 2.6) * 9;

  return `
    <g id="mega-charizard-x" class="pokemon-2d-anime front-facing" transform="translate(0, ${breathY})">
      <!-- JAGGED SPIKED OBSIDIAN WINGS (BALANCED SYMMETRICAL EXPANSION) -->
      <g id="region-wings">
        <!-- LEFT WING -->
        <g id="wing-x-left" transform="rotate(${-wingAngle}, 210, 180)">
          <path d="M 210 180 C 140 80 50 60 15 85 C 5 135 45 225 160 250 Z"
                fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
          <path d="M 200 185 C 140 95 60 78 24 95 C 18 140 52 215 158 242 Z"
                fill="${palette.wingInner || "#252b37"}"/>
          <!-- Cyan Wing Spikes -->
          <polygon points="15,85 2,75 18,95" fill="${palette.wingSpikes || "#8fe3ff"}" stroke="${palette.outline}" stroke-width="2"/>
          <polygon points="45,160 30,165 48,175" fill="${palette.wingSpikes || "#8fe3ff"}" stroke="${palette.outline}" stroke-width="2"/>
        </g>

        <!-- RIGHT WING -->
        <g id="wing-x-right" transform="rotate(${wingAngle}, 310, 180)">
          <path d="M 310 180 C 380 80 470 60 505 85 C 515 135 475 225 360 250 Z"
                fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>
          <path d="M 320 185 C 380 95 460 78 496 95 C 502 140 468 215 362 242 Z"
                fill="${palette.wingInner || "#252b37"}"/>
          <!-- Cyan Wing Spikes -->
          <polygon points="505,85 518,75 502,95" fill="${palette.wingSpikes || "#8fe3ff"}" stroke="${palette.outline}" stroke-width="2"/>
          <polygon points="475,160 490,165 472,175" fill="${palette.wingSpikes || "#8fe3ff"}" stroke="${palette.outline}" stroke-width="2"/>
        </g>
      </g>

      <!-- Tail with Electric-Blue Roaring Fire (Region: tail & blue_flame) -->
      <g id="region-tail">
        <path d="M 285 330 C 350 340 415 310 435 245 C 450 195 435 150 410 115 C 400 142 392 185 372 225 C 348 265 310 295 275 310 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5.5"/>
        <path d="M 284 324 C 345 334 405 305 425 242 C 438 198 425 155 406 122 C 396 148 388 188 370 226 C 346 264 310 294 276 308 Z"
              fill="${palette.base}"/>
      </g>

      <!-- Electric-Blue Tail Inferno -->
      <g id="region-blue_flame" transform="translate(${flameFlickerX}, ${flameFlickerY})">
        <path d="M 410 120 C 365 95 340 35 385 -10 C 415 35 425 55 450 40 C 475 25 470 -10 495 -30 C 515 25 510 80 480 110 Z"
              fill="${palette.flameOuter || "#0984e3"}" filter="drop-shadow(0 0 20px ${palette.flameMid || "#00f2fe"})"/>
        <path d="M 410 115 C 375 90 358 45 388 8 C 410 42 420 60 442 48 C 460 35 458 5 474 -8 C 488 32 482 75 462 105 Z"
              fill="${palette.flameMid || "#00f2fe"}"/>
        <path d="M 412 108 C 388 85 375 52 398 22 C 416 50 425 62 442 52 C 458 42 455 20 466 10 C 475 40 468 72 454 98 Z"
              fill="${palette.flameInner || "#ffffff"}"/>
      </g>

      <!-- Charcoal Dragon Legs & Talons -->
      <g id="region-legs-left">
        <ellipse cx="185" cy="355" rx="42" ry="32" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
        <ellipse cx="185" cy="350" rx="34" ry="24" fill="${palette.base}"/>
        <polygon points="152,376 142,392 160,382" fill="#ffffff" stroke="${palette.outline}" stroke-width="2.5"/>
        <polygon points="172,378 168,396 182,384" fill="#ffffff" stroke="${palette.outline}" stroke-width="2.5"/>
        <polygon points="196,376 198,394 206,380" fill="#ffffff" stroke="${palette.outline}" stroke-width="2.5"/>
      </g>

      <g id="region-legs-right">
        <ellipse cx="335" cy="355" rx="42" ry="32" fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5"/>
        <ellipse cx="335" cy="350" rx="34" ry="24" fill="${palette.base}"/>
        <polygon points="314,376 316,394 324,380" fill="#ffffff" stroke="${palette.outline}" stroke-width="2.5"/>
        <polygon points="338,378 352,396 348,384" fill="#ffffff" stroke="${palette.outline}" stroke-width="2.5"/>
        <polygon points="358,376 378,392 368,382" fill="#ffffff" stroke="${palette.outline}" stroke-width="2.5"/>
      </g>

      <!-- Charcoal Torso & Sky-Blue Belly Plates (Iconic Mega X feature) -->
      <g id="region-torso">
        <path d="M 185 220 C 170 280 185 350 225 370 C 260 378 295 370 335 350 C 350 280 335 220 295 200 C 260 195 220 200 185 220 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="5.5"/>
        <path d="M 190 218 C 176 275 190 345 228 365 C 260 372 292 365 330 345 C 344 275 330 218 292 200 C 260 195 222 200 190 218 Z"
              fill="${palette.base}"/>
        <!-- Radiant Sky-Blue Belly Plates -->
        <path d="M 220 205 C 205 255 210 330 235 355 C 260 360 285 355 305 330 C 315 255 310 205 260 202 Z"
              fill="${palette.belly}"/>
        <!-- Glowing Belly Segment Ribs -->
        <path d="M 222 245 Q 260 258 298 245 M 224 285 Q 260 298 296 285 M 228 322 Q 260 335 292 322"
              stroke="${palette.bellyShadow}" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>

      <!-- Muscular Arms with Shoulder Spikes -->
      <g id="region-arms-left">
        <!-- Shoulder Spike -->
        <polygon points="185,215 160,205 180,225" fill="${palette.wingSpikes || "#8fe3ff"}" stroke="${palette.outline}" stroke-width="2"/>
        <path d="M 195 225 C 160 235 145 260 152 280 C 160 290 180 285 195 265 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>
        <polygon points="146,274 132,280 144,286" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
      </g>

      <g id="region-arms-right">
        <!-- Shoulder Spike -->
        <polygon points="335,215 360,205 340,225" fill="${palette.wingSpikes || "#8fe3ff"}" stroke="${palette.outline}" stroke-width="2"/>
        <path d="M 325 225 C 360 235 375 260 368 280 C 360 290 340 285 325 265 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>
        <polygon points="374,274 388,280 376,286" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
      </g>

      <!-- Head with Blue-Tipped Horns & Dual Mouth Flames (FRONT-FACING) -->
      <g id="region-head">
        <!-- LEFT HORN WITH BLUE TIP -->
        <path d="M 236 115 C 215 70 185 50 170 55 C 195 78 225 100 236 115 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5"/>
        <polygon points="170,55 185,62 178,72" fill="${palette.flameMid || "#00f2fe"}" stroke="${palette.outline}" stroke-width="1.5"/>

        <!-- RIGHT HORN WITH BLUE TIP -->
        <path d="M 284 115 C 305 70 335 50 350 55 C 325 78 295 100 284 115 Z"
              fill="${palette.shadow}" stroke="${palette.outline}" stroke-width="4.5"/>
        <polygon points="350,55 335,62 342,72" fill="${palette.flameMid || "#00f2fe"}" stroke="${palette.outline}" stroke-width="1.5"/>

        <!-- Head Base -->
        <path d="M 195 140 C 185 88 225 65 260 65 C 295 65 335 88 325 140 C 315 185 280 200 260 200 C 240 200 205 185 195 140 Z"
              fill="${palette.base}" stroke="${palette.outline}" stroke-width="5"/>

        <!-- LEFT CRIMSON EYE (Glowing Crimson Anime Eye) -->
        <g id="region-eye-left">
          <polygon points="215,124 246,118 240,140 213,136" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
          <polygon points="219,125 242,120 237,137 218,134" fill="${palette.eye || "#ff3b30"}"/>
          <ellipse cx="227" cy="128" rx="3.5" ry="7" fill="#2d0006"/>
          <circle cx="224" cy="125" r="2.5" fill="#ffffff"/>
        </g>

        <!-- RIGHT CRIMSON EYE (Glowing Crimson Anime Eye) -->
        <g id="region-eye-right">
          <polygon points="305,124 274,118 280,140 307,136" fill="#ffffff" stroke="${palette.outline}" stroke-width="3"/>
          <polygon points="301,125 278,120 283,137 303,134" fill="${palette.eye || "#ff3b30"}"/>
          <ellipse cx="293" cy="128" rx="3.5" ry="7" fill="#2d0006"/>
          <circle cx="296" cy="125" r="2.5" fill="#ffffff"/>
        </g>

        <!-- Nostrils -->
        <circle cx="253" cy="155" r="2.8" fill="${palette.outline}"/>
        <circle cx="267" cy="155" r="2.8" fill="${palette.outline}"/>

        <!-- Dragon Jaws -->
        <path d="M 230 170 Q 260 184 290 170" stroke="${palette.outline}" stroke-width="4.5" fill="none"/>
        <polygon points="242,171 247,185 252,172" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>
        <polygon points="268,172 273,185 278,171" fill="#ffffff" stroke="${palette.outline}" stroke-width="2"/>

        <!-- DUAL STREAMING BLUE MOUTH FLAMES (Iconic Mega Charizard X Characteristic) -->
        <!-- Left Mouth Flame -->
        <g transform="translate(${flameFlickerX * 0.5}, ${flameFlickerY * 0.5})">
          <path d="M 230 170 C 190 160 170 175 145 168 C 170 182 195 180 234 175 Z"
                fill="${palette.mouthFlame || "#00d2d3"}" filter="drop-shadow(0 0 10px ${palette.flameMid || "#00f2fe"})"/>
          <path d="M 230 171 C 200 164 185 174 165 170 C 185 179 205 178 233 174 Z"
                fill="#ffffff"/>
        </g>
        <!-- Right Mouth Flame -->
        <g transform="translate(${-flameFlickerX * 0.5}, ${flameFlickerY * 0.5})">
          <path d="M 290 170 C 330 160 350 175 375 168 C 350 182 325 180 286 175 Z"
                fill="${palette.mouthFlame || "#00d2d3"}" filter="drop-shadow(0 0 10px ${palette.flameMid || "#00f2fe"})"/>
          <path d="M 290 171 C 320 164 335 174 355 170 C 335 179 315 178 287 174 Z"
                fill="#ffffff"/>
        </g>
      </g>
    </g>
  `;
}
