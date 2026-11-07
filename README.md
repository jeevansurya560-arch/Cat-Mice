# CAT-MICE

> Procedural pixel-art ecosystem driven by GitHub developer activity.

CAT-MICE is a deterministic pixel-art ecosystem generator that transforms a developer's GitHub contribution history, streaks, and programming language distributions into an animated retro cat-and-mouse world for GitHub Profile READMEs.

## Current Status: Phase 0 (Foundation)

Phase 0 establishes the engineering foundation:

- Pure JavaScript ES Modules (Node.js 22 LTS).
- Strict modular monolith architecture.
- Centralized configuration and contract validation using Zod.
- Offline-first execution from local data snapshots.
- Vitest testing harness and ESLint/Prettier code quality controls.

## Quick Start

### Installation

```bash
pnpm install
```

### Run in Offline Mode (Default)

```bash
pnpm dev
```

Or execute directly with a specific snapshot:

```bash
node src/cli.js --mode=offline --snapshot=fixtures/sample-snapshot.json
```

### Scripts

- `pnpm dev`: Start local CLI in offline mode.
- `pnpm test`: Run Vitest test suite.
- `pnpm lint`: Run ESLint checks.
- `pnpm format:check`: Verify formatting with Prettier.
- `pnpm format`: Auto-format code.
- `pnpm preview`: Run the offline preview script.
- `pnpm build`: Verify build readiness and artifact pathways.

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for the complete High-Level Architecture (HLA) specification.

## License

MIT
