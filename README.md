# Cat & Mice

> A procedural pixel-art ecosystem driven by your GitHub activity.

Cat & Mice draws a living pixel-art ecosystem from a GitHub account's public activity. Your contributions grow the cat, your languages weave the room's rug and color its coat, and your streak cadence summons a nimble mouse. The cat naps, grooms, explores, eats fresh fish leaving bones behind, and bats a wool ball, while the mouse collects cheese and darts in and out of its hole. A nightly workflow puts the living world directly on your profile README as an ultra-lightweight looping GIF.

<p align="center">
  <img src="https://raw.githubusercontent.com/jeevansurya560-arch/Cat-Mice/main/dist/cat-mice.gif" alt="Cat & Mice Pixel-Art Ecosystem" width="480" />
</p>

---

## The Ecosystem

```
             ┌────────────────────────────────────────────────────────┐
             │                      CAT & MICE                        │
             └────────────────────────────────────────────────────────┘
                      ▲                                      ▲
                      │                                      │
              [Lifetime Commits]                    [Consistency & Streaks]
                      │                                      │
                      ▼                                      ▼
             🐱 THE CAT (Growth)                    🐭 THE MOUSE (Agility)
             • KITTEN  (1x scale, playful)          • LOCKED   (Cat < maturity)
             • ADULT   (2x scale, alert)            • SCOUT    (Cautious forager)
             • ELDER   (2x scale, zen)              • RUNNER   (Agile scamper)
                                                    • NINJA    (Stealth evasion)
```

### Character & World Progression

| Developer Metric                       | World Element              | Progression Behavior                                                                                                                       |
| :------------------------------------- | :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| **Lifetime Contributions**             | **Cat Growth**             | Scales logarithmically from a playful **Kitten** (1x) into an alert **Adult** (2x) and a serene **Elder**.                                 |
| **Account ID & Language Distribution** | **Permanent Identity**     | Permanently determines coat variant (**Tabby**, **Calico**, **Tuxedo**, **Ginger**, **Midnight**) so identity remains stable week to week. |
| **Commit Consistency & Streaks**       | **Mouse Unlock & Agility** | Unlocks when the cat matures. Its speed, confidence, and evasion evolve from **Scout** to **Runner** and **Ninja**.                        |
| **Top Languages**                      | **Room Palette & Rug**     | Primary and secondary language hues dynamically tint room accents, floor seams, and the central woven rug.                                 |
| **Weekly Epoch**                       | **Behavioral Simulation**  | Seeded PRNG drives procedural movement, naps, and interactions for subtle weekly variation.                                                |

### Living World Interactions

- 🐟 **Fish & Fish Bones:** A fresh fish sits on a serving board. When the cat finishes eating, the fish disappears and crisp fish bones remain on the plate.
- 🧶 **Wool Ball Physics:** The cat playfully pounces and bats the yarn ball across the wooden floorboards with realistic velocity and wall rebound.
- 🧀 **Cheese Foraging:** The mouse emerges from its burrow to forage golden Swiss cheese wedges and carry them back to safety.
- 🕳️ **Arched Mouse Hole:** Built into the wooden room baseboard, providing a safe haven where the mouse hides, peeks, and sleeps.

---

## Add to Your GitHub Profile README

### 1. Add the GitHub Action Workflow

Create `.github/workflows/cat-mice.yml` in your profile repository (`username/username`):

```yaml
name: Generate Cat & Mice Ecosystem

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
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 12

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"

      - run: pnpm install --frozen-lockfile

      - name: Generate Ecosystem
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node src/cli.js --mode=production --user="${{ github.repository_owner }}" --out=dist --details

      - name: Commit and push changes
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add dist/cat-mice.gif dist/cat-mice.png
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

Add this single line to your profile `README.md`:

```markdown
<p align="center">
  <img src="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/dist/cat-mice.gif" alt="Cat & Mice World" width="480" />
</p>
```

---

## Local Development & CLI

Run the full ecosystem completely offline without GitHub tokens or network access:

```bash
# Clone the repository
git clone https://github.com/jeevansurya560-arch/Cat-Mice.git
cd Cat-Mice

# Install dependencies
pnpm install

# Generate offline preview in output/ (GIF & PNG)
pnpm preview

# Run CLI with full progression and analytics details
node src/cli.js --mode=offline --snapshot=fixtures/sample-snapshot.json --details

# Run end-to-end build
pnpm build
```

### Try Different Developer Profiles

```bash
# High streak developer (unlocked Ninja mouse)
node src/cli.js --mode=offline --snapshot=fixtures/high-streak.json --details

# Polyglot developer (multi-language palette theme)
node src/cli.js --mode=offline --snapshot=fixtures/polyglot.json --details

# Brand new account (playful kitten nursery)
node src/cli.js --mode=offline --snapshot=fixtures/zero-contributions.json --details
```

---

## Architecture & Design Principles

- **Modular Monolith in Pure JavaScript ESM:** Built for Node.js 22 LTS with zero compilation overhead. No TypeScript, no Rust native binaries, no server daemons.
- **Universal Boundary Isolation:** GitHub integration communicates solely through CLI orchestration. The entire internal pipeline (Analytics $\to$ Progression $\to$ Simulation $\to$ Rendering $\to$ Export) runs 100% offline.
- **Deterministic Mulberry32 PRNG:** Bit-for-bit reproducibility. Identical input snapshots yield identical animations across workstations and CI runners.
- **Ultra-Compact Asset Budget:** Employs NeuQuant color quantization and delta frame compression via `gifenc` to produce smooth, high-fidelity 60-frame animations at **~105 KB** (far below GitHub's 800 KB ceiling).

For complete technical specifications, data contracts, and C4 architecture diagrams, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Testing & Quality Assurance

```bash
# Run complete Vitest suite (103 tests across 29 test suites)
pnpm test

# Run ESLint
pnpm lint

# Run Prettier code formatting check
pnpm format:check
```

---

## License

[MIT](LICENSE) © 2026 Suryaaa..
