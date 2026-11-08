# CAT-MICE

> A procedural pixel-art ecosystem generator driven by your GitHub developer activity.

CAT-MICE transforms a developer's GitHub journey into a personalized virtual world. Your programming languages color their coats and garden, your contributions grow the cat, your streaks equip the consistency companion mouse, and weekly rhythms shape their peaceful habits. A nightly workflow puts the living top-down ecosystem directly on your GitHub profile README as an ultra-lightweight looping animated GIF and scalable resolution-independent SVG, the same tool runs from the command line, and full simulation runs offline with zero tokens or credentials.

<p align="center">
  <img src="https://raw.githubusercontent.com/jeevansurya560-arch/Cat-Mice/main/dist/cat-mice.gif" alt="CAT-MICE Living Pixel-Art Ecosystem" width="560" />
</p>

<p align="center">
  <a href="https://raw.githubusercontent.com/jeevansurya560-arch/Cat-Mice/main/dist/cat-mice.svg">
    <img src="https://img.shields.io/badge/Static%20Vector%20Artwork-SVG%20CrispEdges-blueviolet?style=flat-square&logo=svg" alt="Scalable SVG Available" />
  </a>
  <img src="https://img.shields.io/badge/Node.js-22%20LTS-brightgreen?style=flat-square&logo=node.js" alt="Node.js 22 LTS" />
  <img src="https://img.shields.io/badge/Architecture-Modular%20Monolith-orange?style=flat-square" alt="Modular Monolith" />
  <img src="https://img.shields.io/badge/Tests-106%20Passed-success?style=flat-square" alt="106 Tests Passed" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License" />
</p>

---

## Progression & Language Variant Matrix

Inspired by `git-koi`, CAT-MICE characters evolve in size, accessories, demeanor, and animations based on your developer milestones. Below is the multi-stage progression across programming language color themes:

<p align="center">
  <img src="https://raw.githubusercontent.com/jeevansurya560-arch/Cat-Mice/main/dist/showcase.png" alt="CAT-MICE Evolution Matrix across Language Themes" width="800" />
</p>

### Progression Tiers

| Stage / Tier                 | Developer Metric                       | Visual Evolution                                     | Key Animations & Behaviors                                 |
| :--------------------------- | :------------------------------------- | :--------------------------------------------------- | :--------------------------------------------------------- |
| **🐱 Kitten / 🐭 Newbie**    | 0 – 50 commits / 0 – 15 days           | Cozy sleeping loaf / Peeking from ground burrow      | Deep slumber, tiny paw stretches, burrow hideout           |
| **🐱 Young / 🐭 Regular**    | 51 – 250 commits / 16 – 50 days        | Stepping forward / Curious burrow forager            | Scampering 4-directional walk cycles, exploring lawn       |
| **🐱 Adult / 🐭 Consistent** | 251 – 1,000 commits / 51 – 150 days    | Signature coat & scarf / Golden cheese collector     | Ceramic fish dish dining, wool batting, cheese foraging    |
| **🐱 Pro / 🐭 Dedicated**    | 1,001 – 2,500 commits / 151 – 300 days | Sleek coat & ball pounce / Coding on sleek laptop    | Ball rebound physics, typing on glowing GitHub laptop      |
| **👑 Master / 👑 Streaker**  | 2,501+ commits / 301+ days             | Royal Golden Crown & Jewel / Aviator goggles & crown | Radiant celebration cheer, master demeanor, royal presence |

---

## Top-Down 2D Garden World

The camera is set to a strict **top-down / bird's-eye view (orthographic 2D 90° overhead game view)**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Overhead Tree Canopy]                               [Lantern Post]    │
│      (Pink Petals)                                    (Warm Glow)      │
│                                                                        │
│                      [Winding Cobblestone Pathway]                     │
│                                                                        │
│  [Crystal Pond]          [Octocat Medallion]            [Earthen Burrow]
│  (Fish / Lily Pad)          (Center Stepping)           (Mouse Hideout)│
│                                                                        │
│       [Ceramic Dish]           [Red Wool Ball]       [Swiss Cheese]    │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

- 🐟 **Ceramic Fish Dish & Bones:** A ceramic serving bowl rests beside the garden pond bank. When the cat enjoys its meal, clean fish skeleton bones remain.
- 🧶 **Yarn Ball Rebound Physics:** The cat playfully pounces and bats the textured red wool ball across the lawn with realistic impulse momentum and curling thread.
- 🧀 **Golden Swiss Cheese:** The companion mouse emerges from its burrow to forage golden cheese wedges and celebrate on the cobblestones.
- 💻 **Companion Laptop:** The dedicated mouse sets up an ultra-thin slate laptop with a glowing white GitHub logo and codes alongside you.
- 🕳️ **Top-Down Earthen Burrow:** A rounded ground burrow opening with smooth stone threshold where the mouse rests, peeks, and retreats when surprised.
- 🏮 **Brass Garden Lantern:** A garden lantern post casting warm golden light over the courtyard.
- 🌸 **Cherry Tree Canopies & Pond:** Overhead foliage canopies with scattered pink petals, and an oval tranquil pond with lily pads and swimming koi.

---

## Standalone Character Vector SVGs

In addition to the ecosystem outputs, CAT-MICE generates 34 standalone, pixel-aligned vector SVGs (`viewBox="0 0 128 128"`, `shape-rendering="crispEdges"`, zero external scripts) located in [`assets/characters/`](assets/characters/):

| Direction / Pose         | 🐱 The Cat (`assets/characters/cat/`)                            | 🐭 The Mouse (`assets/characters/mouse/`)                              |
| :----------------------- | :--------------------------------------------------------------- | :--------------------------------------------------------------------- |
| **Facing South (Down)**  | [`cat-idle-down.svg`](assets/characters/cat/cat-idle-down.svg)   | [`mouse-idle-down.svg`](assets/characters/mouse/mouse-idle-down.svg)   |
| **Facing North (Up)**    | [`cat-idle-up.svg`](assets/characters/cat/cat-idle-up.svg)       | [`mouse-idle-up.svg`](assets/characters/mouse/mouse-idle-up.svg)       |
| **Facing East (Right)**  | [`cat-idle-right.svg`](assets/characters/cat/cat-idle-right.svg) | [`mouse-idle-right.svg`](assets/characters/mouse/mouse-idle-right.svg) |
| **Facing West (Left)**   | [`cat-idle-left.svg`](assets/characters/cat/cat-idle-left.svg)   | [`mouse-idle-left.svg`](assets/characters/mouse/mouse-idle-left.svg)   |
| **4-Frame Walk Cycles**  | `assets/characters/cat/cat-walk/`                                | `assets/characters/mouse/mouse-walk/`                                  |
| **Signature Activities** | `cat-eat`, `cat-groom`, `cat-play`, `cat-sleep`                  | `mouse-work`, `mouse-collect`, `mouse-cheer`, `mouse-sleep`            |

---

## Add to Your GitHub Profile README

### 1. Add the GitHub Action Workflow

Create `.github/workflows/cat-mice.yml` in your profile repository (`username/username`):

```yaml
name: Generate CAT-MICE Ecosystem

on:
  schedule:
    # Runs daily at midnight UTC
    - cron: "0 0 * * *"
  workflow_dispatch:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4

      - name: Set up Node.js 22 LTS
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Generate CAT-MICE Artifacts
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          node src/cli.js --mode=production --user="${{ github.repository_owner }}" --out=dist --details

      - name: Commit and push changes
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add dist/cat-mice.gif dist/cat-mice.svg dist/cat-mice.png dist/showcase.png assets/generated/
          if git diff --staged --quiet; then
            echo "No changes to commit."
          else
            git commit -m "chore(ecosystem): update cat-and-mouse world [skip ci]"
            git push
          fi
```

> [!TIP]
> Ensure **Settings $\to$ Actions $\to$ General $\to$ Workflow permissions** is set to **"Read and write permissions"** in your repository.

### 2. Embed in Your README.md

Add this snippet to your profile `README.md`:

```markdown
<!-- Living Looping Animated GIF -->
<p align="center">
  <img src="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/dist/cat-mice.gif" alt="CAT-MICE Living Ecosystem" width="480" />
</p>

<!-- Or Scalable Resolution-Independent SVG -->
<p align="center">
  <img src="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/dist/cat-mice.svg" alt="CAT-MICE Static World" width="480" />
</p>
```

---

## Local Development & CLI

Run the full ecosystem offline with zero network requests or GitHub tokens:

```bash
# Clone the repository
git clone https://github.com/jeevansurya560-arch/Cat-Mice.git
cd Cat-Mice

# Install dependencies
pnpm install

# Build all production artifacts (GIF, SVG, PNG, showcase banner, character SVGs)
pnpm build

# Run offline preview
pnpm preview

# Run CLI with progression details
node src/cli.js --mode=offline --snapshot=fixtures/sample-snapshot.json --details
```

### Try Different Developer Archetypes

```bash
# High streak developer (unlocked Ninja / Streaker mouse companion)
node src/cli.js --mode=offline --snapshot=fixtures/high-streak.json --details

# Polyglot developer (multi-language palette theme)
node src/cli.js --mode=offline --snapshot=fixtures/polyglot.json --details

# Brand new account (playful kitten nursery)
node src/cli.js --mode=offline --snapshot=fixtures/zero-contributions.json --details
```

---

## Architecture & Verification

- **Node.js 22 LTS & Pure ESM:** Zero transpilation overhead, native JavaScript modules throughout.
- **Strict Architectural Boundary:** The GitHub API integration is strictly isolated. All simulation, progression, rendering, and export modules operate independently on deterministic snapshots.
- **Deterministic Mulberry32 PRNG:** Bit-for-bit reproducible runs across local environments and CI runners.
- **Dual Official MVP Outputs:** P0 Animated GIF (~240 KB, well within GitHub's 800 KB ceiling) and P0 Scalable SVG with pixel run-length compression.
- **Comprehensive Quality Gates:** 106 unit, integration, and contract tests across 30 test suites.

```bash
# Run Vitest test suite
pnpm test

# Run ESLint code inspection
pnpm lint

# Run Prettier code formatting check
pnpm format:check
```

---

## License

[MIT](LICENSE) © 2026 Suryaaa..
