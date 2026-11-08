---
name: rust-architecture
description: Production-grade modular Rust software architecture patterns, zero-cost abstractions, error handling with thiserror/anyhow, and crate design for Neo-Pokédex.
---

# Rust Architecture & System Design Skill

## Core Principles
1. **Explicit Ownership & Zero Unnecessary Allocations:** Prefer borrowed references (`&str`, `&[u8]`, `&Path`) over owned allocations (`String`, `Vec<u8>`, `PathBuf`) in internal processing pipelines.
2. **Domain-Driven Error Taxonomy:** Use `thiserror` for structured domain errors in submodules (`PokedexError::GitHub`, `PokedexError::Colorization`, `PokedexError::ImageProcessing`). Use `anyhow` solely at the binary/CLI application boundary (`main.rs`).
3. **Modular Layering:**
   - `src/github`: API transport, GraphQL client, contribution parsing, rate limiting.
   - `src/language`: Linguistic taxonomy, attribution models, perceptual palette mapping.
   - `src/evolution`: Deterministic state transitions, stage mathematical progression.
   - `src/artwork`: Fixed-geometry sprite loaders, anatomical region mask parsers.
   - `src/colorization`: Deterministic perceptual luminance ramps, OKLab blending, spatial priority field.
   - `src/renderer`: Pixel-perfect RGBA composition, GIF quantization, SVG/PNG rasterization.
   - `src/config`: Strongly typed TOML configuration parsing with serde defaults.
4. **Reproducible Toolchain:** All crates must pin strict SemVer in `Cargo.toml`. Never allow unhandled `unwrap()` or `expect()` in production paths.

