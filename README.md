# CAT-MICE

> Procedural pixel-art ecosystem driven by GitHub developer activity.

CAT-MICE is a deterministic pixel-art ecosystem generator that transforms a developer's GitHub contribution history, streaks, and programming language distributions into an animated retro cat-and-mouse world for GitHub Profile READMEs.

---

## Features

- **Procedural Cat Progression:** Cat grows from a playful `KITTEN` (1x scale, playing with yarn) into an alert `ADULT` (2x scale, hunting mice) and a regal `ELDER` (calm demeanor) using logarithmic growth curves.
- **Independent Mouse Agility:** Unlocks when the cat reaches maturity (65% growth threshold). The mouse's agility tier evolves independently from `SCOUT` to `RUNNER` and `NINJA` based on developer consistency.
- **Language-Driven Biomes:** Retro 16-color room palette dynamically styled by your top repository languages (e.g. JavaScript gold, Rust terracotta, Python blue-gray).
- **100% Deterministic Simulation:** Seeded by `userId` and weekly epoch using Mulberry32 PRNG. Identical data generates identical pixel animations bit-for-bit.
- **Ultra-Lightweight GIF Output:** NeuQuant palette quantization and frame delta compression via `gifenc` generates smooth 60-frame animations in ~200 KB (well within GitHub profile constraints).
- **Offline-First Modular Monolith:** Zero database, zero backend server, pure Node.js 22 ES Modules. Ingests via Octokit in CI/CD, or runs completely disconnected from local snapshot JSON fixtures.

---

## Quick Start

### Installation

```bash
pnpm install
```

### 1. Offline Mode (Local Development)

Run with the default sample snapshot:

```bash
pnpm dev
```

Or run with detailed progression and simulation metrics:

```bash
node src/cli.js --mode=offline --snapshot=fixtures/sample-snapshot.json --details
```

Export artifacts locally:

```bash
node src/cli.js --mode=offline --snapshot=fixtures/sample-snapshot.json --out=output
```

Or run the full preview pipeline:

```bash
pnpm preview
```

### 2. Production Mode (Live GitHub Ingestion)

```bash
export GITHUB_TOKEN="ghp_your_personal_access_token"
node src/cli.js --mode=production --user=octocat --out=dist --details
```

---

## GitHub Actions Automated Deployment

CAT-MICE runs on a daily cron schedule via [`.github/workflows/cat-mice.yml`](.github/workflows/cat-mice.yml):

```yaml
name: Generate CAT-MICE Ecosystem

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  generate:
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
      - run: node src/cli.js --mode=production --user="${{ github.repository_owner }}" --out=dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Embedding in Your Profile README

```markdown
<div align="center">
  <img src="https://raw.githubusercontent.com/<username>/<username>/main/dist/cat-mice.gif" alt="CAT-MICE Ecosystem" width="480" />
</div>
```

---

## Available Scripts

| Command             | Action                                                                 |
| :------------------ | :--------------------------------------------------------------------- |
| `pnpm dev`          | Run CLI in default offline mode                                        |
| `pnpm test`         | Run Vitest suite (100 tests across 29 test suites)                     |
| `pnpm test:watch`   | Run Vitest in interactive watch mode                                   |
| `pnpm lint`         | Run ESLint checks                                                      |
| `pnpm format:check` | Check code formatting via Prettier                                     |
| `pnpm format`       | Auto-format codebase with Prettier                                     |
| `pnpm preview`      | Run full simulation, rasterize frames, and export `output/preview.gif` |
| `pnpm build`        | End-to-end dry-run build verifying and generating `dist/cat-mice.gif`  |

---

## Architecture

For complete system design, component boundaries, and Mermaid diagrams, see [ARCHITECTURE.md](ARCHITECTURE.md).

## License

MIT
