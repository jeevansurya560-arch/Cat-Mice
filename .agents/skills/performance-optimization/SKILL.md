---
name: performance-optimization
description: Benchmarking, SIMD color conversions, precomputed tonal lookup tables, zero-copy sprite blitting, and binary size optimization.
---

# Performance Optimization Skill

## Practices
- Precompute OKLab-to-sRGB lookup tables for tonal ramps.
- Use `cargo build --release` with LTO (Link-Time Optimization) and `codegen-units = 1` for small binary size.
- Profile rendering bottlenecks using Criterion benchmarks.
