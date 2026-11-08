# Agent Skills Registry & Operational Protocols

## Overview
Neo-Pokédex leverages the Antigravity Agent Skills framework to enforce domain-specific rigor across Rust architecture, graphics programming, GitHub API integration, color science, and automated QA.

Skills are organized into:
1. **Global Built-in Skills:** Discovered in `~/.gemini/antigravity/builtin/skills/` and `~/.gemini/config/skills/`.
2. **Project-Specific Workspace Skills:** Installed directly in `.agents/skills/<skill-name>/SKILL.md`.

---

## 1. Discovered Global Skills
| Skill Name | Location | Primary Role in Neo-Pokédex | Status |
|---|---|---|---|
| **ponytail** | `~/.gemini/config/skills/ponytail/` | Lean senior developer mindset: smallest complete change, no bloat, upfront risk disclosure. | **Active (Default)** |
| **ponytail-review** | `~/.gemini/config/skills/ponytail-review/` | Change quality audit: correct logic, safety, load resilience, lean diffs. | Available |
| **ponytail-audit** | `~/.gemini/config/skills/ponytail-audit/` | Full codebase audit: bugs, dead code, architectural violations. | Available |
| **ponytail-debt** | `~/.gemini/config/skills/ponytail-debt/` | Tracked debt ledger for documented shortcuts. | Available |
| **ui-ux-pro-max** | `~/.gemini/config/skills/ui-ux-pro-max/` | Visual palette reasoning, typography, responsive HUD embedding. | Available |
| **mira-mcp-development**| `~/.gemini/config/skills/mira-mcp-development/` | Contract standards and security protocols. | Available |

---

## 2. Project-Specific Workspace Skills (`.agents/skills/`)
All 12 project-specific skills have been created with valid YAML frontmatter and precise operational instructions:

| Skill | Path | Scope & Core Responsibility |
|---|---|---|
| **`rust-architecture`** | `.agents/skills/rust-architecture/SKILL.md` | Modular crate design, zero-cost abstractions, domain error taxonomy (`thiserror`/`anyhow`), strict ownership patterns. |
| **`github-api-integration`** | `.agents/skills/github-api-integration/SKILL.md` | GraphQL contribution calendar fetching, rate-limiting backoff, sanitization, token hygiene, offline caching. |
| **`pokemon-art-accuracy`** | `.agents/skills/pokemon-art-accuracy/SKILL.md` | Anatomical fidelity for Charmander (#004), Charmeleon (#005), and Charizard (#006) based on official Pokédex references. |
| **`hd-pixel-art-engineering`** | `.agents/skills/hd-pixel-art-engineering/SKILL.md` | Uniform pixel density, cluster theory, elimination of orphan pixels, multi-tone shading, sub-pixel rendering. |
| **`grayscale-colorization`** | `.agents/skills/grayscale-colorization/SKILL.md` | Mathematical luminance ramp mapping, OKLab/OKLCH perceptual blending, spatial priority field $Q(x,y)$, $\gamma=1.15$ intensity. |
| **`svg-rendering`** | `.agents/skills/svg-rendering/SKILL.md` | Crisp vector pixel scaling (`shape-rendering="crispEdges"`), HUD overlays, scalable output. |
| **`image-processing`** | `.agents/skills/image-processing/SKILL.md` | `image::RgbaImage` buffers, NeuQuant / median-cut quantization, 12-frame animated GIF generation at 10 FPS. |
| **`evolution-progression`** | `.agents/skills/evolution-progression/SKILL.md` | Deterministic stage threshold boundaries (249, 749, 2000), clamped progress equations, state machines. |
| **`github-actions`** | `.agents/skills/github-actions/SKILL.md` | Reusable workflow design, scheduled execution, idempotent git commits, README marker synchronization. |
| **`automated-testing`** | `.agents/skills/automated-testing/SKILL.md` | Unit suites, wiremock integration, visual pixel-diff regression tests, golden image validation. |
| **`security-audit`** | `.agents/skills/security-audit/SKILL.md` | Secret sanitization, path traversal defense, memory-bounded decoders, `cargo-audit` compliance. |
| **`performance-optimization`**| `.agents/skills/performance-optimization/SKILL.md`| Precomputed OKLab lookup tables, LTO release optimization, Criterion benchmarks, zero-copy buffers. |

---

## 3. Skill Frontmatter & Validation Schema
Every custom skill conforms to the standard specification:
```markdown
---
name: <unique-identifier>
description: <concise summary of functionality and triggers>
---

# <Title>
## Instructions & Constraints
```
All skills are validated as syntactically correct and discoverable in the local repository workspace.

