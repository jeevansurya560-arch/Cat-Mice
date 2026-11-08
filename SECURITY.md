# Neo-Pokédex: Security Protocols & Hardening Standards

## 1. Authentication & Token Hygiene

1. **Zero Secret Logging:**
   - Under no circumstances may `GH_TOKEN`, `GITHUB_TOKEN`, or Authorization headers be printed to standard output, log files, or terminal traces.
   - The logging layer (`src/logging`) explicitly redacts any string matching `ghp_`, `github_pat_`, or bearer token signatures.
2. **Environment Variable Injection:**
   - Secrets are read exclusively from process environment variables (`std::env::var("GH_TOKEN")`).
   - Tokens are never written to configuration files, disk caches, or committed to git.

---

## 2. Memory & Image Decoder Hardening

1. **Decompression Bomb Protection:**
   - Image dimensions are strictly checked before allocation. Maximum allowable sprite dimensions are clamped to `2048 x 2048 px`.
   - Any PNG or GIF header requesting allocations exceeding 64MB is immediately rejected with `PokedexError::SecurityViolation`.
2. **Safe Integer Arithmetic:**
   - Pixel buffer offsets and frame index multiplications use checked arithmetic (`checked_add`, `checked_mul`) or unsigned bounding to eliminate buffer overrun exploits.

---

## 3. Path Traversal & File System Safety

1. **Canonical Path Sandboxing:**
   - When loading anatomical masks or custom palettes from user configuration, all paths are resolved via `std::fs::canonicalize` and verified to reside strictly within the permitted project assets root.
   - Any path containing `..`, null bytes, or symbolic link escapes triggers an immediate error.

---

## 4. Supply Chain & CI Security

1. **Automated Dependency Audits:**
   - Phase 9 enforces `cargo audit` to detect known CVEs in the Rust dependency graph.
   - `Cargo.lock` is committed to the repository to guarantee reproducible, bit-for-bit builds.
2. **Least Privilege Workflow Permissions:**
   - The GitHub Actions workflow requests only the minimum required scope:
     ```yaml
     permissions:
       contents: write
     ```
   - No workflow runs with unrestricted repository administrative privileges.

