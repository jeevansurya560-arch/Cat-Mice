# Neo-Pokédex

<p align="center">
  <strong>GitHub Contributions → Pokémon Evolution → Modern HD Pixel Art → Progressive Colorization</strong>
</p>

<!-- NEO-POKEDEX:START -->
<div align="center">
  <img src="assets/generated/pokemon-evolution.gif" alt="Neo-Pokédex Pokémon Evolution Companion" width="600" />
</div>
<!-- NEO-POKEDEX:END -->

<p align="center">
  <img src="https://img.shields.io/badge/Language-Rust%201.85+-dea584?style=flat-square&logo=rust" alt="Rust 1.85+" />
  <img src="https://img.shields.io/badge/Aesthetic-Modern%20HD%20Pixel%20Art-ff5500?style=flat-square" alt="Modern HD Pixel Art" />
  <img src="https://img.shields.io/badge/Engine-Deterministic%20OKLab-00add8?style=flat-square" alt="Deterministic OKLab" />
  <img src="https://img.shields.io/badge/License-MIT-brightgreen?style=flat-square" alt="MIT License" />
  <img src="https://img.shields.io/badge/Tests-25%20Passed%20(100%25)-success?style=flat-square" alt="Tests 100% Passed" />
</p>

---

## 1. Product Vision

**Neo-Pokédex** is a developer companion for your GitHub profile README, inspired by the virtual pet aesthetic of *Git-Koi*.

Instead of simple static icons or basic commit counters, Neo-Pokédex transforms your actual software development activity into an evolving starter Pokémon companion:

1. **Contributions Drive Evolution:** Total GitHub contributions determine your companion's evolutionary stage:
   - **Stage 1 (0 – 249 commits):** Charmander (`#0004`) — The Lizard Pokémon
   - **Stage 2 (250 – 749 commits):** Charmeleon (`#0005`) — The Flame Pokémon
   - **Stage 3 (750 – 2,000+ commits):** Charizard (`#0006`) — The Flame Pokémon
2. **Fixed Artwork Structure, Progressive Color:**
   - At 0% progress within a tier, the character appears as a fully detailed, volumetric **monochromatic grayscale HD pixel-art masterpiece**.
   - As contributions increase, the **exact same artwork geometry** progressively acquires color and radiance. The silhouette, eye placement, claws, and alpha transparency remain mathematically invariant ($\Delta_{\text{alpha}} = 0$).
3. **Language-Driven Aesthetic Identity:**
   - Your primary programming languages (Rust, Python, TypeScript, Go, C++, etc.) influence the color palette through perceptual color mixing in OKLab/OKLCH color space.
4. **Built in 100% Pure Rust:**
   - Fast, deterministic, memory-safe single-binary execution. Zero external runtime dependencies (no Node.js, Python, or Go runtimes).

---

## 2. Evolution Stages & Progression

```text
[0 Commits] ─────────────────→ [249 Commits]
           CHARMANDER (#004)
           0% ────────────→ 100% Color
                     │
                     ▼ (Evolution Threshold: 250)
[250 Commits] ────────────────→ [749 Commits]
           CHARMELEON (#005)
           0% ────────────→ 100% Color
                     │
                     ▼ (Evolution Threshold: 750)
[750 Commits] ───────────────────────────────────────────────→ [2,000+ Commits]
                               CHARIZARD (#006)
           0% ──────→ 40% (1250) ──────→ 60% (1500) ──────→ 80% (1750) ──────→ 100% (2000+)
```

### Visual Progression Milestones

| Milestone | Progress $T(P)$ | Visual Description |
|---|:---:|---|
| **Baseline 0** | $0\%$ | Complete master sprite in pure monochromatic grayscale. Full volumetric shading and deep ambient occlusion. |
| **Early Spark** | $10\%$ | Subtle warm ignition in the tail flame core; body remains in grayscale. |
| **Accentuation** | $25\%$ | Tail flame fully radiant; primary highlights and snout catching warm hues. |
| **Equilibrium** | $50\%$ | Balanced dual-tone presentation: torso, tail, and belly richly colored; extremities retain soft grayscale. |
| **Advanced** | $75\%$ | $80\%$ coverage across all anatomical regions; emerald/teal eyes ignite. |
| **Final Polish**| $90\%$ | Complete color saturation with secondary language rim reflections. |
| **Mastered** | $100\%$ | Full-spectrum master form with vibrant ambient glow. |

---

## 3. Mathematical Color Engine

### Luminance-Preserving 5-Stop Tonal Ramp (OKLab)
For each grayscale pixel with luminance $Y = \frac{G}{255.0} \in [0.0, 1.0]$, Neo-Pokédex interpolates through a 5-stop perceptual ramp:
- **Deep Shadow ($L = 0.15$):** Creases, crevices, contact occlusion.
- **Shadow ($L = 0.35$):** Form shadows away from light.
- **Base Tone ($L = 0.55$):** Diffuse body tone under neutral key light.
- **Highlight ($L = 0.78$):** Surfaces catching direct directional illumination.
- **Specular ($L = 0.95$):** Specular glints (desaturates towards ivory/white).

### Spatial Priority Field $Q(x,y)$
Color reveals organically following biological energy flow:
$$\text{Coverage}(x,y) = \text{smoothstep}\left(1.0 - T - 0.05, 1.0 - T + 0.05, Q(x,y)\right)$$
$$\text{Tail Flame } (Q \approx 1.0 \to 0.85) \longrightarrow \text{Tail \& Legs } (0.85 \to 0.65) \longrightarrow \text{Torso } (0.65 \to 0.35) \longrightarrow \text{Head, Crest \& Eyes } (0.35 \to 0.0)$$

---

## 4. Quickstart & CLI Usage

### Build from Source
```bash
# Clone the repository
git clone https://github.com/jeevansurya560-arch/Cat-Mice.git
cd Cat-Mice

# Build optimized release binary
cargo build --release
```

### Commands

```bash
# Generate companion assets from live GitHub profile
cargo run --release -- generate --username jeevansurya560-arch --output assets/generated --sync-readme

# Generate with an explicit commit override (offline mode)
cargo run --release -- generate --commits 500 --output output/

# Validate master sprite geometry, mask partitions, and dimensions
cargo run --release -- validate

# Render a complete 5-stage preview matrix for all forms
cargo run --release -- preview --stage all --output output/previews

# Print active TOML configuration
cargo run --release -- config
```

---

## 5. Embed in Your GitHub Profile README

Add this snippet to your personal profile `README.md`:

```markdown
<!-- NEO-POKEDEX:START -->
<div align="center">
  <img src="https://raw.githubusercontent.com/jeevansurya560-arch/Cat-Mice/main/assets/generated/pokemon-evolution.svg" alt="Neo-Pokédex Companion" width="600" />
</div>
<!-- NEO-POKEDEX:END -->
```

### Automated Daily GitHub Action

The companion updates automatically every night at 00:00 UTC via [`.github/workflows/pokemon-evolution.yml`](.github/workflows/pokemon-evolution.yml):
- Pulls your latest contributions from GitHub GraphQL v4 API.
- Evaluates evolution stage and colorization progress.
- Renders optimized PNG, animated looping GIF, and crisp SVG assets.
- Synchronizes your README markers only when visual changes occur (`[skip ci]`).

---

## 6. Architecture & Engineering Standards

```text
src/
├── artwork/          # Master 160x160 sprites, disjoint mask partitions, and validation
├── cache/            # Offline deterministic disk cache with configurable TTL
├── cli/              # Strongly typed CLI options using clap v4
├── colorization/     # OKLab 5-stop tonal ramp, spatial priority field Q(x,y), compositing
├── config/           # TOML configuration parser with strongly typed defaults
├── errors/           # Structured domain errors with thiserror
├── evolution/        # Evolution state machine, stages, and progress clamping T(P)
├── github/           # Asynchronous GraphQL v4 client and rate-limit supervisor
├── language/         # Linguist language classification and perceptual palette mixing
├── logging/          # Structured telemetry with tracing and tracing-subscriber
├── readme/           # Safe README marker synchronization and idempotency detection
├── renderer/         # Integer scaling PNG, 12-frame animated GIF, and HUD SVG cards
└── main.rs           # Pure Rust application entry point
```

---

## 7. License

Distributed under the **MIT License**. Created with professional Rust engineering and pixel-art craftsmanship.
