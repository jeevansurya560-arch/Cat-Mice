# Technology Stack & Dependency Specification

## 1. Rust Toolchain Specification
- **Compiler:** `rustc` 1.80.0+ (Stable Channel)
- **Package Manager:** `cargo`
- **Target Triples:**
  - Local Development: `x86_64-pc-windows-msvc` / `x86_64-pc-windows-gnu`
  - GitHub Actions CI: `x86_64-unknown-linux-gnu` / `x86_64-pc-windows-msvc`
- **Edition:** `2021`

> [!WARNING]
> **Environment Status & Blocker:** `rustc` and `cargo` are currently not installed in the Windows environment path. To install the toolchain before Phase 1 compilation, run:
> ```powershell
> winget install Rustlang.Rustup
> # Or download and run https://win.rustup.rs/x86_64
> rustup default stable
> ```

---

## 2. Complete Cargo.toml Dependency Matrix

```toml
[package]
name = "neo-pokedex"
version = "0.1.0"
edition = "2021"
authors = ["Jeevan Surya Jalli <jalli.jeevansurya1019@gmail.com>"]
description = "GitHub contribution-powered Pokémon evolution virtual companion in modern HD pixel art"
license = "MIT"
readme = "README.md"
repository = "https://github.com/jeevansurya560-arch/Cat-Mice"

[dependencies]
# Asynchronous Runtime & Networking
tokio = { version = "1.41", features = ["macros", "rt-multi-thread", "time", "sync"] }
reqwest = { version = "0.12", default-features = false, features = ["json", "rustls-tls"] }

# Serialization & Configuration
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
toml = "0.8"

# Command Line Interface
clap = { version = "4.5", features = ["derive", "env"] }

# Graphics, Raster & Vector Processing
image = { version = "0.25", default-features = false, features = ["png", "gif"] }
gif = "0.13"
palette = { version = "0.7", features = ["std", "libm"] }
tiny-skia = "0.11"
resvg = "0.44"

# Error Handling & Diagnostics
thiserror = "1.0"
anyhow = "1.0"
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter", "fmt"] }

[dev-dependencies]
tempfile = "3.13"
wiremock = "0.6"
criterion = "0.5"

[profile.release]
opt-level = 3
lto = true
codegen-units = 1
panic = "abort"
strip = true
```

---

## 3. Dependency Rationale & Justifications

| Crate | Version | Why Selected |
|---|---|---|
| **`tokio`** | `1.41` | Industry-standard asynchronous runtime; handles concurrent HTTP polling, timers, and non-blocking I/O. |
| **`reqwest`** | `0.12` | High-level HTTP client with `rustls-tls`. Avoiding native OpenSSL eliminates dynamic library link issues on Windows and provides memory-safe TLS. |
| **`serde` & `serde_json`** | `1.0` | Zero-allocation deserialization of GitHub GraphQL responses and configuration structures. |
| **`toml`** | `0.8` | Human-readable configuration format for palettes, thresholds, and user profiles. |
| **`clap`** | `4.5` | Declarative, derive-based CLI parsing with automatic `--help` generation and environment variable support. |
| **`image`** | `0.25` | Direct, memory-safe pixel buffer operations (`RgbaImage`, `LumaImage`). |
| **`gif`** | `0.13` | Low-level control over frame delays (100ms for 10 FPS), color quantization palettes, and disposal methods. |
| **`palette`** | `0.7` | Rigorous color conversions: sRGB $\to$ linear sRGB $\to$ OKLab / OKLCH, ensuring perceptual consistency and avoiding muddy brown artifacts during hue mixing. |
| **`tiny-skia` & `resvg`** | `0.11` / `0.44` | Pure-Rust vector rendering; guarantees pixel-perfect vector rasterization without external C/C++ dependencies. |
| **`thiserror`** | `1.0` | Ergonomic, strongly typed domain error definitions. |
| **`anyhow`** | `1.0` | Clean context-rich error reporting at the CLI binary boundary. |
| **`tracing`** | `0.1` | Zero-overhead structured logging; automatically scrubs sensitive tokens in release builds. |
| **`wiremock`** | `0.6` | HTTP mocking for testing GitHub GraphQL queries without live network dependencies. |

