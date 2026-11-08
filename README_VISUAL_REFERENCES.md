# Visual Reference Collection & Asset Provenance

## 1. Official Pokémon Reference Registry

| ID | Pokémon | Japanese Name | Official Pokédex Reference URL | Ken Sugimori Artwork Archive |
|---|---|---|---|---|
| `#0004` | Charmander | Hitokage (ヒトカゲ) | [Pokédex No. 0004](https://in.portal-pokemon.com/pokedex/0004/) | [PokemonDB Charmander](https://pokemondb.net/artwork/charmander) |
| `#0005` | Charmeleon | Lizardo (リザード) | [Pokédex No. 0005](https://in.portal-pokemon.com/pokedex/0005/) | [PokemonDB Charmeleon](https://pokemondb.net/artwork/charmeleon) |
| `#0006` | Charizard | Lizardon (リザードン) | [Pokédex No. 0006](https://in.portal-pokemon.com/pokedex/0006/) | [PokemonDB Charizard](https://pokemondb.net/artwork/charizard) |

---

## 2. Anatomical Observations from Official Art

### Canonical Evolution Visual Direction Reference
The user-supplied canonical visual style reference (`research/references/art-styles/evolution-canonical-reference.jpg`) establishes the benchmark for Neo-Pokédex:
- **Charmander:** `research/references/pokemon/charmander/charmander_style_reference.png`
- **Charmeleon:** `research/references/pokemon/charmeleon/charmeleon_style_reference.png`
- **Charizard:** `research/references/pokemon/charizard/charizard_style_reference.png`

Key visual traits observed from this reference:
1. **Dynamic Lighting:** Ground bounce light, back-lit fiery embers, sharp multi-tone highlights.
2. **Unified Presentation:** Consistent pixel density and dark vignette background across all three evolution stages.
3. **Stage Indicators:** Dark rounded UI badges with Pokeball icons (`Charmander`, `Charmeleon`, `Charizard`).

### Charmander (#0004)
- **Stance:** 3/4 upright bipedal posture facing front-left.
- **Skull:** Dome-shaped cranium with gentle curve into a short, rounded snout.
- **Eyes:** Large, dark blue irises positioned vertically; friendly, inquisitive expression.
- **Underbelly:** Pale cream coloration runs continuously from the throat, across the chest and abdomen, tapering along the underside of the tail.
- **Limbs:** Short, rounded forearms with 4 small fingers; sturdy legs with 3 white clawed toes.
- **Tail & Flame:** Thick tail tapering smoothly to a dynamic teardrop flame.

### Charmeleon (#0005)
- **Stance:** Predatory, digitigrade stance leaning forward aggressively.
- **Skull:** Single backward-sweeping cranial horn crest emerging at a $45^\circ$ angle from the back of the skull.
- **Snout & Mouth:** Pronounced downward beak hook on upper jaw; subtle smirk with single visible white upper tooth at the mouth corner.
- **Eyes:** Narrow, triangular almond shape with a dark teal iris and focused brow ridge.
- **Underbelly:** Cream/light beige patch stretching across the torso.
- **Limbs:** Long, slender forearms ending in 3 large, white, curved razor talons; powerful hind legs with 3 heavy white ground claws.
- **Tail & Flame:** Long muscular tail curving upwards to the right, ending in a blazing multi-tongued torch fire.

### Charizard (#0006)
- **Stance:** Powerful draconic stance with wings raised and tail sweeping outward.
- **Skull:** Dual prominent horns curving upward and backward; predatory draconic snout with distinct nostrils and two visible fangs.
- **Wings:** Massive bat-like wing structure; outer wing matches body orange; inner membrane is distinct deep teal/cyan. Upper wing elbow features a sharp thumb claw.
- **Underbelly:** Cream plates covering chest and belly.
- **Limbs:** Heavy, muscular legs capable of flight takeoff; 3 sharp white talons on hands and feet.
- **Tail & Flame:** Long sinuous tail ending in a large roaring fire inferno.

---

## 3. Pixel-Art Production Methodology

1. **Step 1: Anatomical Vector Skeleton:**
   - Define exact proportions, joint centers, and silhouette contours in a 160x160 coordinate space.
2. **Step 2: Discrete Pixel Grid Quantization:**
   - Snap vector curves to discrete integer pixel boundaries (`shape-rendering="crispEdges"`).
3. **Step 3: Cluster Cleanup & Single-Pixel Elimination:**
   - Eliminate orphan stray pixels (lonely singletons).
   - Ensure contours use standard pixel steps ($1-1$, $2-2$, $3-3$ runs) to prevent jagged stairs.
4. **Step 4: Monochromatic Master Shading:**
   - Apply 5-tier luminance shading (Deep Shadow, Mid Shadow, Base, Highlight, Specular) to produce the completed 0% grayscale master.
5. **Step 5: Mask Extraction:**
   - Partition the sprite into non-overlapping anatomical region masks (`body.png`, `belly.png`, `face.png`, `limbs.png`, `wings.png`, `tail.png`, `flame.png`).
6. **Step 6: Mathematical Invariance Assertion:**
   - Verify that $\sum_r M_r(x,y) \equiv M_{\text{character}}(x,y)$ with zero gaps or overlaps.

