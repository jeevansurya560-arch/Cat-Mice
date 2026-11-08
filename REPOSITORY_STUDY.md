# Repository Study & Technical Reference Analysis

## 1. Primary Inspiration: Git-Koi (`yalongwastaken/git-koi`)

### Architectural Overview
Git-Koi is an open-source Rust application and GitHub Action that reads a user's GitHub activity and generates an animated, pixel-art koi fish looping GIF for profile READMEs.

### Detailed Component Analysis
1. **Contribution Collection:**
   - Queries GitHub's GraphQL API (`contributionsCollection`) to retrieve public contribution counts and streaks.
   - Avoids scraping HTML; relies on clean authenticated GraphQL payloads.
2. **Growth Progression:**
   - Scales the koi sprite dynamically based on total annual activity.
   - Uses contribution streaks to generate decorative markings/spots on the fish body.
3. **Language Color Mapping:**
   - Inspects top repositories to determine dominant languages and assigns colors accordingly.
4. **GIF Rendering & Animation:**
   - Uses frame-by-frame raster manipulation in Rust, applying sinusoidal wave functions to animate the spine and fins of the fish.
   - Quantizes frames into a shared 256-color palette to minimize GIF byte size while preserving clean pixel art.
5. **Automation & README Synchronization:**
   - Packaged as a Docker or composite GitHub Action with a nightly cron trigger.
   - Uses regex-delimited HTML comments in `README.md` to cleanly update only the targeted image embed without disturbing adjacent profile content.
6. **Licensing & Intellectual Property Boundary:**
   - Git-Koi is released under the MIT License.
   - **Boundary Enforcement:** Neo-Pokédex borrows architectural patterns (Rust GraphQL client, modular pipelines, GIF encoding strategy, GitHub Action marker update) but **strictly avoids** copying any koi artwork, sprites, branding, or proprietary game assets. All Pokémon artwork and math engines are built from scratch.

---

## 2. Supporting Repositories

### A. Language Identification: `github-linguist/linguist`
- **Key Concepts:** GitHub Linguist maintains `languages.yml`, mapping file extensions, filenames, interpreters, and MIME types to programming languages, along with official brand colors (e.g., Python `#3776AB`, Rust `#DEA584`).
- **Attribution Lesson:** Linguist measures repository bytes, not individual author contributions. For Neo-Pokédex, we use Linguist's authoritative color definitions and extension mappings, while attributing language shares through commit diff line additions rather than raw repository sizes.

### B. Vector Graphics & Rasterization: `linebender/resvg` & `linebender/tiny-skia`
- **Key Concepts:** `tiny-skia` is a pure-Rust 2D rendering engine implementing Skia's rasterization subset without C++ dependencies. `resvg` builds on it to render SVG documents into pixel buffers.
- **Application in Neo-Pokédex:** Enables deterministic conversion of SVG badges, HUD elements, and procedural pixel matrices into raw RGBA buffers at exact integer coordinates without subpixel anti-aliasing artifacts.

### C. Image Manipulation & GIF Encoding: `image-rs/image` & `gif`
- **Key Concepts:** `image` provides high-performance `RgbaImage` buffers with zero-copy operations. The `gif` crate allows low-level frame construction, exact disposal method assignment (`DisposalMethod::Background` or `Keep`), and precise frame delay (100ms for 10 FPS).
- **Application in Neo-Pokédex:** The mathematical colorization engine processes 32-bit linear RGBA pixel arrays, then applies palette quantization (e.g. NeuQuant) to generate crisp, compact 12-frame looping animated GIFs.

### D. Asynchronous Runtime & Networking: `tokio` & `reqwest`
- **Key Concepts:** `tokio` provides a multi-threaded async reactor; `reqwest` provides high-level HTTP client functionality.
- **Security & Portability Rule:** Configure `reqwest` with `default-features = false, features = ["json", "rustls-tls"]` to avoid OpenSSL native compile failures on Windows and provide memory-safe TLS.

### E. CLI Ergonomics: `clap` (v4 Derive)
- **Key Concepts:** Strongly typed command-line parsing using Rust derive macros (`#[derive(Parser, Subcommand)]`).
- **Commands:** `generate`, `preview`, `validate`, `config`.

---

## 3. Official Technical Documentation Insights

### GitHub GraphQL API v4
- **Endpoint:** `https://api.github.com/graphql`
- **Query Pattern:**
  ```graphql
  query($username: String!, $from: DateTime, $to: DateTime) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
  ```
- **Rate Limit:** 5,000 points per hour for personal access tokens. A single GraphQL query costs 1 point, making it 50x more efficient than REST pagination.

### W3C SVG 2.0 Specification
- **`shape-rendering="crispEdges"`:** Critical property for pixel-art vector representations. Tells the renderer to disable geometric anti-aliasing along polygon and rect boundaries, preventing muddy borders when sprites are displayed in dark-mode GitHub profile themes.

