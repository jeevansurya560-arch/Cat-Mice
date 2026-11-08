# Neo-Pokédex: Master Research & Architectural Foundation

## 1. Executive Summary & Product Vision

**Neo-Pokédex** is a GitHub profile enhancement application that transforms a developer's software development activity into an evolving Pokémon companion rendered in premium HD pixel art.

Unlike conventional contribution visualizers that merely output static commit counters or rudimentary 8-bit icons, Neo-Pokédex operates as an interactive virtual ecosystem where:
1. **GitHub Activity Drives Evolution:** Lifetime or annual contribution milestones determine character evolution:
   - **Stage 1 (0–249 commits):** Charmander (`#004`)
   - **Stage 2 (250–749 commits):** Charmeleon (`#005`)
   - **Stage 3 (750+ commits, up to 2,000+):** Charizard (`#006`)
2. **Fixed Artwork Structure, Progressive Colorization:**
   - At $0\%$ progression, the Pokémon begins as a complete, fully shaded, high-contrast **grayscale HD pixel-art masterpiece**.
   - As contributions increase within a tier, the **exact same artwork geometry** progressively acquires color and depth. The silhouette, pixel layout, anatomical proportions, and eye positions never distort or shift.
3. **Language-Driven Aesthetic Identity:**
   - The user's programming-language activity (e.g., Python, Rust, JavaScript, TypeScript, Go, C++) influences the color palette through perceptual color mixing in OKLab/OKLCH color space.
   - Language colors harmonize with authentic character design without obliterating the character's recognizable identity.

---

## 2. Why Rust is Mandatory

The entire computational and rendering engine is specified in **Rust**:
1. **Deterministic Performance:** Image processing at pixel granularity involves iterating over hundreds of thousands of RGBA pixels. Rust compiles directly to native machine code with SIMD auto-vectorization, completing image transformations in under 15ms.
2. **Single Statically Linked Binary for GitHub Actions:** Unlike Node.js or Python workflows that require installing heavy runtimes, `node_modules`, or virtual environments, a compiled Rust binary executes instantly in GitHub Actions CI with negligible runner overhead.
3. **Zero-Cost Abstractions & Memory Safety:** Rust's strict ownership model prevents race conditions, buffer overruns, and memory leaks without a garbage collector.
4. **Reliable Vector and Raster Libraries:** The Rust ecosystem provides top-tier graphics crates: `tiny-skia` (pure Rust 2D engine), `resvg` (vector SVG parsing), `image` (buffer manipulation), and `palette` (perceptual color space mathematics).

---

## 3. Official Character Research & Anatomical Specifications

### Stage 1: Charmander (No. 0004) — The Lizard Pokémon
- **Official References:**
  - Pokédex Portal: `https://in.portal-pokemon.com/pokedex/0004/`
  - PokémonDB: `https://pokemondb.net/artwork/charmander`
- **Defining Characteristics:**
  - Smooth rounded head with wide, curious eyes and distinct blue pupils.
  - Blunt, friendly reptilian snout with subtle nostrils.
  - Pale cream/yellow belly patch extending from chest to tail base.
  - Four fingers on short forearms; three short clawed toes on stout legs.
  - Cylindrical tail ending in a lively, teardrop-shaped flame that indicates vitality.
- **Contribution Range:** 0 to 249 commits ($S = 0, E = 249$).

### Stage 2: Charmeleon (No. 0005) — The Flame Pokémon
- **Official References:**
  - Pokédex Portal: `https://in.portal-pokemon.com/pokedex/0005/`
  - PokémonDB: `https://pokemondb.net/artwork/charmeleon`
- **Defining Characteristics:**
  - Prominent single backward-curving cranial horn/crest extending from the rear skull.
  - Downward-angled predatory beak-like snout with distinct beak hook and visible mouth smirk with upper corner tooth.
  - Sharp, triangular teal/emerald eyes with a determined, focused gaze and heavy brow ridge.
  - Muscular, digitigrade legs with three heavy white talons planted firmly on the ground.
  - Long, agile arms with three curved, razor-sharp white talons.
  - Deep coral-red/vermilion skin with pale beige underside.
  - Muscular tail curving upwards, tipped with a roaring torch flame.
- **Contribution Range:** 250 to 749 commits ($S = 250, E = 749$).

### Stage 3: Charizard (No. 0006) — The Flame Pokémon
- **Official References:**
  - Pokédex Portal: `https://in.portal-pokemon.com/pokedex/0006/`
  - PokémonDB: `https://pokemondb.net/artwork/charizard`
- **Defining Characteristics:**
  - Dual prominent swept-back horns emerging from the skull crown.
  - Broad, draconic jaws, defined nostrils, and visible fangs.
  - Expansive, powerful bat-like wings with deep teal/cyan inner membranes and sharp upper wing thumb claws.
  - Lean, athletic dragon torso with broad cream belly plates.
  - Heavy muscular thighs with three massive, white curved foot talons.
  - Long sinuous tail ending in an intense, roaring inferno flame.
- **Contribution Range:** 750+ commits ($S = 750, E = 2000$).

---

## 4. Visual Reference Guidelines & Intellectual Property

1. **Fair Use & Original Creation:**
   - Official Pokémon imagery from Nintendo, Game Freak, and The Pokémon Company is used strictly for anatomical reference, proportion study, and color palette calibration.
   - All sprites, masks, and vector paths in Neo-Pokédex are **100% original, handcrafted pixel-art designs**.
   - No copyrighted ROM dumps, sprite rips, or commercial game rips are redistributed.
2. **Transparent Licensing:**
   - Neo-Pokédex code is released under the MIT License.
   - All Pokémon character names and trademarks remain the intellectual property of Nintendo, Creatures Inc., and Game Freak. Neo-Pokédex is an unofficial fan project for personal GitHub profile visual enhancement.

