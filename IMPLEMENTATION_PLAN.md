# Neo-Pokédex: Master Implementation Plan

## Phase Structure & Execution Gates

Execution follows a strict linear sequence. Each phase requires running automated validation checks, preparing conventional commits, and receiving explicit user approval before advancing.

---

### Phase 0: Research, Visual References & Mathematical Architecture (CURRENT PHASE)
- **Status:** Complete & Awaiting Approval.
- **Deliverables:**
  - `RESEARCH.md`
  - `REPOSITORY_STUDY.md`
  - `ARCHITECTURE.md`
  - `TECH_STACK.md`
  - `DESIGN_SYSTEM.md`
  - `ART_DIRECTION.md`
  - `COLOR_SYSTEM.md`
  - `EVOLUTION_VISUALS.md`
  - `README_VISUAL_REFERENCES.md`
  - `AGENT_SKILLS.md`
  - `CONTRIBUTION_CALCULATION.md`
  - `LANGUAGE_ATTRIBUTION.md`
  - `SECURITY.md`
  - `IMPLEMENTATION_PLAN.md`
  - 12 Custom Agent Skills in `.agents/skills/`.
  - Visual comparison concept boards.
- **Identified Blocker:** `rustc` and `cargo` are not yet installed in the current Windows environment. Must install via `winget install Rustlang.Rustup` or `win.rustup.rs` prior to Phase 1 compilation.
- **Commit:** *No commit during research phase until explicit approval.*

---

### Phase 1: Project Foundation & Toolchain Initialization
- **Tasks:**
  - Verify and initialize Cargo workspace (`Cargo.toml`).
  - Configure dependencies pinned to exact versions.
  - Implement structured domain errors in `src/errors/` with `thiserror`.
  - Implement logging with `tracing` and `tracing-subscriber`.
  - Implement strongly typed configuration parsing in `src/config/` with `toml` and `serde`.
  - Scaffold CLI parsing in `src/cli/` with `clap`.
  - Validate formatting (`cargo fmt --check`) and linting (`cargo clippy`).
- **Commit:** `chore: initialize neo-pokedex architecture`
- **Gate:** Approval required before Phase 2.

---

### Phase 2: Pokémon Artwork Foundation & Mask System
- **Tasks:**
  - Create original 160x160 master pixel-art grayscale sprites for Charmander, Charmeleon, and Charizard.
  - Generate aligned binary/alpha anatomical region masks (`body`, `belly`, `face`, `limbs`, `wings`, `tail`, `flame`).
  - Generate spatial priority maps $Q(x,y)$.
  - Implement sprite loader and dimensional validator in `src/artwork/`.
  - Add unit tests verifying mask alignment and zero pixel overlaps.
- **Commit:** `feat: add hd grayscale pokemon artwork and anatomical masks`
- **Gate:** Approval required before Phase 3.

---

### Phase 3: Evolution Engine & State Machine
- **Tasks:**
  - Implement deterministic evolution stages in `src/evolution/stages.rs`.
  - Implement progression clamping function $T(P)$ in `src/evolution/progression.rs`.
  - Add exhaustive unit tests for boundary thresholds (0, 249, 250, 749, 750, 1250, 1500, 1750, 2000, 2001+).
- **Commit:** `feat: implement pokemon evolution system`
- **Gate:** Approval required before Phase 4.

---

### Phase 4: Language Attribution & Palette Engine
- **Tasks:**
  - Implement Linguist language classification and extension mappings in `src/language/detection.rs`.
  - Implement user commit line-addition attribution in `src/language/attribution.rs`.
  - Implement central palette registry in `src/language/palette.rs`.
  - Implement OKLab / OKLCH weighted mixture and dominant language rules in `src/colorization/blending.rs`.
  - Add unit tests verifying normalized weights ($\sum W_i = 1$) and fallback behavior.
- **Commit:** `feat: implement language palette system`
- **Gate:** Approval required before Phase 5.

---

### Phase 5: Progressive Colorization Engine
- **Tasks:**
  - Implement grayscale luminance extraction in `src/colorization/luminance.rs`.
  - Implement 5-stop perceptual tonal ramp in `src/colorization/tonal_ramp.rs`.
  - Implement spatial priority field processing in `src/colorization/priority_map.rs`.
  - Implement intensity modulation ($\gamma = 1.15$) and linear alpha compositing in `src/colorization/compositing.rs`.
  - Implement dedicated flame tonal ramp preserving elemental fire.
  - Add visual regression test verifying zero geometric/silhouette changes across $T \in [0, 1]$.
- **Commit:** `feat: implement progressive pokemon colorization`
- **Gate:** Approval required before Phase 6.

---

### Phase 6: Graphics & Animation Engine
- **Tasks:**
  - Implement high-resolution static PNG exporter in `src/renderer/png.rs`.
  - Implement 12-frame animated looping GIF encoder (10 FPS) in `src/renderer/gif.rs`.
  - Implement crisp-edge SVG generator with HUD overlays in `src/renderer/svg.rs`.
  - Optimize GIF color quantization and frame file size.
- **Commit:** `feat: implement hd pokemon renderer and animation`
- **Gate:** Approval required before Phase 7.

---

### Phase 7: GitHub Integration & GraphQL Client
- **Tasks:**
  - Implement asynchronous GitHub GraphQL v4 client in `src/github/client.rs`.
  - Implement contribution calendar parser in `src/github/contributions.rs`.
  - Implement rate-limit supervisor and exponential backoff in `src/github/rate_limit.rs`.
  - Implement disk caching for offline determinism in `src/cache/`.
  - Add mocked wiremock integration tests.
- **Commit:** `feat: integrate github contribution data`
- **Gate:** Approval required before Phase 8.

---

### Phase 8: Automation & README Marker Synchronization
- **Tasks:**
  - Implement safe README marker updater in `src/readme/updater.rs` (`<!-- NEO-POKEDEX:START -->`).
  - Create reusable `.github/workflows/pokedex-update.yml` workflow.
  - Implement idempotency detection (no git commit if generated assets are identical).
- **Commit:** `feat: automate github pokemon generation`
- **Gate:** Approval required before Phase 9.

---

### Phase 9: Security, Performance & Complete QA
- **Tasks:**
  - Run `cargo fmt --check` and `cargo clippy --all-targets --all-features -- -D warnings`.
  - Run full test suite `cargo test`.
  - Execute `cargo audit` and `cargo deny` security reviews.
  - Run Criterion benchmarks for image transformation throughput.
- **Commit:** `test: complete security and integration validation`
- **Gate:** Approval required before Phase 10.

---

### Phase 10: Final Documentation & Release
- **Tasks:**
  - Finalize top-level `README.md` with visual preview carousels and setup guide.
  - Verify clean checkout build from scratch.
  - Deliver release checklist.
- **Commit:** `docs: complete neo-pokedex documentation`

